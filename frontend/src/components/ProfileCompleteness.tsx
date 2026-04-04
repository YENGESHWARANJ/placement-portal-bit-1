import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "../utils/cn";

interface ProfileCompletenessProps {
    profile: Record<string, unknown> | null;
    className?: string;
}

const FIELDS = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "cgpa", label: "CGPA" },
    { key: "year", label: "Year" },
    { key: "skills", label: "Skills", isArray: true },
    { key: "resume", label: "Resume / CV" },
    { key: "branch", label: "Branch / Dept" },
];

export function ProfileCompleteness({ profile, className }: ProfileCompletenessProps) {
    if (!profile) return null;

    const filled = FIELDS.filter((f) => {
        const v = profile[f.key];
        if (f.isArray) return Array.isArray(v) && v.length > 0;
        return v != null && String(v).trim() !== "";
    }).length;
    const total = FIELDS.length;
    const pct = total ? Math.round((filled / total) * 100) : 0;

    return (
        <div className={cn("rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Profile completeness</h3>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-600">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-4">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <ul className="space-y-2">
                {FIELDS.map((f) => {
                    const v = profile[f.key];
                    const done = f.isArray ? Array.isArray(v) && v.length > 0 : v != null && String(v).trim() !== "";
                    return (
                        <li key={f.key} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500">
                            {done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Circle className="h-3.5 w-3.5 text-slate-500 dark:text-slate-500 shrink-0" />}
                            {f.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
