import React, { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, ShieldAlert, Cpu, Database, Activity, TrendingUp, AlertTriangle,
    ArrowUpRight, Server, HardDrive, Network, UserPlus, Briefcase, GraduationCap,
    Download, Megaphone, CheckCircle2, X, Terminal, Globe, Zap, Sparkles, ShieldCheck, FileText, Settings
} from 'lucide-react';
import { cn } from '../../utils/cn';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend
} from 'recharts';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ApprovalMatrix from '../../components/admin/ApprovalMatrix';

interface Stat {
    label: string;
    value: string | number;
    icon: any;
    color: string;
    bg: string;
    trend?: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showApprovalsModal, setShowApprovalsModal] = useState(false);
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', type: 'Student', priority: 'Medium' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await api.get('/analytics/admin-stats');
                setData(statsRes.data);
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

            const headers = Object.keys(reportData[0]).join(',');
            const csvRows = reportData.map((row: any) => Object.values(row).join(','));
            const csvContent = [headers, ...csvRows].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportName}.csv`;
            a.click();
            toast.success("Report Exported");
        } catch (err) {
            toast.error("Export Failed");
        }
    };

    const handlePostNotice = async () => {
        try {
            await api.post('/notices', noticeForm);
            toast.success("Announcement Posted");
            setShowNoticeModal(false);
            setNoticeForm({ title: '', content: '', type: 'Student', priority: 'Medium' });
        } catch (err) {
            toast.error("Failed to post announcement");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-600 font-black uppercase tracking-widest">Loading Dashboard...</div>;

    const stats: Stat[] = [
        { label: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Eligible Students', value: data?.stats?.eligibleStudents || 0, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Drives', value: data?.stats?.totalDrives || 0, icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Total Applications', value: data?.stats?.totalApplications || 0, icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { label: 'Total Selected', value: data?.stats?.totalSelected || 0, icon: CheckCircle2, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Placement Rate', value: `${data?.stats?.placementRate || 0}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const readinessData = [
        { name: 'Aptitude', value: data?.readinessStats?.aptitude || 0, fill: '#10b981' },
        { name: 'Coding', value: data?.readinessStats?.coding || 0, fill: '#06b6d4' },
        { name: 'Interview', value: data?.readinessStats?.interview || 0, fill: '#84cc16' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* 🚀 Header Section: Command Center */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[50px] p-10 sm:p-16 relative overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-900/20 group"
            >
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-indigo-600/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] -ml-20 -mb-20" />
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="h-7 w-7 text-white" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400">Institutional Protocol</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Command Center Online</p>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white uppercase italic leading-[1.1] mb-6">
                            PLACEMENT <span className="text-indigo-500 not-italic">EXCELLENCE</span>
                        </h1>
                        <p className="text-slate-400 text-lg sm:text-xl font-bold leading-relaxed max-w-2xl">
                            Driving institutional success through <span className="text-white">strategic corporate engagement</span> and elite student placement readiness.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <button onClick={() => setShowApprovalsModal(true)} className="flex-1 px-8 py-5 bg-amber-500 text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 hover:bg-amber-400 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3">
                            <ShieldAlert className="h-4 w-4" /> Vetting Command
                        </button>
                        <button onClick={handleExport} className="flex-1 px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-3">
                            <Download className="h-4 w-4" /> Export Intel
                        </button>
                        <button onClick={() => setShowNoticeModal(true)} className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3">
                            <Megaphone className="h-4 w-4" /> Broadcast Notice
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Static Approval Overview (Optional) or just keep it in modal as requested */}
            {/* The user requested 'this type function' showing a modal, so I'll prioritize the modal trigger */}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-6 rounded-[28px] border border-slate-100 hover:border-indigo-100 transition-all shadow-sm group"
                    >
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black uppercase tracking-tight">Recruitment Trends</h3>
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="h-[350px] min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <AreaChart data={data?.placementTrend}>
                                    <defs>
                                        <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fill="url(#indigoGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-8">Average Readiness</h3>
                            <div className="h-[280px] min-h-[280px] flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={readinessData}>
                                        <RadialBar background dataKey="value" cornerRadius={10} />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black">{data?.readinessStats?.overall}%</span>
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Global</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-8">Hiring By Dept</h3>
                            <div className="h-[280px] min-h-[280px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <BarChart data={data?.departmentStats}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                        <Bar dataKey="placed" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={20}>
                                            {data?.departmentStats?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Activity Support */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight text-rose-600">Pending Support</h3>
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="space-y-4">
                            {data?.atRiskStudents?.slice(0, 4).map((student: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">{student.name}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{student.issue}</p>
                                    </div>
                                    <span className="text-sm font-black text-rose-500">{student.score}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/admin/students')} className="w-full mt-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                            View All Students
                        </button>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-lg">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-8">Management Portal</h3>
                        <div className="space-y-3">
                            <QuickAction icon={UserPlus} label="Student Registry" onClick={() => navigate('/admin/students')} />
                            <QuickAction icon={Briefcase} label="Launch New Drive" onClick={() => navigate('/jobs/create')} />
                            <QuickAction icon={Settings} label="Portal Settings" onClick={() => navigate('/admin/settings')} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Approvals Vetting Modal */}
            <AnimatePresence>
                {showApprovalsModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowApprovalsModal(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 40 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative bg-slate-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl border border-white/20 p-8 sm:p-12 custom-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-8">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <ShieldAlert className="h-7 w-7 text-slate-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 uppercase">Vetting Command Center</h2>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Institutional Authorization</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowApprovalsModal(false)} className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 border border-slate-100 transition-all shadow-sm">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <ApprovalMatrix onUpdate={() => {}} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification Modal */}
            <AnimatePresence>
                {showNoticeModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowNoticeModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-slate-900 uppercase">Post Announcement</h3>
                                <button onClick={() => setShowNoticeModal(false)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Announcement Title</label>
                                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content Detail</label>
                                    <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[100px]" value={noticeForm.content} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" value={noticeForm.type} onChange={e => setNoticeForm({...noticeForm, type: e.target.value})}>
                                        <option value="All">All Users</option>
                                        <option value="Student">Students Only</option>
                                        <option value="Recruiter">Mentors Only</option>
                                    </select>
                                    <select className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" value={noticeForm.priority} onChange={e => setNoticeForm({...noticeForm, priority: e.target.value})}>
                                        <option value="Low">Standard Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">Urgent Priority</option>
                                    </select>
                                </div>
                                <button onClick={handlePostNotice} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                                    <Megaphone className="h-5 w-5" /> Broadcast Now
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function QuickAction({ icon: Icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{label}</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 translate-x-0 group-hover:translate-x-1 transition-all" />
        </button>
    );
}
