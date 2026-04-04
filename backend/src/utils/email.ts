import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────
// Transporter — uses Gmail SMTP (set SMTP_* in .env)
// Falls back to Ethereal (test mail) if not configured
// ─────────────────────────────────────────────────────────────
let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("[EMAIL] Using SMTP transporter:", process.env.SMTP_HOST);
  } else {
    // Dev fallback: Ethereal fake SMTP
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log("[EMAIL] ⚠  No SMTP configured — using Ethereal test mail.");
    console.log("[EMAIL] Preview emails at: https://ethereal.email/messages");
  }

  return transporter;
}

const FROM = process.env.SMTP_FROM || "PlacementCell <noreply@placementcell.app>";

// ─────────────────────────────────────────────────────────────
// Base HTML Template
// ─────────────────────────────────────────────────────────────
function baseTemplate(title: string, body: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr><td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px;">🎓 PlacementCell</h1>
            <p style="color:#bfdbfe;margin:6px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;">${title}</p>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:36px 40px;">
            ${body}
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="color:#94a3b8;font-size:11px;margin:0;">This email was sent by PlacementCell portal. Do not reply.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────
// 1. Send OTP Verification Email
// ─────────────────────────────────────────────────────────────
export async function sendOTPEmail(to: string, name: string, otp: string) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">Verify Your Email</h2>
      <p style="color:#475569;margin:0 0 28px;line-height:1.6;">Hi <strong>${name}</strong>, use the OTP below to verify your email address. It expires in <strong>5 minutes</strong>.</p>
      <div style="background:#f0f9ff;border:2px dashed #3b82f6;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
        <p style="color:#64748b;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Your One-Time Password</p>
        <h1 style="color:#1d4ed8;font-size:48px;font-weight:900;margin:0;letter-spacing:12px;">${otp}</h1>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0;">If you didn't request this, please ignore this email.</p>`;

    const info = await t.sendMail({ from: FROM, to, subject: `${otp} — Your PlacementCell verification code`, html: baseTemplate("Email Verification", body) });
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n-----------------------------------------`);
      console.log(`[DEV ONLY] OTP for ${to}: ${otp}`);
      console.log(`[EMAIL] Preview: ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`-----------------------------------------\n`);
    }
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${to}:`, err);
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Send OTP Login Email (Passwordless)
// ─────────────────────────────────────────────────────────────
export async function sendLoginOTPEmail(to: string, name: string, otp: string) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">Your Login Code</h2>
      <p style="color:#475569;margin:0 0 28px;line-height:1.6;">Hi <strong>${name}</strong>, use the code below to sign in. It expires in <strong>5 minutes</strong>. Do not share this code with anyone.</p>
      <div style="background:#fef9c3;border:2px solid #eab308;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
        <p style="color:#78716c;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">One-Time Login Code</p>
        <h1 style="color:#92400e;font-size:48px;font-weight:900;margin:0;letter-spacing:12px;">${otp}</h1>
      </div>
      <p style="color:#ef4444;font-weight:600;margin:0 0 8px;">⚠️ Never share this code. PlacementCell staff will never ask for it.</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">If you did not request this, your account may be at risk. Please change your password.</p>`;

    const info = await t.sendMail({ from: FROM, to, subject: `${otp} — PlacementCell login code`, html: baseTemplate("Passwordless Login", body) });
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n-----------------------------------------`);
      console.log(`[DEV ONLY] Login OTP for ${to}: ${otp}`);
      console.log(`[EMAIL] Preview: ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`-----------------------------------------\n`);
    }
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send Login OTP to ${to}:`, err);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Send New Device Login Alert
// ─────────────────────────────────────────────────────────────
export interface DeviceAlertInfo {
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  time: string;
}

export async function sendDeviceLoginAlertEmail(to: string, name: string, device: DeviceAlertInfo) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">🔔 New Device Sign-In</h2>
      <p style="color:#475569;margin:0 0 24px;line-height:1.6;">Hi <strong>${name}</strong>, we detected a new sign-in to your PlacementCell account from a device we haven't seen before.</p>
      
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #fde68a;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Device</span><br>
            <strong style="color:#0f172a;">${device.deviceName}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #fde68a;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Browser</span><br>
            <strong style="color:#0f172a;">${device.browser}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #fde68a;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Operating System</span><br>
            <strong style="color:#0f172a;">${device.os}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #fde68a;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Location</span><br>
            <strong style="color:#0f172a;">${device.location}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #fde68a;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">IP Address</span><br>
            <strong style="color:#0f172a;">${device.ip}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;">
            <span style="color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Time</span><br>
            <strong style="color:#0f172a;">${device.time}</strong>
          </td></tr>
        </table>
      </div>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:16px;">
        <p style="color:#dc2626;font-weight:700;margin:0 0 4px;">⚠️ Wasn't you?</p>
        <p style="color:#7f1d1d;font-size:13px;margin:0;">Change your password immediately and revoke the session from your security settings.</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0;">If this was you, you can safely ignore this email.</p>`;

    await t.sendMail({ from: FROM, to, subject: "🔔 New device signed in to your PlacementCell account", html: baseTemplate("Security Alert — New Device", body) });
  } catch (err) {
    console.warn("[EMAIL] Failed to send device alert:", err);
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Send Login Notification Email (returning user)
// ─────────────────────────────────────────────────────────────
export async function sendLoginNotificationEmail(to: string, name: string, time: string, ip?: string) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">New Login Detected</h2>
      <p style="color:#475569;margin:0 0 24px;line-height:1.6;">Hi <strong>${name}</strong>, we noticed a new login to your PlacementCell account.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
        <tr><td style="padding:6px 0;"><span style="color:#64748b;font-size:12px;">Time:</span><br><strong style="color:#0f172a;">${time}</strong></td></tr>
        ${ip ? `<tr><td style="padding:6px 0;"><span style="color:#64748b;font-size:12px;">IP Address:</span><br><strong style="color:#0f172a;">${ip}</strong></td></tr>` : ""}
      </table>
      <p style="color:#ef4444;font-weight:700;margin:0 0 8px;">If this wasn't you, change your password immediately.</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">If this was you, you can safely ignore this email.</p>`;

    await t.sendMail({ from: FROM, to, subject: "New login to your PlacementCell account", html: baseTemplate("Security Alert", body) });
  } catch (err) {
    console.warn("[EMAIL] Failed to send login notification:", err);
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Send Password Reset Email
// ─────────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">Reset Your Password</h2>
      <p style="color:#475569;margin:0 0 28px;line-height:1.6;">Hi <strong>${name}</strong>, click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 32px;border-radius:10px;font-weight:800;font-size:15px;text-decoration:none;">Reset Password</a>
      </div>
      <p style="color:#64748b;font-size:13px;margin:0 0 8px;">Or copy this link:</p>
      <p style="color:#2563eb;font-size:12px;word-break:break-all;margin:0;">${resetUrl}</p>
      <p style="color:#ef4444;font-size:12px;margin-top:16px;font-weight:600;">⚠️ This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`;

    const info = await t.sendMail({ from: FROM, to, subject: "Reset your PlacementCell password", html: baseTemplate("Password Reset", body) });
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EMAIL] Reset link sent | Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send Password Reset to ${to}:`, err);
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Send Welcome Email
// ─────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string, role: string) {
  try {
    const t = await getTransporter();
    const body = `
      <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:800;">Welcome to PlacementCell! 🎓</h2>
      <p style="color:#475569;margin:0 0 24px;line-height:1.6;">Hi <strong>${name}</strong>, your account has been successfully created as a <strong style="color:#2563eb;">${role}</strong>.</p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#14532d;font-weight:700;margin:0 0 8px;">✅ What's next?</p>
        <ul style="color:#15803d;margin:0;padding-left:20px;line-height:2;">
          <li>Complete your profile to unlock all features</li>
          <li>Explore job opportunities and company listings</li>
          <li>Take aptitude and coding assessments</li>
          <li>Connect with recruiters and alumni</li>
        </ul>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0;">PlacementCell — Bridging talent with opportunity.</p>`;

    await t.sendMail({ from: FROM, to, subject: `Welcome to PlacementCell, ${name}! 🎓`, html: baseTemplate("Welcome", body) });
  } catch (err) {
    console.warn("[EMAIL] Failed to send welcome email:", err);
  }
}
