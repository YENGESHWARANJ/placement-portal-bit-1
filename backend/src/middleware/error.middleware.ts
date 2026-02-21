import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong";

    // Log full error on server
    console.error(`[CRITICAL ERROR] ${new Date().toISOString()}`);
    console.error(`Path: ${req.originalUrl}`);
    console.error(`Message: ${message}`);
    console.error(`Stack: ${err.stack}`);

    // Send generic error to user in production, detailed only in development
    res.status(statusCode).json({
        message: process.env.NODE_ENV === "production" ? "Something went wrong" : message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
        path: req.originalUrl
    });
};
