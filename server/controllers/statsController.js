import * as StatsModel from "../models/statsModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const stats = await StatsModel.getAdminStats();
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOwnerStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId parameter is required" });
    }
    const stats = await StatsModel.getOwnerStats(restaurantId);
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
