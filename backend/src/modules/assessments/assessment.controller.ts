import { Request, Response } from "express";
import axios from "axios";
import { ENV } from "../../config/env.config";
import Assessment from "./assessment.model";
import Student from "../students/student.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import { broadcastGlobalEvent } from "../../config/socket.config";
import {
    aptitudeBank, codingBank, interviewBank,
    getRandomQuestions, shuffleArray,
    MCQQuestion, CodingQuestion, InterviewQuestion
} from "./questionBank";

interface AIQuestionResponse {
    success: boolean;
    type: string;
    topic: string;
    difficulty: string;
    questions: any[];
}

// ─────────────────────────────────────────────────────────
// AI GENERATE QUESTIONS (Now calls AI Service)
// ─────────────────────────────────────────────────────────
export const generateAIQuestions = async (req: Request, res: Response) => {
    try {
        const { type, topic, difficulty, count = 10 } = req.query;
        const numCount = Math.min(Number(count), 20);

        try {
            // Attempt to call AI Gateway
            const aiResponse = await axios.post(`${ENV.AI_GATEWAY_URL}/generate-questions`, {
                type,
                topic: topic || "General",
                difficulty: difficulty || "medium",
                count: numCount
            });

            const data = aiResponse.data as AIQuestionResponse;

            if (data && data.success) {
                return res.json({
                    success: true,
                    type: type || "Full Assessment",
                    generated: true,
                    aiGenerated: true,
                    topic: topic || "Mixed",
                    difficulty: difficulty || "mixed",
                    questions: data.questions
                });
            }
        } catch (aiError) {
            console.warn("AI Gateway unreachable, falling back to local bank");
        }

        // --- FALLBACK LOGIC ---
        if (type === "Aptitude") {
            const questions = getRandomQuestions<MCQQuestion>(
                aptitudeBank,
                numCount,
                topic as string,
                difficulty as string
            ).map((q, idx) => ({ ...q, id: idx + 1 }));

            return res.json({
                success: true,
                type: "Aptitude",
                generated: true,
                topic: topic || "Mixed",
                difficulty: difficulty || "mixed",
                questions
            });
        }

        if (type === "Coding") {
            const questions = getRandomQuestions<CodingQuestion>(
                codingBank,
                Math.min(numCount, 5),
                topic as string,
                difficulty as string
            ).map((q, idx) => ({ ...q, id: idx + 1 }));

            return res.json({
                success: true,
                type: "Coding",
                generated: true,
                topic: topic || "Mixed",
                difficulty: difficulty || "Mixed",
                questions
            });
        }

        if (type === "Interview") {
            const questions = getRandomQuestions<InterviewQuestion>(
                interviewBank,
                numCount,
                topic as string,
                difficulty as string
            ).map((q, idx) => ({ ...q, id: idx + 1 }));

            return res.json({
                success: true,
                type: "Interview",
                generated: true,
                topic: topic || "Mixed",
                difficulty: difficulty || "mixed",
                questions
            });
        }

        // Mixed Set
        const apts = getRandomQuestions<MCQQuestion>(aptitudeBank, 5).map((q, i) => ({ ...q, id: i + 1, assessmentType: "Aptitude" }));
        const codes = getRandomQuestions<CodingQuestion>(codingBank, 2).map((q, i) => ({ ...q, id: i + 1, assessmentType: "Coding" }));

        return res.json({
            success: true,
            type: "Full Assessment",
            generated: true,
            questions: [...apts, ...codes]
        });

    } catch (error) {
        console.error("AI GENERATE QUESTIONS ERROR:", error);
        return res.status(500).json({ message: "Assessment engine offline" });
    }
};

// ─────────────────────────────────────────────────────────
// GET TOPICS (for topic selector UI)
// ─────────────────────────────────────────────────────────
export const getTopics = async (_req: Request, res: Response) => {
    const aptitudeTopics = [...new Set(aptitudeBank.map(q => q.topic))];
    const codingTopics = [...new Set(codingBank.map(q => q.topic))];
    const interviewCategories = [...new Set(interviewBank.map(q => q.category))];

    return res.json({
        aptitude: aptitudeTopics,
        coding: codingTopics,
        interview: interviewCategories
    });
};

