import express from "express";
import { Certification } from "../models/Certification.js";
import { Organization } from "../models/Organization.js";
import { Inquiry } from "../models/Inquiry.js";
import { Admin } from "../models/Admin.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";
import { activityFromDocuments } from "../utils/activity.js";

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  const [
    totalCertifications,
    totalOrganizations,
    totalInquiries,
    totalUsers,
    activeCerts,
    expiredCerts,
    suspendedCerts,
    activeOrganizations,
    totalLogs,
    loginCount,
    failedLogins,
    recentActivities,
    recentLogins,
    certifications,
    organizations,
    inquiries
  ] = await Promise.all([
    Certification.countDocuments(),
    Organization.countDocuments(),
    Inquiry.countDocuments(),
    Admin.countDocuments(),
    Certification.countDocuments({ status: "Active" }),
    Certification.countDocuments({ certificateState: "Expired" }),
    Certification.countDocuments({ certificateState: "Suspended" }),
    Organization.countDocuments({ status: "Certified" }),
    ActivityLog.countDocuments(),
    ActivityLog.countDocuments({ action: "Login", success: true }),
    ActivityLog.countDocuments({ action: "Failed Login" }),
    ActivityLog.find().sort({ createdAt: -1 }).limit(8).select("adminName action module description createdAt targetName"),
    ActivityLog.find({ action: "Login", success: true }).sort({ createdAt: -1 }).limit(5).select("adminName createdAt ipAddress browser device"),
    Certification.find().sort({ createdAt: -1 }).limit(5),
    Organization.find().sort({ createdAt: -1 }).limit(5),
    Inquiry.find().sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    totalCertifications,
    totalOrganizations,
    totalInquiries,
    totalUsers,
    activeCertifications: activeCerts,
    expiredCertifications: expiredCerts,
    suspendedCertifications: suspendedCerts,
    activeOrganizations,
    recentActivity: activityFromDocuments({ certifications, organizations, inquiries }),
    securityWidgets: {
      totalLogs,
      loginCount,
      failedLogins,
      recentLogins
    },
    recentActivities
  });
});

export default router;
