import mongoose, { Schema, Document, model } from "mongoose";

export interface IDrive extends Document {
    company: string;
    jobRole: string;
    packageName: string;
    date: Date;
    venue: string;
    salary: string;
    description: string;
    criterias: {
        cgpa: number;
        branches: string[];
        skills: string[];
        arrearsAllowed: boolean;
    };
    status: 'Pending' | 'Open' | 'Closed' | 'Completed' | 'Cancelled';
    deadline: Date;
    allowedDepartments: string[];
    rounds: string[];
    contactPerson: {
        name: string;
        email: string;
        phone: string;
    };
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DriveSchema = new Schema<IDrive>(
    {
        company: { type: String, required: true },
        jobRole: { type: String, required: true },
        packageName: { type: String },
        date: { type: Date, required: true },
        venue: { type: String, required: true },
        salary: { type: String },
        description: { type: String },
        deadline: { type: Date },
        allowedDepartments: [{ type: String }],
        criterias: {
            cgpa: { type: Number, default: 0 },
            branches: [{ type: String }],
            skills: [{ type: String }],
            arrearsAllowed: { type: Boolean, default: true },
        },
        status: {
            type: String,
            enum: ['Pending', 'Open', 'Closed', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        rounds: [{ type: String }],
        contactPerson: {
            name: String,
            email: String,
            phone: String,
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const PlacementDrive = model<IDrive>("PlacementDrive", DriveSchema);
export default PlacementDrive;
