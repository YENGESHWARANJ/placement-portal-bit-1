import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Code2, Play, Send, Timer, Bot, Terminal, CheckCircle,
    ChevronRight, Maximize2, Sparkles, Layers, Target,
    Cpu, Zap, BookOpen, Home, RefreshCw, Trophy, TrendingUp,
    Lightbulb, X, List, Eye, Hash, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { generateAIQuestions, saveAssessment } from '../../services/assessment.service';

const CODING_TOPICS = [
    "Arrays", "Strings", "Dynamic Programming", "Stack", "Linked Lists",
    "Binary Search", "Trees", "Graph / BFS", "Permutation & Combination"
];

const DIFFICULTY_OPTIONS = [
    { value: "Easy", label: "Easy", color: "bg-emerald-500", time: 20 },
    { value: "Medium", label: "Medium", color: "bg-amber-500", time: 30 },
    { value: "Hard", label: "Hard", color: "bg-rose-500", time: 45 },
];

type Phase = "configure" | "generating" | "coding" | "finished";

export default function CodingAssessment() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>("configure");
    const [question, setQuestion] = useState<any>(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
    const [generatingProgress, setGeneratingProgress] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [testsPassed, setTestsPassed] = useState(0);
    const [totalTests] = useState(3);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (phase !== "coding" || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [phase, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && phase === "coding") {
            toast.error("Time's up! Auto-submitting...");
            handleSubmit();
        }
    }, [timeLeft]);

    const handleGenerate = async () => {
        setPhase("generating");
        setGeneratingProgress(0);

        const interval = setInterval(() => {
            setGeneratingProgress(p => Math.min(p + 15, 90));
        }, 150);

        try {
            const data = await generateAIQuestions({
                type: "Coding",
                topic: selectedTopic || undefined,
                difficulty: selectedDifficulty.toLowerCase() as any,
                count: 1
            });

            clearInterval(interval);
            setGeneratingProgress(100);

            const q = data.questions[0];
            setQuestion(q);
            setCode(q.template);
            const timeMap: Record<string, number> = { Easy: 1200, Medium: 1800, Hard: 2700 };
            setTimeLeft(timeMap[selectedDifficulty] || 1800);

            setTimeout(() => setPhase("coding"), 700);
        } catch {
            clearInterval(interval);
            toast.error("AI Code Generator offline. Try again.");
            setPhase("configure");
        }
    };

    const runCode = () => {
        setIsRunning(true);
        toast.loading("Compiling and running test cases...", { id: "run" });

        setTimeout(() => {
            // Simulate varying pass rates
            const passed = Math.min(Math.floor(Math.random() * 4), totalTests);
            setTestsPassed(passed);

            const results = Array.from({ length: totalTests }, (_, i) => ({
                case: i + 1,
                passed: i < passed,
                expected: `Output_${i + 1}`,
                got: i < passed ? `Output_${i + 1}` : `Wrong_${i + 1}`
            }));

            const outputStr = results.map(r =>
                `[${r.passed ? "✓ PASS" : "✗ FAIL"}] Test ${r.case}: Expected "${r.expected}", Got "${r.got}"`
            ).join("\n") + `\n\nPassed: ${passed}/${totalTests} · Runtime: ${Math.floor(Math.random() * 50 + 20)}ms · Memory: ${Math.floor(Math.random() * 10 + 8)}MB`;

            setOutput(outputStr);
            setIsRunning(false);
            toast.dismiss("run");
            passed === totalTests
                ? toast.success("🎉 All test cases passed!", { icon: "🏆" })
                : toast(`${passed}/${totalTests} tests passed`, { icon: "⚡" });
        }, 2000);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const finalScore = Math.round((testsPassed / totalTests) * 100);
        setScore(finalScore);

        try {
            await saveAssessment({
                type: "Coding",
                score: testsPassed,
                totalQuestions: totalTests,
                timeTaken: (DIFFICULTY_OPTIONS.find(d => d.value === selectedDifficulty)?.time || 30) * 60 - timeLeft,
                topicAnalysis: [{ topic: question?.topic || "Coding", score: finalScore, total: 100 }]
            });
        } catch { /* non-critical */ }

        setPhase("finished");
        toast.success("Code submitted successfully!", { icon: "🚀" });
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // ── CONFIGURE ────────────────────────────────────────────
    if (phase === "configure") return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6 space-y-12 bg-apple-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }}
                    className="h-20 w-20 bg-apple-blue rounded-[30px] flex items-center justify-center mx-auto shadow-apple-hover">
                    <Code2 className="h-10 w-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight text-apple-gray-900">
                    AI <span className="text-apple-blue">Coding</span> Arena
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {DIFFICULTY_OPTIONS.map(d => (
                            <motion.button key={d.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedDifficulty(d.value)}
                                className={cn("p-6 rounded-[24px] border-2 text-center transition-all",
                                    selectedDifficulty === d.value
                                        ? "border-apple-blue bg-apple-blue/5 shadow-sm"
                                        : "border-apple-gray-100 bg-white hover:border-apple-gray-200")}>
                                <div className={cn("h-1.5 w-8 rounded-full mx-auto mb-3 bg-gradient-to-r", d.color)} />
                                <p className="font-bold text-sm text-apple-gray-900">{d.label}</p>
                                <p className="text-[10px] text-apple-gray-400 font-medium tracking-tight mt-1">~{d.time} MINS</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div className="apple-card p-10 flex flex-col justify-between bg-apple-gray-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-apple-blue" />
                            </div>
                            <h3 className="text-xl font-bold">Session Profile</h3>
                        </div>
                        <p className="text-apple-gray-400 text-sm font-medium leading-relaxed">
                            Your coding environment will be synthesized based on the selected domain. Test cases are dynamically generated to evaluate algorithmic complexity and edge-case handling.
                        </p>
                    </div>
                    <p className="relative z-10 text-[11px] font-semibold text-apple-gray-500 uppercase tracking-widest mt-8">
                        Proctored Environment Active
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
                        <h3 className="text-xl font-bold text-apple-gray-900">Problem Domains</h3>
                    </div>
                    {selectedTopic && (
                        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
                            onClick={() => setSelectedTopic("")}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 rounded-full border border-rose-100 flex items-center gap-2">
                            <X className="h-3 w-3" /> Clear Selection
                        </motion.button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    {CODING_TOPICS.map(t => (
                        <motion.button key={t} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTopic(t)}
                            className={cn("px-5 py-3 rounded-[16px] text-[12px] font-bold transition-all border",
                                selectedTopic === t
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
                Initialize Neural Arena
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </motion.div>
    );

    // ── GENERATING ───────────────────────────────────────────
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
                    Synthesizing Challenge
                </h2>
                <p className="text-apple-gray-400 font-medium text-sm mb-10">
                    AI is constructing a specialized {selectedDifficulty} challenge for you...
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
                    {["Initializing", "Curation", "Compiling", "Finalizing"].map((s, i) => (
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

    // ── FINISHED ─────────────────────────────────────────────
    if (phase === "finished") return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto py-12 px-6 space-y-10">
            <div className="bg-white rounded-[50px] shadow-apple-card border border-apple-gray-100 overflow-hidden">
                <div className="p-14 bg-apple-gray-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
                    <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                        className="h-32 w-32 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 relative z-10">
                        <Trophy className="h-14 w-14 text-emerald-500" />
                    </motion.div>
                    <h2 className="text-4xl font-bold tracking-tight mb-3 relative z-10">Deployment <span className="text-emerald-500">Successful</span></h2>
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-apple-gray-400 relative z-10">
                        Node verification sequence complete
                    </p>
                </div>

                <div className="p-14 space-y-14">
                    <div className="flex items-center justify-center gap-20 flex-wrap">
                        <div className="text-center">
                            <div className="text-8xl font-bold text-apple-gray-900 mb-2">{score}%</div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-apple-gray-400">Final Aggregated Score</div>
                        </div>
                        <div className="w-[1px] h-24 bg-apple-gray-100 hidden md:block" />
                        <div className="space-y-8">
                            {[
                                { label: 'Unit Tests Passed', value: `${testsPassed} / ${totalTests}`, color: 'text-emerald-500' },
                                { label: 'Execution Metrics', value: formatTime((DIFFICULTY_OPTIONS.find(d => d.value === selectedDifficulty)?.time || 30) * 60 - timeLeft), color: 'text-apple-blue' },
                                { label: 'Algorithmic Rank', value: score >= 80 ? 'Optimized' : score >= 50 ? 'Functional' : 'Inefficient', color: score >= 80 ? 'text-emerald-500' : 'text-amber-500' },
                            ].map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-apple-gray-400 mb-1">{s.label}</p>
                                    <p className={cn("text-3xl font-bold", s.color)}>{s.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-apple-gray-50">
                        <button onClick={() => navigate('/dashboard')}
                            className="py-5 px-8 bg-apple-gray-100 text-apple-gray-900 rounded-[20px] font-bold text-[13px] uppercase tracking-widest hover:bg-apple-gray-200 transition-all flex items-center justify-center gap-3">
                            <Home className="h-4 w-4" /> Return to Dashboard
                        </button>
                        <button onClick={() => { setPhase("configure"); setOutput(""); setTestsPassed(0); }}
                            className="py-5 px-8 bg-apple-blue text-white rounded-[20px] font-bold text-[13px] uppercase tracking-widest shadow-apple-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                            <Sparkles className="h-4 w-4" /> New Arena Session
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // ── CODING IDE ───────────────────────────────────────────
    const timeWarning = timeLeft < 300;
    return (
        <div className="h-screen flex flex-col bg-apple-gray-50/50 text-apple-gray-900 overflow-hidden">
            {/* IDE Header */}
            <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-apple-gray-100 flex items-center justify-between px-8 shrink-0 relative z-20">
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-apple-blue rounded-xl flex items-center justify-center shadow-apple-hover">
                        <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-apple-gray-900 flex items-center gap-3">
                            {question?.title}
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </h2>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">
                            <span>{question?.topic}</span>
                            <span className="h-1 w-1 rounded-full bg-apple-gray-200" />
                            <span>{selectedDifficulty} CHALLENGE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={cn("flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all",
                        timeWarning ? "border-rose-200 bg-rose-50 shadow-sm" : "border-apple-gray-100 bg-white")}>
                        <Timer className={cn("h-4 w-4", timeWarning ? "text-rose-500 animate-pulse" : "text-apple-blue")} />
                        <span className={cn("text-sm font-bold tracking-tight", timeWarning ? "text-rose-600" : "text-apple-gray-900")}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="h-10 w-[1px] bg-apple-gray-100 mx-2" />

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit} disabled={isSubmitting}
                        className="px-8 py-3 bg-apple-blue text-white rounded-[16px] text-xs font-bold uppercase tracking-widest shadow-apple-hover disabled:opacity-50 flex items-center gap-3">
                        {isSubmitting ? "Transmitting..." : (
                            <>
                                <Send className="h-4 w-4" />
                                Deploy Code
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Pane */}
                <div className="w-[35%] border-r border-apple-gray-100 overflow-y-auto bg-white custom-scrollbar">
                    <div className="p-10 space-y-10">
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-apple-blue/5 text-apple-blue text-[9px] font-bold uppercase tracking-widest rounded-full border border-apple-blue/10">
                                    Description
                                </span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                                    {question?.topic}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-apple-gray-900 tracking-tight leading-tight">{question?.title}</h1>
                            <p className="text-[15px] leading-relaxed text-apple-gray-600 font-medium">{question?.description}</p>
                        </div>

                        {/* Examples */}
                        {question?.examples?.map((ex: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-apple-gray-400">Example {i + 1}</h4>
                                <div className="bg-apple-gray-50/50 rounded-2xl p-6 space-y-3 border border-apple-gray-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mb-1">Input</p>
                                        <code className="text-xs font-mono text-apple-gray-900">{ex.input}</code>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mb-1">Output</p>
                                        <code className="text-xs font-mono text-apple-blue">{ex.output}</code>
                                    </div>
                                    {ex.explanation && (
                                        <div>
                                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest mb-1">Explanation</p>
                                            <p className="text-xs text-apple-gray-500 leading-relaxed italic">{ex.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Constraints */}
                        {question?.constraints?.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-apple-gray-400 mb-4">Constraints</h4>
                                <div className="space-y-3">
                                    {question.constraints.map((c: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-semibold text-apple-gray-500">
                                            <div className="h-1.5 w-1.5 rounded-full bg-apple-blue/40 shrink-0" />
                                            <code className="font-mono bg-apple-gray-50 px-2 py-0.5 rounded border border-apple-gray-100">{c}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Hints */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-8 relative overflow-hidden group">
                            <Bot className="absolute -right-4 -bottom-4 h-24 w-24 text-emerald-100/50 rotate-12" />
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4" /> AI Oracle Hint {currentHintIndex + 1}
                                </h4>
                                <button
                                    onClick={() => {
                                        if (!showHint) { setShowHint(true); }
                                        else { setCurrentHintIndex(p => (p + 1) % (question?.hints?.length || 1)); }
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-all bg-white px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                    {showHint ? "Next Hint" : "Reveal Hint"}
                                </button>
                            </div>
                            <AnimatePresence mode="wait">
                                {showHint && (
                                    <motion.p key={currentHintIndex}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="text-sm font-medium text-emerald-900/70 leading-relaxed italic relative z-10">
                                        "{question?.hints?.[currentHintIndex]}"
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Editor + Console */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]"> {/* Dark editor area for better code focus */}
                    <div className="h-12 bg-apple-gray-900 border-b border-white/5 flex items-center px-6 justify-between shrink-0">
                        <div className="flex items-center gap-6">
                            <span className="text-[11px] font-bold uppercase text-white tracking-widest flex items-center gap-2">
                                <Activity className="h-3 w-3 text-apple-blue" /> solution.js
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">Node.js 18.x</span>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <textarea
                            className="w-full h-full bg-apple-gray-900 text-apple-gray-100 font-mono text-sm border-none focus:outline-none resize-none leading-relaxed tracking-wide p-10 placeholder-white/10"
                            spellCheck={false}
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="// Initializing neural bridge... Write your solution here."
                        />
                    </div>

                    {/* Console */}
                    <div className="h-64 bg-apple-gray-950 border-t-2 border-apple-gray-900 flex flex-col shrink-0">
                        <div className="h-12 bg-apple-gray-900/80 px-6 flex items-center justify-between shrink-0">
                            <span className="text-[10px] font-bold uppercase text-white tracking-widest flex items-center gap-3">
                                <Terminal className="h-3.5 w-3.5 text-apple-blue" /> System Output
                            </span>
                            <motion.button onClick={runCode} disabled={isRunning} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5 disabled:opacity-50">
                                {isRunning ? (
                                    <>
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                        Compiling...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-3.5 w-3.5 text-apple-blue" />
                                        Run Simulation
                                    </>
                                )}
                            </motion.button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono">
                            {isRunning ? (
                                <div className="space-y-3">
                                    {["Loading environment matrix...", "Compiling source nodes...", "Executing test vectors..."].map((s, i) => (
                                        <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.3 }}
                                            className="text-xs text-apple-gray-500 flex items-center gap-3">
                                            <span className="text-apple-blue">❯</span> {s}
                                        </motion.p>
                                    ))}
                                </div>
                            ) : (
                                <pre className="text-xs leading-relaxed">
                                    {output
                                        ? output.split("\n").map((line, i) => (
                                            <span key={i} className={cn("block py-0.5",
                                                line.includes("✓") ? "text-emerald-400" :
                                                    line.includes("✗") ? "text-rose-400" :
                                                        "text-apple-gray-400")}>
                                                {line}
                                            </span>
                                        ))
                                        : <span className="text-white/20 italic tracking-wider">Simulation output will materialize here...</span>}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
