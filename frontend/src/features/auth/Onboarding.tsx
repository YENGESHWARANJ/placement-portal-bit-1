import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
    GraduationCap, Briefcase, Code2, Upload, ChevronRight,
    Sparkles, CheckCircle2, User, BookOpen, Zap, ArrowLeft,
    Shield, Target, Cpu, Hash
} from "lucide-react";
import { useAuth } from "./AuthContext";
import api from "../../services/api";
import { cn } from "../../utils/cn";

const BRANCHES = ["CSE", "ECE", "EEE", "Mechanical", "Civil", "IT", "AIDS", "AIML", "Cyber Security", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];
const SKILLS_SUGGESTIONS = ["React", "Node.js", "Python", "Java", "C++", "MongoDB", "SQL", "TypeScript", "Machine Learning", "Data Science", "AWS", "Docker"];

export default function Onboarding() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isStudent = user?.role === "student";

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        // Student
        usn: "", branch: "", year: "", skills: [] as string[], customSkill: "",
        // Recruiter
        company: "", designation: "", website: "",
    });

    const toggleSkill = (skill: string) => {
        setForm(p => ({
            ...p,
            skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill],
        }));
    };

    const addCustomSkill = () => {
        const sk = form.customSkill.trim();
        if (sk && !form.skills.includes(sk)) {
            setForm(p => ({ ...p, skills: [...p.skills, sk], customSkill: "" }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const tid = toast.loading("Finalizing your dossier...");
        try {
            const payload = isStudent
                ? { branch: form.branch, year: form.year, skills: form.skills.join(", "), usn: form.usn }
                : { company: form.company, designation: form.designation, website: form.website };

            await api.post("/auth/complete-onboarding", payload);
            toast.success("Identity established! Welcome to BIT Placement.", { id: tid, duration: 3000 });
            navigate(isStudent ? "/dashboard" : "/jobs/my", { replace: true });
        } catch {
            toast.error("Failed to commit changes. Retry.", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const skip = () => navigate(isStudent ? "/dashboard" : "/jobs/my", { replace: true });

    const STUDENT_STEPS = [
        {
            icon: Hash, title: "Academic Identity", color: "from-blue-500 to-indigo-600",
            content: (
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">USN / Official Protocol ID</label>
                        <input value={form.usn} onChange={e => setForm(p => ({ ...p, usn: e.target.value }))}
                            placeholder="e.g. 1MS21CS001"
                            className="apple-input" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Academic Domain</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                            {BRANCHES.map(b => (
                                <button key={b} onClick={() => setForm(p => ({ ...p, branch: b }))}
                                    className={cn(
                                        "py-2.5 px-3 rounded-[14px] text-sm font-black uppercase tracking-tight transition-all duration-300 border-2",
                                        form.branch === b
                                            ? "bg-apple-blue border-apple-blue text-slate-900 shadow-apple-soft"
                                            : "bg-apple-gray-50 border-transparent text-apple-gray-400 hover:bg-apple-gray-100/50"
                                    )}>
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Current Cycle</label>
                        <div className="flex gap-2.5 flex-wrap">
                            {YEARS.map(y => (
                                <button key={y} onClick={() => setForm(p => ({ ...p, year: y }))}
                                    className={cn(
                                        "py-2 px-5 rounded-[12px] text-sm font-black uppercase tracking-tight transition-all duration-300 border-2",
                                        form.year === y
                                            ? "bg-apple-blue border-apple-blue text-slate-900 shadow-apple-soft"
                                            : "bg-apple-gray-50 border-transparent text-apple-gray-400 hover:bg-apple-gray-100/50"
                                    )}>
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: Cpu, title: "Neural Skillset", color: "from-purple-500 to-violet-600",
            content: (
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Core Competencies</label>
                        <div className="flex flex-wrap gap-2.5">
                            {SKILLS_SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => toggleSkill(s)}
                                    className={cn(
                                        "py-2 px-4 rounded-[12px] text-sm font-black uppercase transition-all duration-300 border-2",
                                        form.skills.includes(s)
                                            ? "bg-violet-600 border-violet-600 text-slate-900 shadow-apple-soft"
                                            : "bg-apple-gray-50 border-transparent text-apple-gray-400 hover:bg-apple-gray-100/50"
                                    )}>
                                    {form.skills.includes(s) && <span className="mr-1.5 opacity-70">✓</span>}{s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Manual Specification</label>
                        <div className="flex gap-2.5">
                            <input value={form.customSkill} onChange={e => setForm(p => ({ ...p, customSkill: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && addCustomSkill()}
                                placeholder="Specify custom skill..."
                                className="apple-input" />
                            <button onClick={addCustomSkill} className="px-6 h-12 bg-violet-600 text-white rounded-[18px] text-base font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-apple-soft">Add</button>
                        </div>
                    </div>
                    {form.skills.length > 0 && (
                        <div className="p-5 bg-apple-gray-50 border border-apple-gray-100 rounded-[24px]">
                            <p className="text-base font-black uppercase tracking-widest text-apple-gray-300 mb-3">Verified Selection — {form.skills.length} Items</p>
                            <div className="flex flex-wrap gap-2">
                                {form.skills.map(s => (
                                    <span key={s} onClick={() => toggleSkill(s)} className="px-3 py-1.5 bg-violet-50 text-violet-600 text-base font-black uppercase tracking-wider rounded-lg border border-violet-100 cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                                        {s} <span className="ml-1 opacity-50">×</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const RECRUITER_STEPS = [
        {
            icon: Target, title: "Organization Intel", color: "from-amber-500 to-orange-600",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Corporate Entity</label>
                        <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                            placeholder="e.g. Infosys Technologies"
                            className="apple-input" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Professional Rank</label>
                        <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                            placeholder="e.g. HR Manager / Lead Recruiter"
                            className="apple-input" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-300 ml-1">Entity Website</label>
                        <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                            placeholder="https://identity.com"
                            className="apple-input" />
                    </div>
                </div>
            ),
        },
    ];

    const steps = isStudent ? STUDENT_STEPS : RECRUITER_STEPS;
    const currentStep = steps[step];
    const isLast = step === steps.length - 1;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background relative overflow-y-auto">
            {/* Background elements for depth */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-apple-blue/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-apple-blue/5 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-[600px] z-10 py-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center gap-3.5 mb-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="h-11 w-11 bg-apple-blue rounded-[14px] flex items-center justify-center shadow-lg shadow-apple-blue/15"
                        >
                            <GraduationCap className="h-5.5 w-5.5 text-slate-900" />
                        </motion.div>
                        <div className="text-left">
                            <p className="text-apple-gray-900 font-black text-lg tracking-tight leading-none uppercase">BIT Placement</p>
                            <p className="text-apple-blue font-black text-xs tracking-[0.2em] uppercase mt-1">Bannari Amman Institute of Technology</p>
                        </div>
                    </div>
                    <motion.h1
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl sm:text-4xl font-black text-apple-gray-900 tracking-tighter mb-2 sm:mb-3"
                    >
                        Initialize Profile, {user?.name ? user.name.split(" ")[0] : "Academic Prospect"}.
                    </motion.h1>
                    <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Authorized Dossier Personalization</p>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-12">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-5">
                            <div
                                className={cn(
                                    "h-10 w-10 sm:h-12 sm:w-12 rounded-[14px] sm:rounded-[18px] flex items-center justify-center transition-all duration-700 font-black text-sm sm:text-base",
                                    i < step
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                        : i === step
                                            ? "bg-apple-blue text-slate-900 shadow-lg shadow-apple-blue/20"
                                            : "bg-white border-2 border-apple-gray-100 text-apple-gray-300"
                                )}
                            >
                                {i < step ? <CheckCircle2 className="h-4 sm:h-5.5 w-4 sm:w-5.5" /> : i + 1}
                            </div>
                            {i < steps.length - 1 && <div className={cn("w-10 sm:w-16 h-1 rounded-full transition-all duration-700", i < step ? "bg-emerald-500" : "bg-apple-gray-100")} />}
                        </div>
                    ))}
                </div>

                {/* Onboarding Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="apple-card p-6 sm:p-12"
                    >
                        <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12 border-b border-apple-gray-50 pb-6 sm:pb-8">
                            <div className={cn("h-12 w-12 sm:h-16 sm:w-16 rounded-[18px] sm:rounded-[22px] bg-gradient-to-br flex items-center justify-center shadow-lg", currentStep.color)}>
                                <currentStep.icon className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-apple-gray-900 tracking-tighter">{currentStep.title}</h2>
                                <p className="text-[10px] sm:text-base font-black uppercase tracking-[0.3em] text-apple-blue mt-1">Classification Phase {step + 1}</p>
                            </div>
                        </div>

                        <div className="min-h-[320px]">
                            {currentStep.content}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-10 border-t border-apple-gray-50 gap-6">
                            <button
                                onClick={skip}
                                className="text-apple-gray-300 hover:text-apple-gray-900 text-sm font-black uppercase tracking-widest transition-all"
                            >
                                Bypass Configuration
                            </button>
                            <div className="flex gap-4 w-full sm:w-auto">
                                {step > 0 && (
                                    <button
                                        onClick={() => setStep(p => p - 1)}
                                        className="flex-1 sm:flex-none px-8 py-4 bg-apple-gray-50 text-apple-gray-900 rounded-[22px] text-base font-black uppercase tracking-widest hover:bg-apple-gray-100 transition-all border border-apple-gray-100"
                                    >
                                        Previous
                                    </button>
                                )}
                                <button
                                    onClick={isLast ? handleSubmit : () => setStep(p => p + 1)}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none apple-btn-primary px-10 py-4 text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 group"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>
                                            <span>{isLast ? "Commit Dossier" : "Next Phase"}</span>
                                            {isLast ? <Sparkles className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Security */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="mt-10 flex items-center justify-center gap-4 text-base font-bold text-apple-gray-300 uppercase tracking-widest">
                    <Shield className="h-4 w-4 text-apple-blue" />
                    <span>Dossier Synchronization Private & Encrypted</span>
                </motion.div>
            </div>
        </div>
    );
}
