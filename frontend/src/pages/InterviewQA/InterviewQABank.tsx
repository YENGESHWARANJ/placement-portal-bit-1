import React, { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const QA = [
    { q: "Tell me about yourself.", a: "Keep it to 1–2 minutes: education, relevant projects/internships, and why you're interested in this role. End with what you can contribute." },
    { q: "Why do you want to join our company?", a: "Mention specific things: products, culture, or recent news. Show you've researched; avoid generic answers." },
    { q: "What is your greatest strength?", a: "Pick one that fits the job (e.g. problem-solving, teamwork). Give a short example from a project or past experience." },
    { q: "What is your greatest weakness?", a: "Choose a real but minor weakness. Show how you're working on it (e.g. 'I used to overcommit; now I use a task list and prioritize')." },
    { q: "Where do you see yourself in 5 years?", a: "Align with the role and company growth. E.g. 'Growing as a [role], taking more ownership, and contributing to [specific area].'" },
    { q: "Describe a challenging situation and how you handled it.", a: "Use STAR: Situation, Task, Action, Result. Focus on your actions and a clear, positive outcome." },
    { q: "Do you have any questions for us?", a: "Always ask 2–3. Examples: team structure, expectations in the first 6 months, or what success looks like in this role." },
];

export default function InterviewQABank() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic flex items-center gap-3">
                    <MessageCircle className="h-8 w-8 text-violet-500" aria-hidden />
                    Interview Q&A Bank
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 italic">
                    Common questions and how to answer them
                </p>
            </div>

            <div className="space-y-3">
                {QA.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base pr-4">
                                    {item.q}
                                </span>
                                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                            </button>
                            {isOpen && (
                                <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
