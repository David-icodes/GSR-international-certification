import express from "express";
import { body } from "express-validator";
import { Admin } from "../models/Admin.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createActivityLogger } from "../utils/activityLogger.js";

const router = express.Router();

const userValidation = [
  body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("password").optional({ checkFalsy: true }).isLength({ min: 7 }).withMessage("Password must be at least 7 characters"),
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required")
];

router.get("/", protect, adminOnly, async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";
  const filter = includeDeleted ? {} : { isDeleted: { $ne: true } };
  const users = await Admin.find(filter).select("-password -refreshToken");
  res.json(users);
});

router.get("/:id", protect, async (req, res) => {
  const targetId = req.params.id;
  if (req.admin.role !== "ADMIN" && req.admin._id.toString() !== targetId) {
    return res.status(403).json({ message: "You can only view your own profile." });
  }
  const user = await Admin.findById(targetId).select("-password -refreshToken");
  if (!user || user.isDeleted) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.post("/", protect, adminOnly, userValidation, validate, async (req, res) => {
  const log = createActivityLogger(req);
  const { username, password, name, email } = req.body;

  if (!password) {
    return res.status(422).json({ message: "Password is required" });
  }

  const exists = await Admin.findOne({ username: username.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Username already exists" });

  const user = await Admin.create({
    username,
    password,
    name,
    email: email || `${username}@gsr.local`,
    role: "USER"
  });

  const { password: _, refreshToken: __, ...safe } = user.toObject();

  await log({
    action: "User Created",
    module: "User Management",
    description: `${req.admin.name} created user ${name}`,
    targetId: user._id.toString(),
    targetName: name,
    success: true
  });

  res.status(201).json(safe);
});

router.put("/:id", protect, async (req, res) => {
  const log = createActivityLogger(req);
  const targetId = req.params.id;
  const target = await Admin.findById(targetId);

  if (!target) return res.status(404).json({ message: "User not found" });

  if (target.isProtected) {
    if (req.body.role && req.body.role !== "ADMIN") {
      return res.status(403).json({ message: "Default administrator account is protected and cannot be deleted, disabled, or demoted." });
    }
    if (req.admin.role !== "ADMIN") {
      return res.status(403).json({ message: "Default administrator account is protected and cannot be modified." });
    }
  }

  if (req.admin.role !== "ADMIN" && req.admin._id.toString() !== targetId) {
    return res.status(403).json({ message: "You can only update your own profile." });
  }

  if (req.body.role && req.admin.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can change roles." });
  }

  const update = {};
  if (req.body.username) update.username = req.body.username;
  if (req.body.name) update.name = req.body.name;
  if (req.body.email) update.email = req.body.email;
  if (req.body.password) update.password = req.body.password;
  if (req.body.role && req.admin.role === "ADMIN") update.role = req.body.role;

  const user = await Admin.findByIdAndUpdate(targetId, update, { new: true, runValidators: true }).select("-password -refreshToken");
  if (!user) return res.status(404).json({ message: "User not found" });

  await log({
    action: "User Updated",
    module: "User Management",
    description: `${req.admin.name} updated user ${user.name}`,
    targetId: user._id.toString(),
    targetName: user.name,
    success: true
  });

  res.json(user);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const log = createActivityLogger(req);
  const target = await Admin.findById(req.params.id);

  if (!target) return res.status(404).json({ message: "User not found" });

  if (target.isProtected) {
    return res.status(403).json({ message: "Default administrator account is protected and cannot be deleted, disabled, or demoted." });
  }

  if (target._id.toString() === req.admin._id.toString()) {
    return res.status(403).json({ message: "You cannot delete your own account." });
  }

  const adminCount = await Admin.countDocuments({ role: "ADMIN" });
  if (adminCount <= 1 && target.role === "ADMIN") {
    return res.status(403).json({ message: "Cannot delete the last remaining administrator account." });
  }

  target.isDeleted = true;
  await target.save();

  await log({
    action: "User Deleted",
    module: "User Management",
    description: `${req.admin.name} deleted user ${target.name}`,
    targetId: target._id.toString(),
    targetName: target.name,
    success: true
  });

  res.json({ message: "User deleted successfully" });
});

router.patch("/:id/restore", protect, adminOnly, async (req, res) => {
  const log = createActivityLogger(req);
  const target = await Admin.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });
  if (!target.isDeleted) return res.status(400).json({ message: "User is not deleted" });

  target.isDeleted = false;
  await target.save();

  await log({
    action: "User Restored",
    module: "User Management",
    description: `${req.admin.name} restored user ${target.name}`,
    targetId: target._id.toString(),
    targetName: target.name,
    success: true
  });

  res.json({ message: "User restored", user: target });
});

export default router;
