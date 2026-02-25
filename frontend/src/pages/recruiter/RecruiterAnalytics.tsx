import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, TrendingUp, Target, Award, PieChart as PieIcon,
    BarChart2, Calendar, Filter, Download, ChevronRight, MapPin,
    ArrowUpRight, Search, Activity, Zap, Sparkles, Globe, ShieldCheck
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { getRecruiterStats } from '../../services/recruiter.service';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const APPLE_COLORS = ['#0071e3', '#62d2fb', '#5e5ce6', '#af52de', '#34c759'];

const stagger = {
    container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, damping: 25, stiffness: 200 }
        }
    }
};

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

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Intel...</p>
        </div>
    );
    if (!data) return <div className="p-20 text-center text-apple-gray-400 font-bold">No Data Available</div>;

    const { stats, recruitmentTrends, candidateSource } = data;
    const APPLE_COLORS = ['#0071e3', '#62d2fb', '#5e5ce6', '#af52de', '#34c759'];

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="pb-20 space-y-12 mt-4"
        >
            {/* Header Section */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                <div>
                    <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight mb-2">Hiring Intelligence</h1>
                    <p className="text-apple-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Dynamic assessment of recruitment velocity & talent acquisition metrics</p>
                </div>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest text-apple-gray-900 border border-apple-gray-100 shadow-sm hover:bg-apple-gray-50 transition-all"
                    >
                        <Download className="h-4 w-4" /> Export Report
                    </motion.button>
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Applicants', value: stats.totalApplicants, trend: '+12.4%', icon: Users, color: 'text-apple-blue', bg: 'bg-apple-blue/5' },
                    { label: 'Active Pipeline', value: stats.totalJobs, trend: 'STABLE', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-100/50' },
                    { label: 'Target Success', value: stats.shortlistedCount, trend: '+5.2%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Hiring Reviews', value: stats.interviewCount, trend: 'ACTIVE', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={stagger.item}
                        className="apple-card p-10 bg-white relative overflow-hidden group border border-apple-gray-50 shadow-sm"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-[40px] -mr-12 -mt-12 pointer-events-none opacity-40`} />
                        <div className="relative z-10">
                            <div className={cn("h-12 w-12 rounded-[20px] flex items-center justify-center mb-8 shadow-inner border border-apple-gray-50/50", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-4xl font-black text-apple-gray-900 tracking-tighter mb-1 leading-none">{stat.value}</h3>
                                    <p className="text-[10px] font-black text-apple-gray-400 uppercase tracking-widest mt-3">{stat.label}</p>
                                </div>
                                <div className="text-right">
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border", stat.color, stat.bg.replace('bg-', 'border-').replace('/5', '/20'))}>{stat.trend}</span>
                                    <p className="text-[8px] font-black text-apple-gray-300 uppercase mt-3">Verified</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Trend Chart */}
                <motion.div
                    variants={stagger.item}
                    className="lg:col-span-2 apple-card p-10 md:p-12 bg-white border border-apple-gray-50 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight uppercase">Momentum Vector</h3>
                            <p className="text-[10px] text-apple-gray-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                                <Activity className="h-4 w-4 text-apple-blue" /> Analytical Flow Matrix
                            </p>
                        </div>
                        <div className="flex gap-8 bg-apple-gray-50 p-4 rounded-2xl border border-apple-gray-100">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-apple-gray-900">
                                <div className="h-2.5 w-2.5 rounded-full bg-apple-blue shadow-[0_0_8px_rgba(0,113,227,0.5)]"></div> Intake
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-apple-gray-900">
                                <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,159,10,0.5)]"></div> Selection
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <AreaChart data={recruitmentTrends}>
                                <defs>
                                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0071e3" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorHi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff9f0a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ff9f0a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f7" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#d1d1d6', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#d1d1d6', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '24px',
                                        border: '1px solid #f2f2f7',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                                        padding: '20px'
                                    }}
                                    itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="applicants"
                                    stroke="#0071e3"
                                    strokeWidth={5}
                                    fillOpacity={1}
                                    fill="url(#colorApp)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hires"
                                    stroke="#ff9f0a"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorHi)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Donut Chart */}
                <motion.div
                    variants={stagger.item}
                    className="apple-card p-12 bg-white border border-apple-gray-50 shadow-sm"
                >
                    <div className="mb-12 text-center">
                        <h3 className="text-xl font-black text-apple-gray-900 tracking-tight mb-3 uppercase">Sourcing DNA</h3>
                        <p className="text-[10px] text-apple-gray-400 font-black uppercase tracking-[0.3em]">Origin Signal Distribution</p>
                    </div>

                    <div className="h-[280px] w-full relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            >
                                <Globe className="h-6 w-6 text-apple-gray-100 mb-3" />
                            </motion.div>
                            <p className="text-4xl font-black text-apple-gray-900 tracking-tighter leading-none">100%</p>
                            <p className="text-[9px] font-black text-apple-blue uppercase tracking-widest mt-2">Verified</p>
                        </div>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <PieChart>
                                <Pie
                                    data={candidateSource}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={110}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {candidateSource.map((entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={APPLE_COLORS[index % APPLE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '20px',
                                        border: '1px solid #f2f2f7',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-6 mt-16">
                        {candidateSource.map((source: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-apple-gray-50/50 border border-transparent hover:border-apple-gray-100 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div
                                        className="h-3.5 w-3.5 rounded-full shadow-sm"
                                        style={{ backgroundColor: APPLE_COLORS[i % APPLE_COLORS.length] }}
                                    />
                                    <span className="text-[11px] font-black text-apple-gray-400 uppercase tracking-widest leading-none">{source.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 w-16 bg-apple-gray-50 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${source.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className="h-full bg-apple-blue shadow-[0_0_8px_rgba(0,113,227,0.3)]"
                                        />
                                    </div>
                                    <span className="text-[13px] font-black text-apple-gray-900 tracking-tight transition-colors group-hover:text-apple-blue">{source.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="mt-12 p-6 bg-apple-gray-50/80 rounded-[32px] border border-apple-gray-100 flex items-center gap-5 group cursor-pointer hover:bg-white hover:shadow-apple-hover transition-all"
                    >
                        <div className="h-11 w-11 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-apple-gray-50 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-apple-gray-900 leading-none mb-1.5">Intel integrity</p>
                            <p className="text-[10px] font-black text-apple-gray-300 uppercase tracking-tighter">Chain-verified Sourcing</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-apple-gray-200 ml-auto group-hover:text-apple-blue transition-colors" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
