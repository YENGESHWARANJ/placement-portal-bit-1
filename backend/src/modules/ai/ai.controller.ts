import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import axios from "axios";
import { ENV } from "../../config/env.config";
import Student from "../students/student.model";
import FormData from "form-data";

// Multer adds file to Request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const scanResumeAndRank = async (
  req: MulterRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file missing" });
    }

    const file = req.file;
    const aiGatewayUrl = ENV.AI_GATEWAY_URL;

    const form = new FormData();
    form.append("file", file.buffer, file.originalname);

    // 👉 Resume parse
    const { data } = await axios.post(
      `${aiGatewayUrl}/parse-resume`,
      form,
      { headers: form.getHeaders() }
    );

    return res.json(data);
  } catch (error) {
    console.error("AI scan failed:", error);
    return res.status(500).json({
      message: "AI scan failed. Ensure Python service is running.",
    });
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user?.userId;

    // Fetch student context for personalized answers
    const student = await Student.findOne({ userId });

    const context = {
      role: req.user?.role || "student",
      resumeScore: student?.resumeScore || 0,
      objective: student?.careerObjective || "Technology",
      skills: student?.skills || []
    };

    const aiGatewayUrl = ENV.AI_GATEWAY_URL;

    const { data } = await axios.post<{ response: string }>(`${aiGatewayUrl}/ask-ai`, {
      query,
      context
    });

    return res.json({
      success: true,
      response: data.response
    });

  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Intelligence module temporarily offline",
      response: "I'm having trouble connecting to my core brain right now. Please try again in a moment."
    });
  }
};

export const generateJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const aiGatewayUrl = ENV.AI_GATEWAY_URL;

    const { data } = await axios.post<any>(`${aiGatewayUrl}/generate-job`, { title });
    return res.json(data);
  } catch (error) {
    console.error("GENERATE JOB ERROR:", error);
    return res.status(500).json({ message: "AI Generator offline" });
  }
};
