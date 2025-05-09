import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {}, // Prevents crashing if shared packages access process.env
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
},
});
