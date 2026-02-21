import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Briefcase, TrendingUp, Target, Award, PieChart as PieIcon,
    BarChart2, Calendar, Filter, Download, ChevronRight, MapPin,
    ArrowUpRight, Search, Activity
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { getRecruiterStats } from '../../services/recruiter.service';
import { toast } from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function RecruiterAnalytics() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getRecruiterStats();
                setData(res);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 italic tracking-[0.3em] uppercase text-xl">Accessing Data Vault...</div>;
    if (!data) return <div className="p-20 text-center">No Data Available</div>;

    const { stats, recruitmentTrends, candidateSource } = data;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Enterprise Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Hiring Intel™</h1>
                    <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[9px] mt-2">Strategic Intelligence Division • Data Ops</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-slate-100 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all">
                        <Download className="h-4 w-4" /> Export Ledger
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl">
                        <Filter className="h-4 w-4" /> Set Range
                    </button>
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Total Applicants', value: stats.totalApplicants, trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Active Jobs', value: stats.totalJobs, trend: 'STABLE', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Shortlisted', value: stats.shortlistedCount, trend: '+5%', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'Interviews', value: stats.interviewCount, trend: 'ACTIVE', icon: Calendar, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-950 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-sm group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 uppercase italic">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-10 rounded-[45px] border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Application Momentum</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic flex items-center gap-2">
                                <Activity className="h-3 w-3 text-indigo-500" /> Real-time Node Flux
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div> Sourcing
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                <div className="h-2 w-2 rounded-full bg-pink-500"></div> Conversion
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400}>
                            <AreaChart data={recruitmentTrends}>
                                <defs>
                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="applicants" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRec)" />
                                <Area type="monotone" dataKey="hires" stroke="#ec4899" strokeWidth={4} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 p-10 rounded-[45px] border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Talent DNA</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 italic">Source Distribution Analysis</p>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256}>
                            <PieChart>
                                <Pie data={candidateSource} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                    {candidateSource.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-8">
                        {candidateSource.map((source: any, i: number) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    {source.name}
                                </span>
                                <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-widest">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
