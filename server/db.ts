import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket constructor for Neon serverless
// Use ws package for Node.js environments (including Vercel serverless)
try {
  neonConfig.webSocketConstructor = ws;
} catch (error) {
  console.warn("Could not configure ws package for Neon:", error);
  // Neon will fall back to default WebSocket implementation if available
}

if (!process.env.DATABASE_URL) {
  const error = new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
  console.error(error.message);
  throw error;
}

// Create connection pool with error handling
let pool: Pool;
try {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("Database pool created successfully");
} catch (error) {
  console.error("Failed to create database pool:", error);
  throw error;
}

export { pool };
export const db = drizzle({ client: pool, schema });
