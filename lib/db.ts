import { PrismaClient } from "./generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws"; // Required for Node.js environments

// --- Neon Specific Configuration ---
neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL;

// Check if connection string is available before proceeding
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the adapter instance
const adapter = new PrismaNeon({ connectionString });
// ---------------------------------

// --- Singleton Prisma Client Setup ---

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Use the 'adapter' configuration object inside the constructor
export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
