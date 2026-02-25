import React, { useState } from "react";
import { MessageCircle, ChevronDown, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const QA = [
    { q: "Tell me about yourself.", a: "Keep it to 1–2 minutes: focus on your education, relevant projects/internships, and your passion for the role. End with a strong statement on how you can contribute." },
    { q: "Why do you want to join our company?", a: "Mention specific details about the company's products, culture, or recent achievements. Highlight how your values align with theirs." },
    { q: "What is your greatest strength?", a: "Select a strength that directly relates to the job requirements (e.g., problem-solving, rapid learning). Provide a brief, impactful example." },
    { q: "What is your greatest weakness?", a: "Choose a real but manageable weakness. Emphasize the concrete steps you are taking to improve (e.g., time management tools, public speaking practice)." },
    { q: "Where do you see yourself in 5 years?", a: "Focus on growth. Mention your desire to master the role, take on more responsibility, and contribute significantly to the company's goals." },
    { q: "Describe a challenging situation and how you handled it.", a: "Use the STAR method: Situation, Task, Action, Result. Highlight your analytical thinking and the positive resolution." },
    { q: "Do you have any questions for us?", a: "Always prepare 2–3 thoughtful questions. Ask about team dynamics, company vision, or expectations for the first 90 days." },
];

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function InterviewQABank() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[11px] font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Knowledge Base</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Interview Q&A Bank</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium italic">Strategic response patterns for common interview scenarios.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/50">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Curated Responses</span>
                </div>
            </motion.div>

            {/* Q&A List */}
            <div className="space-y-4">
                {QA.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <motion.div
                            key={i}
                            variants={stagger.item}
                            layout
                            className={cn(
                                "apple-card overflow-hidden transition-all duration-500",
                                isOpen ? "scale-[1.01] shadow-xl border-apple-blue/10" : "hover:bg-apple-gray-50/50"
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="w-full flex items-center justify-between gap-6 p-8 text-left focus:outline-none group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 border shadow-sm",
                                        isOpen ? "bg-apple-blue text-white border-apple-blue shadow-apple-blue/20" : "bg-white text-apple-gray-400 border-apple-gray-100 group-hover:bg-apple-blue/5 group-hover:text-apple-blue"
                                    )}>
                                        <HelpCircle className="h-6 w-6" />
                                    </div>
                                    <span className={cn(
                                        "text-lg font-bold tracking-tight transition-colors duration-300",
                                        isOpen ? "text-apple-gray-900" : "text-apple-gray-600 group-hover:text-apple-gray-900"
                                    )}>
                                        {item.q}
                                    </span>
                                </div>
                                <div className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                    isOpen ? "bg-apple-blue/10 text-apple-blue rotate-180" : "bg-apple-gray-50 text-apple-gray-300"
                                )}>
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
                                        <div className="px-8 pb-10 pt-2 border-t border-apple-gray-50 bg-apple-gray-50/30">
                                            <div className="mt-6 flex gap-6 p-6 bg-white rounded-2xl border border-apple-gray-100 shadow-sm">
                                                <div className="h-8 w-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-apple-gray-400 uppercase tracking-widest mb-2 italic">Recommended Strategy</p>
                                                    <p className="text-[15px] font-medium text-apple-gray-600 leading-relaxed">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* AI Pro-Tip Footer */}
            <motion.div
                variants={stagger.item}
                className="apple-card p-10 bg-apple-blue relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-white tracking-tight mb-1">Practice with AI Coach</h4>
                        <p className="text-white/80 font-medium">Refine your delivery and get real-time feedback on your mock interview responses.</p>
                    </div>
                    <button className="px-8 py-3 bg-white text-apple-blue font-bold rounded-xl text-sm shadow-xl hover:scale-105 transition-transform">
                        Launch Mock Session
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

