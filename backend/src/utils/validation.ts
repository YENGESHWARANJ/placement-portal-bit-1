import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Password strength checker (shared across schemas)
// ─────────────────────────────────────────────────────────────
const strongPassword = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .refine((p) => /[A-Z]/.test(p), "Password must contain at least one uppercase letter")
    .refine((p) => /[0-9]/.test(p), "Password must contain at least one number")
    .refine((p) => /[^A-Za-z0-9]/.test(p), "Password must contain at least one special character");

// ─────────────────────────────────────────────────────────────
// Registration
// ─────────────────────────────────────────────────────────────
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name too long")
        .trim(),
    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    password: strongPassword,
    role: z.enum(["student", "recruiter", "admin"]).optional().default("student"),
    captchaToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
    captchaToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────
// OTP Verification
// ─────────────────────────────────────────────────────────────
export const verifyOTPSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must be numeric"),
});

// ─────────────────────────────────────────────────────────────
// OTP Login (passwordless)
// ─────────────────────────────────────────────────────────────
export const loginOTPSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must be numeric"),
});

// ─────────────────────────────────────────────────────────────
// Send OTP (for passwordless login)
// ─────────────────────────────────────────────────────────────
export const sendOTPSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
});

// ─────────────────────────────────────────────────────────────
// Password Reset
// ─────────────────────────────────────────────────────────────
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: strongPassword,
});

// ─────────────────────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────────────────────
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: strongPassword,
});
