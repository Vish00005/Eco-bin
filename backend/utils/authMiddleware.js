const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "dev-jwt-secret";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = bearerToken || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp -otpExpiresAt");

    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = isAuthenticated;
