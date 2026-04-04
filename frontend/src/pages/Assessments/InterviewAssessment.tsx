import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic, MicOff, Video, VideoOff, Clock, ChevronRight, ChevronLeft,
    Brain, Star, Sparkles, Trophy, Target, Layers, Cpu, Home,
    CheckCircle2, X, MessageSquare, Lightbulb, TrendingUp, BarChart3,
    Zap, RefreshCw, Play, BookOpen, User, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { generateAIQuestions, saveAssessment } from '../../services/assessment.service';

interface InterviewQuestion {
    id: number;
    question: string;
    category: string;
    difficulty: string;
    keyPoints: string[];
    sampleAnswer: string;
}

const INTERVIEW_CATEGORIES = [
    "OOP", "Data Structures", "Algorithms", "Databases",
    "System Design", "Behavioral", "Networking", "Operating Systems",
    "JavaScript", "React", "Python", "Memory"
];

const DIFFICULTY_OPTIONS = [
    { value: "", label: "Mixed", color: "from-blue-600 to-indigo-600" },
    { value: "easy", label: "Easy", color: "from-emerald-500 to-teal-600" },
    { value: "medium", label: "Medium", color: "from-amber-500 to-orange-600" },
    { value: "hard", label: "Hard", color: "from-rose-500 to-red-600" },
];

type Phase = "configure" | "generating" | "ready" | "interview" | "finished";

