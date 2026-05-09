import jwt from "jsonwebtoken";
import User from "../models/User.js";

function getToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email createdAt").lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email createdAt").lean();
    if (user) {
      req.user = user;
    }
  } catch {
    // Optional auth should never block public reads.
  }
  next();
}
