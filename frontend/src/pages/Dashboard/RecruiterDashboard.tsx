import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    Plus,
    X,
    Eye,
    Briefcase,
    Users,
    TrendingUp,
    BarChart3,
    ChevronRight,
    Search,
    Rocket,
    Brain,
    Target,
    Activity,
    FileText,
    Zap,
    Expand,
    Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getRecruiterStats } from '../../services/recruiter.service';
import { cn } from '../../utils/cn';

export default function RecruiterDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReports, setShowReports] = useState(false);
    const [compiling, setCompiling] = useState(false);

    const handleCompileDossier = async () => {
        setCompiling(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            const blob = new Blob(
                ['Recruiter Dossier\n\nApplicants,Jobs,Shortlisted\n' + [data?.stats?.totalApplicants ?? 0, data?.stats?.totalJobs ?? 0, data?.stats?.shortlistedCount ?? 0].join(',')],
                { type: 'text/plain' }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recruiter-dossier-${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Dossier compiled and downloaded');
            setShowReports(false);
        } catch {
            toast.error('Compilation failed');
        } finally {
            setCompiling(false);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getRecruiterStats();
                setData(statsData);
            } catch (err) {
                console.error("Failed to fetch recruiter stats", err);
                toast.error("Unable to sync recruitment data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center animate-pulse font-black text-slate-300 italic tracking-[0.3em] uppercase text-xl text-center">Synchronizing Talent Matrix...</div>;

    const pipelineData = data?.pipeline || [];

    return (
        <div className="flex flex-col xl:flex-row gap-10 h-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">

            {/* 1. CORE OPERATIONAL HUD (LEFT GRID) */}
            <div className="flex-1 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Acquisition Console</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Real-time Hiring Node Monitoring</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Funnel Chart Card */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Recruitment Funnel</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Acquisition Stages</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={pipelineData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 900 }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: 'rgba(30, 35, 66, 0.02)' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: 'none' }} />
                                    <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={40}>
                                        {pipelineData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operational Metrics HUD */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform">
                            <Rocket className="h-48 w-48 text-indigo-900" />
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">System Matrix</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Throughput</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                                <Zap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <MetricProgress label="Active Talent Node" value={data?.stats?.totalApplicants || 0} max={1000} color="bg-[#1E2342]" />
                            <MetricProgress label="Market Listings" value={data?.stats?.totalJobs || 0} max={50} color="bg-[#FF7D54]" />
                            <MetricProgress label="Shortlisted Pipeline" value={data?.stats?.shortlistedCount || 0} max={200} color="bg-[#4F46E5]" />
                            <MetricProgress label="Interview Bandwidth" value={data?.stats?.interviewCount || 0} max={100} color="bg-emerald-500" />
                        </div>
                    </div>

                    {/* Active Talent Ledger */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Talent Ledger</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Inflow Vectors</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/recruiter/applicants')}
                                className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                                aria-label="View full talent ledger"
                            >
                                <Expand className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data?.recentApplications?.length > 0 ? data.recentApplications.slice(0, 4).map((app: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50/50 rounded-3xl border border-slate-50 flex items-center justify-between group transition-all hover:bg-white hover:shadow-md cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[10px] font-black italic text-slate-400">
                                            {app.studentId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black italic text-slate-900 uppercase tracking-tighter text-xs truncate max-w-[140px] leading-tight">{app.studentId?.name}</p>
                                            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest truncate max-w-[140px] mt-0.5">{app.jobId?.title}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-900 transition-all font-bold" />
                                </div>
                            )) : (
                                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[35px] text-center">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Monitoring Flux...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hiring Intelligence Promo Card */}
                    <div className="bg-[#1E2342] p-8 rounded-[45px] text-white flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1 italic">Intelligence Protocol</p>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Market Intel</h3>
                            </div>
                            <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5">
                                <BarChart3 className="h-5 w-5 text-indigo-400" />
                            </div>
                        </div>
                        <div className="mt-8 mb-4">
                            <p className="text-[11px] font-bold text-white/50 italic leading-relaxed mb-6">Analyze institutional trends, student performance clusters, and departmental hiring velocity.</p>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 w-[65%]" />
                            </div>
                        </div>
                        <Link to="/hiring-intel" className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[#FF7D54] group-hover:text-white transition-colors">
                            Access Strategic Ledger <ChevronRight className="h-3 w-3 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. OPERATIVE PROFILE (RIGHT PANEL) */}
            <div className="w-full xl:w-[380px] space-y-10 animate-in slide-in-from-right duration-700">
                <div className="bg-white p-10 rounded-[60px] shadow-sm border border-slate-50 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-80 bg-blue-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-30 group-hover:bg-blue-200 transition-all duration-1000" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-44 w-44 rounded-[55px] bg-gradient-to-br from-indigo-100 to-purple-50 p-2 mb-8 shadow-2xl shadow-indigo-100/30 -rotate-3 transition-transform hover:rotate-0 duration-500">
                            <div className="h-full w-full rounded-[45px] bg-slate-900 flex items-center justify-center text-white text-6xl font-black italic p-2 border-4 border-white shadow-inner">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter mb-1 leading-none">{user?.name}</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 italic">@{user?.name?.toLowerCase().replace(' ', '')}</p>

                        <div className="space-y-6 w-full text-left mb-10">
                            <InfoTag icon={Briefcase} label={user?.company || 'Corporate Group'} />
                            <InfoTag icon={Target} label="Recruitment Executive" />
                        </div>

                        <div className="bg-[#1E2342] p-8 rounded-[45px] text-white w-full text-left relative group cursor-pointer shadow-xl shadow-indigo-900/10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic leading-none">Ops Summary</p>
                                <div className="h-8 w-8 bg-white/5 rounded-xl flex items-center justify-center transition-all group-hover:bg-white/10"><TrendingUp className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" /></div>
                            </div>
                            <p className="text-[11px] font-bold italic leading-relaxed text-slate-300">
                                Overseeing high-velocity talent acquisition protocols. Interfacing with departmental leads to synchronize institutional skill clusters with corporate requirement vectors.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Generate Reports Mini-HUD */}
                <div className="bg-white p-8 rounded-[45px] shadow-sm border border-slate-50">
                    <h3 className="text-[11px] font-black italic text-slate-800 uppercase tracking-[0.3em] mb-6 border-b-2 border-orange-500 pb-1 inline-block">Intel Export</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8 italic">Compile and export the latest funnel state to standardized institutional formats (PDF/XLS).</p>
                    <button onClick={() => setShowReports(true)} className="w-full py-5 bg-slate-50 rounded-[28px] border border-slate-100 font-black italic uppercase tracking-widest text-[10px] text-slate-400 hover:bg-[#1E2342] hover:text-white transition-all shadow-sm">
                        Generate Ledger
                    </button>
                </div>
            </div>

            {/* Reports Modal */}
            {showReports && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setShowReports(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 p-12">
                        <div className="flex justify-between items-center mb-10 text-slate-900">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Gen Intel</h3>
                            <button onClick={() => setShowReports(false)} className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all font-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="text-center space-y-6">
                            <p className="text-slate-500 font-bold italic text-sm">Targeting current acquisition nodes. Do you wish to proceed with full institutional data compilation?</p>
                            <button
                                type="button"
                                onClick={handleCompileDossier}
                                disabled={compiling}
                                className="w-full py-5 bg-[#1E2342] text-white rounded-[25px] font-black italic uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-[#2D345B] transition-all disabled:opacity-60"
                            >
                                {compiling ? 'Compiling...' : 'Compile Dossier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// HELPERS
function MetricProgress({ label, value, max, color }: any) {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-800 uppercase tracking-widest italic">
                <span>{label}</span>
                <span className="text-slate-400">{value} / {max}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function InfoTag({ icon: Icon, label }: any) {
    return (
        <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm group">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-blue-600 transition-colors shrink-0">
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic truncate">{label}</span>
        </div>
    );
}
