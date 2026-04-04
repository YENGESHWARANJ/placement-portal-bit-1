import { useState, useEffect } from "react";
import {
    TrendingUp, TrendingDown, Eye, MousePointerClick, Users,
    Briefcase, Target, Award, Calendar, BarChart3, PieChart,
    Activity, Zap, ArrowUpRight, ArrowDownRight, Download,
    Filter, RefreshCw, Share2, Sparkles
} from "lucide-react";
import { getAdminStats, getStudentAnalytics } from "../services/analytics.service";
import { toast } from "react-hot-toast";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";

interface Metric {
    label: string;
    value: string;
    change: number;
    trend: "up" | "down";
    icon: any;
    color: string;
}

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getStudentAnalytics();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
            toast.error("Unable to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 min-h-[60vh] flex items-center justify-center italic">
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <RefreshCw className="h-16 w-16 text-blue-500 opacity-20" />
                    </motion.div>
                    <p className="animate-pulse text-slate-500 font-black tracking-[0.5em] uppercase text-base">Synchronizing Neural Metrics...</p>
                </div>
            </div>
        );
    }

    const metrics: Metric[] = [
        {
            label: "Total Applications",
            value: stats?.appStats?.total?.toString() || "0",
            change: 8.4,
            trend: "up",
            icon: Briefcase,
            color: "blue"
        },
        {
            label: "Shortlisted",
            value: stats?.appStats?.shortlisted?.toString() || "0",
            change: 12.1,
            trend: "up",
            icon: Award,
            color: "emerald"
        },
        {
            label: "Interviews",
            value: stats?.appStats?.interviews?.toString() || "0",
            change: 5.7,
            trend: "up",
            icon: Calendar,
            color: "purple"
        },
        {
            label: "Success Rate",
            value: stats?.appStats?.total > 0 ? `${Math.round((stats.appStats.hired / stats.appStats.total) * 100)}%` : "0%",
            change: 2.1,
            trend: "up",
            icon: TrendingUp,
            color: "orange"
        }
    ];

    const applicationStats = [
        {
            status: "Pending",
            count: stats?.appStats?.pending || 0,
            color: "bg-yellow-500",
            percentage: stats?.appStats?.total > 0 ? Math.round((stats.appStats.pending / stats.appStats.total) * 100) : 0
        },
        {
            status: "Shortlisted",
            count: stats?.appStats?.shortlisted || 0,
            color: "bg-blue-500",
            percentage: stats?.appStats?.total > 0 ? Math.round((stats.appStats.shortlisted / stats.appStats.total) * 100) : 0
        },
        {
            status: "Interview",
            count: stats?.appStats?.interviews || 0,
            color: "bg-purple-500",
            percentage: stats?.appStats?.total > 0 ? Math.round((stats.appStats.interviews / stats.appStats.total) * 100) : 0
        },
        {
            status: "Rejected",
            count: stats?.appStats?.rejected || 0,
            color: "bg-red-500",
            percentage: stats?.appStats?.total > 0 ? Math.round((stats.appStats.rejected / stats.appStats.total) * 100) : 0
        },
        {
            status: "Selected",
            count: stats?.appStats?.hired || 0,
            color: "bg-emerald-500",
            percentage: stats?.appStats?.total > 0 ? Math.round((stats.appStats.hired / stats.appStats.total) * 100) : 0
        }
    ];

    const topSkills = stats?.cognitiveProfile?.map((s: any) => ({
        name: s.subject,
        demand: Math.floor(Math.random() * 20) + 75, // Simulated demand
        proficiency: Math.round(s.A)
    })) || [];

    const recentActivity = stats?.recentActivity?.map((a: any) => ({
        action: `${a.type} updated to ${a.status}`,
        time: new Date(a.date).toLocaleDateString(),
        type: a.type.toLowerCase()
    })) || [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">

            {/* Elite Header */}
            <div className="relative group px-2 sm:px-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 to-pink-500/30 rounded-[30px] sm:rounded-[60px] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-gradient-to-r from-rose-500 to-pink-500 text-slate-900 p-6 sm:p-14 rounded-[30px] sm:rounded-[60px] shadow-[0_20px_60px_rgba(244,63,94,0.3)] overflow-hidden border-none">
                    <div className="absolute top-0 right-0 p-20 sm:p-40 bg-slate-100 rounded-full blur-[60px] sm:blur-[100px] -mr-10 -mt-10 sm:-mr-20 sm:-mt-20 pointer-events-none group-hover:bg-slate-200 transition-all duration-1000"></div>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-10 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="h-16 w-16 sm:h-24 sm:w-24 bg-slate-200 backdrop-blur-md rounded-[20px] sm:rounded-[35px] flex items-center justify-center shadow-inner border border-white/30 shrink-0"
                            >
                                <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 text-slate-900" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 mb-2 sm:mb-3 tracking-tighter italic drop-shadow-md">
                                    NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">ANALYTICS</span>
                                </h1>
                                <p className="text-slate-900/80 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-base">
                                    Cognitive Displacement · Market Resonance
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none justify-center bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-900 px-4 sm:px-8 py-3 sm:py-5 rounded-[18px] sm:rounded-[28px] text-xs sm:text-base font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 backdrop-blur-md">
                                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                                Export
                            </button>
                            <button onClick={fetchAnalytics} className="flex-1 sm:flex-none justify-center bg-white text-rose-500 px-4 sm:px-8 py-3 sm:py-5 rounded-[18px] sm:rounded-[28px] text-xs sm:text-base font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl">
                                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                                Recalibrate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex flex-wrap gap-2 sm:gap-4 px-2">
                {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`flex-1 sm:flex-none px-3 sm:px-8 py-2 sm:py-4 rounded-full text-[10px] sm:text-base font-black uppercase tracking-widest transition-all italic border ${timeRange === range
                            ? "bg-white text-slate-900 border-white shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                            : "bg-slate-50 border border-slate-100 border-slate-100 text-slate-500 hover:text-slate-500 hover:bg-slate-100"
                            }`}
                    >
                        {range === "7d" ? "07 DAYS" : range === "30d" ? "30 DAYS" : range === "90d" ? "90 DAYS" : "01 YEAR"}
                    </button>
                ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-2 sm:px-0">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-5 sm:p-10 rounded-[30px] sm:rounded-[50px] border border-slate-100 shadow-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-12 sm:p-24 bg-slate-50 border border-slate-100 rounded-full blur-2xl sm:blur-3xl -mr-6 -mt-6 sm:-mr-12 sm:-mt-12 group-hover:bg-slate-100 transition-colors" />
                            <div className="flex items-start justify-between mb-4 sm:mb-8 relative z-10">
                                <div className={cn("h-10 w-10 sm:h-16 sm:w-16 rounded-[15px] sm:rounded-[25px] flex items-center justify-center transition-transform group-hover:rotate-12",
                                    metric.color === 'blue' ? "bg-cyan-500/10" :
                                        metric.color === 'emerald' ? "bg-emerald-500/10" :
                                            metric.color === 'purple' ? "bg-purple-500/10" : "bg-orange-500/10")}>
                                    <Icon className={cn("h-5 w-5 sm:h-8 sm:w-8",
                                        metric.color === 'blue' ? "text-cyan-600" :
                                            metric.color === 'emerald' ? "text-emerald-600" :
                                                metric.color === 'purple' ? "text-purple-400" : "text-orange-400")} />
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${metric.trend === "up"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-rose-500/10 text-rose-600"
                                    } border border-slate-100`}>
                                    {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    <span className="text-[10px] sm:text-base font-black">{Math.abs(metric.change)}%</span>
                                </div>
                            </div>
                            <p className="text-[8px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-3 relative z-10 italic">{metric.label}</p>
                            <p className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-slate-900 tracking-tighter relative z-10 italic">{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 px-2 sm:px-0">

                {/* Application Status Distribution */}
                <div className="bg-white p-6 sm:p-12 rounded-[30px] sm:rounded-[60px] border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-40 bg-purple-500/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-purple-500/10 rounded-[20px] sm:rounded-[25px] flex items-center justify-center border border-purple-500/20 shadow-lg shrink-0">
                            <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-900 tracking-tight italic uppercase">Status Matrix</h3>
                            <p className="text-[10px] sm:text-base font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em]">Resource Allocation Flow</p>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8 relative z-10">
                        {applicationStats.map((stat, index) => (
                            <div key={index} className="group/stat">
                                <div className="flex items-center justify-between mb-2 sm:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${stat.color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`} />
                                        <span className="text-[10px] sm:text-sm font-black text-slate-700 dark:text-slate-500 italic uppercase tracking-wider group-hover/stat:text-slate-900 transition-colors">{stat.status}</span>
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-900 italic">{stat.count}</span>
                                        <span className="text-[10px] sm:text-sm font-black text-slate-500 uppercase">{stat.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 sm:h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.percentage}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                                        className={cn("h-full rounded-full shadow-lg", stat.color)}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-purple-500/5 rounded-[25px] sm:rounded-[35px] border border-purple-500/10 relative z-10 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]" />
                        <p className="text-[8px] sm:text-xs font-black text-purple-400 flex items-center gap-2 sm:gap-4 italic tracking-wide">
                            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 animate-pulse" />
                            NEURAL ALIGNMENT: POSITIVE SYNC DETECTED IN TOP RECRUITER ORBITS.
                        </p>
                    </div>
                </div>

                {/* Top Skills Analysis */}
                <div className="bg-white p-6 sm:p-12 rounded-[30px] sm:rounded-[60px] border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-40 bg-orange-500/5 rounded-full blur-[100px] -ml-20 -mt-20"></div>
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-orange-500/10 rounded-[20px] sm:rounded-[25px] flex items-center justify-center border border-orange-500/20 shadow-lg shrink-0">
                            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-900 tracking-tight italic uppercase">Cognitive Radar</h3>
                            <p className="text-[10px] sm:text-base font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em]">Requirement vs Resonance</p>
                        </div>
                    </div>

                    <div className="space-y-8 sm:space-y-10 relative z-10">
                        {topSkills.map((skill: any, index: number) => (
                            <div key={index} className="group/skill">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <span className="text-[10px] sm:text-sm font-black text-slate-900 dark:text-slate-900 italic uppercase tracking-tighter group-hover/skill:text-orange-400 transition-colors">{skill.name}</span>
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.1em]">Feed</span>
                                            <span className="text-[10px] sm:text-xs font-black text-blue-600 italic">{skill.demand}%</span>
                                        </div>
                                        <div className="h-6 sm:h-8 w-px bg-slate-50 border border-slate-100" />
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.1em]">Sync</span>
                                            <span className="text-[10px] sm:text-xs font-black text-emerald-600 italic">{skill.proficiency}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-2 sm:h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative p-0.5 border border-slate-100">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-blue-500/10 animate-pulse"
                                        style={{ width: `${skill.demand}%` }}
                                    ></div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.proficiency}%` }}
                                        transition={{ duration: 2, ease: "easeOut", delay: index * 0.1 }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] relative z-10"
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white p-6 sm:p-12 rounded-[30px] sm:rounded-[60px] border border-slate-100 shadow-2xl relative overflow-hidden mx-2 sm:mx-0">
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 bg-cyan-500/10 rounded-[20px] sm:rounded-[25px] flex items-center justify-center border border-cyan-500/20 shadow-lg shrink-0">
                        <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-900 tracking-tight italic uppercase">Operational Log</h3>
                        <p className="text-[10px] sm:text-base font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em]">System Events</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {recentActivity.map((activity: any, index: number) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.06)" }}
                            className="p-5 sm:p-8 bg-white/[0.03] border border-slate-100 rounded-[30px] sm:rounded-[40px] flex items-center gap-4 sm:gap-6 group transition-all"
                        >
                            <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-[16px] sm:rounded-[22px] flex items-center justify-center shrink-0 shadow-lg border border-slate-100 ${activity.type === "view" ? "bg-cyan-500/10" :
                                activity.type === "application" ? "bg-purple-500/10" :
                                    activity.type === "interview" ? "bg-emerald-500/10" :
                                        "bg-orange-500/10"
                                }`}>
                                {activity.type === "view" ? <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" /> :
                                    activity.type === "application" ? <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" /> :
                                        activity.type === "interview" ? <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" /> :
                                            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 dark:text-slate-900 text-sm sm:text-lg truncate italic group-hover:text-cyan-600 transition-colors tracking-tight leading-none mb-1 sm:mb-2 uppercase">{activity.action}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activity.time}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Performance Score Card */}
            <div className="neural-map bg-[#080B1A] p-8 sm:p-20 rounded-[40px] sm:rounded-[70px] shadow-2xl relative overflow-hidden group border border-slate-100 mx-2 sm:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
                <div className="absolute top-0 right-0 p-40 sm:p-80 bg-blue-500/5 rounded-full blur-[80px] sm:blur-[150px] -mr-20 -mt-20 sm:-mr-40 sm:-mt-40"></div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-16">
                        <div className="text-center lg:text-left">
                            <p className="text-cyan-600 text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-4 sm:mb-6 italic">Neural Resonance Factor</p>
                            <div className="flex items-baseline justify-center lg:justify-start gap-2 sm:gap-4 mb-6 sm:mb-10">
                                <span className="text-7xl sm:text-8xl md:text-[11rem] font-black text-slate-900 tracking-tighter italic leading-none drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">8.7</span>
                                <span className="text-2xl sm:text-3xl md:text-5xl text-slate-900/20 font-black italic tracking-tighter">/10</span>
                            </div>
                            <div className="inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-2 sm:py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                                </motion.div>
                                <span className="text-[10px] sm:text-base font-black text-emerald-600 uppercase tracking-[0.2em] sm:tracking-[0.4em] italic text-center">Elite Candidate Orbit Verified</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full lg:w-auto">
                            {[
                                { icon: TrendingUp, value: "+24%", label: "SYNC VELOCITY", color: "text-cyan-600" },
                                { icon: Users, value: "ELITE", label: "MARKET RANKING", color: "text-indigo-600" }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -15, scale: 1.05 }}
                                    className="bg-slate-50 border border-slate-100 backdrop-blur-3xl border border-slate-200 p-6 sm:p-12 rounded-[30px] sm:rounded-[50px] text-center w-full sm:min-w-[240px] shadow-md shadow-slate-200/40 flex flex-col items-center justify-center relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <s.icon className={`h-6 w-6 sm:h-10 sm:w-10 ${s.color} mb-3 sm:mb-6 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                    <p className="text-3xl sm:text-5xl font-black text-slate-900 mb-1 sm:mb-3 italic tracking-tighter drop-shadow-lg">{s.value}</p>
                                    <p className="text-[10px] sm:text-base font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] italic">{s.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
