import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
    TrendingUp, Target, Award, Activity, Star,
    BookOpen, Zap, CheckCircle2, Search, ArrowUpRight
} from 'lucide-react';
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
        <div className="animate-in fade-in zoom-in duration-500 pb-10">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Growth Intelligence</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Tracking your placement readiness & skill velocity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Score Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Current Readiness Score</span>
                                <h2 className="text-7xl font-black tracking-tighter mb-2">92<span className="text-3xl opacity-50">/100</span></h2>
                                <p className="text-blue-100 font-bold flex items-center gap-2 justify-center md:justify-start">
                                    <TrendingUp className="h-5 w-5" /> Top 6% in Class of 2025
                                </p>
                            </div>
                            <div className="h-44 w-44 bg-white/10 backdrop-blur-md rounded-[40px] border border-white/20 p-8 flex flex-col items-center justify-center text-center">
                                <Star className="h-10 w-10 text-yellow-400 mb-4 fill-yellow-400" />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Dream Offer Eligible</p>
                            </div>
                        </div>
                    </div>

                    {/* Skill Matrix */}
                    <div className="bg-white rounded-[45px] border border-slate-100 p-10 shadow-sm shadow-slate-100">
                        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Technical Portfolio DNA</h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                    <PolarGrid stroke="#f1f5f9" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 900 }} />
                                    <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Active Metrics */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Active Trajectories</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Interview Accuracy', val: '78%', sub: '+12% this week', color: 'bg-emerald-500' },
                                { label: 'Resume ATS Score', val: '84/100', sub: 'Highly Optimized', color: 'bg-blue-500' },
                                { label: 'Problem Solving', val: 'Level 4', sub: 'Consistent Streak', color: 'bg-indigo-500' },
                            ].map((met, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{met.label}</p>
                                            <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{met.val}</p>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 italic">{met.sub}</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={cn("h-full", met.color)} style={{ width: i === 0 ? '78%' : i === 1 ? '84%' : '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Improvement Suggestions */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                        <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" /> Improvement Path
                        </h3>
                        <div className="space-y-4">
                            {[
                                "Improve 'System Design' for Tier-1 companies.",
                                "Participate in 2 more mock arenas.",
                                "Complete Portfolio project 'E-commerce API'."
                            ].map((hint, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-1" />
                                    <p className="text-xs font-medium text-slate-300">{hint}</p>
                                </div>
                            ))}
                        </div>
                        <button
                        type="button"
                        onClick={() => navigate('/aptitude-test')}
                        className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
                    >
                        Start Sprint
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
