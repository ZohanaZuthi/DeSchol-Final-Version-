import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  login,
  registerUser,
  updateProfile,
  logout,
  me,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

// Session / profile
router.get("/me", isAuthenticated, me);
router.put("/updateProfile", isAuthenticated, updateProfile);

// Email verification
router.get("/verify", verifyEmail);

export default router;
