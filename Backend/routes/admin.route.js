
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { adminStats } from "../controllers/admin.controller.js";
const router = express.Router();

router.get("/stats", isAuthenticated, adminStats);
export default router;
