import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../users/user.model";
import Student from "../students/student.model";
import { generateAccessToken, generateRefreshToken } from "./auth.service";
import { UserRole } from "./auth.types";
import { registerSchema, loginSchema } from "../../utils/validation";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LoginLog } from "./loginLog.model";

// ================================
// REGISTER USER
// ================================
export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((err: any) => err.message),
      });
    }

    const { name, email, password, role } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
      status: role === UserRole.RECRUITER ? "pending" : "active",
    });

    console.log(`[AUTH] User registered: ${email} with status: ${user.status}`);

    // 2b. If student, create student profile
    if (user.role === UserRole.STUDENT) {
      await Student.create({
        userId: user._id,
        name: user.name,
        usn: `TEMP_${user._id.toString().slice(-8).toUpperCase()}`,
        branch: "Pending",
        year: 1,
        status: "Unplaced"
      });
      console.log(`[AUTH] Auto-created student profile for: ${email}`);
    }

    // 3. Generate Tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshTokenValue = generateRefreshToken(payload);

    // 4. Set HttpOnly Cookie
    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("[AUTH ERROR] Registration failed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ================================
// LOGIN USER
// ================================
export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map((err: any) => err.message)
      });
    }

    const { email, password } = result.data;
    console.log(`[AUTH] Login attempt for email: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`[AUTH] Login failed: User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // CHECK USER STATUS
    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending approval by the admin." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended. Please contact the administrator." });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your registration request was rejected." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH] Login failed: Password mismatch for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`[AUTH] Login successful for email: ${email}`);

    // LOG SUCCESS
    await LoginLog.create({
      userId: user._id,
      action: "Login Successful",
      status: "success"
    });

    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshTokenValue = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("[AUTH ERROR] Login failed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ================================
// REFRESH TOKEN
// ================================
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ================================
// LOGOUT USER
// ================================
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

// ================================
// SECURITY CONTROLLERS
// ================================
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await LoginLog.create({ userId: user._id, action: "Failed Password Change", status: "danger" });
      return res.status(401).json({ message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await LoginLog.create({ userId: user._id, action: "Password Changed", status: "success" });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to rotate access key" });
  }
};

export const getSecurityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const logs = await LoginLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
    return res.json({ logs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch security flux" });
  }
};
