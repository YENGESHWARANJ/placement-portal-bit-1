import { useState, useEffect } from "react";
import {
    TrendingUp, TrendingDown, Eye, MousePointerClick, Users,
    Briefcase, Target, Award, Calendar, BarChart3, PieChart,
    Activity, Zap, ArrowUpRight, ArrowDownRight, Download,
    Filter, RefreshCw, Share2
} from "lucide-react";
import { getAdminStats } from "../services/analytics.service";
import { toast } from "react-hot-toast";

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
            const data = await getAdminStats();
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
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-slate-900 rounded-[35px] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const metrics: Metric[] = [
        {
            label: "Total Students",
            value: stats?.stats?.totalStudents?.toString() || "0",
            change: 12.5,
            trend: "up",
            icon: Users,
            color: "blue"
        },
        {
            label: "Students Placed",
            value: stats?.stats?.placedStudents?.toString() || "0",
            change: 8.3,
            trend: "up",
            icon: Briefcase,
            color: "emerald"
        },
        {
            label: "Active Jobs",
            value: stats?.stats?.totalJobs?.toString() || "0",
            change: 5.7,
            trend: "up",
            icon: Target,
            color: "purple"
        },
        {
            label: "Placement Rate",
            value: `${stats?.stats?.placementRate || 0}%`,
            change: 3.2,
            trend: "up",
            icon: TrendingUp,
            color: "orange"
        }
    ];

    const applicationStats = [
        { status: "Pending", count: 8, color: "bg-yellow-500", percentage: 33 },
        { status: "Shortlisted", count: 6, color: "bg-blue-500", percentage: 25 },
        { status: "Interview", count: 4, color: "bg-purple-500", percentage: 17 },
        { status: "Rejected", count: 4, color: "bg-red-500", percentage: 17 },
        { status: "Accepted", count: 2, color: "bg-emerald-500", percentage: 8 }
    ];

    const topSkills = [
        { name: "React.js", demand: 95, proficiency: 90 },
        { name: "TypeScript", demand: 88, proficiency: 85 },
        { name: "Node.js", demand: 82, proficiency: 80 },
        { name: "Python", demand: 78, proficiency: 75 },
        { name: "AWS", demand: 85, proficiency: 70 }
    ];

    const recentActivity = [
        { action: "Profile viewed by Google", time: "2 hours ago", type: "view" },
        { action: "Application submitted to Microsoft", time: "5 hours ago", type: "application" },
        { action: "Interview scheduled with Amazon", time: "1 day ago", type: "interview" },
        { action: "Skill assessment completed", time: "2 days ago", type: "achievement" }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">

            {/* Elite Header */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[40px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-[28px] flex items-center justify-center shadow-2xl">
                                <BarChart3 className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                                    Analytics Hub
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Data-Driven Career Insights
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-3">
                {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
                    </button>
                ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`h-14 w-14 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-7 w-7 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                                </div>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${metric.trend === "up"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    }`}>
                                    {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    <span className="text-[9px] font-black">{Math.abs(metric.change)}%</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{metric.label}</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Application Status Distribution */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                            <PieChart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Application Status</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Distribution Overview</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {applicationStats.map((stat, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-3 w-3 rounded-full ${stat.color}`}></div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{stat.status}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{stat.count}</span>
                                        <span className="text-xs font-bold text-slate-400">{stat.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${stat.color} transition-all duration-1000`}
                                        style={{ width: `${stat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Your acceptance rate is 8% - Keep applying to increase your chances!
                        </p>
                    </div>
                </div>

                {/* Top Skills Analysis */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                            <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Skills Analysis</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Market Demand vs Your Proficiency</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {topSkills.map((skill, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{skill.name}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                            Demand: {skill.demand}%
                                        </span>
                                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                            You: {skill.proficiency}%
                                        </span>
                                    </div>
                                </div>

                                {/* Demand Bar */}
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${skill.demand}%` }}
                                    ></div>
                                </div>

                                {/* Proficiency Bar */}
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${skill.proficiency}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center">
                        <Activity className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Your career journey timeline</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-6 group">
                            <div className="relative">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${activity.type === "view" ? "bg-blue-100 dark:bg-blue-900/30" :
                                    activity.type === "application" ? "bg-purple-100 dark:bg-purple-900/30" :
                                        activity.type === "interview" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                                            "bg-yellow-100 dark:bg-yellow-900/30"
                                    }`}>
                                    {activity.type === "view" ? <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" /> :
                                        activity.type === "application" ? <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" /> :
                                            activity.type === "interview" ? <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> :
                                                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                                </div>
                                {index < recentActivity.length - 1 && (
                                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200 dark:bg-slate-800"></div>
                                )}
                            </div>
                            <div className="flex-1 pt-2">
                                <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{activity.action}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Score Card */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Overall Performance Score</p>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-7xl font-black text-white tracking-tighter">8.7</span>
                                <span className="text-3xl text-white/60 font-bold">/10</span>
                            </div>
                            <p className="text-white/90 text-sm font-bold">You're in the top 15% of candidates!</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
                                <TrendingUp className="h-8 w-8 text-white mb-2" />
                                <p className="text-2xl font-black text-white mb-1">+24%</p>
                                <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Growth</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
                                <Users className="h-8 w-8 text-white mb-2" />
                                <p className="text-2xl font-black text-white mb-1">Top 15%</p>
                                <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Ranking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
