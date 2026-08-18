import * as TableModel from "../models/tableModel.js";
import * as RestaurantModel from "../models/restaurantModel.js";

// Add a table to a restaurant
export const createTable = async (req, res) => {
  try {
    const { restaurant_id, table_number, capacity } = req.body;

    if (!restaurant_id || !table_number || !capacity) {
      return res.status(400).json({ error: "restaurant_id, table_number, and capacity are required." });
    }

    if (capacity <= 0) {
      return res.status(400).json({ error: "Capacity must be greater than 0." });
    }

    // Verify restaurant exists
    const restaurant = await RestaurantModel.getRestaurantById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }

    const table = await TableModel.createTable({ restaurant_id, table_number, capacity });
    return res.status(201).json({ message: "Table added successfully", data: table });
  } catch (error) {
    if (error.code === "23505") { // Unique violation in PG
      return res.status(400).json({ error: `Table number ${req.body.table_number} already exists for this restaurant.` });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Get all tables for a specific restaurant
export const getTablesByRestaurant = async (req, res) => {
  try {
    const restaurant_id = req.params.restaurantId || req.query.restaurant_id;

    if (!restaurant_id) {
      return res.status(400).json({ error: "restaurant_id parameter is required." });
    }

    const tables = await TableModel.getTablesByRestaurant(restaurant_id);
    return res.status(200).json({ data: tables });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get single table by ID
export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await TableModel.getTableById(id);
    if (!table) {
      return res.status(404).json({ error: "Table not found." });
    }
    return res.status(200).json({ data: table });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update table details
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TableModel.updateTable(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Table not found." });
    }
    return res.status(200).json({ message: "Table updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete table
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TableModel.deleteTable(id);
    if (!deleted) {
      return res.status(404).json({ error: "Table not found." });
    }
    return res.status(200).json({ message: "Table deleted successfully", data: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
