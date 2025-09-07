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

router.get("/", getAllUniversities);
router.get("/:id", getUniversityById);

router.get("/me/mine", isAuthenticated, isRecruiterOrAdmin, myUniversities);


router.post("/", isAuthenticated, isRecruiterOrAdmin, createUniversity);


router.patch("/:id", isAuthenticated, isRecruiterOrAdmin, updateUniversity);
router.delete("/:id", isAuthenticated, isRecruiterOrAdmin, deleteUniversity);


router.patch("/:id/verify", isAuthenticated, isAdmin, verifyUniversity);
router.patch("/:id/unverify", isAuthenticated, isAdmin, unverifyUniversity);

export default router;
