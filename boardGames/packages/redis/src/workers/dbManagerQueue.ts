import { GraphQLClient } from "graphql-request"; // ignore this warning
import { RedisClientType } from "redis";
import {
  handleAddMove,
  handleEndGame,
  handleFriendRequests,
  handleNewGame,
  handleTossUpdate,
} from "../consumers/gameConsumer";
import { getRedisClient } from "../index";
import {
  QUEUE_NAME
} from "../types";

interface GameRequest {
  type:
    | "new-game"
    | "add-move"
    | "toss-update-game"
    | "end-game"
    | "friend-requests";
  payload: any;
}

export class DbManagerQueue {
  private client: RedisClientType | null = null;
  private queueName = QUEUE_NAME;
  private gqlClient: GraphQLClient;

  constructor() {
    console.log("this graphql endpoint", process.env.GRAPHQL_ENDPOINT);
    this.gqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);
    this.initialize();
  }

  async initialize() {
    try {
      console.log("queue name bug? ", this.queueName);
      this.client = await getRedisClient();
      console.log("Connected to Redis Queue");
    } catch (err) {
      console.error("Redis connection error:", err);
    }
  }

  private async ensureConnection(): Promise<RedisClientType> {
    if (!this.client || !this.client.isOpen) {
      try {
        this.client = await getRedisClient();
      } catch (error) {
        console.error("Failed to connect to Redis in DbManagerQueue:", error);
        throw new Error("Redis connection failed");
      }
    }
    return this.client;
  }

  async processRequests() {
    console.log(`Starting to process requests from queue: ${this.queueName}`);
    const MAX_RETRIES = 5;
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        // Ensure we have a valid connection before processing
        const redisClient = await this.ensureConnection();

        const response = await redisClient.brPop(this.queueName, 0);
        if (response?.key === this.queueName) {
          const requestData = this.safeParseJSON<GameRequest>(response.element);
          if (!requestData) continue;

          await this.handleRequest(requestData);

          // Reset retry count on successful processing
          retryCount = 0;
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);
        retryCount++;
        await this.delay(1000 * retryCount); // Exponential backoff
      }
    }

    console.error("Max retries reached. Stopping request processing.");
  }

  private async handleRequest(requestData: GameRequest) {
    switch (requestData.type) {
      case "new-game":
        await handleNewGame(requestData.payload);
        break;
      case "add-move":
        await handleAddMove(requestData.payload);
        break;
      case "toss-update-game":
        await handleTossUpdate(requestData.payload);
        break;
      case "end-game":
        await handleEndGame(requestData.payload);
        break;
      case "friend-requests":
        await handleFriendRequests(requestData.payload);
    }
  }

  private safeParseJSON<T>(json: string | undefined): T | null {
    try {
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
