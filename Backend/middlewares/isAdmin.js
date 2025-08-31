// middlewares/isAdmin.js
import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.id).select("role");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    req.user = user; // attach for later use
    next();
  } catch (err) {
    console.error("isAdmin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isRecruiterOrAdmin = async (req, res, next) => {
  try {
    if (!req.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.id).select("role");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "recruiter" && user.role !== "admin") {
      return res.status(403).json({ message: "Recruiter or Admin required" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("isRecruiterOrAdmin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
