import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    category: { type: String, trim: true, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    verificationSupport: { type: Boolean, default: true },
    certificateId: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    companyName: { type: String, trim: true, default: "" },
    scope: { type: String, trim: true, default: "" },
    publishDate: { type: Date },
    expiryDate: { type: Date },
    certificateState: { type: String, enum: ["Active", "Expired", "Suspended"], default: "Active" },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Certification = mongoose.model("Certification", certificationSchema);
