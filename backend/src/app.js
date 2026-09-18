import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import usersRoutes from "./routes/users.routes.js";
import activityRoutes from "./routes/activity.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = [
    "http://localhost:3000",
    "https://www.gsrinternationalcertifications.com",
    ...(process.env.FRONTEND_URL || "").split(",").map((s) => s.trim()).filter(Boolean)
  ];

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Cache-Control,Pragma");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.get("/api/v1/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/certifications", certificationRoutes);
  app.use("/api/v1/organizations", organizationRoutes);
  app.use("/api/v1/inquiries", inquiryRoutes);
  app.use("/api/v1/settings", settingsRoutes);
  app.use("/api/v1/dashboard", dashboardRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/activity", activityRoutes);

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || err.msg || String(err);
    if (process.env.NODE_ENV !== "production") {
      console.error("[Error]", err);
    }
    res.status(status).json({
      message: status === 500 && process.env.NODE_ENV === "production" ? "Server error" : message
    });
  });

  return app;
}
