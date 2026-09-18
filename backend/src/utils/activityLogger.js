import { ActivityLog } from "../models/ActivityLog.js";

function parseUserAgent(ua = "") {
  let browser = "Unknown";
  let device = "Desktop";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("MSIE") || ua.includes("Trident")) browser = "Internet Explorer";

  if (/Mobile|Android|iPhone|iPad/i.test(ua)) device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

  return { browser, device };
}

export async function logActivity({
  admin = null,
  action,
  module,
  description = "",
  targetId = "",
  targetName = "",
  ipAddress = "",
  userAgent = "",
  success = true,
  metadata = {}
}) {
  try {
    const { browser, device } = parseUserAgent(userAgent);
    await ActivityLog.create({
      adminId: admin?._id || null,
      adminName: admin?.name || "System",
      adminEmail: admin?.email || "",
      adminRole: admin?.role || "",
      action,
      module,
      description,
      targetId,
      targetName,
      ipAddress,
      userAgent,
      browser,
      device,
      success,
      metadata
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
}

export function createActivityLogger(req) {
  return (data) =>
    logActivity({
      admin: req.admin || null,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
      ...data
    });
}
