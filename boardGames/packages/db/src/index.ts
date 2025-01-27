import { Prisma, PrismaClient } from "@prisma/client";
import { connect } from "http2";
export * from "@prisma/client"
// Instantiate Prisma Client

const connectToDb = () => {
    const client = new PrismaClient();
    client.$connect();
    console.log('dbConnected')
    return client;
}
const client = connectToDb();
// Export the Prisma Client instance and any types you need
export { client };