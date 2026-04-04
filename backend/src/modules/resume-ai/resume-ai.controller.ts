import { Request, Response } from "express";
import { ResumeAIService } from "./resume-ai.service";

export const analyzeResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resume PDF is required" });
        }

        const result = await ResumeAIService.analyzeResumeOnly(req.file.buffer);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const matchResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resume PDF is required" });
        }

        const result = await ResumeAIService.matchResumeToJobs(req.file.buffer);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};
