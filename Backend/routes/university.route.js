import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin, isRecruiterOrAdmin } from "../middlewares/isAdmin.js";
import {
  createUniversity,
  getAllUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
  verifyUniversity,
  unverifyUniversity,
  myUniversities,
} from "../controllers/university.controller.js";

const router = express.Router();

// Public: verified only (unless ?all=1)
router.get("/", getAllUniversities);
router.get("/:id", getUniversityById);

// Auth: my own universities (pending + verified)
router.get("/me/mine", isAuthenticated, isRecruiterOrAdmin, myUniversities);

// Create: recruiter/admin
router.post("/", isAuthenticated, isRecruiterOrAdmin, createUniversity);

// Update/Delete: recruiter/admin, but ownership enforced in controller (admin bypass)
router.patch("/:id", isAuthenticated, isRecruiterOrAdmin, updateUniversity);
router.delete("/:id", isAuthenticated, isRecruiterOrAdmin, deleteUniversity);

// Verify/Unverify: admin only
router.patch("/:id/verify", isAuthenticated, isAdmin, verifyUniversity);
router.patch("/:id/unverify", isAuthenticated, isAdmin, unverifyUniversity);

export default router;
