import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/initDb.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const myServer = express();
const port = process.env.PORT || 5000;

// Middleware
myServer.use(cors());
myServer.use(express.json());

// Routes
myServer.use("/api/users", userRoutes);
myServer.use("/api/restaurants", restaurantRoutes);
myServer.use("/api/tables", tableRoutes);
myServer.use("/api/bookings", bookingRoutes);

myServer.get("/", (req, res) => {
  res.json({ message: "Restaurant Booking API is running successfully." });
});

// Optionally auto-initialize tables if database connection is available
if (process.env.AUTO_INIT_DB === "true") {
  initializeDatabase();
}

myServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});