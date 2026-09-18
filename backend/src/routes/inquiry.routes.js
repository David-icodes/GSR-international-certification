import express from "express";
import { body } from "express-validator";
import { Inquiry } from "../models/Inquiry.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createActivityLogger } from "../utils/activityLogger.js";

const router = express.Router();

const inquiryValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("phone").optional({ checkFalsy: true }).trim().isLength({ min: 7 }).withMessage("Invalid phone"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message is required"),
  body("source").optional().isIn(["Contact", "Apply"]).withMessage("Invalid inquiry source")
];

router.post("/", inquiryValidation, validate, async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
});

router.get("/", protect, async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";
  const filter = includeDeleted ? {} : { isDeleted: { $ne: true } };
  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
  res.json(inquiries);
});

router.get("/export/csv", protect, async (_req, res) => {
  const inquiries = await Inquiry.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  const rows = [
    ["Name", "Email", "Phone", "Company", "Service", "Message", "Source", "Status", "Created At"],
    ...inquiries.map((item) => [
      item.name,
      item.email,
      item.phone,
      item.company,
      item.service,
      item.message,
      item.source,
      item.status,
      item.createdAt.toISOString()
    ])
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=inquiries.csv");
  res.send(csv);
});

router.patch(
  "/:id/status",
  protect,
  [body("status").isIn(["New", "In Progress", "Closed"]).withMessage("Invalid status")],
  validate,
  async (req, res) => {
    const log = createActivityLogger(req);
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    await log({
      action: "Inquiry Updated",
      module: "Inquiries",
      description: `${req.admin.name} updated inquiry status to ${req.body.status} for ${inquiry.name}`,
      targetId: inquiry._id.toString(),
      targetName: inquiry.name,
      success: true
    });

    res.json(inquiry);
  }
);

router.delete("/:id", protect, async (req, res) => {
  const log = createActivityLogger(req);
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  if (inquiry.isDeleted) return res.status(400).json({ message: "Inquiry already deleted" });

  inquiry.isDeleted = true;
  await inquiry.save();

  await log({
    action: "Inquiry Deleted",
    module: "Inquiries",
    description: `${req.admin.name} deleted inquiry from ${inquiry.name}`,
    targetId: inquiry._id.toString(),
    targetName: inquiry.name,
    success: true
  });

  res.json({ message: "Inquiry deleted" });
});

router.patch("/:id/restore", protect, async (req, res) => {
  const log = createActivityLogger(req);
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  if (!inquiry.isDeleted) return res.status(400).json({ message: "Inquiry is not deleted" });

  inquiry.isDeleted = false;
  await inquiry.save();

  await log({
    action: "Inquiry Restored",
    module: "Inquiries",
    description: `${req.admin.name} restored inquiry from ${inquiry.name}`,
    targetId: inquiry._id.toString(),
    targetName: inquiry.name,
    success: true
  });

  res.json({ message: "Inquiry restored", inquiry });
});

export default router;
