const express = require("express");
const isAuthenticated = require("../utils/authMiddleware");
const upload = require("../cloudConfig");
const appController = require("../controller/appController");

const router = express.Router();

router.get("/bins", appController.getBins);
router.get("/dashboard", isAuthenticated, appController.getDashboard);
router.get("/profile", isAuthenticated, appController.getProfile);
router.put("/profile", isAuthenticated, appController.updateProfile);

router.post("/recycle", isAuthenticated, upload.single("image"), appController.postRecycle);
router.post("/recycle/resend-otp", isAuthenticated, appController.resendOtp);
router.post("/recycle/verify-otp", isAuthenticated, appController.verifyOtp);

module.exports = router;
