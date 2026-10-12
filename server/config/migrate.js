import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, "../migrations");

/**
 * Runs pending .sql migrations in transactional order and records
 * applied migrations in the schema_migrations ledger.
 */
export async function runMigrations() {
  console.log("Checking database migrations...");

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const res = await client.query("SELECT name FROM schema_migrations;");
    const appliedSet = new Set(res.rows.map((row) => row.name));

    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.log("No migrations directory found.");
      return 0;
    }

    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const pending = migrationFiles.filter((file) => !appliedSet.has(file));

    if (pending.length === 0) {
      console.log("Database schema is up to date (no pending migrations).");
      return 0;
    }

    console.log(`Found ${pending.length} pending migration(s) to apply.`);

    for (const file of pending) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Applying migration: ${file}...`);
      await client.query("BEGIN;");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1);", [file]);
        await client.query("COMMIT;");
        console.log(`Successfully applied: ${file}`);
      } catch (err) {
        await client.query("ROLLBACK;");
        console.error(`Migration failed on ${file}:`, err.message);
        throw err;
      }
    }

    console.log("All migrations executed successfully.");
    return pending.length;
  } finally {
    client.release();
  }
}

const isMainScript = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("migrate.js");
if (isMainScript) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration runner error:", err.message);
      process.exit(1);
    });
}
