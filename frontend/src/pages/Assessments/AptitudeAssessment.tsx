import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, ShieldAlert, ChevronRight, ChevronLeft, CheckCircle2,
    Camera, Trophy, Activity, Zap, Eye, AlertTriangle, BarChart3,
    RefreshCw, Home, Brain, Sparkles, Target, Settings, Play,
    BookOpen, TrendingUp, Filter, Cpu, Layers, Hash, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { generateAIQuestions, saveAssessment } from '../../services/assessment.service';

interface Question {
    id: number; question: string; options: string[]; correct: number;
    topic: string; difficulty: string; explanation: string;
}

const APTITUDE_TOPICS = [
    "Time & Distance", "Profit & Loss", "Ratio & Proportion", "Percentages",
    "Simple Interest", "Compound Interest", "Work & Time", "Logical Reasoning",
    "Number Series", "Probability", "Averages", "Algebra", "Geometry",
    "Permutation & Combination", "Mixtures & Alligation", "Blood Relations",
    "LCM & HCF", "Coding & Decoding", "Data Interpretation", "Number System"
];

const DIFFICULTY_OPTIONS = [
    { value: "", label: "Mixed", color: "from-blue-500 to-indigo-600", desc: "All levels" },
    { value: "easy", label: "Easy", color: "from-emerald-500 to-teal-600", desc: "Beginner friendly" },
    { value: "medium", label: "Medium", color: "from-amber-500 to-orange-600", desc: "Placement standard" },
    { value: "hard", label: "Hard", color: "from-rose-500 to-red-600", desc: "FAANG level" },
];

const COUNT_OPTIONS = [5, 10, 15, 20];

type Phase = "configure" | "generating" | "ready" | "testing" | "finished";

