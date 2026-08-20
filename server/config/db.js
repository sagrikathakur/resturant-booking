import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(async (client) => {
    console.log("PostgreSQL connected successfully");
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);");
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err.message));