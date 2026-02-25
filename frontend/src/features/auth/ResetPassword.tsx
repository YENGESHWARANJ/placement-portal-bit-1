import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, GraduationCap, CheckCircle2, Eye, EyeOff, X, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const passwordChecks = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const passChecks = passwordChecks.map((c) => ({ ...c, passed: c.test(newPassword) }));
    const allPassed = passChecks.every((c) => c.passed);

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!allPassed) {
            toast.error("Password does not meet security requirements");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/reset-password", { token, newPassword });
            setDone(true);
            toast.success("Password reset successfully!");
        } catch (err: any) {
            const message = err?.response?.data?.message || "Reset failed. The link may have expired.";
            toast.error(message);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="apple-card p-10">
                    {done ? (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-apple-gray-900 tracking-tight mb-4">Password Updated!</h2>
                            <p className="text-apple-gray-400 font-medium mb-10 leading-relaxed">
                                Your account security has been updated. You can now use your new password to sign in to your account.
                            </p>
                            <button
                                onClick={() => navigate("/login")}
                                className="apple-btn-primary w-full py-4 text-[15px] font-semibold flex items-center justify-center gap-2"
                            >
                                <span>Go to Sign In</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="w-16 h-16 bg-apple-blue rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-apple-blue/20 mb-6">
                                    <ShieldCheck className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-3">Set New Password</h2>
                                <p className="text-apple-gray-400 font-medium">
                                    Create a strong, unique password for your account.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-apple-gray-400 ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                        <input
                                            id="reset-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            type={showNew ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="apple-input pl-11 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-300 hover:text-apple-gray-900 transition-colors"
                                        >
                                            {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {newPassword.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 p-4 bg-apple-gray-50 rounded-2xl border border-apple-gray-100 space-y-2"
                                            >
                                                {passChecks.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 text-[12px]">
                                                        {c.passed
                                                            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                                            : <X className="h-3.5 w-3.5 text-apple-gray-300 flex-shrink-0" />}
                                                        <span className={c.passed ? "text-emerald-700 font-medium" : "text-apple-gray-400 font-medium"}>{c.label}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-apple-gray-400 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-apple-gray-300 pointer-events-none" />
                                        <input
                                            id="reset-confirm-password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`apple-input pl-11 pr-12 ${confirmPassword && newPassword !== confirmPassword ? "border-rose-200 focus:border-rose-500" : ""}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-300 hover:text-apple-gray-900 transition-colors"
                                        >
                                            {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="mt-1 ml-1 text-[11px] font-medium text-rose-500">Passwords do not match</p>
                                    )}
                                </div>

                                <button
                                    id="reset-submit"
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="apple-btn-primary w-full py-4 text-[15px] font-semibold flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>
                                            <span>Reset Password</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
