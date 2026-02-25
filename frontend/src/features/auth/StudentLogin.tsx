import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight,
    Briefcase, ShieldCheck, CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth, User } from "./AuthContext";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

// Check if Google Client ID is properly configured (not a placeholder)
const rawGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
const hasGoogleAuth =
    rawGoogleClientId.endsWith(".apps.googleusercontent.com") &&
    !rawGoogleClientId.toLowerCase().includes("your_google") &&
    rawGoogleClientId.length > 30;

/* ─── Animated Number Counter ───────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let cur = 0;
        const step = to / 50;
        const t = setInterval(() => {
            cur = Math.min(cur + step, to);
            setVal(Math.floor(cur));
            if (cur >= to) clearInterval(t);
        }, 25);
        return () => clearInterval(t);
    }, [to]);
    return <span>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Floating Particle ─────────────────────────────────────────── */
function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
    return (
        <motion.div
            className="absolute rounded-full bg-blue-400/20"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        />
    );
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 80 + 20,
    delay: i * 0.4, duration: 4 + Math.random() * 3
}));

export default function StudentLogin() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [focusField, setFocusField] = useState<"email" | "pass" | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    // Already logged in → redirect
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "student") navigate("/dashboard", { replace: true });
            else navigate("/", { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return toast.error("Please fill all fields.");
        setLoading(true);
        try {
            const { data } = await api.post<{ token: string; user: User; redirectTo?: string }>(
                "/auth/login", { email: email.toLowerCase().trim(), password });


            if (data.user?.role !== "student") {
                toast.error("Access denied. Use the correct portal for your role.");
                return;
            }
            login(data.token, data.user);
            toast.success(`Welcome back, ${data.user.name}! 🎓`);
            navigate(data.redirectTo || "/dashboard", { replace: true });
        } catch (err: any) {
            const d = err.response?.data;
            toast.error(d?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async (cr: CredentialResponse) => {
        if (!cr.credential) return;
        setGoogleLoading(true);
        try {
            const { data } = await api.post<{ token: string; user: User; redirectTo?: string }>(
                "/auth/google", { idToken: cr.credential, role: "student" });
            if (data.user?.role !== "student") {
                toast.error("Access denied. Use the correct portal for your role.");
                return;
            }
            login(data.token, data.user);
            toast.success(`Welcome, ${data.user.name}! 🎓`);
            navigate(data.redirectTo || "/dashboard", { replace: true });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Google sign-in failed.");
        } finally {
            setGoogleLoading(false);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="apple-card p-10">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-apple-blue rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-apple-blue/20 mb-6"
                        >
                            <GraduationCap className="h-8 w-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-2">Student Portal</h1>
                        <p className="text-apple-gray-400 font-medium text-center">Sign in to your PlaceIQ account</p>
                    </div>

                    {/* Google Login */}
                    {hasGoogleAuth ? (
                        <div className="mb-8">
                            <div className={`transition-all duration-200 rounded-xl overflow-hidden ${googleLoading ? "opacity-50 pointer-events-none" : ""}`}>
                                <GoogleLogin
                                    onSuccess={handleGoogle}
                                    onError={() => toast.error("Google sign-in failed.")}
                                    useOneTap={false}
                                    shape="circle"
                                    size="large"
                                    width="360"
                                    text="continue_with"
                                />
                            </div>
                        </div>
                    ) : (
                        <button disabled className="w-full flex items-center justify-center gap-3 py-3 border border-apple-gray-100 rounded-full mb-8 opacity-50 cursor-not-allowed">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-4 w-4" alt="G" />
                            <span className="text-sm font-medium text-apple-gray-900">Sign in with Google</span>
                        </button>
                    )}

                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-apple-gray-100"></div>
                        <span className="flex-shrink mx-4 text-xs font-semibold text-apple-gray-300 uppercase tracking-widest">or</span>
                        <div className="flex-grow border-t border-apple-gray-100"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-apple-gray-400 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="name@university.edu"
                                    className="apple-input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[13px] font-semibold text-apple-gray-400">Password</label>
                                <Link to="/forgot-password" title="Forgot password" id="forgot-password"
                                    className="text-[12px] font-medium text-apple-blue hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="apple-btn-primary w-full py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-apple-gray-400 text-sm">
                            New student?{" "}
                            <Link to="/register" className="text-apple-blue font-semibold hover:underline">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Role Switcher Links */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link to="/recruiter-portal" className="text-xs font-medium text-apple-gray-300 hover:text-apple-blue transition-colors flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        Recruiter Portal
                    </Link>
                    <Link to="/admin-portal" className="text-xs font-medium text-apple-gray-300 hover:text-apple-blue transition-colors flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin Access
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
