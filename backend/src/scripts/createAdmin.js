import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";

dotenv.config();

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_USERNAME } = process.env;

  if (!ADMIN_PASSWORD || !ADMIN_USERNAME) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required");
  }

  if (ADMIN_PASSWORD.length < 7) {
    throw new Error("ADMIN_PASSWORD must be at least 7 characters");
  }

  await connectDB();
  const lookup = [{ username: ADMIN_USERNAME.toLowerCase() }];
  if (ADMIN_EMAIL) lookup.push({ email: ADMIN_EMAIL.toLowerCase() });
  const existing = await Admin.findOne({ $or: lookup });

  if (existing) {
    await Admin.findByIdAndUpdate(existing._id, { isProtected: true, role: "ADMIN" });
    console.log("Admin already exists. Updated as protected administrator.");
    process.exit(0);
  }

  await Admin.create({
    name: ADMIN_NAME || "Admin",
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL || `${ADMIN_USERNAME}@gsr.local`,
    password: ADMIN_PASSWORD,
    role: "ADMIN",
    isProtected: true
  });

  console.log("Protected administrator created successfully");
  process.exit(0);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