// ─────────────────────────────────────────────────────────
// LEGACY — kept for backward compat
// ─────────────────────────────────────────────────────────
export const getQuestions = async (req: Request, res: Response) => {
    const { type } = req.query;

    // Now uses real bank instead of hardcoded 3 questions
    if (type === "Aptitude") {
        const questions = getRandomQuestions<MCQQuestion>(aptitudeBank, 10).map((q, i) => ({ ...q, id: i + 1 }));
        return res.json({ questions });
    }

    if (type === "Coding") {
        const questions = getRandomQuestions<CodingQuestion>(codingBank, 1);
        return res.json({ questions });
    }

    if (type === "Interview") {
        const questions = getRandomQuestions<InterviewQuestion>(interviewBank, 10).map((q, i) => ({ ...q, id: i + 1 }));
        return res.json({ questions });
    }

    return res.json({ questions: [] });
};

// ─────────────────────────────────────────────────────────
// SAVE ASSESSMENT
// ─────────────────────────────────────────────────────────
export const saveAssessment = async (req: Request, res: Response) => {
    try {
        const { type, score, totalQuestions, results, topicAnalysis, timeTaken } = req.body;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        const student = await Student.findOne({ userId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const assessment = new Assessment({
            studentId: student._id,
            type,
            title: `${type} Assessment - ${new Date().toLocaleDateString()}`,
            score,
            totalQuestions,
            results,
            topicAnalysis,
            timeTaken
        });

        await assessment.save();

        // Update student score (weighted average)
        const percentage = Math.round((score / totalQuestions) * 100);
        if (type === "Aptitude") {
            student.aptitudeScore = Math.round(((student.aptitudeScore || 0) + percentage) / 2);
        } else if (type === "Coding") {
            student.codingScore = Math.round(((student.codingScore || 0) + percentage) / 2);
        } else if (type === "Interview") {
            student.interviewScore = Math.round(((student.interviewScore || 0) + percentage) / 2);
        }
        await student.save();

        if (percentage >= 80) {
            broadcastGlobalEvent("global_notification", {
                message: `🏆 ${student.name} just scored ${percentage}% on the ${type} Assessment!`,
                type: "success"
            });
        }

        return res.json({ message: "Assessment saved successfully", assessment });
    } catch (error) {
        console.error("SAVE ASSESSMENT ERROR:", error);
        return res.status(500).json({ message: "Failed to save assessment" });
    }
};

// ─────────────────────────────────────────────────────────
// GET RECOMMENDED PREP QUESTIONS (based on skills)
// ─────────────────────────────────────────────────────────
export const getRecommendedPrepQuestions = async (req: Request, res: Response) => {
    try {
        const { skills = [] } = req.body;
        const skillList = Array.isArray(skills) ? skills : [skills];

        if (skillList.length === 0) {
            return res.json({
                coding: getRandomQuestions(codingBank, 3),
                interview: getRandomQuestions(interviewBank, 3),
                aptitude: getRandomQuestions(aptitudeBank, 3)
            });
        }

        // Filter banks by skills
        const coding = codingBank.filter(q =>
            skillList.some(s =>
                q.title.toLowerCase().includes(s.toLowerCase()) ||
                q.topic.toLowerCase().includes(s.toLowerCase())
            )
        ).slice(0, 3);

        const interview = interviewBank.filter(q =>
            skillList.some(s =>
                q.category.toLowerCase().includes(s.toLowerCase()) ||
                q.question.toLowerCase().includes(s.toLowerCase())
            )
        ).slice(0, 5);

        // Fill with random if empty or not enough
        const finalCoding = coding.length >= 3 ? coding : [...coding, ...getRandomQuestions(codingBank, 3 - coding.length)];
        const finalInterview = interview.length >= 5 ? interview : [...interview, ...getRandomQuestions(interviewBank, 5 - interview.length)];

        return res.json({
            coding: finalCoding,
            interview: finalInterview,
            aptitude: getRandomQuestions(aptitudeBank, 3)
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch recommendations" });
    }
};

// ─────────────────────────────────────────────────────────
// GET STUDENT ASSESSMENTS
// ─────────────────────────────────────────────────────────
export const getStudentAssessments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const student = await Student.findOne({ userId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const assessments = await Assessment.find({ studentId: student._id }).sort({ createdAt: -1 });
        return res.json({ assessments });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch assessments" });
    }
};
