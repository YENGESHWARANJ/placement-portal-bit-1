import { Router } from "express";
import multer from "multer";
import { analyzeResume, matchResume } from "./resume-ai.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", authMiddleware, upload.single("resume"), analyzeResume);
router.post("/match", authMiddleware, upload.single("resume"), matchResume);

export default router;
