import { Request, Response } from "express";
import { JobAggregatorService } from "./job-aggregator.service";

export const getGlobalJobs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await JobAggregatorService.searchJobs({ page, limit });

        return res.status(200).json({
            success: true,
            total_jobs: result.total_jobs,
            page: result.page,
            jobs: result.jobs,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const searchJobs = async (req: Request, res: Response) => {
    try {
        const q = req.query.query as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await JobAggregatorService.searchJobs({ q, page, limit });

        return res.status(200).json({
            success: true,
            total_jobs: result.total_jobs,
            page: result.page,
            jobs: result.jobs,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Search failed" });
    }
};

export const getJobsByLocation = async (req: Request, res: Response) => {
    try {
        const country = req.query.country as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await JobAggregatorService.searchJobs({ country, page, limit });

        return res.status(200).json({
            success: true,
            total_jobs: result.total_jobs,
            jobs: result.jobs,
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const getJobsByCompany = async (req: Request, res: Response) => {
    try {
        const company = req.query.name as string;
        const result = await JobAggregatorService.searchJobs({ company });

        return res.status(200).json({
            success: true,
            total_jobs: result.total_jobs,
            jobs: result.jobs,
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const getRemoteJobs = async (req: Request, res: Response) => {
    try {
        const result = await JobAggregatorService.searchJobs({ remote: true });

        return res.status(200).json({
            success: true,
            total_jobs: result.total_jobs,
            jobs: result.jobs,
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

export const getTrendingSkills = async (req: Request, res: Response) => {
    try {
        const skills = await JobAggregatorService.getTrendingSkills();
        return res.status(200).json({
            success: true,
            skills,
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};
