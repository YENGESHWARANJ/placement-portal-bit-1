import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Code2, BookOpen, ChevronRight, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../services/api";
import { cn } from "../../../utils/cn";
import { Link } from "react-router-dom";

interface PrepQuestionsProps {
    skills: string[];
}

export default function ResumePrepQuestions({ skills }: PrepQuestionsProps) {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<any>(null);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await api.post("/assessments/prep-recommendations", { skills });
                setRecommendations(res.data);
            } catch (err) {
                console.error("Failed to fetch prep recommendations", err);
            } finally {
                setLoading(false);
            }
        };
        if (skills.length > 0) fetchRecs();
        else setLoading(false);
    }, [skills]);

    if (loading) return (
        <div className="p-12 text-center space-y-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Synthesizing personalized prep map...</p>
        </div>
    );

    if (!recommendations) return null;

    return (
        <div className="space-y-12 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Target className="h-4 w-4 text-slate-900" />
                        </div>
                        <span className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Skill-Matched Prep</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-slate-900 tracking-tighter italic">Preparation <span className="text-blue-600">Blueprint</span></h2>
                    <p className="text-slate-500 mt-2 font-medium">Custom-curated challenges based on your genetic technical profile.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                {/* Interview Prep */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-slate-100 p-10 rounded-[50px] border border-slate-100 space-y-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-[80px]" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20">
                                <Brain className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 italic tracking-tight">Interview Nodes</h3>
                        </div>
                        <Link to="/interview-test" className="text-xs font-black text-amber-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                            Enter Lab <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {recommendations.interview?.map((q: any, i: number) => (
                            <div key={i} className="p-6 bg-slate-500 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 transition-all group/q shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest px-2 py-1 bg-amber-500/10 rounded-md">
                                        {q.category}
                                    </span>
                                </div>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-500 line-clamp-2">{q.question}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Coding Prep */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-slate-100 p-10 rounded-[50px] border border-slate-100 space-y-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-[80px]" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                <Code2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 italic tracking-tight">Coding Challenges</h3>
                        </div>
                        <Link to="/coding-test" className="text-xs font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                            Enter Arena <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {recommendations.coding?.map((q: any, i: number) => (
                            <div key={i} className="p-6 bg-slate-500 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group/q shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-2 py-1 bg-blue-500/10 rounded-md">
                                        {q.topic}
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        q.difficulty === 'Easy' ? 'text-emerald-500' : 'text-rose-500'
                                    )}>{q.difficulty}</span>
                                </div>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-500">{q.title}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Action */}
            <div className="px-4">
                <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Zap className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 text-xl font-black italic tracking-tight underline decoration-blue-500 decoration-2 underline-offset-4">Comprehensive Assessment Boot</h4>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Initialize full spectrum evaluation sequence</p>
                        </div>
                    </div>
                    <Link to="/aptitude-test" className="relative z-10 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center gap-3">
                        Start Full Test <Sparkles className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
