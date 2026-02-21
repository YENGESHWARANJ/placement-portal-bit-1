import { Router } from "express";
import multer from "multer";
import { scanResumeAndRank, chatWithAI, generateJob } from "./ai.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Authenticated route to allow saving to profile
router.post("/scan", authMiddleware, upload.single("file"), scanResumeAndRank);
router.post("/chat", authMiddleware, chatWithAI);
router.post("/generate-job", authMiddleware, generateJob);

export default router;
