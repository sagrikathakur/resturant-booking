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

const router = express.Router();

router.post("/", createRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);

router.get("/:restaurantId/tables", getTablesByRestaurant);
router.get("/:restaurantId/bookings", getRestaurantBookings);

export default router;
