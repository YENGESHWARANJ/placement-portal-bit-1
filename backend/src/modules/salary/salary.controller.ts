import { Request, Response } from "express";
import { SalaryService } from "./salary.service";

export const getSalaryByRole = async (req: Request, res: Response) => {
    try {
        const title = req.query.title as string;
        if (!title) return res.status(400).json({ message: "Role title is required" });

        const data = await SalaryService.getSalaryByRole(title);
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch salary data" });
    }
};

export const getSalaryByCountry = async (req: Request, res: Response) => {
    try {
        const country = req.query.country as string;
        if (!country) return res.status(400).json({ message: "Country is required" });

        const data = await SalaryService.getSalaryByCountry(country);
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch salary data" });
    }
};

export const getSalaryTrends = async (req: Request, res: Response) => {
    try {
        const data = await SalaryService.getSalaryTrends();
        return res.json({ success: true, trends: data });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch salary trends" });
    }
};
