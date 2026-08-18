import * as BookingModel from "../models/bookingModel.js";
import * as UserModel from "../models/userRegister.js";
import * as RestaurantModel from "../models/restaurantModel.js";

export const createBooking = async (req, res) => {
  try {
    const { user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, date, time, guests, status } = req.body;

    const effectiveUserId = user_id || req.user?.id;
    const finalDate = booking_date || date;
    const finalTime = booking_time || time;
    const finalGuests = number_of_guests || guests;
    const finalTableId = table_id || 1;

    if (!effectiveUserId || !restaurant_id || !finalDate || !finalTime || !finalGuests) {
      return res.status(400).json({ message: "user_id, restaurant_id, date, time, and guests are required" });
    }

    const user = await UserModel.getUserById(effectiveUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const restaurant = await RestaurantModel.getRestaurantById(restaurant_id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (table_id) {
      const isAvailable = await BookingModel.checkTableAvailability(table_id, finalDate, finalTime);
      if (!isAvailable) {
        return res.status(409).json({ message: "Table is already booked at the requested date and time" });
      }
    }

    const booking = await BookingModel.createBooking({
      user_id: effectiveUserId,
      restaurant_id,
      table_id: finalTableId,
      booking_date: finalDate,
      booking_time: finalTime,
      number_of_guests: finalGuests,
      status: status || "confirmed",
    });

    const formatted = { _id: booking.id.toString(), bookingId: `GR-${booking.id}`, ...booking };
    return res.status(201).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ data: booking, ...booking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) return res.status(400).json({ message: "userId parameter is required" });

    const bookings = await BookingModel.getUserBookings(userId);
    const formatted = bookings.map((b) => ({
      _id: b.id.toString(),
      bookingId: `GR-${b.id}`,
      date: b.booking_date,
      time: b.booking_time,
      guests: b.number_of_guests,
      restaurant: {
        name: b.restaurant_name,
        address: b.restaurant_address,
        location: b.restaurant_city,
        image: "/restaurant_1.png",
      },
      ...b,
    }));
    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getRestaurantBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getRestaurantBookings(req.params.restaurantId, req.query.date);
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getAllBookings();
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await BookingModel.updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking status updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const cancelled = await BookingModel.updateBookingStatus(req.params.id, "cancelled");
    if (!cancelled) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking cancelled successfully", data: cancelled });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await BookingModel.deleteBooking(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking deleted successfully", data: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
