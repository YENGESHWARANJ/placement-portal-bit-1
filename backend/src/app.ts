import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import mongoose from "mongoose";

import routes from "./routes";
import { apiRateLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ✅ Security Headers
app.use(helmet());

// ✅ Prevent XSS attacks
const xss = require("xss-clean");
app.use(xss());

// ✅ Prevent HTTP Parameter Pollution
app.use(hpp());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : []),
];

const isDev = process.env.NODE_ENV !== "production";

// ✅ Proper CORS config for frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin (e.g. Postman), dev, or whitelist (including CORS_ORIGIN)
      if (!origin || isDev || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`[CORS REJECTED] Origin: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ✅ Rate Limiting
app.use("/api", apiRateLimiter);

// ✅ Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ✅ Root test route
// ✅ Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "active",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date()
  });
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀 Security Shield Active 🛡️");
});

// API routes
app.use("/api", routes);

// Error Handling
app.use(errorHandler);

export default app;