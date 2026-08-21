import { z } from "zod";

export const createBookingSchema = z.object({
  user_id: z.union([z.number(), z.string()]).optional(),
  restaurant_id: z.union([z.number(), z.string()]).refine((val) => val !== undefined && val !== null && val !== "", {
    message: "restaurant_id is required",
  }),
  table_id: z.union([z.number(), z.string()]).optional(),
  booking_date: z.string().trim().optional(),
  date: z.string().trim().optional(),
  booking_time: z.string().trim().optional(),
  time: z.string().trim().optional(),
  number_of_guests: z.union([z.number(), z.string()]).optional(),
  guests: z.union([z.number(), z.string()]).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
}).refine(
  (data) => data.booking_date || data.date,
  { message: "Booking date is required (booking_date or date)", path: ["booking_date"] }
).refine(
  (data) => data.booking_time || data.time,
  { message: "Booking time is required (booking_time or time)", path: ["booking_time"] }
).refine(
  (data) => data.number_of_guests || data.guests,
  { message: "Number of guests is required (number_of_guests or guests)", path: ["number_of_guests"] }
);

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "Status must be one of: pending, confirmed, cancelled, completed" }),
  }),
});
