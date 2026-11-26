const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "dev-jwt-secret";
const COOKIE_MAX_AGE = 3 * 24 * 60 * 60 * 1000;

function sanitizeUser(user) {
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    recycledItems: user.recycledItems || [],
    createdAt: user.createdAt,
  };
}

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "3d" });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
}

module.exports.signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;
    if (!firstname || !lastname || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      phone,
    });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

module.exports.me = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};
