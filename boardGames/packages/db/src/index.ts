import { Prisma, PrismaClient } from "@prisma/client";
export * from "@prisma/client";

// Load environment variables from the custom .env file
require("dotenv").config({ path: "../../.env" });
console.log("DATABASE_URL:", process.env.DATABASE_URL);  // Should log the value from your .env file


// Instantiate Prisma Client
const connectToDb = () => {
  const client = new PrismaClient();
  client.$connect();
  console.log("dbConnected");
  return client;
};

const client = connectToDb();

// Export the Prisma Client instance and any types you need
export { client };
