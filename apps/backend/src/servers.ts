import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";
import http from "http";
import protect from "overload-protection";

// Ensure `typeDefs` and `resolvers` are correctly imported
import { schema } from "./routes/graphql/schema";

import { expressMiddleware } from "@apollo/server/express4";
import customContext from "helper/customContext";
import passport from "passport";
import { configurePassport } from "passport/config";
import authRouter from "routes/auth";
import adminRouter from "routes/auth/adminAuth";
import { ERROR_CODES, STATUS_CODES } from "./errors";
import { CustomError } from "./helper/customError"; // Assuming CustomError class is defined as discussed
import { setupWebSocket } from "./ws/websocket";

// Initialize Apollo Server
export const setupApolloServer = async (httpServer: http.Server) => {
  try {
    const server = new ApolloServer({
      schema,
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
    // Enable CORS for all origins
    app.use(
      cors({
        origin: "http://localhost:3000", // Allow your frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // Allow cookies or authentication headers
      })
    );

    app.use(passport.initialize());
    configurePassport();

    app.use("/auth", authRouter);
    app.use("/admin", adminRouter);
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      // @ts-ignore // dont know why
      expressMiddleware<any>(apolloServer, {
        context: async ({ req, res }) => customContext({ req, res }),
      })
    );

    return app;
  } catch (error: any) {
    // In case of error setting up Express middleware, throw an appropriate error
    throw new CustomError(
      `Unable to initialize Express app: ${error.message}`,
      STATUS_CODES.EXPRESS_SERVER_ERROR,
      ERROR_CODES.EXPRESS
    );
  }
};


// Export the WebSocket setup for use in index.ts
export { setupWebSocket }; // Ensure WebSocket setup can be imported elsewhere
