// middlewares/isAuthenticated.js
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = req.cookies.token || bearer;
    if (!token) return res.status(401).json({ message: "Unauthorized", success: false });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};
