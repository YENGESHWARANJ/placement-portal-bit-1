import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    senderRole: "student" | "recruiter" | "officer" | "admin";
    content: string;
    type: "text" | "file" | "system";
    fileUrl?: string;
    fileName?: string;
    readBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IChat extends Document {
    participants: Types.ObjectId[];
    participantRoles: { userId: Types.ObjectId; role: string; name: string }[];
    lastMessage?: string;
    lastMessageAt?: Date;
    jobRef?: Types.ObjectId;
    jobTitle?: string;
    unreadCount: Map<string, number>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        senderRole: { type: String, enum: ["student", "recruiter", "officer", "admin"], required: true },
        content: { type: String, required: true, maxlength: 2000 },
        type: { type: String, enum: ["text", "file", "system"], default: "text" },
        fileUrl: { type: String },
        fileName: { type: String },
        readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const ChatSchema = new Schema<IChat>(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        participantRoles: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                role: { type: String },
                name: { type: String },
            },
        ],
        lastMessage: { type: String },
        lastMessageAt: { type: Date },
        jobRef: { type: Schema.Types.ObjectId, ref: "Job" },
        jobTitle: { type: String },
        unreadCount: { type: Map, of: Number, default: {} },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageAt: -1 });
MessageSchema.index({ chatId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
