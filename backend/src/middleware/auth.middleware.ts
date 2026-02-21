import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ DEVOLOPMENT MOCK MODE
  if (token === "mock-google-token" || token.startsWith("mock-")) {
    let role = "student";
    if (token.includes("recruiter")) role = "recruiter";
    if (token.includes("admin")) role = "admin";
    if (token.includes("officer")) role = "officer";

    req.user = {
      userId: "65cf0e1d5a2d6a001b8e8b01", // Default Mock ID
      role: role
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
