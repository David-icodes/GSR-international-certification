import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    service: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, required: true },
    source: { type: String, enum: ["Contact", "Apply"], default: "Contact" },
    status: { type: String, enum: ["New", "In Progress", "Closed"], default: "New" },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
