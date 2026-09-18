import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    username: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    isProtected: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
    lastActivity: { type: Date, default: null },
    refreshToken: { type: String, select: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.isLocked = function isLocked() {
  return this.lockUntil && this.lockUntil > new Date();
};

export const Admin = mongoose.model("Admin", adminSchema);
