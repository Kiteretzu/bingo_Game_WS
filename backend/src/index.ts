import express from 'express';  // Ensure express is imported
import http from 'http';
import dotenv from 'dotenv';  // Load environment variables
import { setupApolloServer, setupExpressApp, setupWebSocket } from './servers';  // Import the app initialization functions

dotenv.config();  // Load environment variables

const startServer = async () => {
  try {
    // Initialize Express app and HTTP server
    const app = express();
    const httpServer = http.createServer(app);
    const PORT = process.env.PORT || 8080;

    // Setup Apollo Server
    const apolloServer = await setupApolloServer(httpServer);

    // Setup express middleware and graphql
    setupExpressApp(app, apolloServer);

    // Setup WebSocket
    setupWebSocket(httpServer);  // Ensure `setupWebSocket` is correctly implemented


    // Start the HTTP server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing the server:', error);
    process.exit(1);  // Exit the process if server fails to start
  }
};

startServer();