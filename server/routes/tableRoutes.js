import express from "express";
import {
  createTable,
  getTablesByRestaurant,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";

const router = express.Router();

router.post("/", createTable);
router.get("/", getTablesByRestaurant);
router.get("/:id", getTableById);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;
