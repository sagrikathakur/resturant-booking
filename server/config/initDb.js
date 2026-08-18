import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");
    console.log("Initializing database schema...");
    await pool.query(sql);
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Error initializing database schema:", error.message);
  }
};

// Execute if run directly via CLI (e.g. `node config/initDb.js`)
if (process.argv[1] && process.argv[1].endsWith("initDb.js")) {
  initializeDatabase().then(() => pool.end());
}
