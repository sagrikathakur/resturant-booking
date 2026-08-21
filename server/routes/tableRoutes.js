import express from "express";
import {
  createTable,
  getTablesByRestaurant,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";
import { validateBody } from "../middleware/validate.js";
import { createTableSchema, updateTableSchema } from "../validations/tableValidation.js";

const router = express.Router();

router.post("/", validateBody(createTableSchema), createTable);
router.get("/", getTablesByRestaurant);
router.get("/:id", getTableById);
router.put("/:id", validateBody(updateTableSchema), updateTable);
router.delete("/:id", deleteTable);

export default router;
