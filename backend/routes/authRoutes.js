const express = require("express");
const authController = require("../controller/authController");
const isAuthenticated = require("../utils/authMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", isAuthenticated, authController.me);

module.exports = router;
