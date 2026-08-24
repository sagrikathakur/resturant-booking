import { pool } from "./config/db.js";
import { initializeDatabase } from "./config/initDb.js";

async function testDatabase() {
  console.log("Connecting to Neon PostgreSQL...");
  try {
    await initializeDatabase();

    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map((r) => r.table_name);
    console.log("Found Public Tables:", tables);

    if (tables.length === 0) {
      console.log("No tables found in public schema of your Neon database.");
    } else {
      for (const table of tables) {
        try {
          const countRes = await pool.query(`SELECT COUNT(*) FROM "${table}";`);
          const count = countRes.rows[0].count;
          console.log(`Table '${table}': ${count} rows`);
        } catch (err) {
          console.log(`Table '${table}': Error querying (${err.message})`);
        }
      }
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
