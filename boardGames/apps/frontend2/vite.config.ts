import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy API requests
      "/api": {
        target: "http://localhost:8080", // Your backend server URL
      },
    },
  },
});