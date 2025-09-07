// scholarship.route.js
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { canCompose } from "../middlewares/canCompose.js";
import {
  listScholarships,     
  createScholarship,
  getScholarshipById,
} from "../controllers/scholarship.controller.js";

const router = express.Router();


router.get("/", listScholarships);          
router.get("/filter", listScholarships);    


router.get("/:id", getScholarshipById);


router.post("/", isAuthenticated, canCompose, createScholarship);

export default router;
