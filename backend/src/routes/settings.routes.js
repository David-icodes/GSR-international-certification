import express from "express";
import { body } from "express-validator";
import { Setting } from "../models/Setting.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createActivityLogger } from "../utils/activityLogger.js";

const router = express.Router();

async function getSettingsDocument() {
  const existing = await Setting.findOne();
  if (existing) return existing;
  return Setting.create({});
}

router.get("/", async (_req, res) => {
  const settings = await getSettingsDocument();
  res.json(settings);
});

router.put(
  "/",
  protect,
  adminOnly,
  [
    body("companyName").trim().isLength({ min: 2 }).withMessage("Company name is required"),
    body("contactEmail").isEmail().withMessage("A valid contact email is required"),
    body("contactNumber").trim().isLength({ min: 5 }).withMessage("Contact number is required"),
    body("address").trim().isLength({ min: 5 }).withMessage("Address is required")
  ],
  validate,
  async (req, res) => {
    const log = createActivityLogger(req);
    const settings = await getSettingsDocument();
    const before = settings.toObject();
    settings.set(req.body);
    await settings.save();

    const changedFields = [];
    for (const key of Object.keys(req.body)) {
      if (key === "socialLinks") {
        for (const sk of Object.keys(req.body.socialLinks || {})) {
          if (String(before.socialLinks?.[sk] || "") !== String(req.body.socialLinks[sk] || "")) {
            changedFields.push(`socialLinks.${sk}`);
          }
        }
      } else if (String(before[key] || "") !== String(req.body[key] || "")) {
        changedFields.push(key);
      }
    }

    if (changedFields.length > 0) {
      await log({
        action: "Settings Updated",
        module: "Settings",
        description: `${req.admin.name} updated settings: ${changedFields.join(", ")}`,
        targetName: req.admin.name,
        success: true,
        metadata: { changedFields }
      });
    }

    res.json(settings);
  }
);

export default router;
