import { Schema, model, Document, models } from "mongoose";

export interface ICompany extends Document {
    name: string;
    description: string;
    industry: string;
    website?: string;
    logo?: string;
    location: string;
    status: 'pending' | 'active' | 'inactive' | 'rejected';
    recruiterIds: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        website: {
            type: String,
            trim: true
        },
        logo: {
            type: String, // URL
        },
        location: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'inactive', 'rejected'],
            default: 'pending'
        },
        recruiterIds: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    {
        timestamps: true
    }
);

const Company = models.Company || model<ICompany>("Company", CompanySchema);

export default Company;
