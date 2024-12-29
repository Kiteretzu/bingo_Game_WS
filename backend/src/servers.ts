import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import protect from "overload-protection";

// Ensure `typeDefs` and `resolvers` are correctly imported
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";

import { setupWebSocket } from "@/ws/websocket";
import { expressMiddleware } from "@apollo/server/express4";
import { ERROR_CODES, STATUS_CODES } from "@/errors";
import { CustomError } from "@/helper/customError"; // Assuming CustomError class is defined as discussed
import { buildContext } from "graphql-passport";

dotenv.config(); // Load environment variables

// Initialize Apollo Server
export const setupApolloServer = async (httpServer: http.Server) => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    return server;
  } catch (error) {
    // If there's an error initializing Apollo, throw a CustomError with appropriate details
    throw new CustomError(
      "Unable to initialize Apollo Server",
      STATUS_CODES.APOLLO_SERVER_ERROR,
      ERROR_CODES.APOLLO
    );
  }
};

// Setup Express app middleware
export const setupExpressApp = (
  app: express.Express,
  apolloServer: ApolloServer
) => {
  try {
    app.use(protect("express")); // Overload protection
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(apolloServer)
    );
    return app;
  } catch (error) {
    // In case of error setting up Express middleware, throw an appropriate error
    throw new CustomError(
      "Unable to initialize Express app",
      STATUS_CODES.EXPRESS_SERVER_ERROR,
      ERROR_CODES.EXPRESS
    );
  }
};

// Export the WebSocket setup for use in index.ts
export { setupWebSocket }; // Ensure WebSocket setup can be imported elsewhere
