import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  restoreOrganization,
  updateOrganization
} from "../controllers/organization.controller.js";

const router = express.Router();

const organizationValidation = [
  body("title").trim().isLength({ min: 2 }).withMessage("Title is required"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description is required"),
  body("certificationDate").isISO8601().withMessage("Certification date is required"),
  body("status").isIn(["Certified", "Active"]).withMessage("Invalid status")
];

router.get("/", listOrganizations);

router.get("/:id", getOrganization);

router.post(
  "/",
  protect,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  organizationValidation,
  validate,
  createOrganization
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  organizationValidation,
  validate,
  updateOrganization
);

router.delete("/:id", protect, deleteOrganization);
router.patch("/:id/restore", protect, restoreOrganization);

export default router;
