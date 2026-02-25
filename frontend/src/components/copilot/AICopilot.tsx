import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Maximize2, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { cn } from '../../utils/cn';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function AICopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your Nexus Copilot 🤖. I know your skills, resume score, and matched jobs. How can I help you accelerate your placement journey today?",
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        try {
            const res = await api.post('/ai/copilot', { message: userMessage.content });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: (res.data as any).reply || "I encountered a cognitive error. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Network synchronization failed. I cannot reach the neural core.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-8 right-8 h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full shadow-[0_10px_40px_rgba(99,102,241,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-50 group border-2 border-white/10"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Bot className="h-7 w-7 relative z-10 drop-shadow-md" />
                        <div className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={cn(
                            "fixed bottom-8 right-8 bg-white dark:bg-[#080B1A] border border-slate-200 dark:border-white/10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden transition-all duration-300",
                            isExpanded ? "w-[800px] h-[80vh] right-1/2 translate-x-1/2 bottom-[10vh]" : "w-[380px] h-[600px]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mixed-blend-overlay pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black italic uppercase tracking-widest text-[13px] leading-tight text-white drop-shadow-sm">Nexus Copilot</h3>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                                <button onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50 dark:bg-transparent relative">
                            <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={cn(
                                        "flex max-w-[85%] relative",
                                        msg.role === 'user' ? "ml-auto" : "mr-auto"
                                    )}
                                >
                                    <div className={cn(
                                        "p-4 text-[13px] font-medium leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                            : "bg-white dark:bg-[#131627] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/5 rounded-2xl rounded-tl-sm shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                                    )}>
                                        {msg.content}
                                        <div className={cn(
                                            "text-[9px] font-bold uppercase tracking-wider mt-2 opacity-50",
                                            msg.role === 'user' ? "text-indigo-100 text-right" : "text-slate-400"
                                        )}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex max-w-[85%] mr-auto">
                                    <div className="p-4 bg-white dark:bg-[#131627] border border-slate-100 dark:border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 bg-pink-500 rounded-full animate-bounce" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#0A0D1E] border-t border-slate-100 dark:border-white/5 shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask the neural net..."
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-[13px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isTyping}
                                    className="absolute right-2 h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <Send className="h-4 w-4 ml-0.5" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Nexus Intelligence Engine v4</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
