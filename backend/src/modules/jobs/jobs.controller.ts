import { Request, Response } from "express";
import { JobsService } from "./jobs.service";

export const getGlobalJobs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const jobs = await JobsService.getGlobalJobs({
            page,
            limit,
        });

        const paginatedJobs = jobs.slice((page - 1) * limit, page * limit);

        return res.status(200).json({
            success: true,
            count: paginatedJobs.length,
            totalCount: jobs.length,
            page,
            jobs: paginatedJobs,
        });
    } catch (error) {
        console.error("GET GLOBAL JOBS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch global jobs",
        });
    }
};

export const searchJobs = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const jobs = await JobsService.getGlobalJobs({
            query,
            page,
            limit,
        });

        const paginatedJobs = jobs.slice((page - 1) * limit, page * limit);

        return res.status(200).json({
            success: true,
            count: paginatedJobs.length,
            jobs: paginatedJobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};

export const getJobsByLocation = async (req: Request, res: Response) => {
    try {
        const country = req.query.country as string;
        const city = req.query.city as string;
        const remote = req.query.remote === "true";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const jobs = await JobsService.getGlobalJobs({
            country,
            page,
            limit,
        });

        let filteredJobs = jobs as any[];
        if (city) {
            filteredJobs = filteredJobs.filter((j: any) => (j.location || "").toLowerCase().includes(city.toLowerCase()));
        }
        if (remote) {
            filteredJobs = filteredJobs.filter((j: any) => (j.location || "").toLowerCase().includes("remote") || (j.description || "").toLowerCase().includes("remote"));
        }

        const paginatedJobs = filteredJobs.slice((page - 1) * limit, page * limit);

        return res.status(200).json({
            success: true,
            count: paginatedJobs.length,
            jobs: paginatedJobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs by location",
        });
    }
};

export const getJobsByCompany = async (req: Request, res: Response) => {
    try {
        const { company } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const jobs = await JobsService.getGlobalJobs({
            company,
            page,
            limit,
        });

        const paginatedJobs = jobs.slice((page - 1) * limit, page * limit);

        return res.status(200).json({
            success: true,
            count: paginatedJobs.length,
            jobs: paginatedJobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs by company",
        });
    }
};
