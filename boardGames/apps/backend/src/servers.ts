import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import protect from "overload-protection";

// Ensure `typeDefs` and `resolvers` are correctly imported
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

import { setupWebSocket } from "./ws/websocket";
import { expressMiddleware } from "@apollo/server/express4";
import { ERROR_CODES, STATUS_CODES } from "./errors";
import { CustomError } from "./helper/customError"; // Assuming CustomError class is defined as discussed
import buildContext from "graphql-passport/lib/buildContext";
import passport from "passport";
import { configurePassport } from "passport/config";

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
  } catch (error: any) {
    console.log("this is error", error.message);
    throw new CustomError(
      "Unable to initialize Apollo Server",
      STATUS_CODES.APOLLO_SERVER_ERROR,
      ERROR_CODES.APOLLO
    );
  }
};

// Setup Express app middleware
export const setupExpressApp = async (
  app: express.Express,
  apolloServer: ApolloServer
) => {
  try {
    app.use(protect("express")); // Overload protection
    app.use(express.json());
    app.use(passport.initialize());
    configurePassport()
    
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      // @ts-ignore // dont know why
      expressMiddleware<any>(apolloServer, {
        context: async ({ req, res }) => buildContext({ req, res }),
      })
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
