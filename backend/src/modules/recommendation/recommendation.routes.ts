import { Router } from "express";
import { getRecommendations } from "./recommendation.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/:userId", authMiddleware, getRecommendations);

export default router;
