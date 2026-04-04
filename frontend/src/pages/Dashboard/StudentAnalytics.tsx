import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
    TrendingUp, Target, Award, Activity, Star,
    BookOpen, Zap, CheckCircle2, Search, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const skillData = [
    { subject: 'Coding', A: 120, fullMark: 150 },
    { subject: 'Logic', A: 98, fullMark: 150 },
    { subject: 'Soft Skills', A: 86, fullMark: 150 },
    { subject: 'Projects', A: 99, fullMark: 150 },
    { subject: 'English', A: 85, fullMark: 150 },
    { subject: 'System Design', A: 65, fullMark: 150 },
];

export default function StudentAnalytics() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="pb-10 animate-in fade-in zoom-in duration-500 bg-apple-gray-50/50 min-h-screen p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight">Growth Intelligence</h1>
                <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-base mt-2">Neural assessment of placement readiness & velocity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Performance Score Card */}
                    <div className="apple-card p-12 bg-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="text-center md:text-left space-y-6">
                                <span className="px-5 py-2 bg-apple-blue/10 text-apple-blue rounded-full text-base font-bold uppercase tracking-widest inline-block border border-apple-blue/10">Readiness Score</span>
                                <h2 className="text-8xl font-black text-apple-gray-900 tracking-tighter mb-2">92<span className="text-3xl text-apple-gray-300 ml-1">/ 100</span></h2>
                                <p className="text-apple-gray-500 font-bold flex items-center gap-2 justify-center md:justify-start text-sm">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" /> Currently Top 6% in Class of 2025
                                </p>
                            </div>
                            <div className="h-48 w-48 bg-white rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl">
                                <Star className="h-10 w-10 text-orange-500 mb-4 fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]" />
                                <p className="text-base font-bold text-slate-900 uppercase tracking-widest leading-tight">Tier-1 Rank Verified</p>
                            </div>
                        </div>
                    </div>

                    {/* Skill Matrix */}
                    <div className="apple-card p-12 bg-white">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-10 w-10 bg-apple-blue/5 rounded-xl flex items-center justify-center">
                                <Activity className="h-5 w-5 text-apple-blue" />
                            </div>
                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight">Technical Portfolio DNA</h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                    <PolarGrid stroke="#f2f2f7" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8e8e93', fontSize: 11, fontWeight: 700 }} />
                                    <Radar name="Student" dataKey="A" stroke="#0071e3" fill="#0071e3" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Active Metrics */}
                    <div className="apple-card p-10 bg-white">
                        <div className="flex items-center gap-3 mb-10">
                            <h3 className="font-bold text-apple-gray-400 uppercase tracking-[0.2em] text-base">Active Trajectories</h3>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: 'Interview Accuracy', val: '78%', sub: '+12% weekly', color: 'bg-emerald-500' },
                                { label: 'Resume ATS Score', val: '84/100', sub: 'Optimized', color: 'bg-apple-blue' },
                                { label: 'Problem Solving', val: 'Level 4', sub: 'Consistent', color: 'bg-orange-500' },
                            ].map((met, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-base font-bold uppercase text-apple-gray-400 tracking-widest leading-none mb-2">{met.label}</p>
                                            <p className="text-2xl font-black text-apple-gray-900 group-hover:text-apple-blue transition-colors leading-none">{met.val}</p>
                                        </div>
                                        <p className="text-xs font-bold text-apple-gray-300 uppercase tracking-widest">{met.sub}</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-apple-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: i === 0 ? '78%' : i === 1 ? '84%' : '60%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={cn("h-full rounded-full", met.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Improvement Suggestions */}
                    <div className="p-10 rounded-[40px] bg-white text-slate-900 relative overflow-hidden shadow-2xl group">
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-apple-blue/10 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
                        <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-3">
                            <Zap className="h-5 w-5 text-orange-500 fill-orange-500" /> Improvement Path
                        </h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                "Refine High-Level Design concepts",
                                "Participate in AI-Mock Arena sessions",
                                "Optimize performance of project nodes"
                            ].map((hint, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-[20px] border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-base font-bold text-apple-gray-300 uppercase tracking-tight">{hint}</p>
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/aptitude-test')}
                            className="w-full mt-10 py-6 bg-apple-blue text-slate-900 rounded-[24px] font-bold uppercase tracking-widest text-xs shadow-apple-hover transition-all"
                        >
                            Start Cognitive Sprint
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