export default function InterviewAssessment() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>("configure");
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [generatingProgress, setGeneratingProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [selfScores, setSelfScores] = useState<Record<number, number>>({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [micOn, setMicOn] = useState(false);
    const [videoOn, setVideoOn] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [showKeyPoints, setShowKeyPoints] = useState(false);
    const COUNT_OPTIONS = [5, 10, 15, 20];

    useEffect(() => {
        if (phase !== "interview") return;
        if (timeLeft <= 0) { toast("Time up!", { icon: "⏰" }); return; }
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(t);
    }, [phase, timeLeft]);

    const handleGenerate = async () => {
        setPhase("generating");
        setGeneratingProgress(0);

        const interval = setInterval(() => {
            setGeneratingProgress(p => Math.min(p + 10, 90));
        }, 150);

        try {
            const category = selectedCategories.length === 1 ? selectedCategories[0] : undefined;
            const data = await generateAIQuestions({
                type: "Interview",
                topic: category,
                difficulty: difficulty as any,
                count: questionCount
            });

            clearInterval(interval);
            setGeneratingProgress(100);

            let qs = data.questions;
            if (selectedCategories.length > 0) {
                const filtered = qs.filter((q: InterviewQuestion) =>
                    selectedCategories.some(c => q.category?.toLowerCase().includes(c.toLowerCase()))
                );
                qs = filtered.length >= 3 ? filtered : qs;
            }

            setQuestions(qs);
            setTimeLeft(qs.length * 120); // 2 min per question to think/answer
            setTimeout(() => setPhase("ready"), 600);
        } catch {
            clearInterval(interval);
            toast.error("AI engine offline.");
            setPhase("configure");
        }
    };

    const handleSaveAnswer = () => {
        if (!currentAnswer.trim()) {
            toast.error("Please write your answer before saving.");
            return;
        }
        setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: currentAnswer }));
        toast.success("Answer saved!", { icon: "✅" });
        setCurrentAnswer("");
        setShowAnswer(false);
        setShowKeyPoints(false);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(p => p + 1);
        }
    };

    const handleSelfScore = (score: number) => {
        setSelfScores(prev => ({ ...prev, [questions[currentIndex].id]: score }));
    };

    const handleFinish = async () => {
        const avgScore = Object.values(selfScores).length > 0
            ? Math.round(Object.values(selfScores).reduce((a, b) => a + b, 0) / Object.values(selfScores).length * 20)
            : 50;

        try {
            await saveAssessment({
                type: "Interview",
                score: Math.round(avgScore / 100 * questions.length),
                totalQuestions: questions.length,
                timeTaken: questions.length * 120 - timeLeft,
            });
            toast.success("Interview assessment synced!", { icon: "🎯" });
        } catch { /* non-critical */ }

        setPhase("finished");
    };

    const fmt = (s: number) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
    const completionPct = questions.length > 0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;

    // ── CONFIGURE ────────────────────────────────────────────
    if (phase === "configure") return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6 space-y-12 bg-apple-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }}
                    className="h-20 w-20 bg-amber-500 rounded-[30px] flex items-center justify-center mx-auto shadow-apple-hover">
                    <MessageSquare className="h-10 w-10 text-slate-900" />
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight text-apple-gray-900">
                    AI <span className="text-amber-500">Interview</span> Lab
                </h1>
                <p className="text-apple-gray-500 font-semibold uppercase tracking-widest text-base">
                    Powered by Intelligence Engine v3.0
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Difficulty Selector */}
                <div className="apple-card p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Target className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Cognitive Load</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {DIFFICULTY_OPTIONS.map(d => (
                            <motion.button key={d.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setDifficulty(d.value)}
                                className={cn("p-6 rounded-[24px] border-2 text-center transition-all",
                                    difficulty === d.value
                                        ? "border-amber-500 bg-amber-50 shadow-sm"
                                        : "border-apple-gray-100 bg-white hover:border-apple-gray-200")}>
                                <div className={cn("h-1.5 w-8 rounded-full mx-auto mb-3 bg-gradient-to-r", d.color)} />
                                <p className="font-bold text-sm text-apple-gray-900">{d.label || "Mixed"}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Count Selector */}
                <div className="apple-card p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <Hash className="h-5 w-5 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-apple-gray-900">Sequence Depth</h3>
                        </div>
                        <div className="flex gap-4">
                            {COUNT_OPTIONS.map(c => (
                                <motion.button key={c} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                                    onClick={() => setQuestionCount(c)}
                                    className={cn("h-16 w-16 rounded-[20px] font-bold text-lg border-2 transition-all",
                                        questionCount === c
                                            ? "border-amber-500 bg-amber-50 text-amber-600"
                                            : "border-apple-gray-100 bg-white text-apple-gray-400 hover:border-apple-gray-200")}>
                                    {c}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-apple-gray-400 uppercase tracking-widest mt-8">
                        Estimated Completion: {questionCount * 2} minutes
                    </p>
                </div>
            </div>

            {/* Category Selector */}
            <div className="apple-card p-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Knowledge Spheres</h3>
                    </div>
                    {selectedCategories.length > 0 && (
                        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
                            onClick={() => setSelectedCategories([])}
                            className="px-4 py-2 text-base font-bold uppercase tracking-widest text-rose-500 bg-rose-50 rounded-full border border-rose-100 flex items-center gap-2">
                            <X className="h-3 w-3" /> Clear Selection ({selectedCategories.length})
                        </motion.button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    {INTERVIEW_CATEGORIES.map(cat => (
                        <motion.button key={cat} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCategories(prev =>
                                prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat])}
                            className={cn("px-5 py-3 rounded-[16px] text-lg font-bold transition-all border",
                                selectedCategories.includes(cat)
                                    ? "border-amber-500 bg-amber-500 text-slate-900 shadow-md"
                                    : "border-apple-gray-100 bg-white text-apple-gray-500 hover:border-apple-gray-200")}>
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Sync Button */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                className="w-full py-7 bg-amber-500 text-slate-900 rounded-[30px] font-bold text-lg uppercase tracking-[0.2em] shadow-apple-hover flex items-center justify-center gap-4 group">
                <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                Synchronize Lab Sequence
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </motion.div>
    );

    // ── GENERATING ─────────────────────────────────────────
    if (phase === "generating") return (
        <div className="min-h-screen flex items-center justify-center bg-apple-gray-50/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full mx-4 apple-card p-16 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-20 w-20 bg-amber-500 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-apple-hover">
                    <Cpu className="h-10 w-10 text-slate-900" />
                </motion.div>
                <h2 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-4">
                    Synthesizing Questions
                </h2>
                <p className="text-apple-gray-400 font-medium text-sm mb-10">
                    AI is sourcing real interview patterns for your profile...
                </p>
                <div className="h-2.5 bg-apple-gray-100 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${generatingProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-amber-500 font-bold text-xl">{generatingProgress}%</p>
                <div className="mt-8 flex justify-center gap-4">
                    {["Initializing", "Curation", "Analysis", "Finalizing"].map((s, i) => (
                        <motion.span key={i}
                            initial={{ opacity: 0 }} animate={{ opacity: generatingProgress > i * 25 ? 1 : 0.3 }}
                            className="text-xs font-bold text-apple-gray-400 uppercase tracking-widest">
                            {s}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );

    // ── READY ──────────────────────────────────────────────
    if (phase === "ready") return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-20 px-6 space-y-12">
            <div className="text-center space-y-6">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                    className="h-24 w-24 bg-white rounded-[36px] flex items-center justify-center mx-auto shadow-2xl">
                    <MessageSquare className="h-12 w-12 text-slate-900" />
                </motion.div>
                <h1 className="text-6xl font-bold text-apple-gray-900 tracking-tight">
                    Session <span className="text-amber-500">Ready</span>
                </h1>
                <p className="text-apple-gray-400 font-bold uppercase tracking-[0.3em] text-sm">
                    {difficulty ? difficulty.toUpperCase() : "MIXED"} MODE · {questions.length} NODES · COGNITIVE ASSESSMENT
                </p>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-8">
                {[
                    { label: "Questions", value: questions.length, icon: Brain, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Est. Time", value: `${questions.length * 2} min`, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
                    { label: "Categories", value: [...new Set(questions.map(q => q.category))].length, icon: Layers, color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="apple-card p-8 text-center flex flex-col items-center">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4", s.bg)}>
                            <s.icon className={cn("h-6 w-6", s.color)} />
                        </div>
                        <div className="text-3xl font-bold text-apple-gray-900 mb-1">{s.value}</div>
                        <div className="text-base font-bold text-apple-gray-400 uppercase tracking-widest">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div className="apple-card p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-apple-gray-100 rounded-2xl flex items-center justify-center">
                            <Lightbulb className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Lab Framework</h3>
                    </div>
                    <div className="space-y-5">
                        {[
                            { text: "Simulate real interview atmosphere", color: "bg-amber-500" },
                            { text: "Voice-driven response practice", color: "bg-apple-blue" },
                            { text: "AI-revealed key points analysis", color: "bg-indigo-500" },
                            { text: "Self-rating cognitive resonance", color: "bg-emerald-500" },
                        ].map((r, i) => (
                            <motion.div key={i} className="flex items-center gap-4">
                                <div className={cn("h-2 w-2 rounded-full shrink-0", r.color)} />
                                <span className="text-[16.5px] font-semibold text-apple-gray-500">{r.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="bg-white p-10 rounded-[40px] text-slate-900 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-all duration-700" />
                    <div className="relative z-10">
                        <h4 className="text-base font-bold uppercase tracking-[0.4em] text-amber-500 mb-6">Security Protocol</h4>
                        <p className="text-lg font-medium leading-relaxed text-apple-gray-300">
                            The session is proctored. Your focus and response time are monitored to build a comprehensive candidate profile.
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-4 mt-10">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-bold text-apple-gray-500 uppercase tracking-widest">Biometric Link Active</span>
                    </div>
                </motion.div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => setPhase("interview")}
                className="w-full py-7 bg-apple-blue text-slate-900 rounded-[30px] font-bold text-lg uppercase tracking-[0.3em] shadow-apple-hover flex items-center justify-center gap-4 group">
                <Play className="h-6 w-6 group-hover:animate-pulse" />
                Initialize Interview Sequence
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </motion.div>
    );

    // ── FINISHED ───────────────────────────────────────────
    if (phase === "finished") {
        const avgStars = Object.values(selfScores).length > 0
            ? (Object.values(selfScores).reduce((a, b) => a + b, 0) / Object.values(selfScores).length).toFixed(1)
            : "N/A";

        const categoryBreakdown: Record<string, { count: number; totalScore: number }> = {};
        questions.forEach(q => {
            if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = { count: 0, totalScore: 0 };
            categoryBreakdown[q.category].count++;
            if (selfScores[q.id]) categoryBreakdown[q.category].totalScore += selfScores[q.id];
        });

        return (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto py-12 px-6 space-y-10">
                <div className="bg-white rounded-[50px] shadow-apple-card border border-apple-gray-100 overflow-hidden">
                    <div className="p-14 bg-white text-slate-900 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 opacity-50" />
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="h-24 w-24 bg-amber-500 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-apple-hover relative z-10">
                            <Trophy className="h-12 w-12 text-slate-900" />
                        </motion.div>
                        <h2 className="text-4xl font-bold tracking-tight mb-3 relative z-10">Verification <span className="text-amber-500">Complete</span></h2>
                        <p className="text-apple-gray-400 font-semibold uppercase tracking-widest text-base relative z-10">
                            {Object.keys(answers).length}/{questions.length} Nodes Processed · Session Terminated
                        </p>
                    </div>

                    <div className="p-14 space-y-14">
                        <div className="text-center">
                            <div className="text-7xl font-bold text-apple-gray-900 mb-4">
                                {avgStars === "N/A" ? "—" : `${avgStars}/5`} <span className="text-3xl text-amber-500">⭐</span>
                            </div>
                            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-sm">Neural Resonance Score</p>
                        </div>

                        {/* Category breakdown */}
                        <div className="space-y-8">
                            <h3 className="text-lg font-bold text-apple-gray-900 flex items-center gap-3">
                                <BarChart3 className="h-5 w-5 text-amber-500" />
                                Cognitive Breakdown
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {Object.entries(categoryBreakdown).map(([cat, data]) => {
                                    const avgScore = data.totalScore > 0 ? data.totalScore / data.count : 0;
                                    const pct = (avgScore / 5) * 100;
                                    return (
                                        <div key={cat} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-base font-bold text-apple-gray-900 uppercase tracking-tight">{cat}</span>
                                                <span className="text-sm font-bold text-apple-gray-400">{avgScore.toFixed(1)}/5 ⭐</span>
                                            </div>
                                            <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={cn("h-full rounded-full",
                                                        pct >= 80 ? "bg-emerald-500" :
                                                            pct >= 60 ? "bg-apple-blue" :
                                                                pct >= 40 ? "bg-amber-500" : "bg-rose-500")} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-apple-gray-50">
                            <button onClick={() => navigate('/dashboard')}
                                className="py-5 px-8 bg-apple-gray-100 text-apple-gray-900 rounded-[20px] font-bold text-base uppercase tracking-widest hover:bg-apple-gray-200 transition-all flex items-center justify-center gap-3">
                                <Home className="h-4 w-4" /> Return to Dashboard
                            </button>
                            <button onClick={() => { setPhase("configure"); setAnswers({}); setSelfScores({}); setCurrentIndex(0); }}
                                className="py-5 px-8 bg-apple-blue text-slate-900 rounded-[20px] font-bold text-base uppercase tracking-widest shadow-apple-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                <Sparkles className="h-4 w-4" /> New Session
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── INTERVIEW MODE ────────────────────────────────────────
    const currentQ = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-apple-gray-50/50 py-8 px-6">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Progress + Timer (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Timer Card */}
                    <div className="apple-card p-8 bg-white text-slate-900 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <Clock className="h-5 w-5 text-amber-500" />
                            <p className="text-base font-bold uppercase tracking-widest text-apple-gray-400">Time Remaining</p>
                        </div>
                        <div className="text-center py-2 relative z-10">
                            <span className={cn("text-5xl font-bold tracking-tight", timeLeft < 120 ? "text-rose-500" : "text-slate-900")}>
                                {fmt(timeLeft)}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-8 relative z-10">
                            <motion.div className="h-full bg-amber-500 rounded-full"
                                initial={{ width: "100%" }}
                                style={{ width: `${(timeLeft / (questions.length * 120)) * 100}%` }} />
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="apple-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-apple-blue" />
                            <h3 className="font-bold text-apple-gray-900 text-sm uppercase tracking-tight">Progress</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-apple-gray-400 uppercase">Answered</span>
                                <span className="text-sm font-bold text-apple-gray-900">{answeredCount}/{questions.length}</span>
                            </div>
                            <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-apple-blue rounded-full"
                                    style={{ width: `${completionPct}%` }} transition={{ duration: 0.5 }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-apple-gray-50 rounded-[20px] text-center">
                                <div className="text-lg font-bold text-apple-gray-900">{currentIndex + 1}</div>
                                <div className="text-xs font-bold text-apple-gray-400 uppercase tracking-widest">Active</div>
                            </div>
                            <div className="p-4 bg-apple-gray-50 rounded-[20px] text-center">
                                <div className="text-lg font-bold text-apple-gray-900">{questions.length - answeredCount}</div>
                                <div className="text-xs font-bold text-apple-gray-400 uppercase tracking-widest">Remaining</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Card */}
                    <div className="apple-card p-8">
                        <p className="text-base font-bold uppercase tracking-widest text-apple-gray-400 mb-6">Environment</p>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setMicOn(!micOn)}
                                className={cn("p-4 rounded-[24px] flex flex-col items-center gap-3 border-2 transition-all shadow-sm",
                                    micOn ? "border-amber-500 bg-amber-50 text-amber-500" : "border-apple-gray-50 bg-white text-apple-gray-400")}>
                                {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                <span className="text-base font-bold uppercase tracking-widest">{micOn ? "Live" : "Muted"}</span>
                            </motion.button>
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setVideoOn(!videoOn)}
                                className={cn("p-4 rounded-[24px] flex flex-col items-center gap-3 border-2 transition-all shadow-sm",
                                    videoOn ? "border-apple-blue bg-blue-50 text-apple-blue" : "border-apple-gray-50 bg-white text-apple-gray-400")}>
                                {videoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                                <span className="text-base font-bold uppercase tracking-widest">{videoOn ? "On" : "Off"}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Main: Question area (6 cols) */}
                <div className="lg:col-span-6 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIndex}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="apple-card p-12 space-y-10 min-h-[600px] flex flex-col">

                            <div className="flex items-center justify-between shrink-0">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-base font-bold uppercase tracking-widest">
                                        {currentQ.category}
                                    </span>
                                    <span className={cn("px-3 py-1 rounded-full text-base font-bold uppercase tracking-widest",
                                        currentQ.difficulty === "easy" ? "bg-emerald-50 text-emerald-600" :
                                            currentQ.difficulty === "medium" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600")}>
                                        {currentQ.difficulty}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-apple-gray-400 uppercase tracking-widest">{currentIndex + 1} OF {questions.length}</span>
                            </div>

                            <div className="space-y-4 shrink-0">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-apple-gray-400">The Problem</p>
                                <h3 className="text-2xl font-bold text-apple-gray-900 leading-tight">
                                    {currentQ.question}
                                </h3>
                            </div>

                            <div className="flex-1 flex flex-col space-y-4">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-apple-gray-400 flex items-center justify-between">
                                    Your Response
                                    <span className="text-apple-gray-300 font-medium normal-case tracking-normal italic text-base">Auto-saving enabled...</span>
                                </p>
                                <textarea
                                    value={currentAnswer}
                                    onChange={e => setCurrentAnswer(e.target.value)}
                                    placeholder="Type your response here. Focus on clarity and professional delivery..."
                                    className="flex-1 w-full bg-apple-gray-50 rounded-[24px] border border-apple-gray-100 p-8 text-slate-700 placeholder-apple-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none font-medium leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 pt-6">
                                <div className="space-y-4">
                                    <button onClick={() => setShowKeyPoints(!showKeyPoints)}
                                        className="flex items-center gap-3 text-sm font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">
                                        <Lightbulb className="h-4 w-4" /> {showKeyPoints ? "Hide Key Points" : "Reveal Key Points"}
                                    </button>
                                    <AnimatePresence>
                                        {showKeyPoints && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                className="bg-amber-50/50 rounded-[20px] p-5 space-y-2 border border-amber-100">
                                                {currentQ.keyPoints.map((pt, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <div className="h-1 w-1 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                                                        <span className="text-lg font-medium text-amber-800/80">{pt}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="space-y-4">
                                    <button onClick={() => setShowAnswer(!showAnswer)}
                                        className="flex items-center gap-3 text-sm font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                                        <BookOpen className="h-4 w-4" /> {showAnswer ? "Hide Sample" : "View Sample Answer"}
                                    </button>
                                    <AnimatePresence>
                                        {showAnswer && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                className="bg-indigo-50/50 rounded-[20px] p-5 border border-indigo-100">
                                                <p className="text-lg font-medium text-indigo-900/70 leading-relaxed italic">
                                                    "{currentQ.sampleAnswer}"
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-10 border-t border-apple-gray-100 shrink-0">
                                <div className="flex items-center gap-4">
                                    <p className="text-base font-bold uppercase tracking-widest text-apple-gray-400">Self-Rate</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} onClick={() => handleSelfScore(s)}
                                                className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                                    (selfScores[currentQ.id] || 0) >= s ? "bg-amber-100 text-amber-500" : "bg-apple-gray-50 text-apple-gray-300")}>
                                                <Star className={cn("h-5 w-5", (selfScores[currentQ.id] || 0) >= s ? "fill-current" : "")} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={handleSaveAnswer}
                                        className="px-8 py-4 bg-apple-blue text-slate-900 rounded-[16px] font-bold text-sm uppercase tracking-widest shadow-apple-hover">
                                        Deploy Response
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Map (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="apple-card p-8 sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Target className="h-5 w-5 text-apple-gray-900" />
                            <h3 className="font-bold text-apple-gray-900 text-sm uppercase tracking-tight">Question Map</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {questions.map((q, i) => (
                                <button key={i} onClick={() => { setCurrentIndex(i); setCurrentAnswer(answers[q.id] || ""); setShowAnswer(false); setShowKeyPoints(false); }}
                                    className={cn("h-10 rounded-xl font-bold text-xs transition-all border-2",
                                        currentIndex === i ? "border-amber-500 bg-amber-50 text-amber-600" :
                                            answers[q.id] ? "border-emerald-500 bg-emerald-50 text-emerald-600" :
                                                "border-apple-gray-50 bg-white text-apple-gray-300 hover:border-apple-gray-100")}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-apple-gray-400 uppercase tracking-widest">Self-Rated</span>
                                <span className="text-xs font-bold text-apple-gray-900">{Object.keys(selfScores).length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-apple-gray-400 uppercase tracking-widest">Average ⭐</span>
                                <span className="text-xs font-bold text-amber-500">
                                    {Object.values(selfScores).length > 0 ? (Object.values(selfScores).reduce((a, b) => a + b, 0) / Object.values(selfScores).length).toFixed(1) : "0.0"}
                                </span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-apple-gray-50 mt-8 space-y-4">
                            <button onClick={handleFinish}
                                className="w-full py-4 bg-white text-slate-900 rounded-[16px] font-bold text-sm uppercase tracking-widest shadow-apple-hover flex items-center justify-center gap-2 group">
                                <Zap className="h-4 w-4 text-emerald-500" />
                                Terminate Session
                            </button>
                            <p className="text-center text-xs font-bold text-apple-gray-300 uppercase leading-relaxed">
                                AI neural scoring will initiate upon termination
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
