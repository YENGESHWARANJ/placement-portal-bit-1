import React, { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import {
    Users, ShieldAlert, Cpu, Database, Activity, TrendingUp, AlertTriangle,
    ArrowUpRight, Server, HardDrive, Network, UserPlus, Briefcase, GraduationCap,
    Download, Megaphone, CheckCircle2, X, Terminal
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
        { label: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Placed Students', value: data?.stats?.placedStudents || 0, trend: `${data?.stats?.placementRate || 0}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Active Jobs', value: data?.stats?.totalJobs || 0, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Total Companies', value: data?.stats?.totalCompanies || 0, icon: Network, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const readinessData = [
        { name: 'Aptitude', value: data?.readinessStats?.aptitude || 0, fill: '#6366f1' },
        { name: 'Coding', value: data?.readinessStats?.coding || 0, fill: '#8b5cf6' },
        { name: 'Interview', value: data?.readinessStats?.interview || 0, fill: '#ec4899' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Officer Console <span className="text-blue-600">v2.4</span></h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                        <Activity className="h-3 w-3 text-emerald-500" /> Active Placement Monitoring Engine
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleExport}
                        className="px-8 py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                    <button
                        onClick={() => setShowNoticeModal(true)}
                        className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Megaphone className="h-4 w-4" /> Broadcast
                    </button>
                </div>
            </div>

            {/* Top Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group active:scale-95 cursor-pointer shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            {stat.trend && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full italic">{stat.trend} Success</span>}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Visuals القسم */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Placement progression Area Chart */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase flex items-center gap-3">
                                    <TrendingUp className="h-6 w-6 text-indigo-500" />
                                    Acquisition Index
                                </h3>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Global Placement Velocity</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full mt-4 min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.placementTrend}>
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                                        itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 900 }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#blueGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Readiness Index */}
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic uppercase">Readiness Score</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">AI Talent Assessment Average</p>
                            <div className="h-[250px] w-full flex items-center justify-center relative min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={20} data={readinessData}>
                                        <RadialBar
                                            label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 900 }}
                                            background
                                            dataKey="value"
                                            cornerRadius={15}
                                        />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">{data?.readinessStats?.overall}%</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Avg</span>
                                </div>
                            </div>
                        </div>

                        {/* Department Distribution */}
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 italic uppercase">Hiring By Dept</h3>
                            <div className="h-[250px] w-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.departmentStats}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="placed" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={25} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-slate-900 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-8 tracking-tight italic">TPO Command</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/admin/students')}
                                    className="w-full p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-between group hover:bg-white/10 transition-all hover:translate-x-2"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity Guard</p>
                                            <p className="text-xs font-bold">Verify Students</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-slate-500" />
                                </button>

                                <button
                                    onClick={() => setShowNoticeModal(true)}
                                    className="w-full p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-between group hover:bg-white/10 transition-all hover:translate-x-2"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center">
                                            <Megaphone className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Announcer</p>
                                            <p className="text-xs font-bold">Post Notice</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-slate-500" />
                                </button>

                                <button
                                    onClick={() => navigate('/jobs/create')}
                                    className="w-full p-8 bg-blue-600 rounded-[35px] flex items-center justify-between group hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 mt-10 active:scale-95"
                                >
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-1">Talent Portal</p>
                                        <p className="text-xl font-black">Post New Listing</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                </button>

                                <div className="p-8 bg-indigo-900/40 border border-white/10 rounded-[40px] mt-8 group hover:bg-indigo-900/60 transition-all cursor-pointer" onClick={() => navigate('/admin/recruiters')}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Partner Intelligence</h4>
                                        <ArrowUpRight className="h-4 w-4 text-indigo-500 group-hover:rotate-45 transition-transform" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic leading-relaxed mb-6">Manage corporate onboarding, vet recruiter identities, and monitor hiring velocity across the network.</p>
                                    <div className="flex -space-x-3 mb-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-full bg-slate-800 border-2 border-[#1E2342] flex items-center justify-center text-[8px] font-black text-white/50">C{i}</div>
                                        ))}
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 border-2 border-[#1E2342] flex items-center justify-center text-[8px] font-black">+12</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#040612] p-8 rounded-[40px] border border-white/5 shadow-2xl font-mono relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-rose-500/50" />
                                <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                                <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                            </div>
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Kernel_Logs.sh</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] text-emerald-500/70 leading-none">[OK] Auth_Node_Cluster: Online</p>
                            <p className="text-[9px] text-blue-400/70 leading-none">[INFO] Syncing Global_Ledger...</p>
                            <p className="text-[9px] text-slate-600 leading-none">[LOG] Request from 192.168.1.1</p>
                            <p className="text-[9px] text-indigo-400/70 leading-none">[SYSCALL] PID 8542 Elevated to ROOT</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Stream</span>
                            </div>
                            <Terminal className="h-3 w-3 text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 italic uppercase">System Integrity</h3>
                    <div className="space-y-8">
                        {(health?.integrity || [
                            { label: 'Knowledge Graph', value: 98, color: 'text-emerald-500', icon: Database },
                            { label: 'Neural AI', value: 100, color: 'text-indigo-500', icon: Cpu },
                            { label: 'Identity Server', value: 45, color: 'text-amber-500', icon: ShieldAlert },
                        ]).map((res: any, i: number) => {
                            const Icon = res.icon || ([Database, Cpu, ShieldAlert, HardDrive][i % 4]);
                            const color = res.color || (res.value > 90 ? 'text-emerald-500' : res.value > 70 ? 'text-indigo-500' : 'text-amber-500');
                            return (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", color)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{res.label}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase italic tracking-widest">{res.status || 'Active'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={cn("h-full transition-all duration-1000", color.replace('text', 'bg'))} style={{ width: `${res.value}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white">{res.value}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-[#0F1121] p-10 rounded-[50px] text-white shadow-2xl">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter mb-8 text-slate-400">Live Audit Trail</h3>
                    <div className="space-y-4">
                        {(health?.logs || [
                            { node: 'REC_ALPHA', action: 'JOB_BROADCAST', status: 'INITIATED', time: '2m' },
                            { node: 'STU_NODE', action: 'RESUME_PARSING', status: 'COMPLETE', time: '14m' },
                            { node: 'SYS_DAEMON', action: 'LEDGER_SYNC', status: 'ACTIVE', time: 'Now' }
                        ]).map((log: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest">
                                <span className="text-indigo-400">{log.node}</span>
                                <span className="text-slate-500">{log.event || log.action}</span>
                                <span className={cn(
                                    log.status === 'OK' || log.status === 'COMPLETE' ? "text-emerald-500" : "text-amber-500"
                                )}>{log.status}</span>
                                <span className="text-slate-600 ml-4 font-mono">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Broadcast Modal */}
            {showNoticeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 italic">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-all duration-500" onClick={() => setShowNoticeModal(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-3xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Strategic Broadcast</h3>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Network-wide announcement protocol</p>
                            </div>
                            <button onClick={() => setShowNoticeModal(false)} className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Headline</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    placeholder="Brief announcement title..."
                                    value={noticeForm.title}
                                    onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content Intelligence</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-bold min-h-[150px]"
                                    placeholder="Detailed message for the network..."
                                    value={noticeForm.content}
                                    onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Cluster</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={noticeForm.type}
                                        onChange={e => setNoticeForm({ ...noticeForm, type: e.target.value })}
                                    >
                                        <option value="All">Global Network</option>
                                        <option value="Student">Student Nodes</option>
                                        <option value="Recruiter">Recruiter Nodes</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority Protocol</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={noticeForm.priority}
                                        onChange={e => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High (Critical)</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handlePostNotice}
                                className="w-full py-5 bg-blue-600 text-white rounded-[30px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Megaphone className="h-5 w-5" /> Initiate Broadcast
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
