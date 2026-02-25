import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, Send, Sparkles, Brain, Target, ArrowRight,
    Zap, Calendar, BookOpen, Trophy, MessageSquare,
    Mic, StopCircle, Play, RefreshCcw, User, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { useAuth } from '../../features/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function AICoach() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: `Hello ${user?.name?.split(' ')[0] || 'there'}. I'm your AI Placement Coach. I've analyzed your current profile and the active job market. How can I help you accelerate your career today?` }
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
            setChat(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the network right now. Please try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            icon: Mic,
            label: "Mock Interview",
            desc: "Practice with AI",
            link: "/interview",
            color: "bg-apple-blue",
            textColor: "text-white"
        },
        {
            icon: Search,
            label: "Resume Analysis",
            desc: "ATS optimization",
            link: "/resume-upload",
            color: "bg-indigo-500",
            textColor: "text-white"
        },
        {
            icon: BookOpen,
            label: "Career Path",
            desc: "Personalized roadmap",
            link: "/roadmap",
            color: "bg-emerald-500",
            textColor: "text-white"
        }
    ];

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="h-[calc(100vh-140px)] flex flex-col lg:grid lg:grid-cols-12 gap-8"
        >
            {/* Left Column: Chat Interface */}
            <motion.div variants={stagger.item} className="lg:col-span-8 flex flex-col apple-card overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-apple-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-apple-blue rounded-xl flex items-center justify-center shadow-lg shadow-apple-blue/20">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-apple-gray-900 tracking-tight">AI Placement Coach</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Intelligence</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setChat([])} className="p-2 hover:bg-apple-gray-50 rounded-xl transition-colors text-apple-gray-400 hover:text-apple-blue">
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-apple-gray-50/30">
                    <AnimatePresence initial={false}>
                        {chat.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                            >
                                <div className={cn(
                                    "max-w-[85%] p-6 rounded-[24px] text-[14px] font-medium leading-relaxed relative shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-apple-gray-900 text-white rounded-tr-none"
                                        : "bg-white text-apple-gray-700 rounded-tl-none border border-apple-gray-100"
                                )}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white p-5 rounded-[20px] rounded-tl-none border border-apple-gray-100 flex gap-2 items-center shadow-sm">
                                <span className="h-2 w-2 bg-apple-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 bg-apple-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 bg-apple-blue rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-apple-gray-50">
                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            placeholder="Ask about tips, strategies, or profile feedback..."
                            className="w-full bg-apple-gray-50 border-2 border-transparent rounded-2xl pl-6 pr-14 py-4 text-sm font-semibold text-apple-gray-900 focus:outline-none focus:bg-white focus:border-apple-blue/20 transition-all"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-apple-blue text-white rounded-xl flex items-center justify-center hover:bg-apple-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-apple-blue/20"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Right Column: Context & Actions */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Insights Card */}
                <motion.div variants={stagger.item} className="apple-card p-8 bg-apple-gray-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-apple-blue/20 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 bg-apple-blue/20 rounded-lg flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-apple-blue" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-apple-blue">Daily Insight</span>
                        </div>
                        <p className="text-xl font-bold leading-snug mb-4 italic tracking-tight">"Focus on System Design for your upcoming fintech interview. Scalability is their core metric."</p>
                        <p className="text-[11px] font-bold text-apple-gray-500 uppercase tracking-widest">Calculated by Neural Engine</p>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    {quickActions.map((action, i) => (
                        <motion.div key={i} variants={stagger.item}>
                            <Link
                                to={action.link}
                                className="apple-card p-6 border border-apple-gray-50 hover:border-apple-blue/20 hover:shadow-apple-hover transition-all flex items-center gap-5 group"
                            >
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", action.color, action.textColor)}>
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-apple-gray-900 text-[14px] tracking-tight">{action.label}</h4>
                                    <p className="text-[10px] font-bold text-apple-gray-400 border border-apple-gray-100 rounded-full px-2 py-0.5 w-fit uppercase tracking-widest mt-1.5">{action.desc}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-apple-gray-300 group-hover:text-apple-blue transition-all" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Readiness Score */}
                <motion.div variants={stagger.item} className="apple-card p-8 bg-white border border-apple-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100/50">
                            <Trophy className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">Market Readiness</p>
                            <p className="text-3xl font-bold text-apple-gray-900 tracking-tighter">85<span className="text-sm font-bold text-apple-gray-400 ml-1">/ 100</span></p>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-apple-gray-50 rounded-full overflow-hidden relative z-10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-apple-blue rounded-full shadow-lg shadow-apple-blue/20"
                        />
                    </div>
                    <p className="text-[11px] font-bold text-apple-gray-500 mt-6 leading-relaxed relative z-10 uppercase tracking-tight">
                        Excellent progress. Complete your <span className="text-apple-blue">mock interview</span> to reach the 90th percentile.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
