import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Code2,
    Play,
    Send,
    Timer,
    Bot,
    Terminal,
    CheckCircle,
    ChevronRight,
    Search,
    Layout,
    Maximize2
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function CodingAssessment() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState<any>(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await api.get('/assessments/questions?type=Coding');
                const q = (res.data as any).questions[0];
                setQuestion(q);
                setCode(q.template);
            } catch (err) {
                toast.error("Cloud IDE failed to initialize");
            }
        };
        fetchQuestion();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isFinished]);

    const runCode = () => {
        setIsRunning(true);
        setTimeout(() => {
            setOutput("Compilation Successful!\nRunning Test Cases...\n[Passed] Test Case 1\n[Passed] Test Case 2\n[Failed] Test Case 3: Expected [0,2], Got [0,1]\n\nEfficiency: O(N) | RAM: 12MB");
            setIsRunning(false);
            toast.success("Build Complete");
        }, 1500);
    };

    const submitCode = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/assessments/save', {
                type: "Coding",
                score: 80, // Simulated score
                totalQuestions: 1,
                timeTaken: 1200,
                results: [{ qId: question.id, status: "Passed" }],
                topicAnalysis: [{ topic: question.topic, score: 80, total: 100 }]
            });
            setIsFinished(true);
            toast.success("Logic Sync Complete");
        } catch (err) {
            toast.error("Cloud sync failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!question) return <div className="p-20 text-center animate-pulse text-slate-500 font-black tracking-widest uppercase italic">Booting Cloud IDE...</div>;

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto py-32 px-6 italic text-center space-y-12">
                <div className="h-24 w-24 bg-emerald-500 rounded-[35px] flex items-center justify-center mx-auto shadow-2xl animate-bounce-slow">
                    <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Code <span className="text-emerald-500">Deployed</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Submission ID: SH-29BK0-92</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-12 py-5 bg-slate-900 text-white rounded-[30px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all active:scale-95 text-xs"
                >
                    Return to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-300 italic overflow-hidden">
            {/* IDE Header */}
            <div className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Code2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-tight text-white italic uppercase">Logic <span className="text-blue-500">Arena</span></h2>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compiler v2.0.4 - Node.js 18</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                        <Timer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-black text-white font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={submitCode} disabled={isSubmitting} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-900/20">
                        {isSubmitting ? "Syncing..." : "Submit Code"}
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Description Pane */}
                <div className="w-1/3 border-r border-white/5 overflow-y-auto p-10 bg-slate-900/50 space-y-10 custom-scrollbar">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">{question.difficulty}</span>
                            <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">{question.topic}</span>
                        </div>
                        <h1 className="text-3xl font-black text-white italic">{question.title}</h1>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-sm leading-relaxed text-slate-400 font-bold italic">
                            {question.description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Constraints</h4>
                        <div className="space-y-3">
                            {["Time Limit: 2.0s", "Memory: 256MB", "1 <= nums.length <= 104"].map((c, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <ChevronRight className="h-3 w-3 text-blue-600" />
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-[35px] relative overflow-hidden group">
                        <Bot className="absolute -right-4 -bottom-4 h-24 w-24 text-blue-600/10 rotate-12" />
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3 italic">AI Logic Hint</h4>
                        <p className="text-[11px] font-bold text-blue-200/70 leading-relaxed italic">Think about using a Map to store previously seen numbers and their indices for O(N) efficiency.</p>
                    </div>
                </div>

                {/* Editor Pane */}
                <div className="flex-1 flex flex-col relative">
                    <div className="h-10 bg-slate-900 border-b border-white/5 flex items-center px-6 justify-between">
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic border-b-2 border-blue-500 pb-1 h-full flex items-center">solution.js</span>
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">test.js</span>
                        </div>
                        <button className="text-slate-600 hover:text-white transition-all"><Maximize2 className="h-4 w-4" /></button>
                    </div>

                    <div className="flex-1 p-6 relative">
                        <textarea
                            className="w-full h-full bg-transparent text-slate-100 font-mono text-sm border-none focus:ring-0 resize-none leading-relaxed tracking-wider placeholder-slate-800"
                            spellCheck={false}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <div className="absolute top-0 right-0 w-12 h-full bg-white/[0.02] border-l border-white/5 pointer-events-none" />
                    </div>

                    {/* Console / Output */}
                    <div className="h-64 bg-slate-950 border-t-4 border-slate-900 flex flex-col">
                        <div className="h-10 bg-slate-900 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2 italic">
                                    <Terminal className="h-3 w-3 text-blue-500" /> Output Console
                                </span>
                            </div>
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                                {isRunning ? <RefreshCcw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} Run Build
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <pre className="text-[11px] font-mono text-slate-400 leading-relaxed font-bold">
                                {isRunning ? "Synchronizing with Cloud VM...\nInitializing Test Environment..." : output || "Execute build to see validation results..."}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RefreshCcw = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
);
