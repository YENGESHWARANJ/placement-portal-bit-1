const pdf = require("pdf-parse");
import { OpenAIService } from "../../utils/openai";
import GlobalJob from "../jobs/global-job.model";

export class ResumeAIService {
    static async analyzeResumeOnly(fileBuffer: Buffer) {
        try {
            const data = await pdf(fileBuffer);
            const resumeText = data.text;
            const analysis = await OpenAIService.analyzeResume(resumeText);
            return analysis;
        } catch (error) {
            console.error("ResumeAI analyze error:", error);
            throw error;
        }
    }

    static async matchResumeToJobs(fileBuffer: Buffer) {
        try {
            const data = await pdf(fileBuffer);
            const resumeText = data.text;

            const analysis = await OpenAIService.analyzeResume(resumeText);
            const { skills, experience } = analysis;

            const resumeEmbedding = await OpenAIService.getEmbedding(resumeText);

            if (!resumeEmbedding) {
                const matchedJobs = await GlobalJob.find({
                    $or: [
                        { title: { $in: (skills || []).map((s: string) => new RegExp(s, "i")) } },
                        { description: { $in: (skills || []).map((s: string) => new RegExp(s, "i")) } },
                    ],
                }).limit(10);
                return { skills, experience, recommended_jobs: matchedJobs };
            }

            const jobs = await GlobalJob.find({}).limit(50);
            const rankedJobs = await Promise.all(
                jobs.map(async (job: any) => {
                    const jobContext = `${job.title} ${job.description}`;
                    const jobEmbedding = await OpenAIService.getEmbedding(jobContext);
                    if (!jobEmbedding) return { job, score: 0 };
                    const score = OpenAIService.cosineSimilarity(resumeEmbedding, jobEmbedding);
                    return { job, score };
                })
            );

            const bestMatches = rankedJobs
                .sort((a: any, b: any) => b.score - a.score)
                .slice(0, 10)
                .map((item) => ({
                    ...item.job.toObject(),
                    match_score: (item.score * 100).toFixed(2),
                }));

            return {
                skills,
                experience,
                recommended_jobs: bestMatches,
            };
        } catch (error) {
            console.error("ResumeAIService match error:", error);
            throw error;
        }
    }
}
