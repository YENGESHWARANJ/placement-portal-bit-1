import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import { Device } from "../modules/auth/device.model";
import {
    sendDeviceLoginAlertEmail,
} from "./email";

/** Extract clean device info from request headers */
export function parseDevice(userAgent: string) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const browserName = browser.name || "Unknown Browser";
    const osName = os.name || "Unknown OS";
    const deviceType = device.type || "desktop";

    return {
        browser: browserName,
        os: osName,
        deviceName: `${browserName} on ${osName}`,
        deviceType,
    };
}

/** Generate a deterministic device fingerprint */
export function getDeviceId(ip: string, userAgent: string): string {
    return crypto
        .createHash("sha256")
        .update(`${ip}:${userAgent}`)
        .digest("hex")
        .slice(0, 32);
}

/** Get approximate geolocation from IP (uses free ip-api.com - no key needed) */
export async function getGeoLocation(ip: string): Promise<string> {
    try {
        // Skip for localhost / private IPs
        if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
            return "Local Network";
        }
        const { data } = await axios.get<{ city: string; country: string; status: string }>(
            `http://ip-api.com/json/${ip}?fields=city,country,status`,
            { timeout: 3000 }
        );
        if (data.status === "success") {
            return `${data.city}, ${data.country}`;
        }
        return "Unknown Location";
    } catch {
        return "Unknown Location";
    }
}

/** Register a device login. Returns true if it's a NEW device (triggers alert). */
export async function registerDeviceLogin(opts: {
    userId: string;
    ip: string;
    userAgent: string;
    sendAlert: boolean;
    userName: string;
    userEmail: string;
}): Promise<boolean> {
    const { userId, ip, userAgent, sendAlert, userName, userEmail } = opts;
    const deviceInfo = parseDevice(userAgent);
    const deviceId = getDeviceId(ip, userAgent);
    const location = await getGeoLocation(ip);

    const existing = await Device.findOne({ userId, deviceId });
    const isNew = !existing;

    await Device.findOneAndUpdate(
        { userId, deviceId },
        {
            $set: {
                ...deviceInfo,
                ip,
                location,
                lastLogin: new Date(),
                isActive: true,
            },
        },
        { upsert: true, new: true }
    );

    // Send login alert for new device
    if (isNew && sendAlert) {
        sendDeviceLoginAlertEmail(userEmail, userName, {
            deviceName: deviceInfo.deviceName,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            ip,
            location,
            time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }).catch(() => { }); // non-blocking
    }

    return isNew;
}
