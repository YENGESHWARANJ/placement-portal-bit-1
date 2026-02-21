import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minus, Maximize2, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { cn } from '../utils/cn';

export function FloatingAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hello! I'm your Placement Intelligence Assistant. How can I help you accelerate your career today?" }
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
            const res = await api.post<{ response: string }>('/ai/chat', { query: userMsg });
            setChat(prev => [...prev, { role: 'ai', text: res.data.response }]);
        } catch (err) {
            setChat(prev => [...prev, { role: 'ai', text: "I'm experiencing a temporary synapse disconnect. Please try asking about your roadmap or resume." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] italic">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] rounded-[35px] overflow-hidden flex flex-col transition-all duration-500",
                            isMinimized ? "h-20 w-80" : "h-[600px] w-[400px]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">Antigravity AI</p>
                                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] animate-pulse">Neural Link Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Area */}
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
                                    {chat.map((msg, i) => (
                                        <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[85%] p-5 rounded-[25px] text-sm font-bold leading-relaxed shadow-sm italic",
                                                msg.role === 'user'
                                                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10"
                                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-700"
                                            )}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-slate-800 p-5 rounded-[25px] rounded-tl-none border border-slate-100 dark:border-slate-700 flex gap-2 items-center">
                                                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ask about your roadmap, jobs, or resume..."
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-6 pr-14 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || loading}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="h-16 w-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[22px] shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <MessageSquare className="h-7 w-7 relative z-10" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full border-4 border-white dark:border-slate-950 animate-pulse"></span>
                </motion.button>
            )}
        </div>
    );
}
