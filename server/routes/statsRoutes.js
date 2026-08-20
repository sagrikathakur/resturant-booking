import express from "express";
import { getOwnerStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/owner/:restaurantId", getOwnerStats);

export default router;
