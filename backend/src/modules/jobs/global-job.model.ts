import { Schema, model, Document, models } from "mongoose";

export interface IGlobalJob extends Document {
    title: string;
    company: string;
    location: string;
    country: string;
    salary: string;
    description: string;
    skills: string[];
    experience_level: string;
    apply_url: string;
    source: string;
    createdAt: Date;
}

const GlobalJobSchema = new Schema<IGlobalJob>(
    {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        country: { type: String, default: "Global" },
        salary: { type: String, default: "Not disclosed" },
        description: { type: String, required: true },
        skills: { type: [String], default: [] },
        experience_level: { type: String, default: "Fresher / 1-3 years" },
        apply_url: { type: String, required: true, unique: true },
        source: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

GlobalJobSchema.index({ title: "text", company: "text", location: "text", skills: "text" });

const GlobalJob = models.GlobalJob || model<IGlobalJob>("GlobalJob", GlobalJobSchema);

export default GlobalJob;
