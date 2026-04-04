import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
    Plus, X, Eye, Briefcase, Users, TrendingUp, BarChart3,
    ChevronRight, Rocket, Target, Activity, FileText, Zap,
    Download, CheckCircle2, Calendar, ArrowRight, Star, Clock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getRecruiterStats } from '../../services/recruiter.service';

const stagger = {
    container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.07 } } },
    item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function MentorDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReports, setShowReports] = useState(false);
    const [compiling, setCompiling] = useState(false);

    const handleExportReport = async () => {
        setCompiling(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            const blob = new Blob(
                [`Mentor Analytics Report\n\nApplicants: ${data?.stats?.totalApplicants ?? 0}\nJobs: ${data?.stats?.totalJobs ?? 0}\nShortlisted: ${data?.stats?.shortlistedCount ?? 0}`],
                { type: 'text/plain' }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `staff-report-${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Report downloaded');
            setShowReports(false);
        } catch {
            toast.error('Export failed');
        } finally {
            setCompiling(false);
        }
    };

    useEffect(() => {
        getRecruiterStats()
            .then(d => setData(d))
            .catch(() => toast.error("Unable to load recruitment data"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6 pb-10">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-[30px]" />)}
        </div>
    );

    const pipelineData = data?.pipeline || [];
    const stats = data?.stats || {};

    const metrics = [
        { label: "Total Applicants", value: stats.totalApplicants || 0, icon: Users, color: "text-apple-blue", bg: "bg-apple-blue/5", trend: "+12% this week" },
        { label: "Active Listings", value: stats.totalJobs || 0, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50", trend: "across all roles" },
        { label: "Shortlisted", value: stats.shortlistedCount || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", trend: "+5 today" },
        { label: "Interviews", value: stats.interviewCount || 0, icon: Calendar, color: "text-orange-500", bg: "bg-orange-50", trend: "scheduled" },
    ];

    const quickActions = [
        { label: "Post New Job", icon: Plus, to: "/jobs/create", color: "bg-white text-slate-900 hover:bg-black" },
        { label: "Browse Talent", icon: Users, to: "/talent-discovery", color: "bg-apple-blue text-slate-900 hover:bg-apple-blue-dark shadow-apple-hover" },
        { label: "Interviews", icon: Calendar, to: "/interviews/ledger", color: "bg-white text-apple-gray-900 border border-apple-gray-100 hover:bg-apple-gray-50" },
        { label: "Analytics", icon: BarChart3, to: "/hiring-intel", color: "bg-white text-apple-gray-900 border border-apple-gray-100 hover:bg-apple-gray-50" },
    ];

    return (
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-10 pb-10 bg-apple-gray-50/50 min-h-screen p-8 rounded-[40px]">

            {/* ── HEADER ────────────────────────────────────────────── */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight leading-none mb-3">
                        Welcome, {user?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-apple-gray-400 font-bold uppercase tracking-[0.3em] text-base">Mentor Command Center // Operational</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/jobs/create")}
                    className="px-8 py-4 bg-apple-blue text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest shadow-apple-hover flex items-center justify-center gap-3 w-full md:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    New Listing
                </motion.button>
            </motion.div>

            {/* ── KPI METRICS ───────────────────────────────────────── */}
            <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="apple-card p-6 sm:p-8 bg-white relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${m.bg} rounded-full blur-[40px] -mr-12 -mt-12 pointer-events-none transition-all group-hover:blur-[60px]`} />
                        <div className="relative z-10">
                            <div className={cn("h-12 w-12 rounded-[18px] flex items-center justify-center mb-6 shadow-sm border border-apple-gray-50", m.bg)}>
                                <m.icon className={cn("h-6 w-6", m.color)} />
                            </div>
                            <p className="text-3xl sm:text-4xl font-black text-apple-gray-900 tracking-tighter mb-1">{m.value}</p>
                            <p className="text-apple-gray-500 text-sm font-bold uppercase tracking-wider">{m.label}</p>
                            <div className="mt-4 pt-4 border-t border-apple-gray-50">
                                <p className="text-apple-gray-300 text-base font-bold uppercase tracking-widest">{m.trend}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* ── QUICK ACTIONS ─────────────────────────────────────── */}
            <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((a, i) => (
                    <Link
                        key={i}
                        to={a.to}
                        className={cn(
                            "flex items-center justify-center gap-3 px-6 py-4 sm:py-5 rounded-[20px] sm:rounded-[24px] font-black text-sm sm:base uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-sm",
                            a.color
                        )}
                    >
                        <a.icon className="h-4 w-4 shrink-0" />
                        {a.label}
                    </Link>
                ))}
            </motion.div>

            {/* ── MAIN GRID ─────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Student Placements Funnel Chart */}
                <motion.div variants={stagger.item} className="apple-card p-10 lg:col-span-2 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight">Student Placements Funnel</h3>
                            <p className="text-apple-gray-400 text-base font-black uppercase tracking-[0.3em] mt-1">Cross-Stage Talent Distribution</p>
                        </div>
                        <Link to="/hiring-intel" className="p-4 bg-apple-gray-50 rounded-2xl text-apple-gray-400 hover:text-apple-blue transition-all w-fit group">
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                            <BarChart data={pipelineData} barSize={48}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f7" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: '#8e8e93', fontSize: 10, fontWeight: 700 }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,113,227,0.02)' }}
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                        padding: '12px 16px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                    {pipelineData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color === '#3b82f6' ? '#0071e3' : (entry.color || "#0071e3")} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Progress Metrics */}
                <motion.div variants={stagger.item} className="apple-card p-10 bg-white">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-apple-gray-400">Pipeline Velocity</h3>
                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-8">
                        {[
                            { label: "Applicants", value: stats.totalApplicants || 0, max: 1000, color: "bg-apple-blue" },
                            { label: "Listings", value: stats.totalJobs || 0, max: 50, color: "bg-purple-500" },
                            { label: "Shortlisted", value: stats.shortlistedCount || 0, max: 200, color: "bg-emerald-500" },
                            { label: "Interviews", value: stats.interviewCount || 0, max: 100, color: "bg-orange-500" },
                        ].map((m, i) => {
                            const pct = Math.min(Math.round((m.value / m.max) * 100), 100);
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-base font-bold text-apple-gray-400 uppercase tracking-widest">{m.label}</span>
                                        <span className="text-xl font-black text-apple-gray-900 tracking-tighter">{m.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-apple-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={cn("h-full rounded-full shadow-sm", m.color)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* ── BOTTOM GRID ───────────────────────────────────────── */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Recent Applicants */}
                <motion.div variants={stagger.item} className="apple-card p-10 lg:col-span-2 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight">Recent Talent Hub</h3>
                        <Link to="/talent-discovery" className="px-5 py-2 bg-apple-gray-50 rounded-full text-base font-bold text-apple-gray-500 uppercase tracking-widest hover:bg-apple-gray-100 transition-all">
                            View Discovery
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {data?.recentApplications?.length > 0
                            ? data.recentApplications.slice(0, 5).map((app: any, i: number) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 6 }}
                                    className="flex items-center gap-6 p-5 rounded-[24px] bg-apple-gray-50/50 hover:bg-apple-gray-50 transition-all cursor-pointer group"
                                    onClick={() => navigate("/talent-discovery")}
                                >
                                    <div className="h-12 w-12 rounded-[16px] bg-white flex items-center justify-center text-slate-900 text-base font-black shrink-0 shadow-lg">
                                        {app.studentId?.name?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-apple-gray-900 text-lg truncate leading-none mb-1.5">{app.studentId?.name || "Student"}</p>
                                        <p className="text-apple-gray-400 text-sm font-bold uppercase tracking-wide truncate">{app.jobId?.title}</p>
                                    </div>
                                    <span className="px-4 py-1.5 bg-apple-blue/10 text-apple-blue rounded-full text-xs font-black uppercase tracking-widest border border-apple-blue/10">Applied</span>
                                    <ChevronRight className="h-5 w-5 text-apple-gray-200 group-hover:text-apple-blue transition-colors shrink-0" />
                                </motion.div>
                            ))
                            : (
                                <div className="py-16 text-center">
                                    <Users className="h-12 w-12 text-apple-gray-100 mx-auto mb-4" />
                                    <p className="text-apple-gray-400 text-sm font-bold uppercase tracking-widest">No Active Applicants</p>
                                </div>
                            )
                        }
                    </div>
                </motion.div>

                {/* Sidebar cards */}
                <div className="space-y-8">
                    {/* Profile card */}
                    <motion.div variants={stagger.item} className="apple-card p-8 bg-white text-slate-900 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/20 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="h-14 w-14 rounded-[20px] bg-white text-apple-gray-900 flex items-center justify-center text-xl font-black shadow-2xl">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-xl tracking-tight leading-none mb-1.5">{user?.name}</p>
                                    <p className="text-apple-gray-400 text-base font-bold uppercase tracking-widest">Verified Mentor</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <InfoRow icon={Briefcase} label={user?.company || "Strategic Partner"} />
                                <InfoRow icon={Target} label="Talent Acquisition Hub" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Export report */}
                    <motion.div variants={stagger.item} className="apple-card p-8 bg-white border border-apple-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-apple-blue/5 flex items-center justify-center">
                                <Download className="h-5 w-5 text-apple-blue" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-apple-gray-400">Intelligence Export</h3>
                        </div>
                        <p className="text-apple-gray-500 text-base font-medium mb-8 leading-relaxed">
                            Generate a comprehensive strategic brief of your recruitment funnel and metrics.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowReports(true)}
                            className="w-full py-4 bg-apple-gray-50 text-apple-gray-900 rounded-[18px] text-sm font-black uppercase tracking-widest hover:bg-apple-gray-100 transition-all flex items-center justify-center gap-3"
                        >
                            <FileText className="h-4 w-4" />
                            Assemble Brief
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Report Export Modal */}
            {showReports && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/40 backdrop-blur-md"
                        onClick={() => setShowReports(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight">Intelligence Export</h3>
                            <button onClick={() => setShowReports(false)} className="h-10 w-10 rounded-full bg-apple-gray-50 text-apple-gray-400 hover:text-apple-gray-900 flex items-center justify-center transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-apple-gray-500 text-[16.5px] font-medium mb-10 leading-relaxed">
                            You are about to export a secure summary of your current recruitment operational data for external review.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setShowReports(false)} className="py-4 px-8 bg-apple-gray-50 text-apple-gray-900 rounded-[20px] text-sm font-black uppercase tracking-widest hover:bg-apple-gray-100 transition-all">Cancel</button>
                            <button
                                onClick={handleExportReport}
                                disabled={compiling}
                                className="flex-1 py-4 bg-apple-blue text-slate-900 rounded-[20px] text-sm font-black uppercase tracking-widest shadow-apple-hover disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                            >
                                {compiling ? (
                                    <>
                                        <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" />
                                        Initialize Download
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

function InfoRow({ icon: Icon, label }: { icon: React.ComponentType<any>; label: string }) {
    return (
        <div className="flex items-center gap-3 text-lg font-bold text-apple-gray-400 uppercase tracking-wide">
            <Icon className="h-4 w-4 text-apple-blue shrink-0" />
            <span className="truncate">{label}</span>
        </div>
    );
}
