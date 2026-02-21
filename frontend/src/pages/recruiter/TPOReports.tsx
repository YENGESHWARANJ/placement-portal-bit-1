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
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

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
            toast.error("Failed to load intelligence reports");
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
            toast.error("Export failed");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse italic font-black uppercase tracking-widest text-slate-400">Loading Batch Intelligence...</div>;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-4">
                        TPO <span className="text-indigo-600">Executive</span> Dashboard
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Institutional Placement Intelligence & Readiness Benchmarking</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-3xl font-black italic uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Download className="h-4 w-4" /> Export Batch Dossier
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Batch Readiness', val: `${data?.readinessStats?.overall}%`, icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Placement Velocity', val: `${data?.stats?.placementRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Talent Pool', val: data?.stats?.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Opportunities', val: data?.stats?.totalJobs, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm", stat.bg, stat.color)}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mt-1">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Readiness Breakdown */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <BarChart3 className="h-32 w-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Brain className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Readiness Index</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Performance Metrics</p>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                            <BarChart data={[
                                { name: 'Aptitude', value: data?.readinessStats?.aptitude },
                                { name: 'Coding', value: data?.readinessStats?.coding },
                                { name: 'Interview', value: data?.readinessStats?.interview },
                                { name: 'Overall', value: data?.readinessStats?.overall }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                />
                                <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={50}>
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#0f172a'][index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Gaps (Critical Alerts) */}
                <div className="bg-slate-900 p-8 rounded-[45px] text-white overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 opacity-10">
                        <ShieldAlert className="h-48 w-48 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Skill Gaps</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Critical Failure Topics</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {data?.skillGaps?.map((skill: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] italic">
                                    <span>{skill.name}</span>
                                    <span className="text-amber-500">{skill.gap}% GAP</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                                        style={{ width: `${skill.gap}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Recommendation</p>
                        <p className="text-xs font-bold italic text-slate-300">Organize remedial bootcamps for {data?.skillGaps?.[0]?.name} to improve batch readiness before the next recruitment drive.</p>
                    </div>
                </div>
            </div>

            {/* Department Comparison */}
            <div className="bg-white p-8 rounded-[45px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <PieChart className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Departmental Velocity</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inter-branch Performance Comparison</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {data?.departmentStats?.map((dept: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{dept.name}</p>
                            <div className="relative h-32 w-32 mx-auto">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <RePieChart>
                                        <Pie
                                            data={[
                                                { value: dept.placed },
                                                { value: dept.students - dept.placed }
                                            ]}
                                            innerRadius={35}
                                            outerRadius={45}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#e2e8f0" />
                                        </Pie>
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black italic">{Math.round((dept.placed / dept.students) * 100)}%</span>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{dept.placed}/{dept.students} Placed</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
