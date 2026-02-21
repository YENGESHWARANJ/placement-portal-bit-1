import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Briefcase, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import { useSavedJobs } from "../../hooks/useSavedJobs";

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
        ? Math.min(100, Math.round((applicationsCount / goals.targetApplications) * 100))
        : 0;
    const savedProgress = goals.targetSavedJobs > 0
        ? Math.min(100, Math.round((savedItems.length / goals.targetSavedJobs) * 100))
        : 0;

    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic flex items-center gap-3">
                    <Target className="h-8 w-8 text-indigo-500" aria-hidden />
                    Goals & Milestones
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 italic">
                    Set targets and track your placement prep progress
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Applications</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Target: apply to more roles</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-4 mb-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Target</label>
                            <input
                                type="number"
                                min={0}
                                value={goals.targetApplications}
                                onChange={(e) => updateGoal("targetApplications", parseInt(e.target.value, 10) || 0)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold"
                            />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{applicationsCount ?? "—"}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Current</p>
                        </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${appProgress}%` }}
                        />
                    </div>
                    {appProgress >= 100 && (
                        <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Goal reached!
                        </p>
                    )}
                </section>

                <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Saved Jobs</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Jobs to shortlist</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-4 mb-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Target</label>
                            <input
                                type="number"
                                min={0}
                                value={goals.targetSavedJobs}
                                onChange={(e) => updateGoal("targetSavedJobs", parseInt(e.target.value, 10) || 0)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold"
                            />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{savedItems.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Saved</p>
                        </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${savedProgress}%` }}
                        />
                    </div>
                    {savedProgress >= 100 && (
                        <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Goal reached!
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
