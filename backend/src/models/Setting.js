import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true, default: "GSR INTERNATIONAL CERTIFICATIONS" },
    contactEmail: { type: String, trim: true, lowercase: true, default: "gsrinternationalcertifications@gmail.com" },
    contactNumber: { type: String, trim: true, default: "8008035779; 7075999265" },
    address: { type: String, trim: true, default: "India" },
    whatsapp: { type: String, trim: true, default: "7075999265" },
    domain: { type: String, trim: true, default: "gsrinternationalcertifications.com" },
    mapUrl: { type: String, trim: true, default: "" },
    copyright: { type: String, trim: true, default: "" },
    socialLinks: {
      linkedin: { type: String, trim: true, default: "" },
      facebook: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
      x: { type: String, trim: true, default: "" }
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
