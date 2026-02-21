import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import {
    Expand, ChevronRight, Trophy, History, Calendar,
    Brain, Rocket, Gamepad2, Code2, Mic2, Palette,
    ArrowUpRight, Briefcase, Zap, GraduationCap,
    CheckCircle2, ShieldCheck, FileText, Sparkles, Activity, Star
} from 'lucide-react';
import {
    ResponsiveContainer, RadarChart, PolarGrid,
    PolarAngleAxis, Radar, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { StreakCard } from '../../components/StreakCard';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
});

export default function StudentDashboard() {
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;
        const fetchData = async () => {
            try {
                const [profileRes, jobsRes, appsRes] = await Promise.all([
                    api.get('/students/profile'),
                    api.get('/jobs/recommendations'),
                    api.get('/applications/my').catch(() => ({ data: { applications: [] } }))
                ]);
                setProfile((profileRes.data as any).data);
                setRecommendedJobs((jobsRes.data as any).jobs || []);
                setApplications((appsRes.data as any).applications || []);
            } catch (err: any) {
                console.error("Dashboard sync failed", err);
                if (err.response?.status === 401) logout();
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authLoading, isAuthenticated, logout]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="h-10 w-10 rounded-full border-4 border-slate-100 border-t-blue-500"
            />
        </div>
    );

    const radarData = [
        { subject: 'Logic', A: profile?.aptitudeScore || 70, fullMark: 100 },
        { subject: 'Creative', A: 75, fullMark: 100 },
        { subject: 'Skills', A: profile?.codingScore || 80, fullMark: 100 },
        { subject: 'Soft Skills', A: 85, fullMark: 100 },
        { subject: 'Discipline', A: 95, fullMark: 100 },
    ];
    const readinessData = [
        { name: 'Hard Skill', value: profile?.technicalScore || 75, color: '#FF7D54' },
        { name: 'Soft Skill', value: profile?.interviewScore || 60, color: '#4F46E5' },
    ];

    const quickActions = [
        { label: 'Resume', icon: FileText, to: '/resume-upload', color: 'from-blue-500 to-indigo-600' },
        { label: 'Interview', icon: Mic2, to: '/interview', color: 'from-violet-500 to-purple-600' },
        { label: 'Aptitude', icon: Brain, to: '/aptitude-test', color: 'from-amber-500 to-orange-500' },
        { label: 'Jobs', icon: Briefcase, to: '/job-recommendations', color: 'from-emerald-500 to-teal-600' },
    ];

    return (
        <div className="flex flex-col xl:flex-row gap-10 h-full pb-12 italic">

            {/* ────── MAIN COLUMN ────── */}
            <div className="flex-1 min-w-0 space-y-8">

                {/* Hero Banner */}
                <motion.div {...fadeUp(0)}
                    className="relative overflow-hidden bg-[#080B1A] rounded-[50px] p-10 text-white shadow-2xl"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-16 -right-16 h-64 w-64 bg-blue-600/15 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-1/3 h-40 w-40 bg-indigo-500/10 rounded-full blur-[60px]" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400/70 mb-3">Command Center · Real-time HUD</p>
                            <h2 className="text-4xl font-black uppercase tracking-[-0.03em] leading-none mb-3">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.name?.split(' ')[0]}</span>
                            </h2>
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Subsystem Optimal · All nodes synchronized
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                                <p className="text-2xl font-black text-white">{profile?.cgpa || '—'}</p>
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">CGPA</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                                <p className="text-2xl font-black text-emerald-400">{recommendedJobs.length}</p>
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Matches</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Streak & Quick Actions */}
                <motion.div {...fadeUp(0.05)} className="flex flex-wrap items-center gap-4">
                    <StreakCard />
                </motion.div>
                {/* Upcoming: applications with Interview/Assessment/Shortlisted */}
                {applications.length > 0 && (
                    <motion.div {...fadeUp(0.06)} className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-[30px] p-6 border border-indigo-100 dark:border-indigo-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                Upcoming
                            </h3>
                            <Link to="/applications" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                                View all
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {applications
                                .filter((a: any) => ["Interview", "Assessment", "Shortlisted", "Applied"].includes(a.status))
                                .slice(0, 4)
                                .map((app: any, i: number) => (
                                    <Link key={app._id} to="/applications">
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                                                {app.jobId?.company?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[140px]">{app.jobId?.title}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{app.jobId?.company} · {app.status}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </motion.div>
                )}

                <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.to}>
                            <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className="bg-white border border-slate-100 rounded-[30px] p-6 flex flex-col items-center gap-3 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                                <div className={cn("h-12 w-12 rounded-[20px] bg-gradient-to-br flex items-center justify-center shadow-md", action.color)}>
                                    <action.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">{action.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Radar */}
                    <motion.div {...fadeUp(0.13)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-black italic text-slate-900 uppercase tracking-tight">Readiness Radar</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cognitive signal intensity</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Brain className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="#E2E8F0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 900 }} />
                                    <Radar name="Skills" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Skills Progress */}
                    <motion.div {...fadeUp(0.16)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-base font-black italic text-slate-900 uppercase tracking-tight">Active Nodes</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill proficiency index</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                                <Zap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="space-y-5">
                            {[
                                { label: 'Logic Score', value: profile?.aptitudeScore || 70, color: 'from-blue-500 to-indigo-600' },
                                { label: 'Code Syntax', value: profile?.codingScore || 60, color: 'from-orange-500 to-rose-500' },
                                { label: 'Vocal Presence', value: profile?.interviewScore || 55, color: 'from-amber-400 to-orange-500' },
                                { label: 'Experience Load', value: 65, color: 'from-indigo-500 to-violet-600' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                        <span>{s.label}</span><span className="text-slate-400">{s.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.value}%` }}
                                            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                                            className={cn("h-full rounded-full bg-gradient-to-r", s.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Job Matches */}
                    <motion.div {...fadeUp(0.2)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-base font-black italic text-slate-900 uppercase tracking-tight">Matching Engine</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI market synchronization</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Briefcase className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recommendedJobs.length > 0 ? recommendedJobs.slice(0, 3).map((job, i) => (
                                <Link key={i} to={`/jobs/${job._id}`}>
                                    <motion.div whileHover={{ x: 4 }}
                                        className={cn("p-4 bg-slate-50 hover:bg-white rounded-[22px] border-l-4 flex items-center justify-between group transition-all hover:shadow-md border border-slate-100",
                                            i === 0 ? "border-l-[#FF7D54]" : i === 1 ? "border-l-indigo-500" : "border-l-emerald-500")}>
                                        <div>
                                            <p className="font-black italic text-slate-900 uppercase tracking-tighter text-sm truncate max-w-[150px]">{job.title}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{job.company} · {job.matchScore ? `${job.matchScore}%` : 'AI Match'}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                                    </motion.div>
                                </Link>
                            )) : (
                                <div className="p-8 border-2 border-dashed border-slate-100 rounded-[30px] text-center">
                                    <Sparkles className="h-6 w-6 text-slate-200 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning market plasm...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Readiness Donut */}
                    <motion.div {...fadeUp(0.23)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-black italic text-slate-900 uppercase tracking-tight">Readiness Index</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placement score composite</p>
                            </div>
                            <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                        </div>
                        <div className="relative h-[160px] w-[160px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie data={readinessData} innerRadius={58} outerRadius={75} paddingAngle={6} dataKey="value" stroke="none">
                                        {readinessData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Level</p>
                                <p className="text-3xl font-black italic text-slate-900">4</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-6">
                            {readinessData.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ────── RIGHT SIDEBAR ────── */}
            <div className="w-full xl:w-[320px] space-y-6 shrink-0">

                {/* Profile Card */}
                <motion.div {...fadeUp(0.1)}
                    className="bg-white rounded-[50px] p-10 text-center border border-slate-100 shadow-xl">
                    <motion.div
                        whileHover={{ rotate: 6, scale: 1.05 }}
                        className="h-28 w-28 mx-auto rounded-[40px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200 mb-5"
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </motion.div>
                    <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tight mb-1">{user?.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">@{user?.name?.toLowerCase().replace(/ /g, '')}</p>
                    <div className="space-y-3 text-left">
                        {[
                            { icon: GraduationCap, label: profile?.branch || 'B.Tech' },
                            { icon: CheckCircle2, label: 'Eligibility: Green' },
                        ].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                                <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <t.icon className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Badge Rack */}
                <motion.div {...fadeUp(0.15)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-black italic text-slate-800 uppercase tracking-[0.3em] mb-6 border-b-2 border-orange-400 pb-2 inline-block">Reward Ledger</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { icon: Trophy, active: true, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
                            { icon: History, active: true, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                            { icon: Code2, active: true, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                            { icon: ShieldCheck, active: true, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                            { icon: Briefcase, active: false, color: '' },
                            { icon: Mic2, active: false, color: '' },
                            { icon: Palette, active: false, color: '' },
                            { icon: Gamepad2, active: false, color: '' },
                        ].map((b, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.15, rotate: b.active ? 8 : 0 }}
                                className={cn("h-12 w-12 rounded-[18px] flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100 cursor-pointer transition-all",
                                    b.active ? b.color : "bg-slate-50 text-slate-200 grayscale")}>
                                <b.icon className="h-5 w-5" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Resume Score Card */}
                <motion.div {...fadeUp(0.2)}
                    className="bg-[#080B1A] rounded-[45px] p-8 text-white relative overflow-hidden border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-[60px]" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Resume Engine</p>
                            <FileText className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <p className="text-5xl font-black italic">{profile?.resumeScore || 0}</p>
                            <p className="text-white/30 text-sm font-black mb-2">/100</p>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">ATS Vector Magnitude</p>

                        {/* Score bar */}
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${profile?.resumeScore || 0}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            />
                        </div>
                        <Link to="/resume-upload"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 rounded-[22px] text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-white hover:text-slate-900 transition-all">
                            Optimize Profile <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                </motion.div>

                {/* Today's Actions */}
                <motion.div {...fadeUp(0.25)} className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Today's Missions
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Complete aptitude test', done: true },
                            { label: 'Review 3 job matches', done: true },
                            { label: 'Update resume skills', done: false },
                            { label: 'Mock interview session', done: false },
                        ].map((t, i) => (
                            <div key={i} className={cn("flex items-center gap-3 p-3 rounded-2xl transition-all",
                                t.done ? "bg-emerald-50" : "bg-slate-50 hover:bg-white border border-slate-100")}>
                                <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                    t.done ? "bg-emerald-500" : "border-2 border-slate-200")}>
                                    {t.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                                </div>
                                <span className={cn("text-[10px] font-black uppercase tracking-widest",
                                    t.done ? "line-through text-emerald-600/60" : "text-slate-700")}>{t.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
