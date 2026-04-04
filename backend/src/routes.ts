import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes";
import aiRoutes from "./modules/ai/ai.routes";
import studentRoutes from "./modules/students/student.routes";
import jobsRoutes from "./modules/jobs/jobs.routes";
import resumeRoutes from "./modules/resume/resume.routes";

import applicationRoutes from "./modules/applications/application.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import interviewRoutes from "./modules/interview/interview.routes";
import roadmapRoutes from "./modules/roadmap/roadmap.routes";
import resourceRoutes from "./modules/resources/resource.routes";
import noticeRoutes from "./modules/notices/notice.routes";
import assessmentRoutes from "./modules/assessments/assessment.routes";
import arenaRoutes from "./modules/arena/arena.routes";
import adminRoutes from "./modules/admin/admin.routes";
import placementDriveRoutes from "./modules/placement-drives/drive.routes";
import companyRoutes from "./modules/companies/company.routes";
import activityRoutes from "./modules/activity/activity.routes";
import recommendationRoutes from "./modules/recommendation/recommendation.routes";
import salaryRoutes from "./modules/salary/salary.routes";
import resumeAIRoutes from "./modules/resume-ai/resume-ai.routes";
import jobAggregatorRoutes from "./modules/job-aggregator/job-aggregator.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/companies", companyRoutes);
router.use("/placement-drives", placementDriveRoutes);
router.use("/notices", noticeRoutes);
router.use("/ai", aiRoutes);
router.use("/resume", resumeRoutes); // New Route
router.use("/students", studentRoutes);
router.use("/jobs", jobsRoutes);
router.use("/applications", applicationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/interview", interviewRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/resources", resourceRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/arena", arenaRoutes);
router.use("/activity", activityRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/salary", salaryRoutes);
router.use("/resume-ai", resumeAIRoutes);
router.use("/job-aggregator", jobAggregatorRoutes);

export default router;
