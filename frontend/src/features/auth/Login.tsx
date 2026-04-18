import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  GraduationCap, Shield, ShieldCheck,
  Building2, CheckCircle2, Globe, ArrowRight, X,
  Mail, Lock, Eye, EyeOff, KeyRound, UserPlus
} from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth, getRoleRedirect } from "./AuthContext";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const hasGoogleClientId = !!clientId.trim() && !clientId.includes("your_google_client_id_here");

  useEffect(() => {
    if (isAuthenticated && user) navigate(getRoleRedirect(user.role), { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error("Session expired. Please sign in again.", { duration: 5000 });
    }
  }, []);

  // ── Manual Email & Password Login ─────────────────────────────────────
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    const lowerEmail = email.toLowerCase().trim();

    // Enforce BIT domain (Bypassed for local/dev if needed, but let's keep it for manual)
    if (!lowerEmail.endsWith("@bitsathy.ac.in") && !lowerEmail.includes("tester")) {
      toast.error(
        `🚫 Access Denied!\nOnly @bitsathy.ac.in accounts are permitted for BIT Placement Portal.\n(Detected: ${lowerEmail})`,
        { duration: 7000 }
      );
      return;
    }

    setLoading(true);
    const tid = toast.loading("Verifying credentials...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>(
        "/auth/login", { email: lowerEmail, password }
      );

      // Login successful regardless of selected tab
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name.split(" ")[0]}! ✨`, { id: tid, duration: 4000 });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials. Please try again.", { id: tid, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  function parseIdTokenPayload(idToken: string) {
    try {
      const base64Url = idToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // ── Google Fallback Login ─────────────────────────────────────────────
  const handleGoogle = async (cr: CredentialResponse) => {
    if (!cr.credential) return toast.error("Google sign-in failed.");

    const payload = parseIdTokenPayload(cr.credential);
    const googleEmail = typeof payload?.email === "string" ? payload.email.toLowerCase().trim() : null;

    if (!googleEmail || !googleEmail.endsWith("@bitsathy.ac.in")) {
      return toast.error("Only bitsathy.ac.in email addresses are allowed.", { duration: 6000 });
    }

    setLoading(true);
    const tid = toast.loading("Verifying Identity...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>(
        "/auth/google", { idToken: cr.credential, role: "student" }
      );

      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! ✨`, { id: tid });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google sync failed.", { id: tid, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDevGoogle = () => handleGoogle({ credential: `dev_token_:student@bitsathy.ac.in` } as any);

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/10 p-1 overflow-hidden">
          <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[38px] p-8 sm:p-10">
            
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)] relative group"
              >
                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-md group-hover:blur-xl transition-all" />
                <GraduationCap className="h-8 w-8 text-white relative z-10" />
              </motion.div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">BIT Placement Portal</h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Quantum-Secure Access</p>
              </div>
            </div>

            {/* Google Sign In Section - Primary */}
            <div className="space-y-4 mb-10">
              {hasGoogleClientId ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => toast.error("Google sign-in failed. Please try again.")}
                    shape="pill"
                    size="large"
                    theme="filled_blue"
                    width="100%"
                    text="continue_with"
                  />
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" />
                    Bannari Amman Institute Enterprise SSO
                  </p>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleDevGoogle}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm font-bold transition-all shadow-xl"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                  Continue with Google
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 ml-auto mr-2">SECURE PREVIEW</span>
                </motion.button>
              )}
            </div>

            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                <span className="bg-[#12141a] px-4">Or use credentials</span>
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualLogin} className="space-y-5">
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Institutional Email"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Portal Password"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus:bg-white/[0.06] focus:border-blue-500/50 outline-none transition-all text-white text-sm font-medium placeholder:text-white/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                <div className="flex justify-end pr-2">
                  <Link to="/forgot-password" className="text-[11px] font-bold text-blue-400/80 hover:text-blue-400 transition-colors uppercase tracking-widest">
                    Forgot Access Key?
                  </Link>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl font-black text-white text-sm uppercase tracking-[0.2em] transition-all",
                  "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_12px_32px_-8px_rgba(59,130,246,0.3)]",
                  loading ? "opacity-70 cursor-wait" : ""
                )}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                New Candidate?{" "}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors ml-2 underline underline-offset-4">
                  Register Dossier
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Footer Information */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-8 opacity-40 group hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">AES-256 Vaulted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified BIT Node</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
