import React, { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, ShieldAlert, Cpu, Database, Activity, TrendingUp, AlertTriangle,
    ArrowUpRight, Server, HardDrive, Network, UserPlus, Briefcase, GraduationCap,
    Download, Megaphone, CheckCircle2, X, Terminal, Globe, Zap, Sparkles, ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend
} from 'recharts';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', type: 'Student', priority: 'Medium' });

    const [health, setHealth] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, healthRes] = await Promise.all([
                    api.get('/analytics/admin-stats'),
                    api.get('/analytics/system-health')
                ]);
                setData(statsRes.data);
                setHealth(healthRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExport = async () => {
        try {
            const res = await api.get('/analytics/export-report');
            const { data: reportData, reportName } = res.data as { data: any[], reportName: string };

            // Convert to CSV
            const headers = Object.keys(reportData[0]).join(',');
            const csvRows = reportData.map((row: any) => Object.values(row).join(','));
            const csvContent = [headers, ...csvRows].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportName}.csv`;
            a.click();
            toast.success("Intelligence Report Exported");
        } catch (err) {
            toast.error("Export Failed");
        }
    };

    const handlePostNotice = async () => {
        try {
            await api.post('/notices', noticeForm);
            toast.success("Announcement Broadcasted");
            setShowNoticeModal(false);
            setNoticeForm({ title: '', content: '', type: 'Student', priority: 'Medium' });
        } catch (err) {
            toast.error("Failed to broadcast");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 italic font-black uppercase tracking-widest">Hydrating Neural Analytics...</div>;

    const stats = [
        { label: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Placed Students', value: data?.stats?.placedStudents || 0, trend: `${data?.stats?.placementRate || 0}%`, icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { label: 'Active Jobs', value: data?.stats?.totalJobs || 0, icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Total Companies', value: data?.stats?.totalCompanies || 0, icon: Network, color: 'text-lime-500', bg: 'bg-lime-500/10' },
    ];

    const readinessData = [
        { name: 'Aptitude', value: data?.readinessStats?.aptitude || 0, fill: '#10b981' },
        { name: 'Coding', value: data?.readinessStats?.coding || 0, fill: '#06b6d4' },
        { name: 'Interview', value: data?.readinessStats?.interview || 0, fill: '#84cc16' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            {/* Command Header - OPERATIONS UPGRADE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-[#0A0D1E] rounded-[60px] p-16 text-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] group border border-white/5"
            >
                <div className="absolute top-0 right-0 p-96 bg-blue-600/10 rounded-full blur-[180px] -mr-48 -mt-48 pointer-events-none group-hover:bg-blue-600/20 transition-all duration-[4000ms]"></div>

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-6 mb-10">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 1, ease: "anticipate" }}
                                className="h-20 w-20 rounded-[30px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] border border-white/20"
                            >
                                <Globe className="h-10 w-10 text-white animate-pulse" />
                            </motion.div>
                            <div>
                                <p className="text-[14px] font-black uppercase tracking-[0.8em] text-emerald-400 italic leading-none">Global Operations Center</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Nexus_Version: 2.4_ALPHA_PRIME</p>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-9xl font-black tracking-[-0.08em] leading-[0.8] mb-10 uppercase italic">
                            COMMAND{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 drop-shadow-[0_0_80px_rgba(16,185,129,0.7)]">
                                MATRIX™
                            </span>
                        </h1>
                        <p className="text-slate-400 text-3xl font-bold leading-tight max-w-2xl italic">
                            Orchestrating the platform's <span className="text-white italic underline decoration-emerald-500 decoration-4 underline-offset-8">neural architecture</span> and placement velocity.
                        </p>
                    </div>

                    <div className="flex xl:flex-col gap-6 shrink-0 mt-8 xl:mt-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className="flex items-center gap-5 bg-white/5 px-12 py-6 rounded-[35px] text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-400 transition-all shadow-2xl backdrop-blur-3xl"
                        >
                            <Download className="h-5 w-5" /> EXPORT_LEDGER
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16,185,129,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNoticeModal(true)}
                            className="flex items-center gap-5 bg-emerald-600 text-white px-12 py-6 rounded-[35px] text-[11px] font-black uppercase tracking-[0.4em] border border-white/10 shadow-2xl shadow-emerald-900/60"
                        >
                            <Megaphone className="h-5 w-5" /> BROADCAST_PULSE
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Top Stats Overview - ELITE UPGRADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-premium p-10 rounded-[50px] border border-white/5 hover:border-emerald-500/30 transition-all group active:scale-95 cursor-pointer shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center justify-between mb-8">
                            <div className={cn("h-16 w-16 rounded-[22px] flex items-center justify-center transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-2xl", stat.bg)}>
                                <stat.icon className={cn("h-8 w-8", stat.color)} />
                            </div>
                            {stat.trend && (
                                <div className="flex flex-col items-end">
                                    <span className="text-emerald-400 text-[11px] font-black italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">{stat.trend}</span>
                                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mt-1">SUCCESS_RATE</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2 italic drop-shadow-2xl">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">{stat.label}_CORE</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Visuals Section - ELITE UPGRADE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Side - Analytics */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Placement progression Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 p-32 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    Acquisition Index
                                </h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2 italic">Global Placement Velocity Matrix</p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="h-[400px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                <AreaChart data={data?.placementTrend}>
                                    <defs>
                                        <linearGradient id="adminEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0A0D1E',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '24px',
                                            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                                            padding: '20px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#60a5fa', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#10b981"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#adminEmeraldGradient)"
                                        animationDuration={3000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* NEW: Placement Probability Curve (PREDICTIVE) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                        <Sparkles className="h-6 w-6 text-amber-400" />
                                    </div>
                                    Forward Projection
                                </h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2 italic">Predictive Placement Probability Curve Model</p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        </div>
                        <div className="h-[300px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                <AreaChart data={data?.predictiveCurve}>
                                    <defs>
                                        <linearGradient id="adminAmberGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="week"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0A0D1E',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '24px',
                                            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                                            padding: '20px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fcd34d', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="probability"
                                        stroke="#f59e0b"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#adminAmberGradient)"
                                        animationDuration={3000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Readiness Index */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-3xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tighter mb-2 italic uppercase">Readiness Core</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 italic">Neural Assessment Global Resonance</p>
                                <div className="h-[300px] w-full flex items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={25} data={readinessData}>
                                            <RadialBar
                                                label={{ position: 'insideStart', fill: '#fff', fontSize: 11, fontWeight: 900 }}
                                                background={{ fill: 'rgba(255,255,255,0.03)' }}
                                                dataKey="value"
                                                cornerRadius={20}
                                                animationDuration={4000}
                                            />
                                            <Tooltip />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-5xl font-black text-white italic drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">{data?.readinessStats?.overall}%</span>
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.5em] mt-2">GLOBAL_AVG</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Department Distribution */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-3xl overflow-hidden"
                        >
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-10 italic uppercase">Hiring By Dept</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                    <BarChart data={data?.departmentStats}>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
                                        />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Bar
                                            dataKey="placed"
                                            fill="#6366f1"
                                            radius={[15, 15, 0, 0]}
                                            barSize={30}
                                            animationDuration={3000}
                                        >
                                            {data?.departmentStats?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={['#10b981', '#06b6d4', '#14b8a6', '#84cc16'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Actions & Feeds */}
                <div className="space-y-12">
                    {/* Command Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0A0D1E] p-12 rounded-[60px] text-white shadow-3xl relative overflow-hidden group border border-white/5"
                    >
                        <div className="absolute top-0 right-0 h-56 w-56 bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-3xl font-black tracking-tighter italic uppercase">Global_Command</h3>
                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                            </div>
                            <div className="space-y-6">
                                <button
                                    onClick={() => navigate('/admin/students')}
                                    className="w-full p-8 bg-white/5 border border-white/5 rounded-[35px] flex items-center justify-between group/btn hover:bg-white/10 transition-all hover:translate-x-3 border-l-4 border-l-emerald-500"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover/btn:bg-emerald-600/20 transition-all">
                                            <ShieldCheck className="h-7 w-7 text-emerald-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mb-1">Authorization_Core</p>
                                            <p className="text-lg font-black italic text-white uppercase tracking-tighter">Verify Students</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-1 transition-all" />
                                </button>

                                <button
                                    onClick={() => setShowNoticeModal(true)}
                                    className="w-full p-8 bg-white/5 border border-white/5 rounded-[35px] flex items-center justify-between group/btn hover:bg-white/10 transition-all hover:translate-x-3 border-l-4 border-l-amber-500"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover/btn:bg-amber-500/20 transition-all">
                                            <Megaphone className="h-7 w-7 text-amber-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mb-1">Neural_Broadcast</p>
                                            <p className="text-lg font-black italic text-white uppercase tracking-tighter">Post Announcement</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover/btn:text-amber-400 group-hover/btn:translate-x-1 transition-all" />
                                </button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/jobs/create')}
                                    className="w-full p-10 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[40px] flex items-center justify-between group/btn hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] transition-all mt-10"
                                >
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase tracking-[0.6em] mb-2 text-emerald-200 opacity-70 italic">Platform_Architecture</p>
                                        <p className="text-2xl font-black italic uppercase tracking-tighter text-white">Post Job Listing</p>
                                    </div>
                                    <div className="h-16 w-16 bg-white/20 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group-hover/btn:rotate-12 transition-all">
                                        <Zap className="h-8 w-8 text-white fill-white" />
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Partner Intelligence */}
                    <div className="glass-premium p-10 rounded-[50px] border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => navigate('/admin/recruiters')}>
                        <div className="absolute top-0 right-0 p-24 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 italic">Partner Intelligence</h4>
                            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 transition-all group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30">
                                <ArrowUpRight className="h-5 w-5 text-emerald-500 group-hover:rotate-45 transition-transform" />
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed mb-8">Orchestrate recruiter onboarding and monitor cross-network hiring velocity.</p>
                        <div className="flex -space-x-4 mb-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-10 rounded-[15px] bg-[#0A0D1E] border-2 border-[#1E2342] flex items-center justify-center text-[10px] font-black text-slate-500 shadow-xl">C{i}</div>
                            ))}
                            <div className="h-10 w-10 rounded-[15px] bg-emerald-600 border-2 border-[#1E2342] flex items-center justify-center text-[10px] font-black text-white shadow-xl shadow-emerald-900/40">+12</div>
                        </div>
                    </div>

                    {/* Kernel Lattice Feed */}
                    <div className="bg-[#05070A] p-10 rounded-[50px] border border-white/5 shadow-3xl font-mono relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                            <div className="flex gap-2.5">
                                <div className="h-3 w-3 rounded-full bg-rose-500/40 animate-pulse" />
                                <div className="h-3 w-3 rounded-full bg-amber-500/40 animate-pulse [animation-delay:0.2s]" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500/40 animate-pulse [animation-delay:0.4s]" />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Kernel_Lattice.sh</span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] text-emerald-500/80 leading-snug font-bold group-hover:translate-x-1 transition-transform">[OK] Auth_Cluster: SYNCHRONIZED</p>
                            <p className="text-[10px] text-cyan-400/80 leading-snug font-bold group-hover:translate-x-1 transition-transform [transition-delay:0.1s]">[INFO] Streaming_Ledger: ACTIVE</p>
                            <p className="text-[10px] text-slate-500 leading-snug font-bold group-hover:translate-x-1 transition-transform [transition-delay:0.2s]">[SYSCALL] Request from 10.0.4.11</p>
                            <p className="text-[10px] text-teal-400/80 leading-snug font-bold group-hover:translate-x-1 transition-transform [transition-delay:0.3s]">[ALERT] Thread_ID_742 Elevating...</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Live Intelligence Feed</span>
                            </div>
                            <Terminal className="h-4 w-4 text-slate-700 group-hover:text-emerald-500 group-hover:rotate-12 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Integrity & Audit Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-3xl relative overflow-hidden h-full flex flex-col"
                >
                    <div className="absolute top-0 right-0 p-24 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
                    <h3 className="text-2xl font-black text-white tracking-tighter mb-10 italic uppercase">System Integrity Matrix</h3>
                    <div className="space-y-10 flex-1">
                        {(health?.integrity || [
                            { label: 'Neural AI Core', value: 100, color: 'text-indigo-400', icon: Cpu },
                            { label: 'Blockchain Ledger', value: 98, color: 'text-emerald-400', icon: Database },
                            { label: 'Identity Vault', value: 45, color: 'text-amber-400', icon: ShieldAlert },
                            { label: 'Network Nexus', value: 92, color: 'text-blue-400', icon: Network },
                        ]).map((res: any, i: number) => {
                            const Icon = res.icon || ([Database, Cpu, ShieldAlert, Network][i % 4]);
                            const color = res.color || (res.value > 90 ? 'text-emerald-400' : res.value > 70 ? 'text-indigo-400' : 'text-amber-400');
                            return (
                                <div key={i} className="group/stat">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all", color)}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none mb-1.5">{res.label}</span>
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">{res.status || 'OPERATIONAL'}</span>
                                            </div>
                                        </div>
                                        <span className={cn("text-xs font-black italic", color)}>{res.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={cn("h-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]", color.replace('text', 'bg'))}
                                            style={{ width: `${res.value}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 p-8 bg-emerald-600/5 rounded-[40px] border border-emerald-500/10 backdrop-blur-3xl">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                                <Zap className="h-6 w-6 text-emerald-400 animate-pulse transition-all" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 leading-tight">
                                INTEGRITY_PULSE:<br />
                                <span className="text-white text-[13px] tracking-tight">OPTIMIZED_LATTICE</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* NEW: At-Risk Students Matrix */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0D1E] p-12 rounded-[60px] text-white shadow-3xl border border-rose-500/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 h-40 w-40 bg-rose-500/10 rounded-full blur-[70px] pointer-events-none" />
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-rose-400">At-Risk Entities</h3>
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                    </div>

                    <div className="space-y-6">
                        {data?.atRiskStudents?.map((student: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[28px] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/risk">
                                <div>
                                    <p className="text-white font-bold text-sm tracking-tight group-hover/risk:text-rose-400 transition-colors">{student.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{student.issue}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-rose-500 font-black italic text-lg">{student.score}</div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">Metric_Score</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-colors border border-rose-500/20">
                        View Full Mitigation Report
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0D1E] p-12 rounded-[60px] text-white shadow-3xl border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-[70px] pointer-events-none" />
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 text-slate-500">Global Audit Trail</h3>
                    <div className="space-y-6">
                        {(health?.logs || [
                            { node: 'OP_ALPHA', action: 'NEXUS_SYNC', status: 'OK', time: '2m' },
                            { node: 'CORE_VAULT', action: 'LEDGER_UPDATE', status: 'COMPLETE', time: '14m' },
                            { node: 'SYS_DAEMON', action: 'SCRUB_PROTOCOL', status: 'ACTIVE', time: 'Now' }
                        ]).map((log: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[28px] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all cursor-pointer group/log">
                                <span className="text-emerald-400 group-hover/log:translate-x-1 transition-transform">{log.node}</span>
                                <span className="text-slate-500 italic">{log.event || log.action}</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[8px]",
                                    log.status === 'OK' || log.status === 'COMPLETE' || log.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-400 font-bold" : "bg-amber-500/10 text-amber-500 font-bold"
                                )}>{log.status}</span>
                                <span className="text-slate-700 font-mono text-[8px]">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Broadcast Modal - ELITE UPGRADE */}
            <AnimatePresence>
                {showNoticeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 italic"
                    >
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(20px)" }}
                            className="absolute inset-0 bg-slate-950/60 transition-all duration-500"
                            onClick={() => setShowNoticeModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0A0D1E] w-full max-w-2xl rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-48 bg-emerald-600/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />

                            <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Strategic Broadcast</h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2 italic">Network-wide announcement protocol</p>
                                </div>
                                <button onClick={() => setShowNoticeModal(false)} className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white/10 transition-all border border-white/5">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-12 space-y-10 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 ml-1 italic">Announcement_Headline</label>
                                    <input
                                        className="w-full px-8 py-6 bg-white/5 rounded-[30px] border border-white/5 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white/10 transition-all font-black text-white placeholder:text-slate-700"
                                        placeholder="Brief announcement title..."
                                        value={noticeForm.title}
                                        onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 ml-1 italic">Intelligence_Payload</label>
                                    <textarea
                                        className="w-full px-8 py-6 bg-white/5 rounded-[30px] border border-white/5 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white/10 transition-all font-black text-white placeholder:text-slate-700 min-h-[150px]"
                                        placeholder="Detailed message for the network..."
                                        value={noticeForm.content}
                                        onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 ml-1 italic">Target_Cluster</label>
                                        <select
                                            className="w-full px-8 py-6 bg-white/5 rounded-[30px] border border-white/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-white cursor-pointer appearance-none uppercase text-xs"
                                            value={noticeForm.type}
                                            onChange={e => setNoticeForm({ ...noticeForm, type: e.target.value })}
                                        >
                                            <option value="All" className="bg-[#0A0D1E]">Global_Pool</option>
                                            <option value="Student" className="bg-[#0A0D1E]">Student_Nodes</option>
                                            <option value="Recruiter" className="bg-[#0A0D1E]">Recruiter_Nodes</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 ml-1 italic">Priority_Protocol</label>
                                        <select
                                            className="w-full px-8 py-6 bg-white/5 rounded-[30px] border border-white/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-white cursor-pointer appearance-none uppercase text-xs"
                                            value={noticeForm.priority}
                                            onChange={e => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                                        >
                                            <option value="Low" className="bg-[#0A0D1E]">Standard</option>
                                            <option value="Medium" className="bg-[#0A0D1E]">Elevated</option>
                                            <option value="High" className="bg-[#0A0D1E]">Critical_Pulse</option>
                                        </select>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(16,185,129,0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePostNotice}
                                    className="w-full py-8 bg-emerald-600 text-white rounded-[35px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 border border-white/10"
                                >
                                    <Megaphone className="h-6 w-6" /> Initiate_Broadcast
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
