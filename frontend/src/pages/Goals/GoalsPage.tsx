import React, { useState, useEffect } from "react";
import {
    Target, TrendingUp, Briefcase, CheckCircle2,
    Sparkles, Zap, ArrowUpRight, Target as TargetIcon,
    Activity, Layers, Rocket, Award, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { cn } from "../../utils/cn";

const STORAGE_GOALS = "placement_goals";

interface GoalsState {
    targetApplications: number;
    targetSavedJobs: number;
}

const defaultGoals: GoalsState = { targetApplications: 10, targetSavedJobs: 5 };

function loadGoals(): GoalsState {
    try {
        const raw = localStorage.getItem(STORAGE_GOALS);
        if (!raw) return defaultGoals;
        const parsed = JSON.parse(raw);
        return { ...defaultGoals, ...parsed };
    } catch {
        return defaultGoals;
    }
}

function saveGoals(g: GoalsState) {
    localStorage.setItem(STORAGE_GOALS, JSON.stringify(g));
}

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function GoalsPage() {
    const [goals, setGoals] = useState<GoalsState>(loadGoals());
    const [applicationsCount, setApplicationsCount] = useState<number | null>(null);
    const { savedItems } = useSavedJobs();

    useEffect(() => {
        api.get("/applications/my").then((res) => {
            const data = (res.data as any)?.data ?? (res.data as any)?.applications;
            setApplicationsCount(Array.isArray(data) ? data.length : 0);
        }).catch(() => setApplicationsCount(0));
    }, []);

    const updateGoal = (key: keyof GoalsState, value: number) => {
        const next = { ...goals, [key]: Math.max(0, value) };
        setGoals(next);
        saveGoals(next);
    };

    const appProgress = applicationsCount !== null && goals.targetApplications > 0
        ? Math.min(100, (applicationsCount / goals.targetApplications) * 100)
        : 0;
    const savedProgress = goals.targetSavedJobs > 0
        ? Math.min(100, (savedItems.length / goals.targetSavedJobs) * 100)
        : 0;

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="text-[11px] font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Tracking</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Objective Tracker</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Define your milestones and track your placement journey.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                        <Activity className="h-4 w-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Metrics Synchronized</span>
                    </div>
                </div>
            </motion.div>

            {/* Featured Banner */}
            <motion.div variants={stagger.item} className="apple-card p-10 bg-apple-gray-900 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8 text-center md:text-left">
                        <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <TargetIcon className="h-10 w-10 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2">Sync Status</p>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Operational Targets Calibrated</h2>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 italic">Average Delta</p>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                <p className="text-lg font-bold text-emerald-400">{Math.round((appProgress + savedProgress) / 2)}% SYNCED</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                            <p className="text-[11px] font-bold text-white tracking-wide">
                                <span className="text-indigo-400">{applicationsCount}</span> Committed Nodes
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Performance Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Applications Goal */}
                <motion.section variants={stagger.item} className="apple-card p-10 relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform">
                                <Rocket className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight">Applications</h3>
                                <p className="text-[11px] font-semibold text-apple-gray-400 uppercase tracking-widest">Target Saturation</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                <span className="text-3xl font-bold text-apple-gray-900 tracking-tight">{applicationsCount ?? "0"}</span>
                            </div>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest italic">Current Uplinks</p>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="bg-apple-gray-50 border border-apple-gray-100 p-8 rounded-3xl">
                            <label className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest block mb-4 italic">Set Saturation Target</label>
                            <input
                                type="number"
                                min={0}
                                value={goals.targetApplications}
                                onChange={(e) => updateGoal("targetApplications", parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-transparent border-none text-4xl font-bold text-apple-gray-900 outline-none focus:ring-0 placeholder:text-apple-gray-200"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <span className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest">Progress Density</span>
                                <span className="text-lg font-bold text-indigo-600">{Math.round(appProgress)}%</span>
                            </div>
                            <div className="h-3 bg-apple-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${appProgress}%` }}
                                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {appProgress >= 100 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Award className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest italic">Target Saturation Achieved</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Market Radar Goal */}
                <motion.section variants={stagger.item} className="apple-card p-10 relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-apple-blue/10 transition-colors" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-apple-blue/5 text-apple-blue rounded-2xl flex items-center justify-center border border-apple-blue/10 shadow-sm group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight">Market Radar</h3>
                                <p className="text-[11px] font-semibold text-apple-gray-400 uppercase tracking-widest">Identification Target</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <Zap className="h-4 w-4 text-apple-blue" />
                                <span className="text-3xl font-bold text-apple-gray-900 tracking-tight">{savedItems.length}</span>
                            </div>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest italic">Nodes Tracked</p>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="bg-apple-gray-50 border border-apple-gray-100 p-8 rounded-3xl">
                            <label className="text-[11px] font-bold text-apple-blue uppercase tracking-widest block mb-4 italic">Set Identification Goal</label>
                            <input
                                type="number"
                                min={0}
                                value={goals.targetSavedJobs}
                                onChange={(e) => updateGoal("targetSavedJobs", parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-transparent border-none text-4xl font-bold text-apple-gray-900 outline-none focus:ring-0 placeholder:text-apple-gray-200"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <span className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest">Radar Density</span>
                                <span className="text-lg font-bold text-apple-blue">{Math.round(savedProgress)}%</span>
                            </div>
                            <div className="h-3 bg-apple-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${savedProgress}%` }}
                                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                                    className="h-full bg-apple-blue rounded-full shadow-[0_0_15px_rgba(0,113,227,0.3)]"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {savedProgress >= 100 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest italic">High Resonance Identified</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>
            </div>

            {/* Quick Action Footer */}
            <motion.div
                variants={stagger.item}
                className="apple-card p-12 bg-white relative overflow-hidden group border-apple-gray-100"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-apple-blue/5" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="h-16 w-16 bg-apple-gray-50 text-apple-gray-400 rounded-2xl flex items-center justify-center border border-apple-gray-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Layers className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight">Performance Statistics</h3>
                            <p className="text-apple-gray-400 font-medium mt-1">Refine your trajectory towards premium opportunities.</p>
                        </div>
                    </div>
                    <button className="apple-btn px-10 py-4 flex items-center gap-3">
                        <span>View Strategy Intel</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

