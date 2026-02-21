import { Request, Response } from "express";
import Notice from "./notice.model";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createNotice = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, type, priority } = req.body;
        const userId = req.user?.userId;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const notice = await Notice.create({
            title,
            content,
            type: type || "All",
            priority: priority || "Low",
            createdBy: userId
        });

        return res.status(201).json({ message: "Notice posted successfully", notice });
    } catch (error) {
        console.error("CREATE NOTICE ERROR:", error);
        return res.status(500).json({ message: "Failed to post notice" });
    }
};

export const getNotices = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        const filter: any = {};
        if (type) filter.type = { $in: [type, "All"] };

        const notices = await Notice.find(filter)
            .sort({ createdAt: -1 })
            .populate("createdBy", "name");

        return res.json({ notices });
    } catch (error) {
        console.error("GET NOTICES ERROR:", error);
        return res.status(500).json({ message: "Failed to fetch notices" });
    }
};

export const deleteNotice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Notice.findByIdAndDelete(id);
        return res.json({ message: "Notice deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete notice" });
    }
};
