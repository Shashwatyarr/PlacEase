import express from "express";
import {
  signup,
  login,
  requestOtp,
  requestSignupOtp,
  verifySignupOtp,
  verifyOtpLogin,
} from "../controllers/authController.js";

const router = express.Router();

// Signup flow
router.post("/signup", signup);
router.post("/request-signup-otp", requestSignupOtp);
router.post("/verify-signup-otp", verifySignupOtp);

// Login flow
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpLogin);

export default router;
