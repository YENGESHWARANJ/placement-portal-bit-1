import { Router } from "express";
import { getGlobalJobs, searchJobs, getJobsByLocation, getJobsByCompany } from "./jobs.controller";
import { createJob, getJobs, getRecommendedJobs, deleteJob, updateJob, getMyJobs, getCompanies, getJobById } from "./job.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter for global job API
const globalJobsRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes"
    }
});

// Global Job Routes
router.get("/global", globalJobsRateLimiter, getGlobalJobs);
router.get("/search", globalJobsRateLimiter, searchJobs);
router.get("/location", globalJobsRateLimiter, getJobsByLocation);
router.get("/company/:company", globalJobsRateLimiter, getJobsByCompany);

// Internal Portal Job Routes (Existing)
router.post("/", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/companies", getCompanies);
router.get("/my", authMiddleware, getMyJobs);
router.get("/recommendations", authMiddleware, getRecommendedJobs);
router.get("/:id", getJobById);
router.delete("/:id", authMiddleware, deleteJob);
router.put("/:id", authMiddleware, updateJob);

export default router;
