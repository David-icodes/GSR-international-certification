import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    imageUrl: { type: String, trim: true, required: true },
    imageUrl2: { type: String, trim: true, default: "" },
    publicId: { type: String, trim: true },
    publicId2: { type: String, trim: true },
    certificationDate: { type: Date, required: true },
    status: { type: String, enum: ["Certified", "Active"], default: "Certified" },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Organization = mongoose.model("Organization", organizationSchema);
