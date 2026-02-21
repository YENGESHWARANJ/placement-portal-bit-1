import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, ShieldAlert, ChevronRight, ChevronLeft,
    CheckCircle2, Camera, Trophy, Activity, Zap,
    Eye, AlertTriangle, BarChart3, RefreshCw, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface Question {
    id: number; question: string; options: string[]; correct: number; topic: string;
}

export default function AptitudeAssessment() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(600);
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [tabSwitches, setTabSwitches] = useState(0);
    const [scanLine, setScanLine] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        api.get('/assessments/questions?type=Aptitude')
            .then(res => setQuestions((res.data as any).questions || []))
            .catch(() => toast.error("Failed to load assessment"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (isStarted && !isFinished && timeLeft > 0) {
            const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
            return () => clearInterval(t);
        } else if (timeLeft === 0 && !isFinished) handleSubmit();
    }, [isStarted, isFinished, timeLeft]);

    useEffect(() => {
        if (!isStarted) return;
        const i = setInterval(() => setScanLine(p => (p + 1) % 100), 30);
        return () => clearInterval(i);
    }, [isStarted]);

    useEffect(() => {
        const fn = () => {
            if (document.hidden && isStarted && !isFinished) {
                setTabSwitches(prev => {
                    const n = prev + 1;
                    toast.error(`⚠️ Tab switch (${n}/3)`);
                    if (n >= 3) handleSubmit();
                    return n;
                });
            }
        };
        document.addEventListener('visibilitychange', fn);
        return () => document.removeEventListener('visibilitychange', fn);
    }, [isStarted, isFinished]);

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = s;
            setIsStarted(true);
        } catch { toast.error("Camera access required"); }
    };

    const handleSubmit = async () => {
        setIsFinished(true);
        let correct = 0;
        const results = questions.map(q => {
            const ok = answers[q.id] === q.correct;
            if (ok) correct++;
            return { qId: q.id, correct: ok, selected: answers[q.id] };
        });
        setScore(correct);
        try {
            await api.post('/assessments/save', {
                type: "Aptitude", score: correct, totalQuestions: questions.length,
                results, timeTaken: 600 - timeLeft
            });
            toast.success("Assessment Completed!");
        } catch { toast.error("Failed to sync results"); }
    };

    const fmt = (s: number) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
    const timerColor = timeLeft > 300 ? 'text-white' : timeLeft > 120 ? 'text-amber-400' : 'text-rose-400';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <RefreshCw className="h-10 w-10 text-blue-500" />
            </motion.div>
        </div>
    );

    /* Pre-start */
    if (!isStarted && !isFinished) return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-20 px-6 space-y-14 italic">
            <div className="text-center space-y-6">
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }}
                    className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[36px] flex items-center justify-center mx-auto shadow-[0_20px_60px_rgba(59,130,246,0.4)] border border-white/20">
                    <ShieldAlert className="h-12 w-12 text-white" />
                </motion.div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
                    Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Proctored</span> Logic Test
                </h1>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Standardized Assessment Protocol v4.0</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div whileHover={{ y: -4 }} className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[22px] bg-blue-50 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Test Integrity Rules</h3>
                    </div>
                    <div className="space-y-5">
                        {[
                            { text: "Face recognition proctoring active", color: "bg-blue-500" },
                            { text: "Tab switching limited to 2 warnings", color: "bg-amber-500" },
                            { text: "Fullscreen mode recommended", color: "bg-emerald-500" },
                            { text: "Timer begins upon entry", color: "bg-rose-500" },
                        ].map((r, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                                <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", r.color)} />
                                <span className="text-sm font-bold text-slate-600">{r.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                <motion.div whileHover={{ y: -4 }}
                    className="bg-[#080B1A] p-12 rounded-[50px] text-white space-y-8 flex flex-col justify-between relative overflow-hidden border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-blue-600/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-3">Structure</p>
                        <h4 className="text-3xl font-black mb-8 tracking-tight">{questions.length} Questions | 10 Minutes</h4>
                        <div className="flex gap-3">
                            {['Analytics', 'IQ+', 'Proctored'].map(t => (
                                <span key={t} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase border border-white/10">{t}</span>
                            ))}
                        </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startCamera}
                        className="relative z-10 w-full py-6 bg-blue-600 text-white rounded-[30px] font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all flex items-center justify-center gap-3 text-sm">
                        <Camera className="h-5 w-5" /> Initialize Proctor
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );

    /* Results */
    if (isFinished) {
        const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
        const circ = 2 * Math.PI * 70;
        const grade = pct >= 80 ? { label: 'ELITE', color: 'text-emerald-400', bg: 'from-emerald-500 to-teal-600' }
            : pct >= 60 ? { label: 'PROFICIENT', color: 'text-blue-400', bg: 'from-blue-500 to-indigo-600' }
                : { label: 'DEVELOPING', color: 'text-amber-400', bg: 'from-amber-500 to-orange-600' };
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto py-20 px-6 italic">
                <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                    <div className="p-16 bg-[#080B1A] text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className={cn("h-28 w-28 bg-gradient-to-br rounded-[45px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10", grade.bg)}>
                            <Trophy className="h-14 w-14 text-white" />
                        </motion.div>
                        <h2 className="text-5xl font-black tracking-tight mb-3 uppercase italic">
                            Protocol <span className="text-blue-400">Completed</span>
                        </h2>
                        <p className={cn("text-[11px] font-black uppercase tracking-[0.4em]", grade.color)}>Rank: {grade.label} Node</p>
                    </div>
                    <div className="p-16 space-y-14">
                        <div className="flex items-center justify-center gap-16">
                            <div className="relative">
                                <svg className="h-48 w-48 -rotate-90" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                                    <motion.circle cx="80" cy="80" r="70" stroke="#3b82f6" strokeWidth="10" fill="transparent"
                                        strokeLinecap="round" strokeDasharray={circ}
                                        initial={{ strokeDashoffset: circ }}
                                        animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
                                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900 italic">{pct}%</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Score</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Correct', value: `${score}/${questions.length}`, color: 'text-emerald-600' },
                                    { label: 'Time', value: `${Math.floor((600 - timeLeft) / 60)}m ${(600 - timeLeft) % 60}s`, color: 'text-blue-600' },
                                    { label: 'Tab Switches', value: `${tabSwitches}`, color: tabSwitches > 0 ? 'text-rose-500' : 'text-slate-400' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                                        <p className={cn("text-2xl font-black italic", s.color)}>{s.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')}
                                className="py-6 bg-[#080B1A] text-white rounded-[30px] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                                <Home className="h-4 w-4" /> Consolidate Data
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => window.location.reload()}
                                className="py-6 bg-white border-2 border-slate-100 text-slate-900 rounded-[30px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3">
                                <RefreshCw className="h-4 w-4" /> Retry Sequence
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* Active Test */
    const currentQ = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 italic pb-20 min-h-screen">
            {/* Left: Proctoring */}
            <div className="space-y-8 order-2 lg:order-1">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-9 w-9 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                            <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Biometric Monitor</p>
                            <p className="text-[10px] font-black text-rose-500 uppercase italic">Active Watch</p>
                        </div>
                    </div>
                    <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-xl border border-slate-800">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-70" />
                        <div className="absolute left-0 right-0 h-0.5 bg-blue-500/40 pointer-events-none" style={{ top: `${scanLine}%` }} />
                        <div className="absolute top-3 right-3"><div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /></div>
                        <div className="absolute inset-0 border-2 border-blue-500/20 rounded-2xl pointer-events-none" />
                        <div className="absolute bottom-3 left-3"><span className="text-[8px] font-black text-white/40 uppercase tracking-widest">REC // Secure Feed</span></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Face Locked</span>
                        </div>
                        <div className={cn("flex items-center gap-2", tabSwitches > 0 ? "text-amber-500" : "text-slate-300")}>
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">{tabSwitches}/3</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="bg-[#080B1A] p-8 rounded-[40px] text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temporal Buffer</p>
                    </div>
                    <div className="text-center py-6">
                        <span className={cn("text-6xl font-black tracking-widest", timerColor)}>{fmt(timeLeft)}</span>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-4">Auto-Expiry Protocol</p>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                        <motion.div
                            className={cn("h-full rounded-full", timeLeft > 300 ? "bg-blue-500" : timeLeft > 120 ? "bg-amber-500" : "bg-rose-500")}
                            style={{ width: `${(timeLeft / 600) * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Middle: Question */}
            <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="flex gap-1.5 mb-6">
                    {questions.map((_, i) => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300",
                            i === currentIndex ? "bg-blue-600" : answers[questions[i].id] !== undefined ? "bg-emerald-500" : "bg-slate-100")} />
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        className="bg-white p-10 md:p-14 rounded-[60px] border border-slate-100 shadow-xl min-h-[580px] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-16 right-16 h-56 w-56 bg-blue-50 rounded-full blur-[80px] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-12">
                                <span className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{currentQ.topic}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{currentIndex + 1} / {questions.length}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-12 italic">{currentQ.question}</h3>
                            <div className="space-y-4">
                                {currentQ.options.map((option, i) => (
                                    <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: i }))}
                                        className={cn("w-full p-6 text-left rounded-[28px] border-2 transition-all duration-200 relative overflow-hidden",
                                            answers[currentQ.id] === i
                                                ? "border-blue-500 bg-blue-50 shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
                                                : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md")}>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all shrink-0",
                                                answers[currentQ.id] === i ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-400 shadow-sm")}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <span className={cn("text-base font-bold", answers[currentQ.id] === i ? "text-blue-900" : "text-slate-600")}>{option}</span>
                                        </div>
                                        {answers[currentQ.id] === i && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6 top-1/2 -translate-y-1/2">
                                                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-12 relative z-10">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                disabled={currentIndex === 0} onClick={() => setCurrentIndex(p => p - 1)}
                                className="h-16 w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-0 transition-all border border-slate-100">
                                <ChevronLeft className="h-8 w-8" />
                            </motion.button>
                            {currentIndex === questions.length - 1 ? (
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit}
                                    className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(59,130,246,0.3)] text-sm flex items-center gap-3">
                                    <Zap className="h-5 w-5" /> Submit Sequence
                                </motion.button>
                            ) : (
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentIndex(p => p + 1)}
                                    className="h-16 w-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all">
                                    <ChevronRight className="h-8 w-8" />
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right: Navigator */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="order-3">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8 sticky top-6">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Navigator</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-2.5">
                        {questions.map((q, i) => (
                            <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                onClick={() => setCurrentIndex(i)}
                                className={cn("h-11 w-11 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2",
                                    currentIndex === i ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : answers[q.id] !== undefined ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200")}>
                                {i + 1}
                            </motion.button>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-slate-50 space-y-4">
                        {[
                            { label: 'Answered', value: answeredCount, color: 'bg-emerald-500' },
                            { label: 'Current', value: currentIndex + 1, color: 'bg-blue-600' },
                            { label: 'Remaining', value: questions.length - answeredCount, color: 'bg-slate-200' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className={cn("h-2.5 w-2.5 rounded-full", s.color)} />
                                    <span className="text-[10px] font-black uppercase text-slate-400">{s.label}</span>
                                </div>
                                <span className="text-sm font-black text-slate-700">{s.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center pt-2">
                        <div className="relative">
                            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                                <motion.circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="6" fill="transparent"
                                    strokeLinecap="round" strokeDasharray={201}
                                    strokeDashoffset={201 - (201 * answeredCount) / Math.max(questions.length, 1)}
                                    transition={{ duration: 0.5 }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-black text-slate-700 italic">
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
