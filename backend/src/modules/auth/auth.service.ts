import jwt from "jsonwebtoken";

const ACCESS_EXPIRY = "15m";   // Production standard: short-lived
const REFRESH_EXPIRY = "7d";   // Rotate on each use

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: REFRESH_EXPIRY,
  });
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};
