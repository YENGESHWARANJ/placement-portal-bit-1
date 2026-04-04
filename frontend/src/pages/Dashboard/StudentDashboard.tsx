import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Briefcase, Brain, FileText, Mic2, ChevronRight, ArrowUpRight,
    TrendingUp, Target, Zap, Trophy, BarChart3, Sparkles, Code2,
    Flame, BookOpen, Rocket, Bot, Bell, Star
} from 'lucide-react';
import {
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import PlacedShowcase from '../../components/common/PlacedShowcase';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

function MetricCard({ icon: Icon, label, value, sub, trend, colorClass }: {
    icon: any; label: string; value: string | number;
    sub?: string; trend?: number; colorClass: string;
}) {
    return (
        <motion.div variants={stagger.item}
            className="apple-card p-6 flex flex-col justify-between hover:shadow-apple-hover transition-all duration-500">
            <div className="flex items-start justify-between">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm", colorClass)}>
                    <Icon className="h-6 w-6 text-slate-900" />
                </div>
                {trend !== undefined && (
                    <div className={cn("flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full", trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                        <TrendingUp className={cn("h-3 w-3", trend < 0 && "rotate-180")} />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-6">
                <h3 className="text-3xl font-bold text-apple-gray-900 tracking-tight">{value}</h3>
                <p className="text-base font-semibold text-apple-gray-400 mt-1 uppercase tracking-wider">{label}</p>
                {sub && <p className="text-sm text-apple-gray-300 mt-2 font-medium">{sub}</p>}
            </div>
        </motion.div>
    );
}

export default function StudentDashboard() {
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'applications' | 'jobs'>('jobs');

    const fetchData = useCallback(async () => {
        try {
            const [profileRes, jobsRes, appsRes] = await Promise.all([
                api.get('/students/profile'),
                api.get('/jobs/recommendations'),
                api.get('/applications/my').catch(() => ({ data: { applications: [] } }))
            ]);
            setProfile((profileRes.data as any).data);
            setRecommendedJobs((jobsRes.data as any).jobs || []);
            setApplications((appsRes.data as any).applications || []);
        } catch (e: any) {
            if (e.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchData();
        }
    }, [authLoading, isAuthenticated, fetchData]);

    const firstName = user?.name?.split(' ')[0] || 'Student';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const activityData = [
        { day: 'Mon', v: 72 }, { day: 'Tue', v: 85 }, { day: 'Wed', v: 61 },
        { day: 'Thu', v: 90 }, { day: 'Fri', v: 78 }, { day: 'Sat', v: 55 }, { day: 'Sun', v: 68 },
    ];

    const radarData = [
        { s: 'Aptitude', A: profile?.aptitudeScore || 0 },
        { s: 'Coding', A: profile?.codingScore || 0 },
        { s: 'Interview', A: profile?.interviewScore || 0 },
        { s: 'Resume', A: profile?.resumeScore || 0 },
        { s: 'Soft Skills', A: 70 },
    ];

    const metrics = [
        { icon: Briefcase, label: "Applications", value: applications.length, sub: "In review", colorClass: "bg-apple-blue", trend: 12 },
        { icon: Target, label: "Job Matches", value: recommendedJobs.length, sub: "New matches found", colorClass: "bg-indigo-500", trend: 8 },
        { icon: Trophy, label: "Readiness", value: `${profile?.aptitudeScore || 0}%`, sub: "Skill Level", colorClass: "bg-emerald-500", trend: 5 },
        { icon: Star, label: "CGPA", value: profile?.cgpa || "—", sub: "Academic Standing", colorClass: "bg-amber-500" },
    ];

    const quickActions = [
        { label: 'Resume', icon: FileText, to: '/resume-builder', color: 'text-apple-blue' },
        { label: 'Mock AI', icon: Mic2, to: '/interview', color: 'text-indigo-600' },
        { label: 'Coding', icon: Code2, to: '/coding-test', color: 'text-rose-600' },
        { label: 'Practice', icon: Brain, to: '/aptitude-test', color: 'text-emerald-600' },
    ];

    if (loading) return (
        <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white rounded-apple" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-white rounded-apple" />)}
            </div>
            <div className="h-96 bg-white rounded-apple" />
        </div>
    );

    return (
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-10">
            {/* Header / Welcome */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-sm font-black text-apple-blue uppercase tracking-[0.4em] mb-3 block">BIT Student Hub</span>
                    <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight leading-none">
                        {greeting}, <span className="text-apple-blue font-black">{firstName}</span>
                    </h1>
                    <p className="text-apple-gray-400 mt-3 font-bold uppercase tracking-widest text-base">Strategic Readiness & Intelligence Overview</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link to="/profile" className="w-full md:w-auto h-[52px] px-8 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-apple-hover">
                        <UserIcon className="h-4 w-4" />
                        <span>Update Dossier</span>
                    </Link>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
            </div>

            {/* Placed Students Showcase */}
            <motion.div variants={stagger.item}>
                <PlacedShowcase />
            </motion.div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* AI Insights - Apple Card */}
                <motion.div variants={stagger.item} className="lg:col-span-2 apple-card p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group bg-white border border-apple-gray-50">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-apple-blue/5 rounded-full blur-[60px] -mr-32 -mt-32 group-hover:bg-apple-blue/10 transition-all duration-1000" />
                    <div className="w-24 h-24 bg-white rounded-[30px] flex items-center justify-center shrink-0 shadow-2xl relative z-10">
                        <Bot className="h-12 w-12 text-slate-900" />
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <Sparkles className="h-4 w-4 text-apple-blue" />
                            <span className="text-base font-black uppercase tracking-[0.3em] text-apple-blue">Neural Insights Engine</span>
                        </div>
                        <h3 className="text-2xl font-black text-apple-gray-900 leading-tight tracking-tight mb-6">
                            "Optimal readiness detected. 3 premium challenges synchronized with your skill matrix."
                        </h3>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            {quickActions.map((ax, i) => (
                                <Link key={i} to={ax.to} className="group/ax">
                                    <span className={cn("text-base font-black px-5 py-3 rounded-2xl bg-apple-gray-50 hover:bg-white border border-apple-gray-100 hover:border-apple-blue/30 hover:text-apple-blue transition-all flex items-center gap-3 uppercase tracking-widest shadow-sm", ax.color)}>
                                        <ax.icon className="h-3.5 w-3.5" />
                                        {ax.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Radar Skill View */}
                <motion.div variants={stagger.item} className="apple-card p-10 flex flex-col bg-white border border-apple-gray-50">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-lg font-black text-apple-gray-900 tracking-tight">Skill Matrix</h2>
                            <p className="text-base font-black text-apple-gray-300 uppercase tracking-widest mt-1">Multi-dimensional Proficiency</p>
                        </div>
                        <div className="h-12 w-12 rounded-[18px] bg-indigo-50 flex items-center justify-center shadow-inner">
                            <Brain className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#f2f2f7" />
                                <PolarAngleAxis dataKey="s" tick={{ fill: '#8e8e93', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em' }} />
                                <Radar dataKey="A" stroke="#007aff" fill="#007aff" fillOpacity={0.1} dot={{ r: 4, fill: '#007aff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section - Active Pipeline */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Weekly Tracking */}
                <motion.div variants={stagger.item} className="apple-card p-10 bg-white border border-apple-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-lg font-black text-apple-gray-900 tracking-tight">Engagement Pulse</h2>
                            <p className="text-base font-black text-apple-gray-300 uppercase tracking-widest mt-1">Platform Interaction Velocity</p>
                        </div>
                        <div className="px-4 py-1.5 bg-apple-blue/10 text-apple-blue rounded-full text-base font-black uppercase tracking-widest border border-apple-blue/5">Neural Link Active</div>
                    </div>
                    <div className="h-72 w-full min-h-[18rem]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#007aff" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8e8e93', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8e8e93', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', padding: '16px' }}
                                />
                                <Area type="monotone" dataKey="v" stroke="#007aff" strokeWidth={4} fillOpacity={1} fill="url(#colorV)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Job Matches List */}
                <motion.div variants={stagger.item} className="apple-card p-0 flex flex-col bg-white border border-apple-gray-50 overflow-hidden">
                    <div className="p-10 border-b border-apple-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-lg font-black text-apple-gray-900 tracking-tight">High Resonance Targets</h2>
                            <p className="text-base font-black text-apple-gray-300 uppercase tracking-widest mt-1">Matched by Neural Matrix</p>
                        </div>
                        <Link to="/job-recommendations" className="text-base font-black text-apple-blue uppercase tracking-widest hover:underline">Market Access</Link>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar max-h-[340px]">
                        {recommendedJobs.length > 0 ? recommendedJobs.slice(0, 5).map((job, i) => (
                            <Link key={i} to={`/jobs/${job._id}`} className="flex items-center gap-6 p-5 rounded-[24px] hover:bg-apple-gray-50 transition-all border border-transparent hover:border-apple-gray-50 mb-3 group">
                                <div className="h-14 w-14 rounded-[18px] bg-white flex items-center justify-center text-slate-900 font-black text-base shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                    {(job.company || "C").charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-black text-apple-gray-900 truncate leading-none mb-2">{job.title}</p>
                                    <p className="text-sm font-bold text-apple-gray-400 uppercase tracking-wide truncate">{job.company} · {job.location}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-emerald-500 text-base font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                        {job.matchScore}%
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <div className="py-20 text-center">
                                <Rocket className="h-12 w-12 text-apple-gray-100 mx-auto mb-6" />
                                <p className="text-base font-black text-apple-gray-300 uppercase tracking-[0.2em]">Synthesizing Opportunity Matrix...</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Helper mock icon for User
function UserIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
