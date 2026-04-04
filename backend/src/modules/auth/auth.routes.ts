import { Router } from "express";
import {
    register,
    login,
    loginWithOTP,
    sendOTP,
    googleLogin,
    githubLogin,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    changePassword,
    getSecurityLogs,
    completeOnboarding,
    verifyOTP,
    getDevices,
    revokeDevice,
    revokeAllDevices,
} from "./auth.controller";
import { authRateLimiter, otpRateLimiter, strictRateLimiter } from "../../middleware/rateLimit.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// ─── Public Auth Routes ─────────────────────────────────────────────────────
// Registration & Email Login
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

// Passwordless OTP Login
router.post("/send-otp", otpRateLimiter, sendOTP);        // Step 1: Request OTP
router.post("/login-otp", authRateLimiter, loginWithOTP);   // Step 2: Verify OTP & login

// Social OAuth
router.post("/google", authRateLimiter, googleLogin);
router.post("/github", authRateLimiter, githubLogin);

// Email Verification
router.post("/verify-otp", authRateLimiter, verifyOTP);

// Password Reset
router.post("/forgot-password", strictRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);

// Token Refresh (uses httpOnly cookie — no auth header needed)
router.post("/refresh", refreshToken);

// ─── Protected Auth Routes ──────────────────────────────────────────────────
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);
router.get("/security-logs", authMiddleware, getSecurityLogs);
router.post("/complete-onboarding", authMiddleware, completeOnboarding);

// ─── Device / Session Management ────────────────────────────────────────────
router.get("/devices", authMiddleware, getDevices);
router.delete("/devices/all", authMiddleware, revokeAllDevices);
router.delete("/devices/:deviceId", authMiddleware, revokeDevice);

export default router;
