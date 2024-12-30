import { getWebSocketServer } from "../../ws/websocket";
import GraphQLJSON from "graphql-type-json";

// userResolvers.ts
export const userResolvers = {
  JSON: GraphQLJSON,
  Query: {
    // Fake implementation for fetching the authenticated user
    authUser: () => {
      return {
        id: "1",
        name: "John Doe",
        password: "********", // Mask sensitive data
        isStudent: true,
        userType: "student",
        validEmail: true,
        email: "john.doe@example.com",
        gender: "MALE",
        createdAt: new Date().toISOString(),
        guardianContactNo: "1234567890",
        otp: null, // Don't return OTP
      };
    },

    // Fetch user by ID (fake data)
    user: (_: unknown, { userId }: { userId: string }) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return {
        id: userId,
        name: "Jane Smith",
        password: "********", // Mask sensitive data
        isStudent: false,
        userType: "teacher",
        validEmail: true,
        email: "jane.smith@example.com",
        gender: "FEMALE",
        createdAt: new Date().toISOString(),
        guardianContactNo: "9876543210",
        otp: null, // Don't return OTP
      };
    },

    // Test resolver for JSON input
    test: async (_parent: unknown, args: { message: any }) => {
      const { message } = args;
      console.log("This is message:", message);

      // Create a WebSocket client connection to the WebSocket server
      const wsClient = new WebSocket("ws://localhost:8080/");

      if (!wsClient) {
        console.error("Failed to create WebSocket client.");
        return "WebSocket client could not be created.";
      }

      // Handle WebSocket client events
      wsClient.onopen = () => {
        console.log("WebSocket client connected");

        // Send a message to the WebSocket server
        wsClient.send(JSON.stringify({ type: "test-message", data: message }));

        // Log for confirmation
        console.log("Message sent to WebSocket server:", message);
      };

      wsClient.onmessage = (event) => {
        console.log("Message received from WebSocket server:", event.data);
      };

      wsClient.onclose = () => {
        console.log("WebSocket client connection closed");
      };

      wsClient.onerror = (error) => {
        console.error("WebSocket client encountered an error:", error);
      };

      // Return a response immediately, or handle the WebSocket asynchronously
      return `Received message: ${message.type}`;
    },
  },
};
