import { User } from "../models/user.model.js";

export const canCompose = async (req, res, next) => {
  try {
   const user = await User.findById(req.id).select("role isVerified");
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const okRole = user.role === "recruiter" || user.role === "admin";


  if (!okRole) return res.status(403).json({ message: "Forbidden: wrong role" });

  next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
