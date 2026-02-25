import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight,
    GraduationCap, Briefcase, AlertCircle, Activity, Zap
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Scanning line animation ──────────────────────────────────── */
function ScanLine() {
    return (
        <motion.div
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent pointer-events-none z-20"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
    );
}

/* ─── Blinking cursor ───────────────────────────────────────────── */
function Cursor() {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setVisible(v => !v), 500);
        return () => clearInterval(t);
    }, []);
    return <span className={`inline-block w-2 h-4 bg-blue-500 ml-0.5 ${visible ? "opacity-100" : "opacity-0"}`} />;
}

/* ─── Log entry ─────────────────────────────────────────────────── */
function LogEntry({ text, type = "info", delay }: { text: string; type?: "ok" | "info" | "warn"; delay: number }) {
    const colors = { ok: "text-emerald-400", info: "text-blue-400", warn: "text-amber-400" };
    const tags = { ok: "[OK]", info: "[INFO]", warn: "[WARN]" };
    return (
        <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="text-[10px] font-mono flex items-center gap-2"
        >
            <span className={`${colors[type]} font-bold shrink-0`}>{tags[type]}</span>
            <span className="text-slate-500">{text}</span>
        </motion.p>
    );
}

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusField, setFocusField] = useState<"email" | "pass" | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "admin" || user.role === "officer") navigate("/admin/dashboard", { replace: true });
            else navigate("/", { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            toast.error("Authentication credentials required.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post<{ token: string; user: any; redirectTo?: string; requiresVerification?: boolean; email?: string; message?: string }>("/auth/login", {
                email: email.toLowerCase().trim(),
                password,
            });


            if (data.user.role !== "admin" && data.user.role !== "officer") {
                toast.error("⛔ Unauthorized access detected. This incident has been logged.");
                return;
            }

            login(data.token, data.user);
            toast.success("✅ Command Center access granted.");
            navigate("/admin/dashboard", { replace: true });
        } catch (err: any) {
            const d = err?.response?.data;
            toast.error(d?.message || "Authentication failed. Access denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            {/* Background elements for depth */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-apple-blue/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-apple-blue/5 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="apple-card p-10">
                    {/* Security Header */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-apple-gray-900 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-apple-gray-900/10 mb-6"
                        >
                            <ShieldAlert className="h-8 w-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-apple-gray-900 tracking-tight mb-2 uppercase">Root Access</h1>
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-apple-blue animate-pulse" />
                            <p className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest">Command Center Authorization</p>
                        </div>
                    </div>

                    {/* Admin Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-apple-gray-400 ml-1">Admin Identifier</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@system.internal"
                                    className="apple-input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-apple-gray-400 ml-1">Passkey Protocol</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="apple-input pl-11 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-300 hover:text-apple-gray-900 transition-colors"
                                >
                                    {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Security Warning */}
                        <div className="flex items-start gap-3 p-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl">
                            <AlertCircle className="h-4 w-4 text-apple-gray-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-apple-gray-400 italic leading-relaxed">
                                Unauthorized access attempts are traced, logged, and reported to the system security team automatically.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="apple-btn-primary w-full py-4 text-[14px] font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Activity className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    <span>Initiate Session</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 pt-8 border-t border-apple-gray-100 text-center">
                        <p className="text-[11px] text-apple-gray-300 uppercase tracking-[0.2em] font-bold mb-6">Provisioning</p>
                        <Link to="/admin-portal/register" className="text-apple-blue font-semibold hover:underline text-sm">
                            Request Admin Credentials →
                        </Link>
                    </div>
                </div>

                {/* Role Switcher Links */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link to="/login" className="text-xs font-medium text-apple-gray-300 hover:text-apple-blue transition-colors flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Student
                    </Link>
                    <Link to="/recruiter-portal" className="text-xs font-medium text-apple-gray-300 hover:text-apple-blue transition-colors flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        Recruiter
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
