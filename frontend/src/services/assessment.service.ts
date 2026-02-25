import api from "./api";

export interface GenerateOptions {
    type: "Aptitude" | "Coding" | "Interview";
    topic?: string;
    difficulty?: "easy" | "medium" | "hard" | "";
    count?: number;
}

export const generateAIQuestions = async (options: GenerateOptions) => {
    const params = new URLSearchParams({
        type: options.type,
        count: String(options.count || 10),
        ...(options.topic && { topic: options.topic }),
        ...(options.difficulty && { difficulty: options.difficulty }),
    });
    const res = await api.get(`/assessments/ai/generate?${params}`);
    return (res.data as any);
};

export const getTopics = async () => {
    const res = await api.get("/assessments/topics");
    return (res.data as any);
};

export const saveAssessment = async (payload: {
    type: string;
    score: number;
    totalQuestions: number;
    timeTaken: number;
    results?: any[];
    topicAnalysis?: any[];
}) => {
    const res = await api.post("/assessments/save", payload);
    return (res.data as any);
};

export const getMyAssessments = async () => {
    const res = await api.get("/assessments/my-results");
    return (res.data as any);
};
