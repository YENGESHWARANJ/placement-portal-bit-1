import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Download,
    AlertTriangle,
    Target,
    Brain,
    Rocket,
    ShieldAlert
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

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

export default function TPOReports() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const res: any = await api.get('/analytics/admin-stats');
            setData(res.data);
        } catch (error) {
            toast.error("Unable to sync intelligence reports");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const res: any = await api.get('/analytics/export-report');
            const csvContent = "data:text/csv;charset=utf-8,"
                + "Name,USN,Branch,CGPA,Status,Aptitude,Coding,Interview\n"
                + res.data.data.map((s: any) => `${s.name},${s.usn},${s.branch},${s.cgpa},${s.status},${s.aptitudeScore},${s.codingScore},${s.interviewScore}`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${res.data.reportName}.csv`);
            document.body.appendChild(link);
            link.click();
            toast.success("Batch Dossier Exported");
        } catch (error) {
            toast.error("Export protocol failed");
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Assembling Batch Intelligence...</p>
        </div>
    );

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20 mt-4"
        >
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-apple-gray-900 tracking-tight leading-none mb-4">Institutional Reports</h1>
                    <p className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em]">Placement Intelligence & Readiness Benchmarking</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="flex items-center justify-center gap-3 bg-apple-gray-900 text-white px-8 py-4.5 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-apple-hover border border-white/10"
                >
                    <Download className="h-4 w-4" /> Export Batch Dossier
                </motion.button>
            </motion.div>

            {/* Core Readiness Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Batch Readiness', val: `${data?.readinessStats?.overall}%`, icon: Rocket, color: 'text-apple-blue', bg: 'bg-apple-blue/5' },
                    { label: 'Placement Velocity', val: `${data?.stats?.placementRate}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
                    { label: 'Talent Pool', val: data?.stats?.totalStudents, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100/50' },
                    { label: 'Active Targets', val: data?.stats?.totalJobs, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50/50' },
                ].map((stat, i) => (
                    <motion.div key={i} variants={stagger.item} className="apple-card p-10 group bg-white border border-apple-gray-50 shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-[40px] -mr-12 -mt-12 opacity-50`} />
                        <div className="relative z-10">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-apple-gray-50/50", stat.bg, stat.color)}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-gray-400 mb-2">{stat.label}</p>
                            <p className="text-4xl font-black text-apple-gray-900 tracking-tighter leading-none">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Visual Readiness Index */}
                <motion.div variants={stagger.item} className="lg:col-span-2 apple-card p-10 md:p-12 border border-apple-gray-50 relative overflow-hidden bg-white shadow-sm">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] -mr-12 -mt-12">
                        <BarChart3 className="h-72 w-72" />
                    </div>
                    <div className="flex items-center gap-5 mb-12">
                        <div className="h-14 w-14 rounded-2xl bg-apple-blue/10 flex items-center justify-center text-apple-blue shadow-inner border border-apple-blue/5">
                            <Brain className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight uppercase">Readiness Vector</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-apple-gray-400 mt-1">Aggregate Talent Performance</p>
                        </div>
                    </div>

                    <div className="h-[350px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <BarChart data={[
                                { name: 'Aptitude', value: data?.readinessStats?.aptitude },
                                { name: 'Coding', value: data?.readinessStats?.coding },
                                { name: 'Interview', value: data?.readinessStats?.interview },
                                { name: 'Overall', value: data?.readinessStats?.overall }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f7" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: '900', letterSpacing: '0.15em', fill: '#d1d1d6' }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f2f2f7', radius: 16 }}
                                    contentStyle={{ borderRadius: '24px', border: '1px solid #f2f2f7', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '20px' }}
                                />
                                <Bar dataKey="value" radius={[14, 14, 14, 14]} barSize={65}>
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0071e3', '#34c759', '#ff9f0a', '#1c1c1e'][index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Growth Opportunities (Skill Gaps) */}
                <motion.div variants={stagger.item} className="bg-apple-gray-900 p-10 md:p-12 rounded-[48px] text-white overflow-hidden relative shadow-2xl border border-black">
                    <div className="absolute -bottom-24 -right-24 opacity-[0.08]">
                        <ShieldAlert className="h-72 w-72" />
                    </div>
                    <div className="flex items-center gap-5 mb-12">
                        <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase">Deficit Matrix</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-1">Critical Intel Gaps</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {data?.skillGaps?.map((skill: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Skill Domain</p>
                                        <p className="text-[13px] font-black uppercase tracking-widest text-white/90">{skill.name}</p>
                                    </div>
                                    <span className="text-[11px] font-black text-orange-400 tabular-nums">{skill.gap}% DEFICIT</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.gap}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_15px_rgba(255,159,10,0.5)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-white/5 rounded-[32px] border border-white/10 relative z-10 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Rocket className="h-4 w-4 text-apple-blue" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-blue">Optimization Hub</p>
                        </div>
                        <p className="text-[14px] font-bold text-white/70 leading-relaxed italic">
                            Redirect operational focus toward <span className="text-white font-black">{data?.skillGaps?.[0]?.name}</span> training protocols to ensure batch equilibrium.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Departmental Sync Velocity */}
            <motion.div variants={stagger.item} className="apple-card p-10 md:p-12 border border-apple-gray-50 bg-white shadow-sm">
                <div className="flex items-center gap-5 mb-12">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-500/5">
                        <PieChart className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight uppercase">Departmental Synchronization</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-apple-gray-400 mt-1">Inter-branch Performance Velocity</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {data?.departmentStats?.map((dept: any, i: number) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-10 bg-apple-gray-50/50 rounded-[40px] border border-apple-gray-100 group hover:bg-white hover:shadow-apple-hover hover:border-apple-gray-200 transition-all duration-500"
                        >
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-apple-gray-400 mb-8 text-center">{dept.name}</p>
                            <div className="relative h-44 w-44 mx-auto">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                    <RePieChart>
                                        <Pie
                                            data={[
                                                { value: dept.placed },
                                                { value: dept.students - dept.placed }
                                            ]}
                                            innerRadius={60}
                                            outerRadius={75}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill="#34c759" className="shadow-lg" />
                                            <Cell fill="#e5e5ea" />
                                        </Pie>
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-apple-gray-900 tracking-tighter tabular-nums leading-none mb-1">{Math.round((dept.placed / dept.students) * 100)}%</span>
                                    <span className="text-[9px] font-black text-apple-blue uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                            <div className="mt-10 text-center">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-apple-gray-100 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[11px] font-black text-apple-gray-900 tracking-widest uppercase">
                                        {dept.placed} <span className="text-apple-gray-300">/</span> {dept.students}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
