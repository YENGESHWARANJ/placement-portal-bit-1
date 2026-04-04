import { Request, Response } from "express";
import PlacementDrive from "./drive.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import Notice from "../notices/notice.model";
import { broadcastGlobalEvent } from "../../config/socket.config";

export const createDrive = async (req: AuthRequest, res: Response) => {
    try {
        const driveData = {
            ...req.body,
            createdBy: req.user?.userId
        };
        const drive = await PlacementDrive.create(driveData);

        // CREATE INSTITUTIONAL NOTICE
        await Notice.create({
            title: `🚀 NEW PLACEMENT DRIVE: ${drive.company}`,
            content: `A new recruitment drive for the role of ${drive.jobRole} has been broadcasted. Package: ${drive.packageName}. Deadline: ${new Date(drive.deadline).toLocaleDateString()}. Check details in the Placement Portal.`,
            createdBy: req.user?.userId,
            type: "All",
            priority: "High"
        });

        // BROADCAST REAL-TIME NOTIFICATION
        broadcastGlobalEvent("global_notification", {
            message: `🚀 NEW DRIVE: ${drive.company} is hiring for ${drive.jobRole}!`,
            type: "success"
        });

        return res.status(201).json({ drive });
    } catch (error) {
        console.error("CREATE DRIVE ERROR:", error);
        return res.status(500).json({ message: "Failed to create drive" });
    }
};

import Student from "../students/student.model";

export const getAllDrives = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role === 'STUDENT') {
            const student = await Student.findOne({ userId: req.user.userId });
            if (!student) return res.status(404).json({ message: "Student context not found" });

            const drives = await PlacementDrive.find({
                status: 'Open',
                'criterias.cgpa': { $lte: student.cgpa },
                'criterias.branches': student.branch,
                $or: [
                    { 'criterias.arrearsAllowed': true },
                    { 'criterias.arrearsAllowed': false, currentArrears: 0 }
                ]
            }).sort({ date: 1 });
            return res.json({ drives });
        }

        const drives = await PlacementDrive.find().sort({ date: 1 });
        return res.json({ drives });
    } catch (error) {
        console.error("GET DRIVES ERROR:", error);
        return res.status(500).json({ message: "System failed to aggregate drive nodes" });
    }
};

export const deleteDrive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await PlacementDrive.findByIdAndDelete(id);
        return res.json({ message: "Drive deleted successfully" });
    } catch (error) {
        console.error("DELETE DRIVE ERROR:", error);
        return res.status(500).json({ message: "Failed to delete drive" });
    }
};

export const updateDrive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const drive = await PlacementDrive.findByIdAndUpdate(id, req.body, { new: true });
        return res.json({ drive });
    } catch (error) {
        console.error("UPDATE DRIVE ERROR:", error);
        return res.status(500).json({ message: "Failed to update drive" });
    }
};
