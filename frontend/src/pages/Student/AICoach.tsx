import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, Send, Sparkles, Brain, Target, ArrowRight,
    Zap, Calendar, BookOpen, Trophy, MessageSquare,
    Mic, StopCircle, Play, RefreshCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';

export default function AICoach() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: `Greetings, ${user?.name || 'Candidate'}. I am your dedicated Placement Coach. My primary directive is to optimize your career trajectory. Shall we analyze your resume, simulate an interview, or discuss strategic roadmaps today?` }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = message;
        setMessage("");
        setChat(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await api.post<{ response: string }>('/ai/chat', {
                query: userMsg,
                context: { role: 'student', objective: 'Placement Success' }
            });
            setChat(prev => [...prev, { role: 'ai', text: res.data.response }]);
        } catch (err) {
            setChat(prev => [...prev, { role: 'ai', text: "Connectivity interrupted. My neural link to the mainframe is currently unstable." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            icon: Mic,
            label: "Mock Interview",
            desc: "Simulate a technical round",
            link: "/interview",
            color: "bg-blue-600 text-white"
        },
        {
            icon: Target,
            label: "Resume Scan",
            desc: "Analyze ATS compatibility",
            link: "/resume-upload",
            color: "bg-purple-600 text-white"
        },
        {
            icon: BookOpen,
            label: "Career Roadmap",
            desc: "View your personalized path",
            link: "/roadmap",
            color: "bg-emerald-600 text-white"
        }
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Left Panel: Chat Interface */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 relative">

                {/* Header */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">AI Coach Terminal</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setChat([])} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                    {chat.map((msg, i) => (
                        <div key={i} className={cn("flex w-full animate-in zoom-in duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[80%] p-6 rounded-[30px] shadow-sm text-sm font-bold leading-relaxed relative overflow-hidden group",
                                msg.role === 'user'
                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                            )}>
                                {/* Decorative elements */}
                                {msg.role === 'ai' && <Sparkles className="h-4 w-4 text-indigo-400 absolute top-4 right-4 opacity-50" />}
                                <p className="italic relative z-10">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[30px] rounded-tl-none border border-slate-100 dark:border-slate-700 flex gap-2 items-center shadow-sm">
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Ask for advice, interview tips, or resume feedback..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-6 pr-16 py-5 text-sm font-bold text-slate-700 dark:text-white uppercase tracking-wide focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner group-hover:border-slate-200"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Panel: Context & Actions */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6">

                {/* Daily Wisdom Card */}
                <div className="bg-slate-900 dark:bg-black p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain className="h-6 w-6 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Daily Insight</span>
                        </div>
                        <h3 className="text-2xl font-black italic leading-tight mb-4">"Success is not final, failure is not fatal: it is the courage to continue that counts."</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-right">— Winston Churchill</p>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid gap-4">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            to={action.link}
                            className="bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex items-center gap-6 hover:-translate-y-1"
                        >
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform", action.color)}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-lg">{action.label}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{action.desc}</p>
                            </div>
                            <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Status Card */}
                <div className="mt-auto bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 rounded-[40px] border border-indigo-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-white dark:bg-slate-950 rounded-xl shadow-sm">
                            <Trophy className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Score</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white italic">85<span className="text-lg text-slate-400">/100</span></p>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-[85%] rounded-full" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-4 leading-relaxed">
                        You are performing in the top 15% of candidates. Focus on System Design to reach the 95th percentile.
                    </p>
                </div>

            </div>
        </div>
    );
}
