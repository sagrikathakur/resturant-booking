import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);
router.get("/profile", verifyToken, getProfile);

router.post("/", validateBody(registerSchema), registerUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", verifyToken, validateBody(updateUserSchema), updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
