import * as UserModel from "../models/userRegister.js";

// Create / Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const newUser = await UserModel.createUser({ name, email, password, phone, role });
    return res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Single User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.updateUser(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ message: "User updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ message: "User deleted successfully", data: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
