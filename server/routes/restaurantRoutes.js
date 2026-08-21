import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController.js";
import { getTablesByRestaurant } from "../controllers/tableController.js";
import { getRestaurantBookings } from "../controllers/bookingController.js";
import { validateBody } from "../middleware/validate.js";
import { createRestaurantSchema, updateRestaurantSchema } from "../validations/restaurantValidation.js";

const router = express.Router();

router.post("/", validateBody(createRestaurantSchema), createRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", validateBody(updateRestaurantSchema), updateRestaurant);
router.delete("/:id", deleteRestaurant);

router.get("/:restaurantId/tables", getTablesByRestaurant);
router.get("/:restaurantId/bookings", getRestaurantBookings);

export default router;
