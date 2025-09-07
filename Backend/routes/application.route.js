
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  applyScholarship,
  getUserApplications,
  myDashboard
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply", isAuthenticated, applyScholarship);
router.get("/my", isAuthenticated, getUserApplications);
router.get("/my/dashboard", isAuthenticated, myDashboard); // <-- new

export default router;
