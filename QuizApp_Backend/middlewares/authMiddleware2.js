import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const decoded = jwt.verify(token, 'divyansh');
    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = student; // ✅ Attach student to req
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
