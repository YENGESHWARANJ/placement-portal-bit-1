import { Router } from "express";
import { register, login, refreshToken, logout, changePassword, getSecurityLogs } from "./auth.controller";
import { authRateLimiter } from "../../middleware/rateLimit.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/change-password", authMiddleware, changePassword);
router.get("/security-logs", authMiddleware, getSecurityLogs);

export default router;
