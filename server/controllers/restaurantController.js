import * as RestaurantModel from "../models/restaurantModel.js";

export const createRestaurant = async (req, res) => {
  try {
    const { name, address, city, phone, opening_time, closing_time } = req.body;
    if (!name || !address || !city) {
      return res.status(400).json({ message: "Name, address, and city are required" });
    }

    const restaurant = await RestaurantModel.createRestaurant({ name, address, city, phone, opening_time, closing_time });
    const formatted = { _id: restaurant.id.toString(), ...restaurant };
    return res.status(201).json({ message: "Restaurant created successfully", data: formatted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const { city, search } = req.query;
    const restaurants = await RestaurantModel.getAllRestaurants(city, search);
    const formatted = restaurants.map((r) => ({
      _id: r.id.toString(),
      location: r.city,
      image: "/restaurant_1.png",
      rating: 4.8,
      reviewsCount: 124,
      ...r,
    }));
    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const formatted = {
      _id: restaurant.id.toString(),
      location: restaurant.city,
      image: "/restaurant_1.png",
      rating: 4.8,
      reviewsCount: 124,
      ...restaurant,
    };
    return res.status(200).json({ data: formatted, ...formatted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const updated = await RestaurantModel.updateRestaurant(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Restaurant not found" });
    return res.status(200).json({ message: "Restaurant updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await RestaurantModel.deleteRestaurant(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Restaurant not found" });
    return res.status(200).json({ message: "Restaurant deleted successfully", data: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
