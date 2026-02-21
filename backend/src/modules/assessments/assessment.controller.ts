import { Request, Response } from "express";
import Assessment from "./assessment.model";
import Student from "../students/student.model";

export const getQuestions = async (req: Request, res: Response) => {
    const { type } = req.query;

    // Mock questions for demo purposes
    const aptitudeQuestions = [
        {
            id: 1,
            question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
            options: ["120 metres", "180 metres", "324 metres", "150 metres"],
            correct: 3, // 150m
            topic: "Time & Distance"
        },
        {
            id: 2,
            question: "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
            options: ["15", "16", "18", "25"],
            correct: 1, // 16
            topic: "Profit & Loss"
        },
        {
            id: 3,
            question: "If 40% of a number is equal to two-third of another number, what is the ratio of first number to the second number?",
            options: ["2:5", "3:7", "5:3", "7:3"],
            correct: 2, // 5:3
            topic: "Ratio & Proportion"
        }
    ];

    const codingQuestions = [
        {
            id: 1,
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            difficulty: "Easy",
            topic: "Arrays",
            template: "function twoSum(nums, target) {\n  // Write your code here\n}"
        }
    ];

    return res.json({
        questions: type === "Aptitude" ? aptitudeQuestions : codingQuestions
    });
};

export const saveAssessment = async (req: Request, res: Response) => {
    try {
        const { type, score, totalQuestions, results, topicAnalysis, timeTaken } = req.body;
        const userId = (req as any).user.id;

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

        // Update overall student score (simplified avg)
        if (type === "Aptitude") {
            student.aptitudeScore = Math.round(((student.aptitudeScore || 0) + (score / totalQuestions) * 100) / 2);
        } else {
            student.codingScore = Math.round(((student.codingScore || 0) + (score / totalQuestions) * 100) / 2);
        }
        await student.save();

        return res.json({ message: "Assessment saved successfully", assessment });
    } catch (error) {
        return res.status(500).json({ message: "Failed to save assessment" });
    }
};

export const getStudentAssessments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const student = await Student.findOne({ userId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const assessments = await Assessment.find({ studentId: student._id }).sort({ createdAt: -1 });
        return res.json({ assessments });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch assessments" });
    }
};
