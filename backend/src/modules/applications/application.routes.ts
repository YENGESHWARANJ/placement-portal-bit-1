import { Router } from "express";
import { 
    applyForJob, 
    getMyApplications, 
    getJobApplicants, 
    updateApplicationStatus, 
    fastTrackApplicant, 
    withdrawApplication,
    applyForDrive,
    getDriveApplicants,
    bulkUpdateApplicationStatus
} from "./application.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Student
router.post("/", authMiddleware, applyForJob); // Apply (jobId in body)
router.post("/drive", authMiddleware, applyForDrive); // Apply for drive (driveId in body)
router.get("/my", authMiddleware, getMyApplications); // Get my applications
router.patch("/:id/withdraw", authMiddleware, withdrawApplication); // Withdraw own application

// Admin / Recruiter
router.get("/job/:jobId", authMiddleware, getJobApplicants); // Get applicants for a job
router.get("/drive/:driveId", authMiddleware, getDriveApplicants); // Get applicants for a drive
router.put("/bulk-status", authMiddleware, bulkUpdateApplicationStatus); // Bulk status update
router.put("/:id", authMiddleware, updateApplicationStatus); // Update status single
router.post("/:id/fast-track", authMiddleware, fastTrackApplicant); // Fast track assessment winner

export default router;
