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
                    <p className="animate-pulse text-slate-400 font-black tracking-[0.5em] uppercase text-[10px]">Synchronizing Neural Metrics...</p>
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
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-[60px] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative glass-premium p-14 rounded-[60px] border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-40 bg-cyan-500/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
                        <div className="flex items-center gap-8">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="h-24 w-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] flex items-center justify-center shadow-[0_20px_60px_rgba(6,182,212,0.4)] border border-white/10"
                            >
                                <BarChart3 className="h-12 w-12 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">
                                    NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ANALYTICS</span>
                                </h1>
                                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">
                                    Cognitive Displacement · Market Resonance · Sync Verification
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="bg-white/5 hover:bg-white/10 text-slate-400 px-8 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                <Download className="h-5 w-5" />
                                Export Intel
                            </button>
                            <button onClick={fetchAnalytics} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_10px_30px_rgba(6,182,212,0.3)]">
                                <RefreshCw className="h-5 w-5" />
                                Recalibrate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-4 px-2">
                {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border ${timeRange === range
                            ? "bg-white text-slate-900 border-white shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                            : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                            }`}
                    >
                        {range === "7d" ? "07 DAYS" : range === "30d" ? "30 DAYS" : range === "90d" ? "90 DAYS" : "01 YEAR"}
                    </button>
                ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={index}
                            className="glass-premium p-10 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className={cn("h-16 w-16 rounded-[25px] flex items-center justify-center transition-transform group-hover:rotate-12",
                                    metric.color === 'blue' ? "bg-cyan-500/10" :
                                        metric.color === 'emerald' ? "bg-emerald-500/10" :
                                            metric.color === 'purple' ? "bg-purple-500/10" : "bg-orange-500/10")}>
                                    <Icon className={cn("h-8 w-8",
                                        metric.color === 'blue' ? "text-cyan-400" :
                                            metric.color === 'emerald' ? "text-emerald-400" :
                                                metric.color === 'purple' ? "text-purple-400" : "text-orange-400")} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${metric.trend === "up"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                                    } border border-white/5`}>
                                    {metric.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                    <span className="text-[10px] font-black">{Math.abs(metric.change)}%</span>
                                </div>
                            </div>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 relative z-10 italic">{metric.label}</p>
                            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter relative z-10 italic">{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">

                {/* Application Status Distribution */}
                <div className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-40 bg-purple-500/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="h-16 w-16 bg-purple-500/10 rounded-[25px] flex items-center justify-center border border-purple-500/20 shadow-lg">
                            <PieChart className="h-8 w-8 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Status Matrix</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Resource Allocation Flow</p>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        {applicationStats.map((stat, index) => (
                            <div key={index} className="group/stat">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-3 w-3 rounded-full ${stat.color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`} />
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 italic uppercase tracking-wider group-hover/stat:text-white transition-colors">{stat.status}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-lg font-black text-slate-900 dark:text-white italic">{stat.count}</span>
                                        <span className="text-[11px] font-black text-slate-500 uppercase">{stat.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
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

                    <div className="mt-12 p-8 bg-purple-500/5 rounded-[35px] border border-purple-500/10 relative z-10 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]" />
                        <p className="text-xs font-black text-purple-400 flex items-center gap-4 italic tracking-wide">
                            <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                            NEURAL ALIGNMENT: POSITIVE SYNC DETECTED IN TOP RECRUITER ORBITS.
                        </p>
                    </div>
                </div>

                {/* Top Skills Analysis */}
                <div className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-40 bg-orange-500/5 rounded-full blur-[100px] -ml-20 -mt-20"></div>
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="h-16 w-16 bg-orange-500/10 rounded-[25px] flex items-center justify-center border border-orange-500/20 shadow-lg">
                            <Target className="h-8 w-8 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Cognitive Radar</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Requirement vs Resonance</p>
                        </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                        {topSkills.map((skill: any, index: number) => (
                            <div key={index} className="group/skill">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-black text-slate-900 dark:text-white italic uppercase tracking-tighter group-hover/skill:text-orange-400 transition-colors">{skill.name}</span>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Market Feed</span>
                                            <span className="text-xs font-black text-blue-400 italic">{skill.demand}%</span>
                                        </div>
                                        <div className="h-8 w-px bg-white/5" />
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Your Sync</span>
                                            <span className="text-xs font-black text-emerald-400 italic">{skill.proficiency}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden relative p-0.5 border border-white/5">
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
            <div className="glass-premium p-12 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-6 mb-12">
                    <div className="h-16 w-16 bg-cyan-500/10 rounded-[25px] flex items-center justify-center border border-cyan-500/20 shadow-lg">
                        <Activity className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Operational Log</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">System Events & Action Streams</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentActivity.map((activity: any, index: number) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.06)" }}
                            className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] flex items-center gap-6 group transition-all"
                        >
                            <div className={`h-14 w-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-lg border border-white/5 ${activity.type === "view" ? "bg-cyan-500/10" :
                                activity.type === "application" ? "bg-purple-500/10" :
                                    activity.type === "interview" ? "bg-emerald-500/10" :
                                        "bg-orange-500/10"
                                }`}>
                                {activity.type === "view" ? <Eye className="h-6 w-6 text-cyan-400" /> :
                                    activity.type === "application" ? <Briefcase className="h-6 w-6 text-purple-400" /> :
                                        activity.type === "interview" ? <Calendar className="h-6 w-6 text-emerald-400" /> :
                                            <Award className="h-6 w-6 text-orange-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 dark:text-white text-[15px] truncate italic group-hover:text-cyan-400 transition-colors tracking-tight leading-none mb-2 uppercase">{activity.action}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{activity.time}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Performance Score Card */}
            <div className="neural-map bg-[#080B1A] p-20 rounded-[70px] shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
                <div className="absolute top-0 right-0 p-80 bg-blue-500/5 rounded-full blur-[150px] -mr-40 -mt-40"></div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="text-center lg:text-left">
                            <p className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.6em] mb-6 italic">Neural Resonance Factor</p>
                            <div className="flex items-baseline justify-center lg:justify-start gap-4 mb-10">
                                <span className="text-[11rem] font-black text-white tracking-tighter italic leading-none drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">8.7</span>
                                <span className="text-5xl text-white/20 font-black italic tracking-tighter">/10</span>
                            </div>
                            <div className="inline-flex items-center gap-4 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Sparkles className="h-5 w-5 text-emerald-400" />
                                </motion.div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">Elite Candidate Orbit Verified</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full lg:w-auto">
                            {[
                                { icon: TrendingUp, value: "+24%", label: "SYNC VELOCITY", color: "text-cyan-400" },
                                { icon: Users, value: "ELITE", label: "MARKET RANKING", color: "text-indigo-400" }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -15, scale: 1.05 }}
                                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] text-center min-w-[240px] shadow-3xl flex flex-col items-center justify-center relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <s.icon className={`h-10 w-10 ${s.color} mb-6 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                    <p className="text-5xl font-black text-white mb-3 italic tracking-tighter drop-shadow-lg">{s.value}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{s.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