export default function AptitudeAssessment() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>("configure");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(600);
    const [score, setScore] = useState(0);
    const [tabSwitches, setTabSwitches] = useState(0);
    const [scanLine, setScanLine] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [generatingProgress, setGeneratingProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Timer
    useEffect(() => {
        if (phase !== "testing") return;
        if (timeLeft <= 0) { handleSubmit(); return; }
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(t);
    }, [phase, timeLeft]);

    // Scan line animation
    useEffect(() => {
        if (phase !== "testing") return;
        const i = setInterval(() => setScanLine(p => (p + 1) % 100), 30);
        return () => clearInterval(i);
    }, [phase]);

    // Tab switch detection
    useEffect(() => {
        const fn = () => {
            if (document.hidden && phase === "testing") {
                setTabSwitches(prev => {
                    const n = prev + 1;
                    toast.error(`⚠️ Tab switch detected (${n}/3)`, { icon: "🚨" });
                    if (n >= 3) handleSubmit();
                    return n;
                });
            }
        };
        document.addEventListener('visibilitychange', fn);
        return () => document.removeEventListener('visibilitychange', fn);
    }, [phase]);

    const handleGenerate = async () => {
        setPhase("generating");
        setGeneratingProgress(0);

        const progressInterval = setInterval(() => {
            setGeneratingProgress(p => Math.min(p + 12, 90));
        }, 150);

        try {
            const topic = selectedTopics.length === 1 ? selectedTopics[0] : undefined;
            const data = await generateAIQuestions({
                type: "Aptitude",
                topic,
                difficulty: difficulty as any,
                count: questionCount
            });

            clearInterval(progressInterval);
            setGeneratingProgress(100);

            // Filter by selected topics if multiple selected
            let qs = data.questions;
            if (selectedTopics.length > 1) {
                const filtered = qs.filter((q: Question) =>
                    selectedTopics.some(t => q.topic?.toLowerCase().includes(t.toLowerCase()))
                );
                qs = filtered.length >= 5 ? filtered : qs;
            }

            setQuestions(qs);
            setTimeLeft(qs.length * 60); // 1 min per question
            setTimeout(() => setPhase("ready"), 600);
        } catch (err) {
            clearInterval(progressInterval);
            toast.error("AI engine failed. Using fallback questions.");
            setPhase("configure");
        }
    };

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = s;
            setPhase("testing");
        } catch {
            // Camera optional - still allow testing
            setPhase("testing");
            toast("Camera access denied — proctoring disabled", { icon: "ℹ️" });
        }
    };

    const handleSubmit = async () => {
        setPhase("finished");
        let correct = 0;
        const results = questions.map(q => {
            const ok = answers[q.id] === q.correct;
            if (ok) correct++;
            return { qId: q.id, correct: ok, selected: answers[q.id], topic: q.topic };
        });
        setScore(correct);

        // Topic analysis
        const topicMap: Record<string, { correct: number; total: number }> = {};
        questions.forEach((q, i) => {
            if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
            topicMap[q.topic].total++;
            if (results[i].correct) topicMap[q.topic].correct++;
        });

        try {
            await saveAssessment({
                type: "Aptitude",
                score: correct,
                totalQuestions: questions.length,
                timeTaken: (questions.length * 60) - timeLeft,
                results,
                topicAnalysis: Object.entries(topicMap).map(([topic, v]) => ({
                    topic, score: Math.round((v.correct / v.total) * 100), total: 100
                }))
            });
            toast.success("🎯 Assessment synced to cloud!", { icon: "✅" });
        } catch { toast.error("Failed to sync results"); }
    };

    const toggleTopic = (t: string) => {
        setSelectedTopics(prev =>
            prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
        );
    };

    const fmt = (s: number) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
    const timerColor = timeLeft > (questions.length * 40) ? 'text-white' : timeLeft > (questions.length * 15) ? 'text-amber-400' : 'text-rose-400';

    // ── CONFIGURE PHASE ──────────────────────────────────────
    if (phase === "configure") return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6 space-y-12 bg-apple-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }}
                    className="h-20 w-20 bg-apple-blue rounded-[30px] flex items-center justify-center mx-auto shadow-apple-hover">
                    <Brain className="h-10 w-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight text-apple-gray-900">
                    AI <span className="text-apple-blue">Aptitude</span> Generator
                </h1>
                <p className="text-apple-gray-500 font-semibold uppercase tracking-widest text-[10px]">
                    Powered by Intelligence Engine v3.0
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Difficulty Selector */}
                <div className="apple-card p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-apple-blue/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-apple-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Difficulty Matrix</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {DIFFICULTY_OPTIONS.map(d => (
                            <motion.button key={d.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setDifficulty(d.value)}
                                className={cn("p-6 rounded-[24px] border-2 text-center transition-all",
                                    difficulty === d.value
                                        ? "border-apple-blue bg-apple-blue/5 shadow-sm"
                                        : "border-apple-gray-100 bg-white hover:border-apple-gray-200")}>
                                <div className={cn("h-1.5 w-8 rounded-full mx-auto mb-3 bg-gradient-to-r", d.color)} />
                                <p className="font-bold text-sm text-apple-gray-900">{d.label}</p>
                                <p className="text-[10px] text-apple-gray-400 font-medium tracking-tight mt-1">{d.desc}</p>
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
                                            ? "border-apple-blue bg-apple-blue/5 text-apple-blue"
                                            : "border-apple-gray-100 bg-white text-apple-gray-400 hover:border-apple-gray-200")}>
                                    {c}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                    <p className="text-[11px] font-semibold text-apple-gray-400 uppercase tracking-widest mt-8">
                        Estimated Completion: {questionCount} minutes
                    </p>
                </div>
            </div>

            {/* Topic Selector */}
            <div className="apple-card p-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Topic Domains</h3>
                    </div>
                    {selectedTopics.length > 0 && (
                        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
                            onClick={() => setSelectedTopics([])}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 rounded-full border border-rose-100 flex items-center gap-2">
                            <X className="h-3 w-3" /> Clear Selection ({selectedTopics.length})
                        </motion.button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    {APTITUDE_TOPICS.map(t => (
                        <motion.button key={t} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => toggleTopic(t)}
                            className={cn("px-5 py-3 rounded-[16px] text-[12px] font-bold transition-all border",
                                selectedTopics.includes(t)
                                    ? "border-apple-blue bg-apple-blue text-white shadow-md"
                                    : "border-apple-gray-100 bg-white text-apple-gray-500 hover:border-apple-gray-200")}>
                            {t}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                className="w-full py-7 bg-apple-blue text-white rounded-[30px] font-bold text-lg uppercase tracking-[0.2em] shadow-apple-hover flex items-center justify-center gap-4 group">
                <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                Initialize AI Assessment
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </motion.div>
    );

    // ── GENERATING PHASE ──────────────────────────────────────
    if (phase === "generating") return (
        <div className="min-h-screen flex items-center justify-center bg-apple-gray-50/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full mx-4 apple-card p-16 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-20 w-20 bg-apple-blue rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-apple-hover">
                    <Cpu className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-4">
                    Synthesizing Assessment
                </h2>
                <p className="text-apple-gray-400 font-medium text-sm mb-10">
                    AI is curation {questionCount} specialized questions for your profile...
                </p>
                <div className="h-2.5 bg-apple-gray-100 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-apple-blue rounded-full"
                        style={{ width: `${generatingProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-apple-blue font-bold text-xl">{generatingProgress}%</p>
                <div className="mt-8 flex justify-center gap-4">
                    {["Curating", "Filtering", "Calibrating", "Finalizing"].map((s, i) => (
                        <motion.span key={i}
                            initial={{ opacity: 0 }} animate={{ opacity: generatingProgress > i * 25 ? 1 : 0.3 }}
                            className="text-[9px] font-bold text-apple-gray-400 uppercase tracking-widest">
                            {s}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );

    // ── READY PHASE ──────────────────────────────────────────
    if (phase === "ready") return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-20 px-6 space-y-12">
            <div className="text-center space-y-6">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-24 w-24 bg-apple-gray-900 rounded-[36px] flex items-center justify-center mx-auto shadow-2xl">
                    <ShieldAlert className="h-12 w-12 text-white" />
                </motion.div>
                <h1 className="text-6xl font-bold text-apple-gray-900 tracking-tight">
                    Assessment <span className="text-apple-blue">Ready</span>
                </h1>
                <p className="text-apple-gray-400 font-bold uppercase tracking-[0.3em] text-[11px]">
                    {difficulty ? difficulty.toUpperCase() : "MIXED"} MODE · {questions.length} NODES · PROCTORED SESSION
                </p>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-8">
                {[
                    { label: "Questions", value: questions.length, icon: Brain, color: "text-apple-blue", bg: "bg-apple-blue/5" },
                    { label: "Est. Time", value: `${questions.length} min`, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Topic Strata", value: [...new Set(questions.map(q => q.topic))].length, icon: Layers, color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="apple-card p-8 text-center flex flex-col items-center">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4", s.bg)}>
                            <s.icon className={cn("h-6 w-6", s.color)} />
                        </div>
                        <div className="text-3xl font-bold text-apple-gray-900 mb-1">{s.value}</div>
                        <div className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div className="apple-card p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-apple-gray-900 rounded-2xl flex items-center justify-center">
                            <Eye className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-apple-gray-900">Integrity Framework</h3>
                    </div>
                    <div className="space-y-5">
                        {[
                            { text: "Live camera proctoring enabled", color: "bg-apple-blue" },
                            { text: "Dynamic tab monitoring (3 thresholds)", color: "bg-amber-500" },
                            { text: "Hard submission on temporal exhaust", color: "bg-rose-500" },
                            { text: "Unique AI-generated question sequence", color: "bg-purple-500" },
                        ].map((r, i) => (
                            <motion.div key={i} className="flex items-center gap-4">
                                <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", r.color)} />
                                <span className="text-[14px] font-semibold text-apple-gray-500">{r.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="bg-apple-gray-900 p-10 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-apple-gray-400 mb-3">Session Profile</p>
                        <h4 className="text-3xl font-bold mb-6 tracking-tight">
                            {questions.length} Inquiries · {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Standard"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {[...new Set(questions.map(q => q.topic))].slice(0, 4).map(t => (
                                <span key={t} className="px-3 py-1.5 bg-white/10 rounded-[10px] text-[10px] font-bold uppercase border border-white/5">{t}</span>
                            ))}
                        </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startCamera}
                        className="relative z-10 w-full py-6 bg-apple-blue text-white rounded-[24px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 text-sm mt-10">
                        <Camera className="h-5 w-5" /> Start Proctored Session
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );

    // ── FINISHED PHASE ───────────────────────────────────────
    if (phase === "finished") {
        const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
        const circ = 2 * Math.PI * 70;
        const grade = pct >= 80 ? { label: 'DISTINCTION', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Trophy }
            : pct >= 60 ? { label: 'PROFICIENT', color: 'text-apple-blue', bg: 'bg-apple-blue/5', icon: Target }
                : { label: 'DEVELOPING', color: 'text-amber-500', bg: 'bg-amber-50', icon: Activity };

        // Topic breakdown
        const topicMap: Record<string, { correct: number; total: number }> = {};
        questions.forEach((q, i) => {
            if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
            topicMap[q.topic].total++;
            if (answers[q.id] === q.correct) topicMap[q.topic].correct++;
        });

        return (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto py-12 px-6 space-y-10">
                <div className="bg-white rounded-[50px] shadow-apple-card border border-apple-gray-100 overflow-hidden">
                    <div className="p-14 bg-apple-gray-900 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/10 via-transparent to-transparent" />
                        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                            className={cn("h-32 w-32 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 relative z-10", grade.bg.replace('bg-', 'bg-opacity-10 bg-'))}>
                            <grade.icon className={cn("h-14 w-14", grade.color)} />
                        </motion.div>
                        <h2 className="text-4xl font-bold tracking-tight mb-3 relative z-10">Assessment <span className="text-apple-blue">Finalized</span></h2>
                        <p className={cn("text-[11px] font-bold uppercase tracking-[0.4em] relative z-10", grade.color)}>Classification: {grade.label}</p>
                    </div>

                    <div className="p-14 space-y-14">
                        <div className="flex items-center justify-center gap-20 flex-wrap">
                            <div className="relative">
                                <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-apple-gray-50" />
                                    <motion.circle cx="80" cy="80" r="70" stroke="url(#scoreGradFinished)" strokeWidth="12" fill="transparent"
                                        strokeLinecap="round" strokeDasharray={circ}
                                        initial={{ strokeDashoffset: circ }}
                                        animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
                                        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }} />
                                    <defs>
                                        <linearGradient id="scoreGradFinished" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0071e3" />
                                            <stop offset="100%" stopColor="#00c7be" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold text-apple-gray-900">{pct}%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-apple-gray-400">Total Score</span>
                                </div>
                            </div>
                            <div className="space-y-8">
                                {[
                                    { label: 'Correct Responses', value: `${score} / ${questions.length}`, color: 'text-emerald-500' },
                                    { label: 'Time Elapsed', value: `${Math.floor(((questions.length * 60) - timeLeft) / 60)}m ${((questions.length * 60) - timeLeft) % 60}s`, color: 'text-apple-blue' },
                                    { label: 'Integrity Anomalies', value: `${tabSwitches}`, color: tabSwitches > 0 ? 'text-rose-500' : 'text-apple-gray-400' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-apple-gray-400 mb-1">{s.label}</p>
                                        <p className={cn("text-3xl font-bold", s.color)}>{s.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Topic Breakdown */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold text-apple-gray-900 flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-apple-blue" /> Domain Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {Object.entries(topicMap).map(([topic, v]) => {
                                    const pctT = Math.round((v.correct / v.total) * 100);
                                    return (
                                        <div key={topic} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[13px] font-semibold text-apple-gray-600 uppercase tracking-tight">{topic}</span>
                                                <span className="text-[13px] font-bold text-apple-gray-900">{pctT}%</span>
                                            </div>
                                            <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pctT}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={cn("h-full rounded-full", pctT >= 80 ? "bg-emerald-500" : pctT >= 50 ? "bg-apple-blue" : "bg-rose-500")}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-apple-gray-50">
                            <button onClick={() => navigate('/dashboard')}
                                className="py-5 px-8 bg-apple-gray-100 text-apple-gray-900 rounded-[20px] font-bold text-[13px] uppercase tracking-widest hover:bg-apple-gray-200 transition-all flex items-center justify-center gap-3">
                                <Home className="h-4 w-4" /> Return to Dashboard
                            </button>
                            <button onClick={() => { setPhase("configure"); setAnswers({}); setCurrentIndex(0); }}
                                className="py-5 px-8 bg-apple-blue text-white rounded-[20px] font-bold text-[13px] uppercase tracking-widest shadow-apple-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                <Sparkles className="h-4 w-4" /> Initialize New Test
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── TESTING PHASE ────────────────────────────────────────
    const currentQ = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6 pb-20 bg-apple-gray-50/30 min-h-screen">
            {/* Left Column: Proctoring & Secondary Info */}
            <div className="space-y-6 order-2 lg:order-1">
                {/* Proctoring Card */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="apple-card p-6 space-y-5 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-rose-50 rounded-xl flex items-center justify-center relative">
                            <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
                            <div className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">Neural Proctoring</p>
                            <p className="text-[11px] font-bold text-rose-500 uppercase">Live Feed Active</p>
                        </div>
                    </div>

                    <div className="aspect-video bg-apple-gray-900 rounded-[20px] overflow-hidden relative shadow-lg inner-shadow-lg">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-40 mix-blend-screen" />
                        <motion.div
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[1px] bg-apple-blue/50 shadow-[0_0_10px_rgba(0,113,227,0.5)] pointer-events-none"
                        />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">REC_CORE_NODE_7.2</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-apple-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-3 w-3 text-emerald-500" />
                            <span className="text-[9px] font-bold text-apple-gray-400 uppercase tracking-widest">Focus Locked</span>
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                            tabSwitches > 0 ? "text-rose-500 border-rose-100 bg-rose-50" : "text-apple-gray-400 border-apple-gray-100 bg-apple-gray-50")}>
                            Violations: {tabSwitches}/3
                        </div>
                    </div>
                </motion.div>

                {/* AI Guidance Card */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="apple-card p-6 bg-apple-blue/5 border-apple-blue/10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-4 w-4 text-apple-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-apple-blue">AI Assessment Insight</span>
                    </div>
                    <p className="text-[13px] font-medium text-apple-gray-600 leading-relaxed">
                        {currentQ?.topic === "Time & Distance" ? "Distance = Speed × Time. Ensure relative speed vectors are calibrated." :
                            currentQ?.topic === "Profit & Loss" ? "Calculate the margin based on the initial cost basis (CP)." :
                                currentQ?.topic === "Probability" ? "Sum of all outcomes constitutes the denominator. Filter favorable states." :
                                    "Analyze structural relationships. Eliminate logically incongruent nodes first."}
                    </p>
                </motion.div>
            </div>

            {/* Middle Column: Question Area */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
                {/* Timer & Basic Progress */}
                <div className="apple-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-apple-gray-50 rounded-xl flex items-center justify-center">
                            <Clock className={cn("h-5 w-5", timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-apple-blue")} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">Chronometer</p>
                            <p className={cn("text-xl font-bold tracking-tight", timeLeft < 60 ? "text-rose-500" : "text-apple-gray-900")}>
                                {fmt(timeLeft)}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 max-w-[200px] h-1.5 bg-apple-gray-50 rounded-full mx-8 overflow-hidden">
                        <motion.div
                            className={cn("h-full rounded-full transition-all duration-1000", timeLeft < 60 ? "bg-rose-500" : "bg-apple-blue")}
                            style={{ width: `${(timeLeft / (questions.length * 60)) * 100}%` }}
                        />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">Sequence Status</p>
                        <p className="text-sm font-bold text-apple-gray-900">{currentIndex + 1} of {questions.length}</p>
                    </div>
                </div>

                {/* Progress Strip */}
                <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300",
                            i === currentIndex ? "bg-apple-blue scale-y-125" : answers[questions[i].id] !== undefined ? "bg-emerald-400" : "bg-apple-gray-100")} />
                    ))}
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="apple-card p-12 md:p-16 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <span className="px-4 py-1.5 bg-apple-blue/10 text-apple-blue rounded-full text-[10px] font-bold uppercase tracking-widest border border-apple-blue/10">
                                    {currentQ.topic?.toUpperCase()}
                                </span>
                                <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                    currentQ.difficulty === "easy" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        currentQ.difficulty === "medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-rose-50 text-rose-600 border-rose-100")}>
                                    {currentQ.difficulty?.toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-apple-gray-900 leading-tight mb-12 tracking-tight">
                                {currentQ.question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQ.options.map((option, i) => (
                                    <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: i }))}
                                        className={cn("w-full p-6 text-left rounded-[24px] border-2 transition-all group relative overflow-hidden",
                                            answers[currentQ.id] === i
                                                ? "border-apple-blue bg-apple-blue/5 shadow-sm"
                                                : "border-apple-gray-50 bg-white hover:border-apple-gray-100 hover:bg-apple-gray-50/50")}>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center font-bold text-base transition-all",
                                                answers[currentQ.id] === i ? "bg-apple-blue text-white shadow-apple-blue/20" : "bg-apple-gray-50 text-apple-gray-400 group-hover:text-apple-gray-600")}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <span className={cn("text-base font-semibold", answers[currentQ.id] === i ? "text-apple-gray-900" : "text-apple-gray-600 group-hover:text-apple-gray-900")}>
                                                {option}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-12 relative z-10 pt-8 border-t border-apple-gray-50">
                            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(p => p - 1)}
                                className="h-14 w-14 bg-apple-gray-50 text-apple-gray-400 rounded-2xl flex items-center justify-center hover:bg-apple-gray-100 disabled:opacity-0 transition-all">
                                <ChevronLeft className="h-7 w-7" />
                            </button>

                            {currentIndex === questions.length - 1 ? (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
                                    className="px-12 py-4 bg-apple-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl text-sm flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-apple-blue" /> Terminate Session
                                </motion.button>
                            ) : (
                                <button onClick={() => setCurrentIndex(p => p + 1)}
                                    className="h-14 px-8 bg-apple-blue text-white rounded-2xl flex items-center gap-3 font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-apple-hover">
                                    Proceed <ChevronRight className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right Column: Navigator */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="order-3">
                <div className="apple-card p-8 sticky top-6 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-apple-gray-50 rounded-xl flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-apple-blue" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-apple-gray-900">Map</h3>
                    </div>

                    <div className="grid grid-cols-5 gap-2.5">
                        {questions.map((q, i) => (
                            <button key={i} onClick={() => setCurrentIndex(i)}
                                className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border-2",
                                    currentIndex === i ? "border-apple-blue bg-apple-blue text-white shadow-apple-blue/20"
                                        : answers[q.id] !== undefined ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                                            : "border-apple-gray-50 bg-white text-apple-gray-400 hover:border-apple-gray-100")}>
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 pt-6 mt-6 border-t border-apple-gray-50">
                        {[
                            { label: 'Completed', value: answeredCount, color: 'bg-emerald-400' },
                            { label: 'Pending', value: questions.length - answeredCount, color: 'bg-apple-gray-100' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", s.color)} />
                                    <span className="text-[10px] font-bold uppercase text-apple-gray-400 tracking-widest">{s.label}</span>
                                </div>
                                <span className="text-sm font-bold text-apple-gray-700">{s.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <div className="relative">
                            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-apple-gray-50" />
                                <motion.circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                                    strokeLinecap="round" strokeDasharray={251}
                                    strokeDashoffset={251 - (251 * answeredCount) / Math.max(questions.length, 1)}
                                    className="text-apple-blue"
                                    transition={{ duration: 0.5 }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-apple-gray-900">
                                    {questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
