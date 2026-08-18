import * as BookingModel from "../models/bookingModel.js";
import * as TableModel from "../models/tableModel.js";
import * as UserModel from "../models/userRegister.js";
import * as RestaurantModel from "../models/restaurantModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      user_id,
      restaurant_id,
      table_id,
      booking_date,
      booking_time,
      number_of_guests,
      status,
    } = req.body;

    if (!user_id || !restaurant_id || !table_id || !booking_date || !booking_time || !number_of_guests) {
      return res.status(400).json({
        error: "user_id, restaurant_id, table_id, booking_date, booking_time, and number_of_guests are required.",
      });
    }

    if (number_of_guests <= 0) {
      return res.status(400).json({ error: "number_of_guests must be greater than 0." });
    }

    // 1. Verify User exists
    const user = await UserModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2. Verify Restaurant exists
    const restaurant = await RestaurantModel.getRestaurantById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }

    // 3. Verify Table exists & belongs to restaurant
    const table = await TableModel.getTableById(table_id);
    if (!table) {
      return res.status(404).json({ error: "Table not found." });
    }

    if (parseInt(table.restaurant_id, 10) !== parseInt(restaurant_id, 10)) {
      return res.status(400).json({ error: "Specified table does not belong to this restaurant." });
    }

    // 4. Verify capacity
    if (number_of_guests > table.capacity) {
      return res.status(400).json({
        error: `Number of guests (${number_of_guests}) exceeds table capacity (${table.capacity}).`,
      });
    }

    // 5. Check if table is available at date & time
    const isAvailable = await BookingModel.checkTableAvailability(table_id, booking_date, booking_time);
    if (!isAvailable) {
      return res.status(409).json({
        error: "Table is already booked at the requested date and time.",
      });
    }

    // Create booking
    const booking = await BookingModel.createBooking({
      user_id,
      restaurant_id,
      table_id,
      booking_date,
      booking_time,
      number_of_guests,
      status: status || "confirmed",
    });

    return res.status(201).json({ message: "Booking created successfully", data: booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get single booking details by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }
    return res.status(200).json({ data: booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await BookingModel.getUserBookings(userId);
    return res.status(200).json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get bookings for a restaurant
export const getRestaurantBookings = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;
    const bookings = await BookingModel.getRestaurantBookings(restaurantId, date);
    return res.status(200).json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all bookings (admin view)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getAllBookings();
    return res.status(200).json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updated = await BookingModel.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Booking not found." });
    }

    return res.status(200).json({ message: "Booking status updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Cancel booking (helper wrapper)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const cancelled = await BookingModel.updateBookingStatus(id, "cancelled");
    if (!cancelled) {
      return res.status(404).json({ error: "Booking not found." });
    }
    return res.status(200).json({ message: "Booking cancelled successfully", data: cancelled });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookingModel.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found." });
    }
    return res.status(200).json({ message: "Booking deleted successfully", data: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
