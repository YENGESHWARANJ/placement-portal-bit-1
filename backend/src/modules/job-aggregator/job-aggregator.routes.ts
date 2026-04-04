import { Router } from "express";
import { getGlobalJobs, searchJobs, getJobsByLocation, getJobsByCompany, getRemoteJobs, getTrendingSkills } from "./job-aggregator.controller";

const router = Router();

router.get("/global", getGlobalJobs);
router.get("/search", searchJobs);
router.get("/location", getJobsByLocation);
router.get("/company", getJobsByCompany);
router.get("/remote", getRemoteJobs);
router.get("/trending-skills", getTrendingSkills);

export default router;
