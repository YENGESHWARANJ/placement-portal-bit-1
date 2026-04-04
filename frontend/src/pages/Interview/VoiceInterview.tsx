import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Square, Loader2, Volume2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function VoiceInterview() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [conversation, setConversation] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [interviewActive, setInterviewActive] = useState(false);
    const [sessionContext, setSessionContext] = useState<any[]>([]); // To hold chat history for backend

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    toast.error("Microphone access denied. Please allow microphone access.");
                    setIsRecording(false);
                }
            };

            recognitionRef.current.onend = () => {
                // If it naturally ends but we wanted to keep recording (not implemented explicitly, but good hook)
            };
        } else {
            toast.error("Speech Recognition API not supported in this browser. Please use Chrome.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            if (transcript.trim()) {
                handleUserSubmission(transcript);
            }
        } else {
            // Stop any playing AI speech
            if (synthRef.current) synthRef.current.cancel();

            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const speakText = (text: string) => {
        if (!synthRef.current) return;

        synthRef.current.cancel(); // cancel previous
        const utterance = new SpeechSynthesisUtterance(text);

        // Attempt to find a good English voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("en")) ||
            voices.find(v => v.lang === "en-US") ||
            voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.05;
        utterance.pitch = 1;

        synthRef.current.speak(utterance);
    };

    const startInterview = async () => {
        setInterviewActive(true);
        setConversation([]);
        setSessionContext([]);
        setTranscript('');
        setAiResponse('');

        setIsProcessing(true);
        try {
            // Initialize interview session on backend
            const res = await api.post<{ message: string }>('/ai/voice-interview/start');
            const introText = res.data.message;
            setAiResponse(introText);
            setConversation([{ role: 'ai', text: introText }]);
            setSessionContext([{ role: 'model', parts: [{ text: introText }] }]);
            speakText(introText);
        } catch (err) {
            toast.error("Failed to start interview server.");
        } finally {
            setIsProcessing(false);
        }
    };

    const endInterview = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (synthRef.current) synthRef.current.cancel();
        setInterviewActive(false);
        setIsRecording(false);
        toast.success("Interview Session Ended", { icon: '🛑' });
    };

    const handleUserSubmission = async (text: string) => {
        if (!text.trim()) return;

        // Add user message to UI immediately
        const newContext = [...sessionContext, { role: 'user', parts: [{ text }] }];
        setConversation(prev => [...prev, { role: 'user', text }]);
        setSessionContext(newContext);
        setTranscript('');

        setIsProcessing(true);
        try {
            const res = await api.post<{ reply: string }>('/ai/voice-interview/reply', {
                message: text,
                history: newContext.slice(0, -1) // Send history excluding the current message as handling might vary, but actually the backend route takes message and history separately.
            });

            const replyText = res.data.reply;
            setAiResponse(replyText);
            setConversation(prev => [...prev, { role: 'ai', text: replyText }]);
            setSessionContext(prev => [...prev, { role: 'model', parts: [{ text: replyText }] }]);

            speakText(replyText);

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to get AI response");
        } finally {
            setIsProcessing(false);
        }
    };

    // Rendering Audio Visualizer (Mock visualizer css animation)
    const renderVisualizer = (active: boolean, type: 'user' | 'ai') => {
        const bars = 10;
        const color = type === 'user' ? 'bg-emerald-500' : 'bg-cyan-500';
        return (
            <div className="flex items-center gap-1.5 h-16 w-32 justify-center">
                {Array.from({ length: bars }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={active ? {
                            height: ['20%', `${Math.random() * 80 + 20}%`, '20%'],
                        } : { height: '20%' }}
                        transition={{
                            duration: 0.5 + Math.random() * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                        }}
                        className={cn("w-1.5 rounded-full", color)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white p-6 lg:p-12 relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                    Neural Voice <span className="text-emerald-600 italic">Interviewer</span>
                </h1>
                <div className={cn("h-3 w-3 rounded-full shadow-[0_0_15px]", interviewActive ? "bg-emerald-500 shadow-emerald-500/50 animate-pulse" : "bg-slate-700")} />
            </div>

            {!interviewActive ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex items-center justify-center relative z-10"
                >
                    <div className="bg-white border border-slate-100 p-16 rounded-[60px] max-w-2xl w-full text-center border border-slate-200 shadow-md shadow-slate-200/40">
                        <div className="h-24 w-24 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-[30px] flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                            <Mic className="h-10 w-10 text-slate-900" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter mb-4">Start Session</h2>
                        <p className="text-slate-500 font-bold leading-relaxed mb-12 text-sm uppercase tracking-widest">
                            You are about to enter a live conversational AI interview. Ensure your microphone is connected and your environment is quiet. The AI will evaluate your responses in real-time.
                        </p>
                        <button
                            onClick={startInterview}
                            className="w-full py-6 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
                        >
                            <Play className="h-5 w-5" /> Initialize Neural Link
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                    {/* Visualizer & Controls Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center justify-center gap-16 bg-white border border-slate-100 rounded-[60px] p-12 border border-slate-100"
                    >
                        {/* AI Visualizer */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-base font-black uppercase tracking-[0.4em] text-cyan-600 italic flex items-center gap-3">
                                <Volume2 className="h-4 w-4" /> AI Interviewer
                            </div>
                            <div className="h-32 w-32 rounded-full border border-cyan-500/30 flex items-center justify-center relative bg-cyan-500/5 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                                {!isProcessing && !isRecording && interviewActive ? renderVisualizer(true, 'ai') : renderVisualizer(false, 'ai')}
                            </div>
                        </div>

                        {/* Status Display */}
                        <div className="h-20 flex items-center justify-center px-10 bg-white border border-slate-100 rounded-full border border-slate-200 w-full max-w-md">
                            {isProcessing ? (
                                <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">
                                    <Loader2 className="h-5 w-5 animate-spin" /> Processing Neural Data...
                                </div>
                            ) : isRecording ? (
                                <div className="flex items-center gap-3 text-rose-500 font-black uppercase tracking-[0.2em] text-xs">
                                    <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" /> Recording Audio...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
                                    <Mic className="h-5 w-5" /> Ready for Input
                                </div>
                            )}
                        </div>

                        {/* User Controls */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleRecording}
                                disabled={isProcessing}
                                className={cn(
                                    "h-24 w-24 rounded-full flex items-center justify-center shadow-2xl transition-all disabled:opacity-50",
                                    isRecording
                                        ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_40px_rgba(244,63,94,0.5)] scale-110"
                                        : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                                )}
                            >
                                {isRecording ? <Square className="h-8 w-8 fill-current" /> : <Mic className="h-8 w-8" />}
                            </button>

                            <button
                                onClick={endInterview}
                                className="h-16 px-8 rounded-full bg-slate-50 border border-slate-200 text-slate-900 hover:bg-rose-500 hover:border-rose-500 transition-all font-black uppercase tracking-widest text-xs"
                            >
                                End
                            </button>
                        </div>
                    </motion.div>

                    {/* Transcript Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-slate-100 rounded-[60px] border border-slate-100 p-12 flex flex-col h-full max-h-[700px] overflow-hidden"
                    >
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-widest">Live Transcript</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
                            <AnimatePresence>
                                {conversation.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-6 rounded-[24px] max-w-[85%]",
                                            msg.role === 'ai'
                                                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 mr-auto rounded-tl-sm"
                                                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 ml-auto rounded-tr-sm"
                                        )}
                                    >
                                        <p className="text-base font-black uppercase tracking-widest mb-2 opacity-50">
                                            {msg.role === 'ai' ? 'Interviewer' : 'You'}
                                        </p>
                                        <p className="font-bold leading-relaxed whitespace-pre-wrap text-sm">{msg.text}</p>
                                    </motion.div>
                                ))}
                                {isRecording && transcript && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 rounded-[24px] max-w-[85%] bg-slate-50 border border-slate-200 text-slate-500 ml-auto rounded-tr-sm italic"
                                    >
                                        <p className="text-base font-black uppercase tracking-widest mb-2 opacity-50">You (Speaking...)</p>
                                        <p className="font-bold leading-relaxed">{transcript}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
