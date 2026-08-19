import express from "express";
import { getAdminStats, getOwnerStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/admin", getAdminStats);
router.get("/owner/:restaurantId", getOwnerStats);

export default router;
