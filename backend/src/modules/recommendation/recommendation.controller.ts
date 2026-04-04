import { Request, Response } from "express";
import { RecommendationService } from "./recommendation.service";

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const recommendedJobs = await RecommendationService.getRecommendations(userId);

        return res.status(200).json({
            success: true,
            recommended_jobs: recommendedJobs,
        });
    } catch (error) {
        console.error("RECOMMENDATION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recommendations",
        });
    }
};
