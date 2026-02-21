import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Target, Zap, CheckCircle2, Circle, ChevronRight, Trophy,
    Award, Star, Sparkles, BookOpen, Code2, Briefcase, RefreshCcw, Send,
    Activity, Globe, Cpu, Hexagon, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const radarData = [
    { subject: 'Algorithms', A: 92, fullMark: 100 },
    { subject: 'System Design', A: 78, fullMark: 100 },
    { subject: 'Intelligence', A: 85, fullMark: 100 },
    { subject: 'Logic', A: 95, fullMark: 100 },
    { subject: 'Speed', A: 88, fullMark: 100 },
    { subject: 'Reliability', A: 90, fullMark: 100 },
];

export default function CareerRoadmap() {
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<any[]>([]);
    const [objective, setObjective] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAligning, setIsAligning] = useState(false);
    const [newObjective, setNewObjective] = useState("");

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ roadmap: any[], objective: string }>('/roadmap');
            setRoadmap(res.data.roadmap);
            setObjective(res.data.objective);
        } catch (err) {
            console.error("Roadmap fetch failed", err);
            toast.error("Failed to sync roadmap");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const handleAlign = async () => {
        if (!newObjective.trim()) return;
        setIsAligning(true);
        try {
            await api.post('/roadmap/align', { objective: newObjective });
            toast.success("Objective aligned. Recalibrating journey...");
            setTimeout(() => {
                setNewObjective("");
                setIsAligning(false);
                fetchRoadmap();
            }, 2000);
        } catch (err) {
            toast.error("Alignment failed");
            setIsAligning(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center italic">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8"
            >
                <RefreshCcw className="h-16 w-16 text-blue-500 opacity-50" />
            </motion.div>
            <p className="animate-pulse text-slate-400 font-black tracking-[0.5em] uppercase text-xs">Initializing Cognitive Mapping...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20 italic selection:bg-blue-500 selection:text-white">
            {/* Header / AI Strategy Node */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-[#0A0C1B] rounded-[60px] p-16 text-white mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] group border border-white/5"
            >
                <div className="absolute top-0 right-0 p-80 bg-blue-600/10 rounded-full blur-[150px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-[3000ms]"></div>
                <div className="absolute bottom-0 left-0 p-60 bg-indigo-600/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>

                {/* Visual Scanner Overlay */}
                <AnimatePresence>
                    {isAligning && (
                        <motion.div
                            initial={{ top: '-100%' }}
                            animate={{ top: '200%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20"
                        />
                    )}
                </AnimatePresence>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 text-cyan-400 font-black uppercase tracking-[0.5em] text-[11px] mb-10">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Sparkles className="h-5 w-5" />
                        </motion.div>
                        AI-Powered Career Intelligence Hub
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                        <div className="max-w-4xl">
                            <motion.h1
                                layoutId="objective-title"
                                className="text-7xl md:text-8xl font-black mb-10 tracking-[-0.05em] leading-[0.9] italic"
                            >
                                Target: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">{objective}</span>
                            </motion.h1>
                            <p className="text-slate-400 text-xl font-bold leading-relaxed mb-12 max-w-2xl">
                                Global strategy verified. Your profile is undergoing <span className="text-white italic underline decoration-blue-500 underline-offset-4">Continuous Synchronization</span>.
                                Priority objective: <span className="text-blue-400 uppercase tracking-widest text-sm font-black italic">Tier-1 Market Dominance</span>.
                            </p>

                            <div className="flex items-center gap-6 group/input">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Redefine Strategic Objective..."
                                        className="bg-black/40 border-2 border-white/5 rounded-3xl px-8 py-5 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 w-full transition-all shadow-2xl placeholder:text-slate-700 italic"
                                        value={newObjective}
                                        onChange={(e) => setNewObjective(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 font-black text-[10px] tracking-widest uppercase">Input protocol</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleAlign}
                                    disabled={isAligning || !newObjective}
                                    className="h-16 w-16 bg-blue-600 rounded-[28px] flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-50 shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
                                >
                                    {isAligning ? <RefreshCcw className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex gap-10">
                            {[
                                { label: 'Sync Rank', value: 'LV. 42', color: 'text-white' },
                                { label: 'Convergence', value: '92%', color: 'text-blue-400' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[45px] text-center min-w-[220px] shadow-3xl flex flex-col items-center justify-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">{stat.label}</p>
                                    <p className={cn("text-6xl font-black tracking-tighter italic", stat.color)}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Roadmap Journey Matrix */}
                <div className="lg:col-span-8 space-y-16">
                    {roadmap.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={cn("relative group", step.status === 'locked' && "opacity-30 saturate-0 hover:opacity-100 transition-all duration-1000")}
                        >
                            {idx !== roadmap.length - 1 && (
                                <div className="absolute left-[48px] top-[120px] bottom-[-64px] w-1.5 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent dark:from-slate-800/80 dark:to-transparent group-hover:from-blue-500/50 transition-all duration-700 rounded-full"></div>
                            )}

                            <div className={cn(
                                "bg-white dark:bg-[#060813] rounded-[60px] p-16 border transition-all duration-700 relative overflow-hidden",
                                step.status === 'in-progress' ? "border-blue-500/50 shadow-[0_40px_80px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20" : "border-slate-100 dark:border-white/5 shadow-xl"
                            )}>
                                {step.status === 'in-progress' && (
                                    <div className="absolute -top-20 -right-20 h-60 w-60 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                                )}

                                <div className="flex flex-col md:flex-row items-start gap-16">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={cn(
                                            "h-24 w-24 shrink-0 rounded-[35px] border-4 flex items-center justify-center transition-all duration-700 shadow-2xl",
                                            step.status === 'completed' ? "bg-emerald-500 text-white border-emerald-400 rotate-3" :
                                                step.status === 'in-progress' ? "bg-blue-600 text-white border-blue-400 -rotate-3" :
                                                    "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/10"
                                        )}
                                    >
                                        {step.status === 'completed' ? <CheckCircle2 className="h-12 w-12" /> :
                                            step.status === 'in-progress' ? <Zap className="h-12 w-12 fill-white animate-pulse" /> :
                                                <Circle className="h-12 w-12" />}
                                    </motion.div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-8">
                                            <div>
                                                <h3 className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-all italic leading-none mb-3">{step.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <Layers className="h-3 w-3 text-slate-400" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Milestone Protocol {idx + 1}</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "w-fit px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border italic",
                                                step.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    step.status === 'in-progress' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                        "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {step.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xl font-bold leading-relaxed mb-12 italic opacity-90">{step.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {step.tasks.map((task: string, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ x: 10 }}
                                                    className="flex items-center gap-6 p-6 bg-slate-50/50 dark:bg-black/40 rounded-[30px] border border-transparent hover:border-blue-500/20 transition-all group/task relative overflow-hidden"
                                                >
                                                    <div className={cn(
                                                        "h-3 w-3 rounded-full transition-all shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                                        step.status === 'completed' ? "bg-emerald-500 shadow-emerald-500/30" :
                                                            step.status === 'in-progress' && i < 2 ? "bg-blue-500 animate-pulse shadow-blue-500/30" :
                                                                "bg-slate-300"
                                                    )}></div>
                                                    <span className="text-[13px] font-black text-slate-700 dark:text-slate-300 italic tracking-tight uppercase leading-none">{task}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {step.status === 'in-progress' && (
                                            <div className="mt-16 pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-12">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-5">
                                                        <div className="flex items-center gap-3">
                                                            <Activity className="h-4 w-4 text-blue-500" />
                                                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Sync Velocity</p>
                                                        </div>
                                                        <p className="text-2xl font-black text-blue-500 tracking-tighter italic">{step.progress}%</p>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-white/5 h-4 rounded-full overflow-hidden shadow-inner p-1">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${step.progress}%` }}
                                                            transition={{ duration: 3, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                type="button"
                                                onClick={() => navigate('/resume-builder')}
                                                className="flex items-center gap-6 bg-slate-900 text-white px-12 py-6 rounded-[30px] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.1] hover:bg-blue-600 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-blue-500/30 italic group/btn"
                                            >
                                                Initiate Deck
                                                <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                            </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Side Intelligence Matrix */}
                <div className="lg:col-span-4 space-y-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#0A0C1B] p-16 rounded-[60px] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between mb-12">
                            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Cognitive Radar</h4>
                            <Hexagon className="h-5 w-5 text-blue-500 animate-spin-slow" />
                        </div>

                        <div className="h-[300px] w-full mb-12">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                    <Radar
                                        name="Intelligence"
                                        dataKey="A"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Algorithms', score: 92, status: 'Elite' },
                                { label: 'System Design', score: 78, status: 'Securing' },
                                { label: 'Logical Radius', score: 95, status: 'Master' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[25px] border border-transparent hover:border-blue-500/30 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white italic leading-none mt-1">{stat.score}%</p>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{stat.status}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-950 via-[#0A0C1B] to-black p-16 rounded-[60px] text-white relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] group"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="absolute top-0 left-0 p-40 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mt-20 group-hover:bg-blue-500/20 transition-all duration-1000"></div>

                        <div className="relative z-10">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-3xl rounded-[30px] flex items-center justify-center mb-12 border border-white/10 shadow-2xl group-hover:rotate-12 transition-all">
                                <Trophy className="h-10 w-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                            </div>
                            <h4 className="text-4xl font-black mb-6 tracking-tighter italic uppercase drop-shadow-md">Tier-1 Verified</h4>
                            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-12 italic opacity-80">
                                Critical strategic benchmarks cleared. Your profile has achieved <span className="text-blue-400">Target Visualisation</span> in Elite Recruiter orbits.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/job-recommendations')}
                                className="w-full bg-blue-600 text-white py-7 rounded-[35px] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white hover:text-blue-600 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] italic"
                            >
                                Access Elite Tiers
                            </button>
                        </div>
                    </motion.div>

                    {/* Operational Feed */}
                    <div className="p-12 bg-white dark:bg-[#060813] border border-slate-100 dark:border-white/5 rounded-[50px] shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <Cpu className="h-4 w-4 text-emerald-500" />
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Operational Feed</h5>
                        </div>
                        <div className="space-y-6">
                            {[
                                'Neural pathway alignment: 100%',
                                'Sync Rank LV. 42 confirmed',
                                'Elite Tier visibility: Active',
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 text-[10px] font-black text-slate-500 dark:text-slate-400 italic">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
