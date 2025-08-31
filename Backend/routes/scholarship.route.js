// scholarship.route.js
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { canCompose } from "../middlewares/canCompose.js";
import {
  listScholarships,      // <- use the list handler that returns {items, page, pages}
  createScholarship,
  getScholarshipById,
} from "../controllers/scholarship.controller.js";

const router = express.Router();

// PUBLIC list endpoints
router.get("/", listScholarships);          // e.g. /api/scholarships?search=...&page=1&limit=12
router.get("/filter", listScholarships);    // optional alias

// PUBLIC details (keep LAST so it doesn't swallow /filter)
router.get("/:id", getScholarshipById);

// PROTECTED create
router.post("/", isAuthenticated, canCompose, createScholarship);

export default router;
