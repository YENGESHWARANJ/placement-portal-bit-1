import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    TrendingUp,
    Target,
    Calendar,
    Zap,
    BookOpen,
    BarChart3,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Clock,
    FileText,
    Mic2,
    Briefcase,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../features/auth/AuthContext";
import api from "../../services/api";
import { cn } from "../../utils/cn";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function InsightsHub() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [weeklyPrep, setWeeklyPrep] = useState<{ day: string; tasks: string[] }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const res = await api.get("/students/profile").catch(() => ({ data: {} }));
                setProfile((res.data as any)?.data ?? null);
                setWeeklyPrep([
                    { day: "Mon", tasks: ["Aptitude practice", "Resume update"] },
                    { day: "Tue", tasks: ["Coding challenge", "Company research"] },
                    { day: "Wed", tasks: ["Mock interview", "Networking"] },
                    { day: "Thu", tasks: ["Soft skills read", "Apply to 3 jobs"] },
                    { day: "Fri", tasks: ["Review week", "Set next week goals"] },
                ]);
            } catch (e) {
                setError("Profile data could not be loaded. Showing default plan.");
                setWeeklyPrep([
                    { day: "Mon", tasks: ["Aptitude practice"] },
                    { day: "Tue", tasks: ["Coding challenge"] },
                    { day: "Wed", tasks: ["Mock interview"] },
                    { day: "Thu", tasks: ["Apply to jobs"] },
                    { day: "Fri", tasks: ["Review & goals"] },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[320px]" role="status" aria-live="polite" aria-busy="true">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="h-10 w-10 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-blue-500"
                    aria-hidden
                />
                <span className="sr-only">Loading Insights Hub…</span>
            </div>
        );
    }

    const skillAreas = [
        { label: "Technical", value: profile?.codingScore ?? 70, color: "bg-blue-500" },
        { label: "Aptitude", value: profile?.aptitudeScore ?? 65, color: "bg-emerald-500" },
        { label: "Interview", value: profile?.interviewScore ?? 60, color: "bg-amber-500" },
        { label: "Profile", value: Math.min(100, ((profile?.skills?.length ?? 0) * 10 + 40)), color: "bg-violet-500" },
    ];

    const quickActions = [
        { to: "/resume-builder", label: "Resume Builder", icon: FileText },
        { to: "/interview", label: "Mock Interview", icon: Mic2 },
        { to: "/job-recommendations", label: "Job Intel", icon: Briefcase },
    ];

    const weeklyFocusItems = [
        { title: "Apply to 5 roles", icon: TrendingUp },
        { title: "Complete 1 mock interview", icon: Clock },
        { title: "Update resume & portfolio", icon: BookOpen },
    ];

    return (
        <div className="space-y-10 pb-12" role="main">
            {error && (
                <motion.div {...fadeUp(0)} className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm" role="alert">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}
            <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-amber-500" aria-hidden />
                        Insights Hub
                    </h1>
                    <p className="text-slate-500 dark:text-slate-500 text-sm font-medium mt-1 italic">
                        Next-level prep intelligence for {user?.name ?? "you"}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-widest italic">
                    <Zap className="h-4 w-4" /> Advanced
                </div>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="flex flex-wrap gap-3">
                {quickActions.map(({ to, label, icon: Icon }) => (
                    <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.section {...fadeUp(0.1)} className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm" aria-labelledby="skill-matrix-heading">
                    <h2 id="skill-matrix-heading" className="text-sm font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" /> Skill Matrix
                    </h2>
                    <div className="space-y-4">
                        {skillAreas.map((area, i) => (
                            <div key={area.label}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-500 mb-1">
                                    <span>{area.label}</span>
                                    <span>{area.value}%</span>
                                </div>
                                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${area.value}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                        className={cn("h-full rounded-full", area.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section {...fadeUp(0.15)} className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm" aria-labelledby="prep-calendar-heading">
                    <h2 id="prep-calendar-heading" className="text-sm font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Prep Calendar
                    </h2>
                    <div className="space-y-3">
                        {weeklyPrep.map(({ day, tasks }, i) => (
                            <div
                                key={day}
                                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600"
                            >
                                <span className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase w-10">{day}</span>
                                <ul className="flex-1 space-y-1">
                                    {tasks.map((t, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-500">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>

            <motion.section {...fadeUp(0.2)} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-slate-900 border border-slate-700/50" aria-labelledby="weekly-focus-heading">
                <h2 id="weekly-focus-heading" className="text-sm font-black text-slate-900/70 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4" /> This Week&apos;s Focus
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeklyFocusItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            <item.icon className="h-5 w-5 text-amber-600" aria-hidden />
                            <span className="font-bold text-sm italic">{item.title}</span>
                            <ChevronRight className="h-4 w-4 text-slate-900/30 ml-auto" aria-hidden />
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
