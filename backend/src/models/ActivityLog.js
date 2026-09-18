import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    adminName: { type: String, default: "System" },
    adminEmail: { type: String, default: "" },
    adminRole: { type: String, default: "" },
    action: { type: String, required: true },
    module: { type: String, required: true },
    description: { type: String, default: "" },
    targetId: { type: String, default: "" },
    targetName: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    device: { type: String, default: "" },
    browser: { type: String, default: "" },
    success: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ module: 1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
