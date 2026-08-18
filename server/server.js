import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/test-db", async (req, res) => {
  try {
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map((r) => r.table_name);
    const counts = {};

    for (const table of tables) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM "${table}";`);
        counts[table] = parseInt(countRes.rows[0].count, 10);
      } catch (err) {
        counts[table] = `Error: ${err.message}`;
      }
    }

    return res.json({ status: "Connected", tables, counts });
  } catch (err) {
    return res.status(500).json({ status: "Error", message: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Restaurant Booking API" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});