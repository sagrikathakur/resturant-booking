import * as RestaurantModel from "../models/restaurantModel.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, city, phone, opening_time, closing_time } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({ error: "Name, address, and city are required." });
    }

    const restaurant = await RestaurantModel.createRestaurant({
      name,
      address,
      city,
      phone,
      opening_time,
      closing_time,
    });

    return res.status(201).json({ message: "Restaurant created successfully", data: restaurant });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all restaurants (with optional city or search query filter)
export const getRestaurants = async (req, res) => {
  try {
    const { city, search } = req.query;
    const restaurants = await RestaurantModel.getAllRestaurants(city, search);
    return res.status(200).json({ data: restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantModel.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    return res.status(200).json({ data: restaurant });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await RestaurantModel.updateRestaurant(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    return res.status(200).json({ message: "Restaurant updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RestaurantModel.deleteRestaurant(id);
    if (!deleted) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    return res.status(200).json({ message: "Restaurant deleted successfully", data: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
