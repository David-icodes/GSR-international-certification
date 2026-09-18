import cloudinary from "../config/cloudinary.js";
import { Organization } from "../models/Organization.js";
import { createActivityLogger } from "../utils/activityLogger.js";

function removeFromCloudinary(publicId) {
  if (!publicId) return;
  cloudinary.uploader.destroy(publicId, (err) => {
    if (err) console.error("Cloudinary delete error:", err.message);
  });
}

export async function listOrganizations(req, res) {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const baseFilter = req.query.public === "true" ? { status: { $in: ["Certified", "Active"] } } : {};
    const filter = includeDeleted ? { ...baseFilter } : { ...baseFilter, isDeleted: { $ne: true } };
    const organizations = await Organization.find(filter).sort({ certificationDate: -1, createdAt: -1 });
    res.json(organizations);
  } catch (err) {
    console.error("listOrganizations error:", err.message);
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
}

export async function getOrganization(req, res) {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization || organization.isDeleted) return res.status(404).json({ message: "Organization not found" });
    res.json(organization);
  } catch (err) {
    console.error("getOrganization error:", err.message);
    res.status(500).json({ message: "Failed to fetch organization" });
  }
}

export async function createOrganization(req, res) {
  try {
    const log = createActivityLogger(req);
    const image1 = req.files?.image1?.[0] || req.files?.image?.[0] || req.file;
    const image2 = req.files?.image2?.[0];

    if (!image1) {
      return res.status(422).json({ message: "Project Image 1 is required for new organization records" });
    }

    const organization = await Organization.create({
      title: req.body.title,
      description: req.body.description,
      certificationDate: req.body.certificationDate,
      status: req.body.status || "Certified",
      imageUrl: image1.path,
      publicId: image1.filename,
      imageUrl2: image2?.path || "",
      publicId2: image2?.filename || ""
    });

    await log({
      action: "Organization Created",
      module: "Organizations",
      description: `${req.admin.name} created organization ${organization.title}`,
      targetId: organization._id.toString(),
      targetName: organization.title,
      success: true
    });

    res.status(201).json(organization);
  } catch (err) {
    console.error("createOrganization error:", err.message);
    res.status(500).json({ message: err.message || "Failed to create organization" });
  }
}

export async function updateOrganization(req, res) {
  try {
    const log = createActivityLogger(req);
    const existing = await Organization.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Organization not found" });

    const payload = {
      title: req.body.title,
      description: req.body.description,
      certificationDate: req.body.certificationDate,
      status: req.body.status || existing.status,
      imageUrl: existing.imageUrl,
      publicId: existing.publicId,
      imageUrl2: existing.imageUrl2,
      publicId2: existing.publicId2
    };

    const image1 = req.files?.image1?.[0] || req.files?.image?.[0] || req.file;
    const image2 = req.files?.image2?.[0];

    if (image1) {
      removeFromCloudinary(existing.publicId);
      payload.imageUrl = image1.path;
      payload.publicId = image1.filename;
    }

    if (image2) {
      removeFromCloudinary(existing.publicId2);
      payload.imageUrl2 = image2.path;
      payload.publicId2 = image2.filename;
    }

    const organization = await Organization.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    await log({
      action: "Organization Updated",
      module: "Organizations",
      description: `${req.admin.name} updated organization ${organization.title}`,
      targetId: organization._id.toString(),
      targetName: organization.title,
      success: true
    });

    res.json(organization);
  } catch (err) {
    console.error("updateOrganization error:", err.message);
    res.status(500).json({ message: err.message || "Failed to update organization" });
  }
}

export async function deleteOrganization(req, res) {
  try {
    const log = createActivityLogger(req);
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: "Organization not found" });
    if (organization.isDeleted) return res.status(400).json({ message: "Organization already deleted" });

    organization.isDeleted = true;
    await organization.save();

    await log({
      action: "Organization Deleted",
      module: "Organizations",
      description: `${req.admin.name} soft-deleted organization ${organization.title}`,
      targetId: organization._id.toString(),
      targetName: organization.title,
      success: true
    });

    res.json({ message: "Organization deleted" });
  } catch (err) {
    console.error("deleteOrganization error:", err.message);
    res.status(500).json({ message: "Failed to delete organization" });
  }
}

export async function restoreOrganization(req, res) {
  try {
    const log = createActivityLogger(req);
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: "Organization not found" });
    if (!organization.isDeleted) return res.status(400).json({ message: "Organization is not deleted" });

    organization.isDeleted = false;
    await organization.save();

    await log({
      action: "Organization Restored",
      module: "Organizations",
      description: `${req.admin.name} restored organization ${organization.title}`,
      targetId: organization._id.toString(),
      targetName: organization.title,
      success: true
    });

    res.json({ message: "Organization restored", organization });
  } catch (err) {
    console.error("restoreOrganization error:", err.message);
    res.status(500).json({ message: "Failed to restore organization" });
  }
}
