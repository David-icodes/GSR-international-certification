export function adminOnly(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.admin.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required. This action is restricted." });
  }
  next();
}

export function selfOrAdmin(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const targetId = req.params.id;
  if (req.admin.role === "ADMIN" || req.admin._id.toString() === targetId) {
    return next();
  }
  return res.status(403).json({ message: "You can only modify your own profile." });
}
