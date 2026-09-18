import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { Admin } from "./models/Admin.js";

dotenv.config();

const port = process.env.PORT || 5000;

console.log(`Starting with MONGODB_URI: ${(process.env.MONGODB_URI || "").slice(0, 50)}...`);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

async function migrateRoles() {
  try {
    const lcAdmin = await Admin.updateMany({ role: "admin" }, { $set: { role: "ADMIN" } });
    if (lcAdmin.modifiedCount > 0) console.log(`Normalized ${lcAdmin.modifiedCount} admin -> ADMIN`);
    const lcUser = await Admin.updateMany({ role: "user" }, { $set: { role: "USER" } });
    if (lcUser.modifiedCount > 0) console.log(`Normalized ${lcUser.modifiedCount} user -> USER`);
    const protectedFix = await Admin.updateMany(
      { isProtected: true, role: { $ne: "ADMIN" } },
      { $set: { role: "ADMIN" } }
    );
    if (protectedFix.modifiedCount > 0) console.log(`Fixed ${protectedFix.modifiedCount} protected admin role(s)`);
    const adminUserFix = await Admin.updateOne(
      { username: "admin" },
      { $set: { isProtected: true, role: "ADMIN" } }
    );
    if (adminUserFix.modifiedCount > 0) console.log("Ensured admin user is protected ADMIN");
  } catch (err) {
    console.error("Role migration error:", err.message);
  }
}

connectDB()
  .then(async () => {
    await migrateRoles();
    const app = createApp();
    const server = app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Is another instance running?`);
        process.exit(1);
      }
      console.error("Server error:", err.message);
    });
  })
  .catch((error) => {
    console.error("===========================================");
    console.error("FAILED TO START SERVER");
    console.error("===========================================");
    console.error("Error:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.error("CAUSE: MongoDB connection failed. Check:");
      console.error("  1. MONGODB_URI in backend/.env is correct");
      console.error("  2. Network access is configured in MongoDB Atlas");
      console.error("  3. Database user credentials are valid");
    }
    console.error("===========================================");
    process.exit(1);
  });
