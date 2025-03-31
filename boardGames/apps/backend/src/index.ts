import express from "express";
import http from "http";
import dotenv from "dotenv";
import { setupApolloServer, setupExpressApp,  setupRedisPubSub,  setupWebSocket } from "./servers";
import { ApolloServer } from "@apollo/server";
// import redis, { createClient } from "redis";

dotenv.config({ path: "../../.env" });

const startServer = async () => {
  try {
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error(
        "GOOGLE_CLIENT_SECRET is missing in environment variables"
      );
    }
    console.log("Secret", process.env.GOOGLE_CLIENT_SECRET);

    const app = express();
    const httpServer = http.createServer(app);
    const PORT = process.env.PORT || 8080;

    const apolloServer = await setupApolloServer(httpServer);
    setupExpressApp(app, apolloServer);
    setupWebSocket(httpServer);
    await setupRedisPubSub();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error: any) {
    console.error(
      "Error initializing the server:",
      error.stack || error.message
    );
    process.exit(1);
  }
};

startServer();
