import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "organizations",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }]
    }
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG, and WebP images are allowed"));
    }
    cb(null, true);
  }
});
