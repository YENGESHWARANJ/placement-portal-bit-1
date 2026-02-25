import React, { useState } from "react";
import {
    Lightbulb,
    MessageSquare,
    FileCheck,
    Calendar,
    ChevronDown,
    CheckCircle2,
    Zap,
    Bot,
    Target as TargetIcon,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const SECTIONS = [
    {
        id: "interview",
        icon: MessageSquare,
        title: "Interview Mastery",
        subtitle: "Verbal Synthesis & Persona Alignment",
        color: "blue",
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
        title: "Resume & Profile",
        subtitle: "ATS Resonance & Optimization",
        color: "indigo",
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
        title: "Strategic Readiness",
        subtitle: "Mental Recovery & Preparation",
        color: "amber",
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
        icon: TargetIcon,
        title: "Technical Foundation",
        subtitle: "Computational Speed & Logic",
        color: "rose",
        tips: [
            "Practice timed mock tests to build speed and accuracy.",
            "Revise basics: quant, logical reasoning, and verbal.",
            "For coding: focus on arrays, strings, and simple data structures first.",
            "Read questions carefully; manage time per section.",
            "Review wrong answers after each practice test.",
        ],
    },
];

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function PrepTips() {
    const [openId, setOpenId] = useState<string | null>("interview");

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
                    <span className="text-[11px] font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Preparation</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Intelligence Hub</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Curated strategies for placement excellence.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Knowledge Sync Active</span>
                    </div>
                </div>
            </motion.div>

            {/* Featured Banner */}
            <motion.div variants={stagger.item} className="apple-card p-10 bg-apple-blue relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-black/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8 text-center md:text-left">
                        <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <Lightbulb className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] mb-2">Cognitive Index</p>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Placement Performance Optimized</h2>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-bold text-white">READY_TARGET</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Preparation Modules */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {SECTIONS.map((section) => {
                        const isOpen = openId === section.id;
                        const Icon = section.icon;
                        const colors = {
                            blue: "text-blue-500 bg-blue-50 border-blue-100",
                            indigo: "text-indigo-500 bg-indigo-50 border-indigo-100",
                            amber: "text-amber-500 bg-amber-50 border-amber-100",
                            rose: "text-rose-500 bg-rose-50 border-rose-100",
                        }[section.color as "blue" | "indigo" | "amber" | "rose"];

                        return (
                            <motion.div
                                key={section.id}
                                variants={stagger.item}
                                layout
                                className={cn(
                                    "apple-card overflow-hidden transition-all duration-500",
                                    isOpen ? "bg-white shadow-xl scale-[1.01]" : "hover:bg-apple-gray-50/50"
                                )}
                            >
                                <button
                                    onClick={() => setOpenId(isOpen ? null : section.id)}
                                    className="w-full flex items-center justify-between p-8 focus:outline-none group"
                                >
                                    <div className="flex items-center gap-6 text-left">
                                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 border shadow-sm", colors)}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight mb-1">
                                                {section.title}
                                            </h3>
                                            <p className="text-[11px] font-semibold text-apple-gray-400 uppercase tracking-widest">{section.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-apple-gray-50 text-apple-gray-400 transition-all", isOpen && "rotate-180 bg-apple-blue/5 text-apple-blue")}>
                                        <ChevronDown className="h-5 w-5" />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <div className="px-8 pb-10 pt-2 border-t border-apple-gray-50">
                                                <div className="grid gap-4 mt-6">
                                                    {section.tips.map((tip, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-apple-gray-50 transition-colors"
                                                        >
                                                            <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colors)}>
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                            </div>
                                                            <p className="text-[13px] font-medium text-apple-gray-500 leading-relaxed">
                                                                {tip}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 p-6 bg-apple-gray-50 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-emerald-100/80 rounded-lg flex items-center justify-center">
                                                            <Zap className="h-4 w-4 text-emerald-600" />
                                                        </div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-apple-gray-400">Strategy Verified</p>
                                                    </div>
                                                    <button className="apple-btn-secondary px-5 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <span>Download Guide</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={stagger.item} className="apple-card p-10 flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-apple-blue/5 rounded-3xl flex items-center justify-center text-apple-blue mb-6">
                        <Bot className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-apple-gray-900 tracking-tight mb-2">AI Prep Mentor</h4>
                    <p className="text-[13px] font-medium text-apple-gray-400 leading-relaxed">Get personalized feedback based on your recent mock assessments.</p>
                </motion.div>
                <motion.div variants={stagger.item} className="apple-card p-10 flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-apple-gray-900 tracking-tight mb-2">Dynamic Drills</h4>
                    <p className="text-[13px] font-medium text-apple-gray-400 leading-relaxed">Daily challenges tailored to the companies visiting this month.</p>
                </motion.div>
            </div>
        </motion.div>
    );
}

