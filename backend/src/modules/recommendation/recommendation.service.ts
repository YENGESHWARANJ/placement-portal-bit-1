import Student from "../students/student.model";
import GlobalJob from "../jobs/global-job.model";
import Application from "../applications/application.model";
import { OpenAIService } from "../../utils/openai";

export class RecommendationService {
    static async getRecommendations(userId: string) {
        // 1. Get user profile and skills
        const student = await Student.findOne({ userId });
        if (!student) return [];

        // 2. Get previous applications to understand interests
        const previousApplications = await Application.find({ studentId: student._id }).populate("jobId");
        const applicationContext = previousApplications
            .map((app: any) => app.jobId?.title)
            .filter(Boolean)
            .join(", ");

        const userContext = `Skills: ${student.skills.join(", ")}. Interests based on previous applications: ${applicationContext}`;
        const userEmbedding = await OpenAIService.getEmbedding(userContext);

        if (!userEmbedding) {
            // Fallback to keyword matching if embedding fails
            return await GlobalJob.find({
                $or: [
                    { title: { $in: (student.skills || []).map((skill: string) => new RegExp(skill, "i")) } },
                    { description: { $in: (student.skills || []).map((skill: string) => new RegExp(skill, "i")) } }
                ]
            }).limit(10);
        }

        // 3. Fetch potential jobs (broad search)
        const jobs = await GlobalJob.find({}).limit(100);

        // 4. Calculate similarity scores
        const rankedJobs = await Promise.all(
            jobs.map(async (job: any) => {
                const jobContext = `${job.title} ${job.description}`;
                const jobEmbedding = await OpenAIService.getEmbedding(jobContext);

                if (!jobEmbedding) return { job, score: 0 };

                const score = OpenAIService.cosineSimilarity(userEmbedding, jobEmbedding);
                return { job, score };
            })
        );

        // 5. Sort by score and return top 10
        return rankedJobs
            .sort((a: any, b: any) => b.score - a.score)
            .slice(0, 10)
            .map((item: any) => ({
                ...item.job.toObject(),
                match_score: (item.score * 100).toFixed(2),
            }));
    }
}
