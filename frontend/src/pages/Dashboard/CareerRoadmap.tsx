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

export default function CareerRoadmap() {
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<any[]>([]);
    const [objective, setObjective] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAligning, setIsAligning] = useState(false);
    const [newObjective, setNewObjective] = useState("");
    const [radarData, setRadarData] = useState<any[]>([
        { subject: 'Algorithms', A: 0, fullMark: 100 },
        { subject: 'System Design', A: 0, fullMark: 100 },
        { subject: 'Intelligence', A: 0, fullMark: 100 },
        { subject: 'Logic', A: 0, fullMark: 100 },
        { subject: 'Speed', A: 0, fullMark: 100 },
        { subject: 'Reliability', A: 0, fullMark: 100 },
    ]);

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const [roadmapRes, analyticsRes] = await Promise.all([
                api.get<{ roadmap: any[], objective: string }>('/roadmap'),
                api.get<any>('/analytics/student-stats')
            ]);

            setRoadmap(roadmapRes.data.roadmap);
            setObjective(roadmapRes.data.objective);

            if (analyticsRes.data.cognitiveProfile) {
                setRadarData(analyticsRes.data.cognitiveProfile);
            }
        } catch (err) {
            console.error("Roadmap or Analytics fetch failed", err);
            toast.error("Failed to sync neural roadmap");
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
            <p className="animate-pulse text-slate-500 font-black tracking-[0.5em] uppercase text-xs">Initializing Cognitive Mapping...</p>
        </div>
    );

    return (
        <div className="pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 bg-apple-gray-50/50 min-h-screen p-8">
            {/* Header / Strategy Hub */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="apple-card p-12 mb-10 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-apple-blue rounded-[14px] flex items-center justify-center shadow-apple-hover">
                                <Target className="h-5 w-5 text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-apple-gray-400 uppercase tracking-widest leading-none">AI Career Compass</h2>
                                <p className="text-xs font-black text-apple-blue uppercase tracking-widest mt-1">Cognitive Engine v4.0</p>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-apple-gray-900 tracking-tight leading-tight mb-4">
                                Target: <span className="text-apple-blue">{objective}</span>
                            </h1>
                            <p className="text-lg font-medium text-apple-gray-500 max-w-2xl leading-relaxed">
                                Strategy verified. Your professional trajectory is undergoing <span className="text-apple-gray-900 font-bold underline decoration-apple-blue underline-offset-8">Continuous Alignment</span>.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 max-w-md">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Redefine Objective..."
                                    className="w-full bg-apple-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-apple-gray-900 focus:outline-none focus:border-apple-blue/20 focus:bg-white transition-all transition-all"
                                    value={newObjective}
                                    onChange={(e) => setNewObjective(e.target.value)}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAlign}
                                disabled={isAligning || !newObjective}
                                className="h-14 w-14 bg-apple-blue text-slate-900 rounded-2xl flex items-center justify-center hover:bg-apple-blue-dark transition-all disabled:opacity-50 shadow-apple-hover"
                            >
                                {isAligning ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 shrink-0">
                        {[
                            { label: 'Sync Rank', value: `LV. ${Math.min(99, Math.floor((radarData.reduce((acc, curr) => acc + curr.A, 0) / (radarData.length || 1)) / 1.5))}`, color: 'text-apple-gray-900', bg: 'bg-white' },
                            { label: 'Convergence', value: `${Math.round(radarData.reduce((acc, curr) => acc + curr.A, 0) / (radarData.length || 1))}%`, color: 'text-apple-blue', bg: 'bg-apple-blue/5' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className={cn("p-10 rounded-[40px] border border-apple-gray-100 flex flex-col items-center justify-center min-w-[200px] shadow-sm relative overflow-hidden", stat.bg)}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-apple-gray-50" />
                                <p className="text-base font-bold text-apple-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                <p className={cn("text-5xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
                                <div className="mt-4 flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-apple-blue animate-pulse" />
                                    <span className="text-sm font-bold text-apple-gray-300 uppercase tracking-widest">Neural Link</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Roadmap Journey Matrix */}
                <div className="lg:col-span-8 space-y-12">
                    {roadmap.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={cn("relative group", step.status === 'locked' && "opacity-40 grayscale")}
                        >
                            {idx !== roadmap.length - 1 && (
                                <div className="absolute left-[48px] top-[120px] bottom-[-64px] w-1 bg-apple-gray-100 group-hover:bg-apple-blue/20 transition-all duration-700"></div>
                            )}

                            <div className={cn(
                                "apple-card p-12 transition-all duration-700 relative overflow-hidden",
                                step.status === 'in-progress' ? "border-apple-blue/10 bg-white" : "border-apple-gray-50 bg-white"
                            )}>
                                <div className="flex flex-col md:flex-row items-start gap-12">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={cn(
                                            "h-24 w-24 shrink-0 rounded-[30px] flex items-center justify-center transition-all duration-700 shadow-sm border-2",
                                            step.status === 'completed' ? "bg-emerald-500 text-white border-emerald-400" :
                                                step.status === 'in-progress' ? "bg-apple-blue text-slate-900 border-apple-blue" :
                                                    "bg-apple-gray-50 text-apple-gray-300 border-apple-gray-100"
                                        )}
                                    >
                                        {step.status === 'completed' ? <CheckCircle2 className="h-10 w-10" /> :
                                            step.status === 'in-progress' ? <Zap className="h-10 w-10 fill-white" /> :
                                                <Circle className="h-10 w-10" />}
                                    </motion.div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                            <div>
                                                <h3 className="text-3xl font-black text-apple-gray-900 tracking-tight leading-none mb-3">{step.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-3.5 w-3.5 text-apple-gray-400" />
                                                    <p className="text-base font-bold uppercase tracking-[0.3em] text-apple-gray-400">Phase Protocol {idx + 1}</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "w-fit px-6 py-2 rounded-full text-base font-bold uppercase tracking-widest border",
                                                step.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    step.status === 'in-progress' ? "bg-apple-blue/5 text-apple-blue border-apple-blue/10" :
                                                        "bg-apple-gray-50 text-apple-gray-400 border-apple-gray-100"
                                            )}>
                                                {step.status}
                                            </span>
                                        </div>
                                        <p className="text-apple-gray-500 text-lg font-medium leading-relaxed mb-10">{step.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {step.tasks.map((task: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-4 p-5 bg-apple-gray-50/50 rounded-[20px] border border-transparent hover:border-apple-blue/10 transition-all group/task"
                                                >
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full transition-all",
                                                        step.status === 'completed' ? "bg-emerald-500" :
                                                            step.status === 'in-progress' && i < 2 ? "bg-apple-blue" :
                                                                "bg-apple-gray-200"
                                                    )}></div>
                                                    <span className="text-lg font-bold text-apple-gray-600 uppercase tracking-tight leading-none">{task}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {step.status === 'in-progress' && (
                                            <div className="mt-12 pt-10 border-t border-apple-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-apple-blue" />
                                                            <p className="text-base font-bold uppercase tracking-[0.4em] text-apple-gray-400">Sync Velocity</p>
                                                        </div>
                                                        <p className="text-xl font-bold text-apple-blue tracking-tighter">{step.progress}%</p>
                                                    </div>
                                                    <div className="w-full bg-apple-gray-50 h-2.5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${step.progress}%` }}
                                                            transition={{ duration: 2, ease: "easeOut" }}
                                                            className="h-full bg-apple-blue rounded-full shadow-apple-hover"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/resume-builder')}
                                                    className="flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-[20px] text-sm font-bold uppercase tracking-widest hover:scale-[1.02] hover:bg-black transition-all shadow-apple-hover"
                                                >
                                                    Initiate Action
                                                    <ChevronRight className="h-4 w-4" />
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
                <div className="lg:col-span-4 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="apple-card p-10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-apple-gray-400">Cognitive Radar</h4>
                            <Hexagon className="h-4 w-4 text-apple-blue" />
                        </div>

                        <div className="h-[280px] w-full mb-10 relative z-10">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#f2f2f7" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8e8e93', fontSize: 9, fontWeight: 700 }} />
                                    <Radar
                                        name="Intelligence"
                                        dataKey="A"
                                        stroke="#0071e3"
                                        fill="#0071e3"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {radarData.slice(0, 3).map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-apple-gray-50/50 rounded-[16px] border border-transparent hover:border-apple-blue/10 transition-all">
                                    <div>
                                        <p className="text-xs font-bold text-apple-gray-400 uppercase tracking-widest">{stat.subject}</p>
                                        <p className="text-lg font-black text-apple-gray-900 leading-none mt-1">{Math.round(stat.A)}%</p>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                                        stat.A >= 90 ? "text-emerald-500 bg-emerald-50" :
                                            stat.A >= 70 ? "text-apple-blue bg-apple-blue/5" :
                                                "text-orange-500 bg-orange-50"
                                    )}>
                                        {stat.A >= 90 ? 'Master' : stat.A >= 70 ? 'Strategic' : 'Learning'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[40px] bg-white text-slate-900 relative overflow-hidden shadow-2xl group"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-apple-blue/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="h-16 w-16 bg-slate-100 rounded-[20px] flex items-center justify-center mb-10 border border-slate-100 shadow-2xl">
                                <Trophy className="h-8 w-8 text-orange-500" />
                            </div>
                            <h4 className="text-3xl font-black mb-4 tracking-tight uppercase">Tier-1 Elite</h4>
                            <p className="text-apple-gray-400 text-sm font-medium leading-relaxed mb-10 opacity-80">
                                Strategic benchmarks cleared. Your profile has achieved <span className="text-apple-blue font-bold">Priority Status</span> in recruiter selection pools.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/job-recommendations')}
                                className="w-full bg-apple-blue text-slate-900 py-6 rounded-[24px] font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-apple-blue transition-all shadow-apple-hover"
                            >
                                Access Elite Tiers
                            </button>
                        </div>
                    </motion.div>

                    {/* Operational Feed */}
                    <div className="p-10 apple-card border border-apple-gray-50">
                        <div className="flex items-center gap-3 mb-8">
                            <Cpu className="h-4 w-4 text-emerald-500" />
                            <h5 className="text-base font-bold uppercase tracking-[0.4em] text-apple-gray-400">System Feed</h5>
                        </div>
                        <div className="space-y-5">
                            {[
                                'Neural pathways aligned: 100%',
                                'Sync Rank LV. 42 confirmed',
                                'Elite Tier visibility: Active',
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-3 text-base font-bold text-apple-gray-500 uppercase tracking-tight">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
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
