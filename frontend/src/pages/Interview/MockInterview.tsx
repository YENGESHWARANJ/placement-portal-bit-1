import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Send, User, Bot, Mic, Volume2, StopCircle,
    CheckCircle, TrendingUp, RefreshCcw, X, Zap,
    Brain, Activity, Star, ChevronRight, Sparkles, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { saveAssessment } from '../../services/assessment.service';


interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    score?: number;
    feedback?: string;
}

export default function MockInterview() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I am your AI Interview Coach. I'm analyzing your profile to generate specialized questions. Ready?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [sessionScore, setSessionScore] = useState<number[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Processing document...", { icon: "📄" });
        const formData = new FormData();
        formData.append("file", file);
        setIsTyping(true);

        try {
            const res = await api.post<{ success: boolean, data: any }>("/resume/scan", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success && res.data.data) {
                await api.post("/students/profile", {
                    skills: res.data.data.resume?.skills || [],
                    resumeScore: res.data.data.ranking?.score || 0,
                });
                toast.success("Profile Updated! Extracting topics...", { id: toastId, icon: "🧠" });

                // Fetch new questions based on uploaded resume
                startInterview();
            } else {
                toast.error("Unrecognized format.", { id: toastId });
                setIsTyping(false);
            }
        } catch (error) {
            toast.error("Upload failed.", { id: toastId });
            setIsTyping(false);
        }
    };

    const startInterview = async () => {
        setIsTyping(true);
        try {
            const res = await api.get<{ questions: string[] }>('/interview/questions');
            setQuestions(res.data.questions);
            setCurrentIndex(0);
            const firstQ = res.data.questions[0];
            setMessages(prev => [...prev, { id: Date.now(), text: firstQ, sender: 'bot' }]);
            speak(firstQ);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Please upload your resume in the 'Resume' section first to unlock tailored questions.";
            setMessages(prev => [...prev, { id: Date.now(), text: msg, sender: 'bot' }]);
            toast.error("Profile not found");
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SR();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (e: any) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    if (e.results[i].isFinal) {
                        finalTranscript += e.results[i][0].transcript;
                    } else {
                        interimTranscript += e.results[i][0].transcript;
                    }
                }

                // Set input to whatever is finalized + the current interim guess
                setInput(prev => {
                    const baseText = prev.replace(/ $/, ''); // Clean up trailing space
                    if (finalTranscript) return baseText + ' ' + finalTranscript.trim() + ' ';
                    return baseText + ' ' + interimTranscript.trim();
                });
            };

            // Auto restart logic if user didn't explicitly pause
            recognitionRef.current.onend = () => {
                if (isListening) {
                    recognitionRef.current.start();
                }
            };
            recognitionRef.current.onerror = (e: any) => {
                if (e.error !== 'no-speech') {
                    setIsListening(false);
                    toast.error("Microphone disconnected.");
                }
            };
        }
    }, [isListening]);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.onstart = () => setIsSpeaking(true);
            u.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(u);
        }
    };

    const toggleListening = () => {
        if (isListening) { recognitionRef.current?.stop(); }
        else { recognitionRef.current?.start(); setIsListening(true); }
    };

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const answer = input;
        const userMsg: Message = { id: Date.now(), text: answer, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        if (currentIndex === -1) { startInterview(); return; }
        setIsTyping(true);
        try {
            const evalRes = await api.post<{ score: number; feedback: string }>('/interview/evaluate', {
                question: questions[currentIndex], answer
            });
            setSessionScore(prev => [...prev, evalRes.data.score]);
            setMessages(prev => prev.map(m => m.id === userMsg.id
                ? { ...m, score: evalRes.data.score, feedback: evalRes.data.feedback } : m));
            if (currentIndex < questions.length - 1) {
                const nextIdx = currentIndex + 1;
                setCurrentIndex(nextIdx);
                setTimeout(() => {
                    const nextQ = questions[nextIdx];
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: nextQ, sender: 'bot' }]);
                    setIsTyping(false);
                    speak(nextQ);
                }, 1000);
            } else {
                setTimeout(() => {
                    const endMsg = "Excellent. We have covered all key domains. I'm generating your performance report now.";
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: endMsg, sender: 'bot' }]);
                    setIsTyping(false);
                    speak(endMsg);
                    setTimeout(() => setShowReport(true), 2000);
                }, 1000);
            }
        } catch {
            toast.error("Evaluation failed");
            setIsTyping(false);
        }
    };

    const avgScore = sessionScore.length > 0
        ? Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length * 10)
        : 0;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto italic relative">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#080B1A] rounded-t-[40px] px-8 py-5 flex justify-between items-center border border-white/5 shadow-xl relative overflow-hidden"
            >
                {/* Voice Active Background Pulsing */}
                <AnimatePresence>
                    {(isSpeaking || isListening) && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-500/10 mix-blend-overlay pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                        {/* Audio Waveform Ring */}
                        {(isSpeaking || isListening) && (
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className={cn("absolute inset-0 rounded-[20px] blur-sm", isSpeaking ? "bg-blue-500" : "bg-rose-500")}
                            />
                        )}
                        <motion.div
                            animate={{ scale: isSpeaking ? [1, 1.05, 1] : 1 }}
                            transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.8 }}
                            className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/10"
                        >
                            {isListening ? <Mic className="h-6 w-6 text-white animate-pulse" /> : <Bot className="h-6 w-6 text-white" />}
                        </motion.div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black tracking-tight text-white italic">AI Coach</h2>
                            <span className="text-blue-400 text-[9px] font-black uppercase px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5">
                                <Activity className="h-3 w-3" /> Voice Model Active
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time Audio Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <AnimatePresence>
                        {isSpeaking && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full"
                            >
                                <Volume2 className="h-3 w-3 text-blue-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Synthesizing Voice</span>
                            </motion.div>
                        )}
                        {isListening && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full"
                            >
                                <Mic className="h-3 w-3 text-rose-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Listening to you ({input.length > 0 ? 'Hearing' : 'Silent'})</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {questions.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-[9px] font-black uppercase text-slate-400">
                                Q: {Math.min(currentIndex + 1, questions.length)} / {questions.length}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="h-10 w-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>

            {/* ── Chat Area ── */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-slate-50 border-x border-slate-100">
                <AnimatePresence>
                    {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn("flex items-start gap-4", msg.sender === 'user' ? 'flex-row-reverse' : '')}
                        >
                            <motion.div
                                whileHover={{ rotate: 12, scale: 1.1 }}
                                className={cn(
                                    "h-12 w-12 shrink-0 rounded-[20px] flex items-center justify-center shadow-lg",
                                    msg.sender === 'user'
                                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                        : "bg-white border border-slate-100 text-slate-700 shadow-sm"
                                )}
                            >
                                {msg.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </motion.div>

                            <div className="space-y-3 max-w-[72%]">
                                <div className={cn(
                                    "p-6 rounded-[28px] shadow-sm",
                                    msg.sender === 'user'
                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-[0_8px_20px_rgba(59,130,246,0.25)]"
                                        : "bg-white border border-slate-100 rounded-tl-none text-slate-700"
                                )}>
                                    <p className="text-sm leading-relaxed font-bold italic">{msg.text}</p>
                                </div>

                                {msg.feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-blue-50 border border-blue-100 p-5 rounded-[22px]"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-3 w-3 text-blue-500" />
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Live Feedback</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("h-3 w-3", i < Math.round((msg.score || 0) / 2) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                                ))}
                                                <span className="text-[9px] font-black text-blue-500 ml-1">{msg.score}/10</span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] font-bold text-blue-700 leading-relaxed italic">"{msg.feedback}"</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <Bot className="h-5 w-5 text-blue-500 animate-bounce" />
                        </div>
                        <div className="bg-white border border-slate-100 p-5 rounded-[28px] rounded-tl-none flex items-center gap-3 shadow-sm">
                            {[0, 0.15, 0.3].map((d, i) => (
                                <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                                    className="w-2 h-2 bg-blue-500 rounded-full" />
                            ))}
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Generating...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* ── Input Area ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-b-[40px] p-6 border border-slate-100 border-t-0 shadow-xl relative z-20"
            >
                {/* Live Speech Waveform overlay inside input area */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute -top-12 left-0 right-0 flex justify-center items-end h-10 gap-1 pointer-events-none"
                        >
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [Math.random() * 10 + 10, Math.random() * 30 + 20, Math.random() * 10 + 10] }}
                                    transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.3 }}
                                    className="w-1.5 bg-rose-500 rounded-full opacity-60"
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 items-center">
                    <div className="relative">
                        {isListening && (
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 bg-rose-500 rounded-[22px]"
                            />
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={toggleListening}
                            className={cn(
                                "relative z-10 h-14 w-14 rounded-[22px] flex items-center justify-center transition-all shadow-lg shrink-0",
                                isListening
                                    ? "bg-rose-500 text-white shadow-rose-200"
                                    : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100 hover:text-rose-500"
                            )}
                        >
                            {isListening ? <StopCircle className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </motion.button>
                    </div>

                    <div className="flex-1 relative">
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                        <input
                            type="text"
                            className={cn(
                                "w-full h-14 border-2 rounded-[22px] px-6 pr-[100px] focus:outline-none focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300",
                                isListening ? "bg-rose-50/50 border-rose-100 text-rose-900 focus:border-rose-400" : "bg-slate-50 border-slate-100 text-slate-700 focus:border-blue-400"
                            )}
                            placeholder={isListening ? "Listening... Speak your answer loudly." : "Type your answer or click the Mic..."}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isTyping}
                                className="h-9 w-9 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-300 transition-all disabled:opacity-40"
                                title="Upload Resume Context"
                            >
                                <Paperclip className="h-4 w-4" />
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className={cn(
                                    "h-9 w-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shadow-md",
                                    isListening ? "bg-rose-600 hover:bg-rose-500 shadow-rose-200 text-white" : "bg-blue-600 hover:bg-blue-500 shadow-blue-200 text-white"
                                )}
                            >
                                <Send className="h-4 w-4" />
                            </motion.button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setShowReport(true)}
                        className="h-14 px-7 bg-slate-900 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
                    >
                        <TrendingUp className="h-4 w-4" /> Review
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Report Modal ── */}
            <AnimatePresence>
                {showReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[110] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Report Header */}
                            <div className="p-12 bg-gradient-to-br from-[#080B1A] to-indigo-950 text-white relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 h-64 w-64 bg-blue-500/15 rounded-full blur-[80px]" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-14 w-14 rounded-[24px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <Brain className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black italic tracking-tight">Arena <span className="text-blue-400">Insight</span></h3>
                                            <p className="text-[10px] text-blue-300 font-black tracking-widest uppercase opacity-70">Session Performance Certificate</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Questions', value: questions.length || '--', color: 'text-blue-400' },
                                            { label: 'Avg Score', value: sessionScore.length > 0 ? `${avgScore}%` : '--', color: 'text-emerald-400' },
                                            { label: 'Rank', value: avgScore >= 80 ? 'Elite' : avgScore >= 60 ? 'Pro' : 'Dev', color: 'text-amber-400' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-[22px] p-5 text-center">
                                                <p className={cn("text-2xl font-black italic", s.color)}>{s.value}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 space-y-8">
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Technical Readiness</p>
                                        <h4 className="text-4xl font-black text-slate-900 italic">
                                            {avgScore >= 80 ? 'Elite' : avgScore >= 60 ? 'Proficient' : 'Developing'}
                                            <span className="text-blue-600 text-lg font-black not-italic ml-3">Node</span>
                                        </h4>
                                    </div>
                                    <div className="h-16 w-16 rounded-[24px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                                    </div>
                                </div>

                                {sessionScore.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score Progression</p>
                                        <div className="flex items-end gap-2 h-16">
                                            {sessionScore.map((s, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${s * 10}%` }}
                                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                                    className={cn("flex-1 rounded-t-xl", s >= 8 ? "bg-emerald-400" : s >= 6 ? "bg-blue-400" : "bg-amber-400")}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-5">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={async () => {
                                            try {
                                                await saveAssessment({
                                                    type: 'Interview',
                                                    score: Math.round((avgScore / 100) * (questions.length || 1)),
                                                    totalQuestions: questions.length || 1,
                                                    timeTaken: 0, // Could be tracked
                                                    results: messages.filter(m => m.sender === 'user').map((m, i) => ({
                                                        question: questions[i] || "General Question",
                                                        answer: m.text,
                                                        score: m.score,
                                                        feedback: m.feedback
                                                    })),
                                                    topicAnalysis: [{ topic: 'Mock Interview', score: avgScore, total: 100 }]
                                                });
                                                toast.success("Progress Synchronized!");
                                                navigate('/dashboard');
                                            } catch (err) {
                                                toast.error("Failed to sync progress");
                                                navigate('/dashboard');
                                            }
                                        }}

                                        className="py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                                    >
                                        <Zap className="h-4 w-4" /> Seal Progress
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowReport(false)}
                                        className="py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                                    >
                                        <RefreshCcw className="h-4 w-4" /> Continue Session
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
