import { Schema, model, Document, Types, models } from "mongoose";

export interface ILoginLog extends Document {
    userId: Types.ObjectId;
    action: string;
    timestamp: Date;
    location: string;
    device: string;
    status: "success" | "warning" | "danger";
}

const LoginLogSchema = new Schema<ILoginLog>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: { type: String, default: "MUMBAI, INDIA [GEO_NODE]" },
    device: { type: String, default: "CHROME ON WINDOWS [IDENT_01]" },
    status: { type: String, enum: ["success", "warning", "danger"], default: "success" }
}, { timestamps: true });

export const LoginLog = models.LoginLog || model<ILoginLog>("LoginLog", LoginLogSchema);
