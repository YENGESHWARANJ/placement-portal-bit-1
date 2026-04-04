import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export class OpenAIService {
    static async getEmbedding(text: string) {
        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error("OpenAI Embedding Error:", error);
            return null;
        }
    }

    static async analyzeResume(text: string) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Extract professional skills and years of experience from the following resume text. Return a JSON object with 'skills' (array) and 'experience' (number, in years).",
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
                response_format: { type: "json_object" },
            });
            return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
            console.error("OpenAI Resume Analysis Error:", error);
            return { skills: [], experience: 0 };
        }
    }

    static cosineSimilarity(vecA: number[], vecB: number[]) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (normA * normB);
    }
}
