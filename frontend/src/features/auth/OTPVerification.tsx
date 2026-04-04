import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, RefreshCw, Mail, ArrowLeft, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { cn } from "../../utils/cn";

export default function OTPVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "your email";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(59);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < 6) {
            toast.error("Protocol requires fully 6-digit sequence.");
            return;
        }

        setLoading(true);
        const tid = toast.loading("Verifying digital handshake...");
        try {
            await api.post("/auth/verify-otp", { email, code });
            toast.success("Verification successful. Identity confirmed.", { id: tid });
            navigate("/onboarding");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Sequence mismatch or expired. Retry.", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (timer > 0) return;

        const tid = toast.loading("Requesting new sequence...");
        try {
            await api.post("/auth/resend-otp", { email });
            toast.success("New sequence dispatched to your address.", { id: tid });
            setTimer(59);
            setOtp(["", "", "", "", "", ""]);
            inputRefs[0].current?.focus();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Dispatch failed.", { id: tid });
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
                className="w-full max-w-[460px] z-10"
            >
                <div className="apple-card p-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-apple-gray-300 hover:text-apple-gray-900 transition-colors mb-10 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Retrace Step
                    </button>

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-apple-blue rounded-[20px] flex items-center justify-center shadow-lg shadow-apple-blue/15 mb-6">
                            <ShieldCheck className="h-8 w-8 text-slate-900" />
                        </div>
                        <h2 className="text-4xl font-black text-apple-gray-900 tracking-tighter mb-2">Protocol Zero</h2>
                        <p className="text-apple-blue font-black text-xs tracking-[0.3em] uppercase mb-4">Identity Verification v5.0</p>
                        <p className="text-apple-gray-400 font-bold text-sm px-4">
                            A 6-digit sequence has been dispatched to <span className="text-apple-gray-900 whitespace-nowrap">{email}</span>
                        </p>
                    </div>

                    <div className="space-y-10">
                        {/* OTP Input Fields */}
                        <div className="flex justify-between gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onFocus={() => setFocusedIndex(index)}
                                    onBlur={() => setFocusedIndex(null)}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={cn(
                                        "w-full h-16 text-center text-2xl font-black bg-apple-gray-50 border-2 border-transparent rounded-[18px] outline-none transition-all duration-300 text-apple-gray-900",
                                        focusedIndex === index ? "bg-white border-apple-blue shadow-apple-soft scale-105" : "hover:bg-apple-gray-100/50"
                                    )}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <div className="space-y-6">
                            <button
                                onClick={handleVerify}
                                disabled={loading || otp.some(d => !d)}
                                className="apple-btn-primary w-full py-4.5 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    <>
                                        <span>Confirm Sequence</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col items-center gap-2">
                                <p className="text-apple-gray-300 text-sm font-bold uppercase tracking-widest">Awaiting dispatch?</p>
                                <button
                                    onClick={resendOTP}
                                    disabled={timer > 0}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all",
                                        timer > 0 ? "text-apple-gray-200" : "text-apple-blue hover:underline"
                                    )}
                                >
                                    {timer > 0 ? (
                                        <>Redispatch in {timer}s</>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Redeliver Sequence
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-apple-gray-50 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-apple-gray-50 rounded-full border border-apple-gray-100">
                            <Shield className="h-4 w-4 text-apple-blue" />
                            <span className="text-base font-black text-apple-gray-400 uppercase tracking-[0.2em]">Encrypted Channel Verified</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
