import rateLimit from "express-rate-limit";

const isProd = process.env.NODE_ENV === "production";

// ─────────────────────────────────────────────────────────────
// Auth Rate Limiter — Login, Register, OAuth
// Max 10 attempts per 15 minutes per IP (production)
// ─────────────────────────────────────────────────────────────
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 10 : 1000,
    message: { message: "Too many authentication attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// ─────────────────────────────────────────────────────────────
// OTP Rate Limiter — Stricter: max 3 OTP requests per 10 min
// Prevents OTP flooding / SMS bombing
// ─────────────────────────────────────────────────────────────
export const otpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: isProd ? 3 : 1000,
    message: { message: "Too many OTP requests. Please wait 10 minutes before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────
// Strict Rate Limiter — Password Reset: max 3 per 30 min
// Prevents email bombing via forgot-password
// ─────────────────────────────────────────────────────────────
export const strictRateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: isProd ? 3 : 1000,
    message: { message: "Too many password reset requests. Please try again in 30 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────
// API Rate Limiter — General API: max 100 requests per 15 min
// ─────────────────────────────────────────────────────────────
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 100 : 10000,
    message: { message: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
