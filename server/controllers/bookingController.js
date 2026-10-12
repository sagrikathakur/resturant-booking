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
    const parsedRestId = parseInt(restaurant_id || req.body.restaurantId, 10);
    const finalTableId = table_id && !isNaN(parseInt(table_id, 10)) ? parseInt(table_id, 10) : null;

    if (!effectiveUserId || isNaN(parsedRestId) || !finalDate || !finalTime || !finalGuests) {
      return res.status(400).json({ message: "user_id, restaurant_id, date, time, and guests are required" });
    }

    const user = await UserModel.getUserById(effectiveUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const restaurant = await RestaurantModel.getRestaurantById(parsedRestId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (finalTableId) {
      const isAvailable = await BookingModel.checkTableAvailability(finalTableId, finalDate, finalTime);
      if (!isAvailable) {
        return res.status(409).json({ message: "Table is already booked at the requested date and time" });
      }
    }

    const booking = await BookingModel.createBooking({
      user_id: effectiveUserId,
      restaurant_id: parsedRestId,
      table_id: finalTableId,
      booking_date: finalDate,
      booking_time: finalTime,
      number_of_guests: parseInt(finalGuests, 10),
      status: status || "confirmed",
    });

    const restCuisine = restaurant.cuisine || (
      restaurant.name.includes("Cielo") ? "Italian" :
      restaurant.name.includes("Kuro") ? "Japanese" :
      restaurant.name.includes("Flora") ? "Vegetarian" :
      restaurant.name.includes("Ember") ? "Steakhouse" : "French"
    );

    const formatted = {
      _id: booking.id.toString(),
      id: booking.id,
      bookingId: `GR-${booking.id}`,
      date: finalDate,
      time: finalTime,
      guests: parseInt(finalGuests, 10),
      status: booking.status || "confirmed",
      restaurant: {
        _id: restaurant.id.toString(),
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        location: restaurant.city,
        city: restaurant.city,
        cuisine: restCuisine,
        image: "/restaurant_1.png",
      },
      ...booking,
    };

    return res.status(201).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Booking not found" });

    const booking = await BookingModel.getBookingById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ data: booking, ...booking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const rawUserId = req.params.userId || req.user?.id;
    if (!rawUserId) return res.status(400).json({ message: "userId parameter is required" });

    const userId = parseInt(rawUserId, 10);
    if (isNaN(userId)) {
      return res.status(200).json([]);
    }

    const bookings = await BookingModel.getUserBookings(userId);
    const formatted = bookings.map((b) => {
      const restName = b.restaurant_name || "Restaurant";
      const cuisine = restName.includes("Cielo") ? "Italian" :
        restName.includes("Kuro") ? "Japanese" :
        restName.includes("Flora") ? "Vegetarian" :
        restName.includes("Ember") ? "Steakhouse" : "French";

      return {
        _id: b.id.toString(),
        bookingId: `GR-${b.id}`,
        date: b.booking_date,
        time: b.booking_time,
        guests: b.number_of_guests,
        restaurant: {
          name: b.restaurant_name,
          address: b.restaurant_address,
          location: b.restaurant_city,
          city: b.restaurant_city,
          cuisine,
          image: "/restaurant_1.png",
        },
        ...b,
      };
    });
    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getRestaurantBookings = async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId, 10);
    if (isNaN(restaurantId)) return res.status(200).json([]);

    const bookings = await BookingModel.getRestaurantBookings(restaurantId, req.query.date);
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Booking not found" });

    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await BookingModel.updateBookingStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking status updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Booking not found" });

    const existingBooking = await BookingModel.getBookingById(id);
    if (!existingBooking) return res.status(404).json({ message: "Booking not found" });

    if (req.user && req.user.role !== "owner" && req.user.role !== "admin") {
      if (existingBooking.user_id !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to cancel this booking" });
      }
    }

    const cancelled = await BookingModel.updateBookingStatus(id, "cancelled");
    return res.status(200).json({ message: "Booking cancelled successfully", data: cancelled });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Booking not found" });

    const deleted = await BookingModel.deleteBooking(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    return res.status(200).json({ message: "Booking deleted successfully", data: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
