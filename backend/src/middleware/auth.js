import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select("_id name email username role isProtected");

    if (!admin) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (admin.isProtected && admin.role !== "ADMIN") {
      await Admin.findByIdAndUpdate(admin._id, { role: "ADMIN" });
      admin.role = "ADMIN";
    } else if (!admin.role || admin.role === "admin") {
      await Admin.findByIdAndUpdate(admin._id, { role: "ADMIN" });
      admin.role = "ADMIN";
    } else if (admin.role === "user") {
      await Admin.findByIdAndUpdate(admin._id, { role: "USER" });
      admin.role = "USER";
    }

    req.admin = admin;
    req.adminRole = admin.role;

    if (payload.type !== "refresh") {
      await Admin.findByIdAndUpdate(admin._id, { lastActivity: new Date() });
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}
