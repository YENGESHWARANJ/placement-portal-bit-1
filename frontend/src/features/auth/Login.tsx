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

  // ── Google Fallback Login ─────────────────────────────────────────────
  const handleGoogle = async (cr: CredentialResponse) => {
    if (!cr.credential) return toast.error("Google sign-in failed.");

    // Domain check for Dev tokens (Bypassed)
    if (cr.credential.startsWith("dev_token_:")) {
      // Any email allowed for dev bypass
    }

    setLoading(true);
    const tid = toast.loading("Verifying Google account...");
    try {
      const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresOnboarding?: boolean }>(
        "/auth/google", { idToken: cr.credential, role: "student" }
      );

      login(data.token, data.user);
      toast.success("Identity established! ✨", { id: tid });
      navigate(data.requiresOnboarding ? "/onboarding" : (data.redirectTo || getRoleRedirect(data.user.role)), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google sync failed.", { id: tid, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDevGoogle = () => handleGoogle({ credential: `dev_token_:student@bitsathy.ac.in` } as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-400/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-300/5 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl shadow-blue-900/10 border border-white/80 overflow-hidden">

          {/* Header */}
          <div className="px-10 pt-9 pb-6 text-center border-b border-slate-100">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 200 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30"
            >
              <GraduationCap className="h-7 w-7 text-slate-900" />
            </motion.div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">BIT Placement Portal</h1>
            <p className="text-xs font-semibold text-blue-600 mt-1.5 tracking-wide uppercase">Bannari Amman Institute of Technology</p>
          </div>

          <div className="px-8 py-7">

            {/* Manual Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                  Corporate Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@bitsathy.ac.in"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:shadow-md focus:shadow-blue-100 outline-none transition-all text-sm font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot-password" tabIndex={-1} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:shadow-md focus:shadow-blue-100 outline-none transition-all text-sm font-medium text-slate-700 font-mono"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-slate-900 text-sm uppercase tracking-widest shadow-lg mt-2 transition-all",
                  "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25 border border-slate-200",
                  loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl hover:shadow-blue-500/40"
                )}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-6 opacity-60">
              <div className="flex-1 h-px bg-slate-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">or optionally</p>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            {hasGoogleClientId ? (
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogle}
                  onError={() => toast.error("Google sign-in failed. Please try again.")}
                  shape="pill"
                  size="large"
                  theme="outline"
                  width="380"
                  text="continue_with"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDevGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-4 w-4" alt="Google" />
                Continue with Google (Dev)
              </button>
            )}

          </div>

          {/* Footer */}
          <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100">
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: Shield, label: "Encrypted" },
                { icon: Globe, label: "BIT domain" },
                { icon: CheckCircle2, label: "Zero-Trust" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 opacity-60">
                  <Icon className="h-3.5 w-3.5 text-slate-600" />
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
