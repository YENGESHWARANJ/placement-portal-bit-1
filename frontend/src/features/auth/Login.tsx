import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight,
  UserCheck, Briefcase, ShieldCheck, Sparkles, CheckCircle2,
  ChevronRight, TrendingUp, Users, Zap, Bot, Shield,
  ChevronLeft, LayoutDashboard, Monitor, Key
} from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth, getRoleRedirect } from "./AuthContext";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

/* ── Mini animated counter ─────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = to / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setVal(Math.floor(cur));
      if (cur >= to) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

const stagger = {
  container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } } }
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    navigate(getRoleRedirect(user.role), { replace: true });
    return null;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"select" | "login">("select");
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const [focused, setFocused] = useState<string | null>(null);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Captcha State
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const hasGoogleClientId = !!clientId.trim() && !clientId.includes("your_google_client_id_here");

  const themeMap = {
    student: {
      primary: "bg-apple-blue",
      text: "text-apple-blue",
      border: "border-apple-blue/20",
      accent: "text-apple-blue",
      glow: "shadow-apple-blue/20",
      icon: GraduationCap,
      label: "Student Portal",
      subLabel: "Intelligence Nexus"
    },
    recruiter: {
      primary: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-500/20",
      accent: "text-amber-600",
      glow: "shadow-amber-500/20",
      icon: Briefcase,
      label: "Recruiter Hub",
      subLabel: "Partner Network"
    },
    admin: {
      primary: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      accent: "text-emerald-600",
      glow: "shadow-emerald-500/20",
      icon: ShieldCheck,
      label: "Control Matrix",
      subLabel: "System Root"
    }
  };

  const currentTheme = themeMap[role];

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    if (!captchaToken && role !== "admin") { toast.error("Please verify that you are human."); return; }

    setLoading(true);
    const tid = toast.loading("Accessing encrypted vault...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string }>(
        "/auth/login", { email, password, captchaToken }
      );

      login(data.token, data.user);
      toast.success("Identity verified. Welcome.", { id: tid });
      navigate(data.redirectTo || getRoleRedirect(data.user.role), { replace: true });
    } catch (err: any) {
      const d = err?.response?.data;
      if (d?.requiresVerification) {
        toast.dismiss(tid);
        setShowOTP(true);
        return;
      }
      const msg = d?.errors ? d.errors[0] : d?.message || "Authentication failed.";
      toast.error(msg, { id: tid });
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { toast.error("Security code must be 6 digits."); return; }
    setVerifying(true);
    const tid = toast.loading("Verifying identity code...");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Identity verified! You can now authenticate.", { id: tid });
      setShowOTP(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed.", { id: tid });
    } finally {
      setVerifying(false);
    }
  };

  const handleGoogle = async (cr: CredentialResponse) => {
    if (!cr.credential) { toast.error("Google sign-in failed."); return; }
    setLoading(true);
    const tid = toast.loading("Verifying Google token...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>(
        "/auth/google", { idToken: cr.credential, role }
      );
      login(data.token, data.user);
      toast.success("Verified! ✨", { id: tid });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed.", { id: tid });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* ── LEFT CONCEPTUAL SIDE (Apple Style) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-white border-r border-apple-gray-50">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-apple-blue/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-50/30 blur-[130px]" />
          <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-blue-50/20 blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col h-full w-full px-16 py-12">
          {/* Brand Identity */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="flex items-center gap-3.5 mb-24">
            <div className="h-11 w-11 bg-apple-blue rounded-[14px] flex items-center justify-center shadow-lg shadow-apple-blue/15">
              <GraduationCap className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <p className="text-apple-gray-900 font-black text-xl tracking-tight leading-none uppercase">PlacementCell</p>
              <p className="text-apple-blue font-black text-[9px] tracking-[0.3em] uppercase mt-1">Intelligence Nexus</p>
            </div>
          </motion.div>

          {/* Core Messaging */}
          <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex-1">
            <motion.div variants={stagger.item}>
              <span className="text-apple-blue font-black text-[11px] tracking-[0.4em] uppercase mb-4 block">Version 5.0 — Evolution</span>
              <h1 className="text-5xl font-black text-apple-gray-900 leading-[1.05] tracking-tighter mb-8">
                Orchestrate Your <br />
                <span className="text-apple-blue underline decoration-apple-blue/10 underline-offset-[10px]">Future Trajectory.</span>
              </h1>
              <p className="text-apple-gray-400 text-lg font-bold leading-relaxed max-w-[420px] mb-12 uppercase tracking-widest text-[11px]">
                Redefining the hiring ecosystem with neural matching and professional architectural clarity.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="space-y-6 max-w-[400px]">
              {[
                { icon: Zap, label: "NEURAL MATCHING", desc: "AI-driven job alignment with 97% resonance.", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Shield, label: "SECURE IDENTITY", desc: "Enterprise-grade vault for personal data.", color: "text-apple-blue", bg: "bg-blue-50" },
                { icon: TrendingUp, label: "MARKET INTEL", desc: "Live analytics on hiring trends and readiness.", color: "text-emerald-500", bg: "bg-emerald-50" }
              ].map((f, i) => (
                <motion.div key={i} variants={stagger.item}
                  className="flex items-start gap-5 p-5 bg-white border border-apple-gray-50 rounded-[28px] shadow-sm hover:shadow-apple-md hover:-translate-y-1 transition-all duration-500 group">
                  <div className={cn("h-12 w-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", f.bg)}>
                    <f.icon className={cn("h-5 w-5", f.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-apple-gray-300 uppercase mb-1">{f.label}</p>
                    <p className="text-apple-gray-900 font-bold text-[14px] tracking-tight">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Proof Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex items-center gap-10 pt-10 border-t border-apple-gray-50">
            <div>
              <p className="text-2xl font-black text-apple-gray-900"><Counter to={12000} suffix="+" /></p>
              <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest mt-1">Dossiers Online</p>
            </div>
            <div>
              <p className="text-2xl font-black text-apple-gray-900"><Counter to={95} suffix="%" /></p>
              <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest mt-1">Success Rate</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT AUTH PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Mobile Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden lg:hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-apple-blue/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[480px] z-10"
        >
          <AnimatePresence mode="wait">
            {view === "select" ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-apple-gray-900 tracking-tighter mb-3 uppercase italic">Select Portal.</h2>
                  <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[11px]">Choose Your Interface Destination</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {[
                    { id: "student", icon: GraduationCap, label: "Student", desc: "Access your dashboard, jobs, and AI tools.", color: "bg-apple-blue", text: "text-apple-blue" },
                    { id: "recruiter", icon: Briefcase, label: "Recruiter", desc: "Manage hiring pipelines and talent nodes.", color: "bg-amber-500", text: "text-amber-600" },
                    { id: "admin", icon: ShieldCheck, label: "Terminal Admin", desc: "Root access for system-wide orchestration.", color: "bg-emerald-500", text: "text-emerald-600" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setRole(p.id as any); setView("login"); }}
                      className="group relative p-8 bg-white border border-apple-gray-50 rounded-[35px] text-left hover:border-apple-gray-200 hover:shadow-apple-md transition-all duration-500 overflow-hidden"
                    >
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity", p.color)} />
                      <div className="relative z-10 flex items-center gap-6">
                        <div className={cn("h-16 w-16 rounded-[22px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500", p.color + "/10")}>
                          <p.icon className={cn("h-7 w-7", p.text)} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-300 mb-1">Authorization Node</p>
                          <p className="text-2xl font-black text-apple-gray-900 tracking-tight italic uppercase">{p.label}</p>
                          <p className="text-apple-gray-400 text-[11px] font-bold mt-1 uppercase tracking-wider opacity-60">{p.desc}</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-apple-gray-100 group-hover:text-apple-gray-300 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : showOTP ? (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="apple-card p-12 relative overflow-hidden space-y-6"
              >
                <button onClick={() => setShowOTP(false)} className="absolute top-8 left-8 p-3 rounded-2xl bg-apple-gray-50 text-apple-gray-400 hover:text-apple-gray-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-apple-gray-100">
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
                <div className="text-center space-y-2 mb-8 mt-6">
                  <div className="mx-auto w-12 h-12 bg-apple-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Key className="h-6 w-6 text-apple-blue" />
                  </div>
                  <h2 className="text-xl font-black text-apple-gray-900 tracking-tight">Verify Identity</h2>
                  <p className="text-xs text-apple-gray-400 font-medium">
                    Your account requires email verification. Check your email for a 6-digit code.
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
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="apple-card p-12 relative overflow-hidden"
              >
                {/* Back Button */}
                <button
                  onClick={() => setView("select")}
                  className="absolute top-8 left-8 p-3 rounded-2xl bg-apple-gray-50 text-apple-gray-400 hover:text-apple-gray-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-apple-gray-100"
                >
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>

                {/* Header */}
                <div className="mb-10 text-center pt-8">
                  <div className={cn("h-16 w-16 mx-auto rounded-[22px] flex items-center justify-center mb-6 shadow-lg", currentTheme.primary + "/10")}>
                    <currentTheme.icon className={cn("h-7 w-7", currentTheme.text)} />
                  </div>
                  <h2 className="text-4xl font-black text-apple-gray-900 tracking-tighter mb-2 italic uppercase">{currentTheme.label}</h2>
                  <p className={cn("font-black uppercase tracking-[0.4em] text-[10px]", currentTheme.text)}>
                    {currentTheme.subLabel}
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em] ml-1">Identity Cluster</label>
                    <div className="relative">
                      <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "email" ? currentTheme.text : "text-apple-gray-200")} />
                      <input
                        id="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                        placeholder="you@university.edu"
                        className={cn("apple-input pl-12", focused === "email" && currentTheme.border)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.2em]">Access Protocol</label>
                      <Link to="/forgot-password" title="Recover Access" className={cn("text-[10px] font-black uppercase tracking-widest hover:underline", currentTheme.text)}>Lost Access?</Link>
                    </div>
                    <div className="relative">
                      <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300", focused === "pw" ? currentTheme.text : "text-apple-gray-200")} />
                      <input
                        id="password-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused("pw")} onBlur={() => setFocused(null)}
                        placeholder="••••••••••"
                        className={cn("apple-input pl-12 pr-12 font-mono tracking-widest", focused === "pw" && currentTheme.border)} />
                      <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-200 hover:text-apple-gray-400 transition-colors p-1">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {role !== "admin" && (
                    <div className="flex justify-center mt-2">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                        onChange={(token) => setCaptchaToken(token)}
                        theme="light"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    id="login-submit" onClick={handleLogin} disabled={loading}
                    className={cn(
                      "w-full py-4.5 text-[15px] font-black uppercase tracking-widest mt-4 group rounded-[25px] flex items-center justify-center gap-3 transition-all duration-500 shadow-xl text-white",
                      currentTheme.primary,
                      loading ? "opacity-70 scale-[0.98]" : "hover:scale-[1.02] active:scale-[0.98] " + currentTheme.glow
                    )}>
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>Initiate Authorization</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {role !== "admin" && (
                  <>
                    <div className="flex items-center gap-5 my-10">
                      <div className="flex-1 h-px bg-apple-gray-50" />
                      <span className="text-[10px] font-black text-apple-gray-200 uppercase tracking-[0.3em]">Alternate Channel</span>
                      <div className="flex-1 h-px bg-apple-gray-50" />
                    </div>

                    <div className="flex justify-center mb-10">
                      <GoogleLogin onSuccess={handleGoogle} onError={() => toast.error("Digital handshake failed.")}
                        shape="pill" size="large" width="324" text="signin_with" />
                    </div>
                  </>
                )}

                {/* Security Footnote */}
                <div className="flex items-start gap-4 p-5 bg-apple-gray-50 rounded-[28px] border border-apple-gray-100">
                  <ShieldCheck className={cn("h-5 w-5 shrink-0 mt-0.5", currentTheme.text)} />
                  <p className="text-[11px] text-apple-gray-400 leading-relaxed font-bold uppercase tracking-tight">
                    Identity verified by <span className="text-apple-gray-900">PlacementCell-RSA</span>. Sessions are encrypted and audited for security compliance.
                  </p>
                </div>

                {/* Registration Redirect */}
                {role === "student" && (
                  <div className="mt-10 pt-8 border-t border-apple-gray-50 text-center">
                    <p className="text-[12px] font-bold text-apple-gray-400 uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-2">
                      New Prospect?
                      <Link to="/register" className="text-apple-blue hover:underline">Establish Dossier →</Link>
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
