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

  // Captcha State
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const strength = getStrength(password);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const hasGoogleClientId = !!clientId.trim() && !clientId.includes("your_google_client_id_here");

  const handleRegister = async () => {
    if (!name.trim()) { toast.error("Please provide your legal name."); return; }
    if (!email.includes("@")) { toast.error("Invalid digital address."); return; }

    // ── BIT domain Restriction ──────────────────────────────────
    if (!email.toLowerCase().endsWith("@bitsathy.ac.in")) {
      toast.error("🚫 Only @bitsathy.ac.in email addresses are allowed for BIT Placement Portal.", { duration: 6000 });
      return;
    }
    // ────────────────────────────────────────────────────────────

    if (password.length < 8) { toast.error("Security key too short."); return; }
    if (password !== confirmPassword) { toast.error("Protocols do not match."); return; }
    if (!captchaToken) { toast.error("Please verify that you are human."); return; }

    setLoading(true);
    const tid = toast.loading("Establishing new dossier...");
    try {
      const { data } = await api.post<{ message: string; email?: string }>("/auth/register", { name, email, password, role, captchaToken });
      toast.success(data.message || "Dossier established. You can now login.", { id: tid });
      navigate(role === "student" ? "/login" : "/recruiter-portal");
    } catch (err: any) {
      const errorData = err?.response?.data;
      const msg = errorData?.errors?.[0] || errorData?.message || "Registration failed.";
      toast.error(msg, { id: tid });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) { toast.error("Google handshake failed."); return; }

    // ── BIT domain Check (client-side fast-fail) ──────────────────
    try {
      const tokenPayload = JSON.parse(atob(idToken.split(".")[1]));
      const tokenEmail: string = tokenPayload.email || "";
      if (!tokenEmail.toLowerCase().endsWith("@bitsathy.ac.in")) {
        toast.error(`🚫 Access Denied. Only @bitsathy.ac.in accounts allowed.\n(Detected: ${tokenEmail})`, { duration: 6000 });
        return;
      }
    } catch { /* let server validate */ }
    // ─────────────────────────────────────────────────────────────

    setLoading(true);
    const tid = toast.loading("Syncing with BIT Google account...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>("/auth/google", { idToken, role });
      login(data.token, data.user);
      toast.success("BIT Identity established! ✨", { id: tid });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google sync failed.", { id: tid, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] z-10 my-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/10 p-1 overflow-hidden">
          <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[38px] p-8 sm:p-10">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] mb-6"
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Establish Dossier</h1>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Bannari Amman Institute Node</p>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex bg-white/[0.03] p-1.5 rounded-[22px] mb-10 border border-white/5">
              {(["student", "recruiter"] as const).map(r => (
                <button 
                  key={r} 
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                    role === r 
                      ? "bg-white/10 shadow-xl text-white border border-white/10" 
                      : "text-white/30 hover:text-white/50"
                  )}
                >
                  {r === "student" ? <UserCheck className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />}
                  <span>{r === "student" ? "Student" : "Mentor"}</span>
                </button>
              ))}
            </div>

            {/* Google Registration Section */}
            {hasGoogleClientId && (
              <div className="space-y-4 mb-10">
                <div className="w-full flex flex-col items-center gap-3">
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess} 
                    onError={() => toast.error("Handshake failed.")}
                    shape="pill" 
                    size="large" 
                    theme="filled_blue"
                    width="100%"
                    text="signup_with" 
                  />
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Identity Verification Required
                  </p>
                </div>

                <div className="relative pt-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <span className="bg-[#12141a] px-4">Or manual entry</span>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="relative group">
                    <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors", focused === "name" ? "text-blue-400" : "text-white/20")} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                      placeholder="Full Name" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors", focused === "email" ? "text-blue-400" : "text-white/20")} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      placeholder="BIT Email" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors", focused === "pw" ? "text-blue-400" : "text-white/20")} />
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => { setFocused("pw"); setShowRequirements(true); }} onBlur={() => setFocused(null)}
                    placeholder="Create Password" className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20 font-mono" required />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 border-none bg-transparent">
                    {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {password && (
                  <div className="mt-3 space-y-2 px-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-700 ${i <= strength.score ? strength.color : "bg-white/5"}`} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={cn("text-[9px] font-black uppercase tracking-widest", strength.score <= 1 ? "text-rose-500" : strength.score <= 3 ? "text-amber-500" : "text-emerald-500")}>
                        Vault Security: {strength.label}
                      </p>
                      <button onClick={() => setShowRequirements(!showRequirements)} className="text-[9px] font-bold text-blue-400 uppercase tracking-widest hover:underline bg-transparent border-none">
                        {showRequirements ? "Hide Protocols" : "Show Protocols"}
                      </button>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showRequirements && password && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                      className="mt-4 p-5 bg-white/[0.02] rounded-[24px] border border-white/5 space-y-3">
                      {REQUIREMENTS.map(r => (
                        <div key={r.label} className={cn("flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest", r.test(password) ? "text-emerald-400" : "text-white/20")}>
                          {r.test(password) ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-white/10" />}
                          <span>{r.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <ShieldCheck className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors", confirmPassword && password === confirmPassword ? "text-emerald-400" : "text-white/20")} />
                  <input type={showCpw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" className={cn("w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20 font-mono", confirmPassword && password !== confirmPassword ? "border-rose-500/50" : "")} required />
                </div>
              </div>

              <div className="flex justify-center mt-6 scale-90 sm:scale-100 origin-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(token) => setCaptchaToken(token)}
                  theme="dark"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }}
                onClick={handleRegister} 
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl font-black text-white text-sm uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_12px_32px_-8px_rgba(59,130,246,0.3)] mt-4"
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Initialize Dossier</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                Already have a dossier?
                <button onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none p-0 ml-1 font-black">Verify Identity →</button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
  );
}
