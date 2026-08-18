import express from "express";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getRestaurantBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.get("/user/:userId", getUserBookings);
router.get("/restaurant/:restaurantId", getRestaurantBookings);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);

export default router;
