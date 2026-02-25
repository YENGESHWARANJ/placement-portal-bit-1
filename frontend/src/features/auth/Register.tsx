import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  GraduationCap, ArrowRight, Lock, Mail, User,
  UserCheck, Briefcase, Eye, EyeOff, CheckCircle2, XCircle,
  ShieldCheck, Sparkles, Shield, Key
} from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth, getRoleRedirect } from "./AuthContext";
import api from "../../services/api";
import { cn } from "../../utils/cn";

// ── Password Strength ─────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score <= 1
    ? { score, label: "Weak", color: "bg-rose-500" }
    : score <= 3
      ? { score, label: "Fair", color: "bg-amber-400" }
      : score <= 4
        ? { score, label: "Good", color: "bg-emerald-400" }
        : { score, label: "Strong", color: "bg-emerald-500" };
}

const REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character (!@#...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    navigate(getRoleRedirect(user.role), { replace: true });
    return null;
  }

  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  // OTP State
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Captcha State
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const strength = getStrength(password);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const hasGoogleClientId = !!clientId.trim() && !clientId.includes("your_google_client_id_here");

  const handleRegister = async () => {
    if (!name.trim()) { toast.error("Please provide your legal name."); return; }
    if (!email.includes("@")) { toast.error("Invalid digital address."); return; }
    if (password.length < 8) { toast.error("Security key too short."); return; }
    if (password !== confirmPassword) { toast.error("Protocols do not match."); return; }
    if (!captchaToken) { toast.error("Please verify that you are human."); return; }

    setLoading(true);
    const tid = toast.loading("Establishing new dossier...");
    try {
      const { data } = await api.post<{ message: string; email?: string }>("/auth/register", { name, email, password, role, captchaToken });
      toast.success(data.message || "Dossier established. Please verify email.", { id: tid });
      setShowOTP(true);
    } catch (err: any) {
      const errorData = err?.response?.data;
      const msg = errorData?.errors?.[0] || errorData?.message || "Registration failed.";
      toast.error(msg, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { toast.error("Security code must be 6 digits."); return; }
    setVerifying(true);
    const tid = toast.loading("Verifying identity code...");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Identity verified! Welcome to the nexus.", { id: tid });
      setShowOTP(false);
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed.", { id: tid });
    } finally {
      setVerifying(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) { toast.error("Google handshake failed."); return; }
    setLoading(true);
    const tid = toast.loading("Syncing with Google...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>("/auth/google", { idToken, role });
      login(data.token, data.user);
      toast.success("Identity established! ✨", { id: tid });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google sync failed.", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative">
      {/* Background elements for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-apple-blue/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-apple-blue/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="apple-card p-12">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-10">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="w-14 h-14 bg-apple-blue rounded-[18px] flex items-center justify-center shadow-lg shadow-apple-blue/15 mb-6">
              <GraduationCap className="h-7 w-7 text-white" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-black text-apple-gray-900 tracking-tighter mb-2">Establish Identity</h1>
              <p className="text-apple-blue font-black text-[9px] tracking-[0.3em] uppercase">Intelligence Nexus v5.0</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex bg-apple-gray-50 p-1.5 rounded-[22px] mb-10">
            {(["student", "recruiter"] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-[18px] text-[12px] font-black uppercase tracking-widest transition-all duration-500",
                  role === r ? "bg-white shadow-apple-soft text-apple-blue" : "text-apple-gray-300 hover:text-apple-gray-400"
                )}>
                {r === "student" ? <UserCheck className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />}
                <span>{r}</span>
              </button>
            ))}
          </div>

          {!showOTP ? (
            <>
              {/* Registration Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative">
                    <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "name" ? "text-apple-blue" : "text-apple-gray-200")} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                      placeholder="Yengeshwaran J" className="apple-input pl-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Digital Address</label>
                  <div className="relative">
                    <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "email" ? "text-apple-blue" : "text-apple-gray-200")} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      placeholder={role === "student" ? "student@uni.edu" : "hr@corp.com"} className="apple-input pl-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Vault Key</label>
                  <div className="relative">
                    <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "pw" ? "text-apple-blue" : "text-apple-gray-200")} />
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => { setFocused("pw"); setShowRequirements(true); }} onBlur={() => setFocused(null)}
                      placeholder="••••••••" className="apple-input pl-12 pr-12 font-mono" required />
                    <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-200 hover:text-apple-gray-400">
                      {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {password && (
                    <div className="mt-4 space-y-2 px-1">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-700 ${i <= strength.score ? strength.color : "bg-apple-gray-50"}`} />
                        ))}
                      </div>
                      <p className={cn("text-[10px] font-black uppercase tracking-widest", strength.score <= 1 ? "text-rose-500" : strength.score <= 3 ? "text-amber-500" : "text-emerald-500")}>
                        Security Index: {strength.label}
                      </p>
                    </div>
                  )}

                  {/* Requirements */}
                  <AnimatePresence>
                    {showRequirements && password && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-5 bg-apple-gray-50 rounded-[24px] border border-apple-gray-100 space-y-3">
                        {REQUIREMENTS.map(r => (
                          <div key={r.label} className={cn("flex items-center gap-3 text-[11px] font-bold", r.test(password) ? "text-emerald-600" : "text-apple-gray-300")}>
                            {r.test(password) ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <span className="uppercase tracking-wide">{r.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Confirm Identity Key</label>
                  <div className="relative">
                    <Shield className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", confirmPassword && password === confirmPassword ? "text-emerald-500" : "text-apple-gray-200")} />
                    <input type={showCpw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" className={cn("apple-input pl-12 pr-12 font-mono", confirmPassword && password !== confirmPassword ? "border-rose-200" : "")} required />
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={(token) => setCaptchaToken(token)}
                    theme="light"
                  />
                </div>

                <button id="register-submit" onClick={handleRegister} disabled={loading}
                  className="apple-btn-primary w-full py-4.5 text-[15px] font-black uppercase tracking-widest mt-6 group">
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Establish Dossier</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>

              {/* Alternate Entry */}
              {hasGoogleClientId && (
                <>
                  <div className="flex items-center gap-5 my-10">
                    <div className="flex-1 h-px bg-apple-gray-50" />
                    <span className="text-[10px] font-black text-apple-gray-200 uppercase tracking-[0.3em]">Alternate</span>
                    <div className="flex-1 h-px bg-apple-gray-50" />
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Handshake failed.")}
                      shape="pill" size="large" width="384" text="signup_with" />
                  </div>
                </>
              )}

              {/* Login Redirect */}
              <div className="mt-10 pt-8 border-t border-apple-gray-50 text-center">
                <p className="text-[12px] font-bold text-apple-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  Registered Identity?
                  <button onClick={() => navigate("/login")} className="text-apple-blue hover:underline">Verify Identity →</button>
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-2 mb-8">
                <div className="mx-auto w-12 h-12 bg-apple-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Key className="h-6 w-6 text-apple-blue" />
                </div>
                <h2 className="text-xl font-black text-apple-gray-900 tracking-tight">Verify Identity</h2>
                <p className="text-xs text-apple-gray-400 font-medium">
                  A 6-digit transmission has been sent to <br />
                  <span className="text-sm font-bold text-apple-blue">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Security Code</label>
                <div className="relative">
                  <ShieldCheck className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "otp" ? "text-apple-blue" : "text-apple-gray-200")} />
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} onFocus={() => setFocused("otp")} onBlur={() => setFocused(null)}
                    placeholder="• • • • • •" className="apple-input pl-12 font-mono tracking-widest text-center text-lg" required />
                </div>
              </div>

              <button onClick={handleVerifyOTP} disabled={verifying || otp.length !== 6}
                className="apple-btn-primary w-full py-4.5 text-[15px] font-black uppercase tracking-widest mt-6 group">
                {verifying ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>Confirm Code</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
