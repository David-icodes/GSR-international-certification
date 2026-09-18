import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { Admin } from "../models/Admin.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createActivityLogger, logActivity } from "../utils/activityLogger.js";

const router = express.Router();

function signAccessToken(admin, rememberMe = false) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "24h" : "1h"
  });
}

function signRefreshToken(admin, rememberMe = false) {
  return jwt.sign(
    { id: admin._id, role: admin.role, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? "30d" : "7d" }
  );
}

function getClientInfo(req) {
  return {
    ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || ""
  };
}

router.post(
  "/login",
  [
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("A valid email is required"),
    body("username").optional({ checkFalsy: true }).trim().isLength({ min: 3 }).withMessage("Username is required"),
    body("password").isLength({ min: 7 }).withMessage("Password must be at least 7 characters"),
    body("rememberMe").optional().isBoolean()
  ],
  validate,
  async (req, res) => {
    const { email, username, password, rememberMe } = req.body;
    const { ipAddress, userAgent } = getClientInfo(req);

    if (!email && !username) {
      return res.status(422).json({ message: "Email or username is required" });
    }

    const admin = await Admin.findOne(
      email ? { email: email.toLowerCase() } : { username: username.toLowerCase() }
    ).select("+password +refreshToken");

    if (!admin) {
      await logActivity({
        action: "Failed Login",
        module: "Authentication",
        description: `Failed login attempt for ${email || username}`,
        targetName: email || username,
        ipAddress,
        userAgent,
        success: false
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (admin.isLocked()) {
      const minutesLeft = Math.ceil((admin.lockUntil - new Date()) / 60000);
      return res.status(429).json({
        message: `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
        code: "ACCOUNT_LOCKED"
      });
    }

    if (!(await admin.comparePassword(password))) {
      const attempts = (admin.loginAttempts || 0) + 1;
      const update = { loginAttempts: attempts };
      if (attempts >= 5) {
        update.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await Admin.findByIdAndUpdate(admin._id, update);

      await logActivity({
        action: "Failed Login",
        module: "Authentication",
        description: `Failed login attempt ${attempts}/5 for ${admin.name}`,
        targetId: admin._id.toString(),
        targetName: admin.name,
        ipAddress,
        userAgent,
        success: false
      });

      const remaining = 5 - attempts;
      return res.status(401).json({
        message: remaining > 0
          ? `Invalid credentials. ${remaining} attempt(s) remaining.`
          : "Too many failed login attempts. Account locked for 15 minutes.",
        remainingAttempts: Math.max(0, remaining),
        code: remaining > 0 ? "INVALID_CREDENTIALS" : "ACCOUNT_LOCKED"
      });
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

    await Admin.findByIdAndUpdate(admin._id, {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date()
    });

    const accessToken = signAccessToken(admin, rememberMe);
    const refreshToken = signRefreshToken(admin, rememberMe);

    await Admin.findByIdAndUpdate(admin._id, { refreshToken });

    await logActivity({
      admin,
      action: "Login",
      module: "Authentication",
      description: `${admin.name} logged in successfully`,
      targetId: admin._id.toString(),
      targetName: admin.name,
      ipAddress,
      userAgent,
      success: true
    });

    res.json({
      token: accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      expiresIn: rememberMe ? 86400 : 3600
    });
  }
);

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const admin = await Admin.findById(payload.id).select("+refreshToken");
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
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

    const newAccessToken = signAccessToken(admin);
    const newRefreshToken = signRefreshToken(admin);

    await Admin.findByIdAndUpdate(admin._id, { refreshToken: newRefreshToken });

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      expiresIn: 3600
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again.", code: "SESSION_EXPIRED" });
    }
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.get("/me", protect, (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

router.post("/logout", protect, async (req, res) => {
  const log = createActivityLogger(req);

  await Admin.findByIdAndUpdate(req.admin._id, { refreshToken: null, lastActivity: new Date() });

  await log({
    action: "Logout",
    module: "Authentication",
    description: `${req.admin.name} logged out`,
    targetId: req.admin._id.toString(),
    targetName: req.admin.name,
    success: true
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
