import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userRegister.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_restaurant_booking_2026";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const userRole = role === "owner" ? "owner" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({ name, email, password: hashedPassword, phone, role: userRole });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || userRole }, JWT_SECRET, { expiresIn: "7d" });
    const userData = { _id: user.id.toString(), id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role || userRole };

    return res.status(201).json({ message: "User registered successfully", token, ...userData, data: userData });
  } catch (err) {
    if (err.code === "23505") {
      const detail = err.detail || "";
      if (detail.includes("phone")) return res.status(400).json({ message: "Phone number is already registered" });
      if (detail.includes("email")) return res.status(400).json({ message: "Email is already registered" });
    }
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let isMatch = false;
    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
      if (isMatch) {
        const newHash = await bcrypt.hash(password, 10);
        await UserModel.updateUser(user.id, { password: newHash });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRole = user.role || "user";
    const token = jwt.sign({ id: user.id, email: user.email, role: userRole }, JWT_SECRET, { expiresIn: "7d" });
    const userData = { _id: user.id.toString(), id: user.id, name: user.name, email: user.email, phone: user.phone, role: userRole };

    return res.status(200).json({ message: "Login successful", token, ...userData, data: userData });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userData = { _id: user.id.toString(), id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role || "user" };
    return res.status(200).json({ ...userData, data: userData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await UserModel.updateUser(req.params.id, updateData);
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await UserModel.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted successfully", data: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
