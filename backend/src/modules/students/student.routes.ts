import { Router } from "express";
import { registerStudent, getStudents, getPlacedStudents, updateProfile, getProfile, getStudentById, getSavedJobs, addSavedJob, removeSavedJob, getLeaderboard, getOnlineStudents, bulkRegisterStudents } from "./student.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { UserRole } from "../auth/auth.types";

const router = Router();

router.get("/profile", authMiddleware, getProfile);

router.get("/saved-jobs", authMiddleware, getSavedJobs);
router.post("/saved-jobs", authMiddleware, addSavedJob);
router.delete("/saved-jobs/:jobId", authMiddleware, removeSavedJob);

// Registration doesn't need auth (public signup)
router.post("/register", registerStudent);

// Only Admin and Recruiter can view all students
router.get("/", authMiddleware, rbacMiddleware([UserRole.ADMIN, UserRole.RECRUITER, UserRole.OFFICER]), getStudents);

// Leaderboard - Accessible to everyone with auth
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/placed-showcase", authMiddleware, getPlacedStudents);

router.get("/online", authMiddleware, getOnlineStudents);

// Get specific student profile (Recruiters/Admins)
router.get("/:id", authMiddleware, rbacMiddleware([UserRole.ADMIN, UserRole.RECRUITER, UserRole.OFFICER]), getStudentById);

// Students (and Admins/Officers) can update their own profile
router.post("/profile", authMiddleware, rbacMiddleware([UserRole.STUDENT, UserRole.ADMIN, UserRole.OFFICER]), updateProfile);

// Bulk Admin Registration
router.post("/bulk-register", authMiddleware, rbacMiddleware([UserRole.ADMIN, UserRole.OFFICER]), bulkRegisterStudents);

export default router;
