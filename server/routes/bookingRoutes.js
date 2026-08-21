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
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { createBookingSchema, updateBookingStatusSchema } from "../validations/bookingValidation.js";

const router = express.Router();

router.post("/", verifyToken, validateBody(createBookingSchema), createBooking);
router.get("/", getAllBookings);
router.get("/my", verifyToken, getUserBookings);
router.get("/my-bookings", verifyToken, getUserBookings);
router.get("/:id", getBookingById);
router.get("/user/:userId", getUserBookings);
router.get("/restaurant/:restaurantId", getRestaurantBookings);
router.patch("/:id/status", verifyToken, validateBody(updateBookingStatusSchema), updateBookingStatus);
router.patch("/:id/cancel", verifyToken, cancelBooking);
router.delete("/:id", verifyToken, deleteBooking);

export default router;
