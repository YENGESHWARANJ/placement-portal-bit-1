import { Schema, model, Document, Types, models } from "mongoose";

export interface IDevice extends Document {
    userId: Types.ObjectId;
    deviceId: string;        // unique fingerprint (hash of UA + IP)
    deviceName: string;      // e.g. "Chrome on Windows"
    browser: string;
    os: string;
    ip: string;
    location: string;        // city/country from IP geo
    lastLogin: Date;
    isActive: boolean;
    refreshToken?: string;   // hashed refresh token for this device
    createdAt: Date;
    updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        deviceId: { type: String, required: true },
        deviceName: { type: String, default: "Unknown Device" },
        browser: { type: String, default: "Unknown" },
        os: { type: String, default: "Unknown" },
        ip: { type: String, default: "Unknown" },
        location: { type: String, default: "Unknown" },
        lastLogin: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        refreshToken: { type: String, default: null },
    },
    { timestamps: true }
);

// Compound index: one device record per user+deviceId
DeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const Device = models.Device || model<IDevice>("Device", DeviceSchema);
