import { DbManagerQueue } from "../services/dbManagerQueue"; // Adjust path as needed

// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Shutting down DB Queue Worker...");
  // Add any cleanup if needed here
  process.exit(0);
});

async function startDbQueueWorker() {
  const dbManagerQueue = new DbManagerQueue();

  try {
    await dbManagerQueue.processRequests();
    console.log("DB Queue Worker started and processing requests...");
  } catch (err) {
    console.error("DB Queue Worker error:", err);
    process.exit(1);
  }
}

startDbQueueWorker();
