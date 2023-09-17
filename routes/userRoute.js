import express from "express";
import {
  signup,
  login,
  protect,
  isLogin,
  restrictTo,
  userDashboard,
  forgotPassword,
  adminDashboard,
  updateProfile,
} from "../controllers/authController.js";

// router object
const router = express.Router();

// Routes
// Signup || POST
router.post("/signup", signup);

// Login || POST
router.post("/login", login);

// Forgot Password || POST
router.post("/forgot-password", forgotPassword);

// Test route
router.get("/test", protect, restrictTo("admin"), isLogin);

// Protected user || GET
router.get("/user-dashboard", protect, userDashboard);

// Protected admin || GET
router.get("/admin-dashboard", protect, restrictTo("admin"), adminDashboard);

// update profile
router.put("/profile", protect, updateProfile);

export default router;
