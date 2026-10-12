import * as TableModel from "../models/tableModel.js";
import * as RestaurantModel from "../models/restaurantModel.js";

export const createTable = async (req, res) => {
  try {
    const { restaurant_id, table_number, capacity } = req.body;
    if (!restaurant_id || !table_number || !capacity) {
      return res.status(400).json({ message: "restaurant_id, table_number, and capacity are required" });
    }

    const restaurant = await RestaurantModel.getRestaurantById(restaurant_id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const table = await TableModel.createTable({ restaurant_id, table_number, capacity });
    return res.status(201).json({ message: "Table added successfully", data: table });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: `Table number ${req.body.table_number} already exists for this restaurant` });
    }
    return res.status(500).json({ message: err.message });
  }
};

export const getTablesByRestaurant = async (req, res) => {
  try {
    const rawRestId = req.params.restaurantId || req.query.restaurant_id;
    if (!rawRestId) return res.status(400).json({ message: "restaurant_id is required" });

    const restId = parseInt(rawRestId, 10);
    if (isNaN(restId)) return res.status(200).json({ data: [] });

    const tables = await TableModel.getTablesByRestaurant(restId);
    return res.status(200).json({ data: tables });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Table not found" });

    const table = await TableModel.getTableById(id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    return res.status(200).json({ data: table });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Table not found" });

    const updated = await TableModel.updateTable(id, req.body);
    if (!updated) return res.status(404).json({ message: "Table not found" });
    return res.status(200).json({ message: "Table updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(404).json({ message: "Table not found" });

    const deleted = await TableModel.deleteTable(id);
    if (!deleted) return res.status(404).json({ message: "Table not found" });
    return res.status(200).json({ message: "Table deleted successfully", data: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
