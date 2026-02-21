import React, { useState } from "react";
import {
    Lightbulb,
    MessageSquare,
    FileCheck,
    Calendar,
    Target,
    BookOpen,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
} from "lucide-react";
const SECTIONS = [
    {
        id: "interview",
        icon: MessageSquare,
        title: "Interview Tips",
        tips: [
            "Research the company and role before the interview.",
            "Prepare STAR (Situation, Task, Action, Result) examples for behavioral questions.",
            "Ask at least 2–3 thoughtful questions to the interviewer.",
            "Practice aloud with a friend or in front of a mirror.",
            "Arrive or join 5 minutes early; test your camera/mic for virtual interviews.",
        ],
    },
    {
        id: "resume",
        icon: FileCheck,
        title: "Resume & Application",
        tips: [
            "Tailor your resume to each role; highlight relevant skills and projects.",
            "Use action verbs and quantify impact (e.g., 'Improved X by 20%').",
            "Keep it to 1 page for freshers; 2 pages max for experienced.",
            "Proofread twice and get a second pair of eyes.",
            "Save as PDF and name the file clearly (e.g., YourName_Company_Role.pdf).",
        ],
    },
    {
        id: "day-before",
        icon: Calendar,
        title: "Day Before Placement",
        tips: [
            "Get 7–8 hours of sleep; avoid last-minute cramming.",
            "Lay out clothes and have documents/ID ready.",
            "Plan your route and buffer time for traffic.",
            "Review your resume and the job description one last time.",
            "Relax with a light activity; avoid heavy screen time late at night.",
        ],
    },
    {
        id: "aptitude",
        icon: Target,
        title: "Aptitude & Technical",
        tips: [
            "Practice timed mock tests to build speed and accuracy.",
            "Revise basics: quant, logical reasoning, and verbal.",
            "For coding: focus on arrays, strings, and simple data structures first.",
            "Read questions carefully; manage time per section.",
            "Review wrong answers after each practice test.",
        ],
    },
];

export default function PrepTips() {
    const [openId, setOpenId] = useState<string | null>("interview");

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic flex items-center gap-3">
                        <Lightbulb className="h-8 w-8 text-amber-500" aria-hidden />
                        Prep Tips
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 italic">
                        Curated tips for interviews, resume, and placement day
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-widest italic">
                    <BookOpen className="h-4 w-4" /> Quick reference
                </div>
            </div>

            <div className="space-y-4">
                {SECTIONS.map((section) => {
                    const isOpen = openId === section.id;
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenId(isOpen ? null : section.id)}
                                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                        {section.title}
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                            </button>
                            {isOpen && (
                                <ul className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-2">
                                    {section.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
