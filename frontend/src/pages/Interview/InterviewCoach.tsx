import React, { useState, useEffect } from 'react';
import { Mic, Send, Brain, Trophy, ArrowRight, RefreshCcw, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function InterviewCoach() {
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [complete, setComplete] = useState(false);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ questions: string[] }>('/interview/questions');
            setQuestions(res.data.questions);
            setCurrentIndex(0);
            setFeedbacks([]);
            setComplete(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleNext = async () => {
        if (!answer.trim()) return;

        setLoading(true);
        try {
            const res = await api.post<{ score: number, feedback: string }>('/interview/evaluate', {
                question: questions[currentIndex],
                answer
            });

            setFeedbacks([...feedbacks, { question: questions[currentIndex], ...res.data }]);
            setAnswer("");

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setComplete(true);
            }
        } catch (err) {
            toast.error("Evaluation failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading && questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI is preparing your interview board...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-20">
            {/* Header */}
            <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-20 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">AI Interview Engine</span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic">Practice <span className="text-blue-400">Sphere</span></h1>
                    <p className="text-slate-400 font-bold mt-2">Personalized technical and behavioral prep powered by AI.</p>
                </div>
                <button
                    onClick={fetchQuestions}
                    className="relative z-10 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
                >
                    <RefreshCcw className="h-5 w-5 text-white group-hover:rotate-180 transition-transform duration-700" />
                </button>
            </div>

            {!complete ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[50px] overflow-hidden shadow-sm">
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800">
                        <div
                            className="h-full bg-blue-600 transition-all duration-1000"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-12 space-y-10">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Question {currentIndex + 1} of {questions.length}</span>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight italic">
                                "{questions[currentIndex]}"
                            </h2>
                        </div>

                        <div className="relative">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your response here... (Try to be detailed)"
                                className="w-full h-48 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[35px] p-8 text-lg font-bold text-slate-700 dark:text-white outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
                            />
                            <div className="absolute bottom-6 right-6 flex gap-3">
                                <button className="h-12 w-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-lg active:scale-95">
                                    <Mic className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={loading || !answer.trim()}
                                    className="px-8 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? "Analyzing..." : currentIndex === questions.length - 1 ? "Finish Session" : "Next Question"}
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-center">
                            <Brain className="h-6 w-6 text-blue-600" />
                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-relaxed">
                                Tip: Use the STAR method (Situation, Task, Action, Result) to structure your answers for higher impact.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-emerald-500 p-10 rounded-[50px] text-white text-center space-y-4 shadow-2xl shadow-emerald-500/20">
                        <Trophy className="h-16 w-16 mx-auto bg-white/20 p-4 rounded-3xl" />
                        <h2 className="text-4xl font-black italic">Arena Phase Complete!</h2>
                        <p className="text-emerald-50 font-black uppercase tracking-widest text-[10px]">Your performance has been evaluated by PlacementAI</p>
                    </div>

                    <div className="grid gap-6">
                        {feedbacks.map((f, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {i + 1}</p>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full">
                                        <Trophy className="h-3 w-3" />
                                        <span className="text-[10px] font-black uppercase">Score: {f.score}/10</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white italic">"{f.question}"</h4>
                                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[30px] border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Feedback</span>
                                        {f.score >= 7 ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <ShieldAlert className="h-4 w-4 text-amber-500" />}
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">"{f.feedback}"</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={fetchQuestions}
                            className="flex-1 py-6 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Try Another Session
                        </button>
                        <button className="px-10 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Save Progress
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
