import { Prisma, PrismaClient } from "@prisma/client";
export * from "@prisma/client"
// Instantiate Prisma Client
const client = new PrismaClient();
// Export the Prisma Client instance and any types you need
export { client };