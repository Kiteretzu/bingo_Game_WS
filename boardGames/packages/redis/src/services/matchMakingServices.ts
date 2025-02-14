import { createClient, RedisClientType } from "redis";
import { REDIS_PlayerFindingMatch } from "types";

export class MatchmakingService {
  private static instance: MatchmakingService;
  private publisher: RedisClientType;
  private queueName = "matchmakingQueue";
  private channelName = "matchmakingChannel";

  public static getInstance(): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  constructor() {
    this.publisher = createClient({ url: process.env.REDIS_URL });
    this.publisher
      .connect()
      .catch((err) => console.error("Publisher connection error:", err));
    console.log("MatchmakingService Publisher initialized");
  }

  async publishMatchCreated(
    player1: REDIS_PlayerFindingMatch,
    player2: REDIS_PlayerFindingMatch
  ) {
    try {
      const message = JSON.stringify({
        event: "matchCreated",
        players: [player1, player2],
        timestamp: Date.now(),
      });

      await this.publisher.publish(this.channelName, message);
      console.log(
        `Published matchCreated event for players ${player1.id} and ${player2.id}.`
      );
    } catch (error) {
      console.error("Error publishing matchCreated event:", error);
    }
  }

  async addPlayerToQueue(player: REDIS_PlayerFindingMatch) {
    try {
      await this.publisher.lPush(this.queueName, JSON.stringify(player));
      await this.publisher.publish(this.channelName, "playerAdded");
      console.log(`Player ${player.id} added to the matchmaking queue.`);
    } catch (error) {
      console.error("Error adding player to queue:", error);
    }
  }

  async findMatch() {
    const MAX_RETRIES = 5;
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        const players = await this.publisher.lRange(this.queueName, 0, -1);
        if (players.length < 2) {
          console.log("Not enough players in the queue to find a match.");
          return;
        }

        const parsedPlayers: REDIS_PlayerFindingMatch[] = players.map(
          (player) => JSON.parse(player)
        );

        // Group players by matchTier
        const playersByTier: Record<string, REDIS_PlayerFindingMatch[]> = {};
        for (const player of parsedPlayers) {
          const tier = player.matchTier || "default"; // Use "default" if matchTier is not set
          if (!playersByTier[tier]) {
            playersByTier[tier] = [];
          }
          playersByTier[tier].push(player);
        }

        // Find matches within each tier
        for (const tier in playersByTier) {
          const tierPlayers = playersByTier[tier];
          if (tierPlayers.length < 2) {
            console.log(`Not enough players in tier ${tier} to find a match.`);
            continue;
          }

          // Sort players by MMR to find the closest match within the same tier
          tierPlayers.sort((a, b) => a.mmr - b.mmr);

          let bestMatch:
            | [REDIS_PlayerFindingMatch, REDIS_PlayerFindingMatch]
            | null = null;
          let smallestMMRDifference = Infinity;

          for (let i = 0; i < tierPlayers.length - 1; i++) {
            const player1 = tierPlayers[i];
            const player2 = tierPlayers[i + 1];
            const mmrDifference = Math.abs(player1.mmr - player2.mmr);

            if (mmrDifference < smallestMMRDifference) {
              smallestMMRDifference = mmrDifference;
              bestMatch = [player1, player2];
            }
          }

          if (bestMatch) {
            const [player1, player2] = bestMatch;

            // Remove matched players from the queue
            await this.publisher.lRem(
              this.queueName,
              1,
              JSON.stringify(player1)
            );
            await this.publisher.lRem(
              this.queueName,
              1,
              JSON.stringify(player2)
            );

            console.log(
              `Matched players in tier ${tier}: ${player1.id} (MMR: ${player1.mmr}) and ${player2.id} (MMR: ${player2.mmr})`
            );

            // Notify GameManager to create a new game with the matched players
            await this.publishMatchCreated(player1, player2);
          } else {
            console.log(`No suitable match found in tier ${tier}.`);
          }
        }

        // Reset retry count on successful processing
        retryCount = 0;
      } catch (error: any) {
        console.error("Error finding match:", error.message);
        retryCount++;
        await this.delay(1000 * retryCount); // Exponential backoff
      }
    }

    console.error("Max retries reached. Stopping matchmaking.");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const matchmakingService = MatchmakingService.getInstance();
