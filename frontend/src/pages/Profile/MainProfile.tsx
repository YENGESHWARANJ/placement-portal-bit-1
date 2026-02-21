import React, { useEffect, useState } from 'react';
import {
    Expand,
    ChevronRight,
    Trophy,
    History,
    Calendar,
    School,
    MapPin,
    Brain,
    Rocket,
    Gamepad2,
    Code2,
    Mic2,
    Palette,
    ArrowUpRight,
    Briefcase,
    Zap,
    GraduationCap,
    Clock,
    CheckCircle2,
    Target
} from 'lucide-react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { ProfileCompleteness } from '../../components/ProfileCompleteness';

export default function MainProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                setProfile((res.data as any).data);
            } catch (err) {
                console.error("Profile sync failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center animate-pulse font-black text-slate-300 italic tracking-[0.3em] uppercase text-xl">Accessing Biosphere...</div>;
    if (!profile) return <div>Access denied. Authentication required.</div>;

    const radarData = [
        { subject: 'Problem Solving', A: profile.aptitudeScore || 70, fullMark: 100 },
        { subject: 'Creative', A: 75, fullMark: 100 },
        { subject: 'Skills', A: profile.codingScore || 85, fullMark: 100 },
        { subject: 'Critical Thinking', A: 80, fullMark: 100 },
        { subject: 'Discipline', A: 95, fullMark: 100 },
    ];

    const timeData = [
        { name: 'Core Skill', value: profile.technicalScore || 65, color: '#FF7D54' },
        { name: 'Interface Skill', value: profile.interviewScore || 45, color: '#4F46E5' },
    ];

    return (
        <div className="flex flex-col xl:flex-row gap-10 h-full animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* 1. CORE INTELLIGENCE (LEFT GRID) */}
            <div className="flex-1 space-y-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Biosphere Core</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Interconnected Skill Profile Ledger</p>
                    </div>
                </div>

                <ProfileCompleteness profile={profile} className="mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Radar Chart Card */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Psychometric Radar</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cognitive Signal Intensity</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-[#1E2342] flex items-center justify-center text-white shadow-lg">
                                <Target className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="#E2E8F0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 900 }} />
                                    <Radar name="Skills" dataKey="A" stroke="#FF7D54" fill="#FF7D54" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Interest Patterns Card */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Interest Flux</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Natural Propensity Nodes</p>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                                <Zap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <InterestBar label="Logic Protocol" value={85} color="bg-[#1E2342]" />
                            <InterestBar label="Syntactic Skill" value={70} color="bg-[#FF7D54]" />
                            <InterestBar label="Creative Vector" value={45} color="bg-[#F59E0B]" />
                            <InterestBar label="Enterprise Logic" value={60} color="bg-[#4F46E5]" />
                        </div>
                    </div>

                    {/* Ongoing Status Card */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Active Funnel</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concurrent Learning Clusters</p>
                            </div>
                            <Expand className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-4">
                            <OngoingItem label="System Algorithm" date="1 Mar - 1 May" color="border-orange-500" />
                            <OngoingItem label="Corporate Comms" date="16 Mar - 16 Jun" color="border-indigo-600" />
                        </div>
                    </div>

                    {/* Donut Chart Card */}
                    <div className="bg-white p-8 rounded-[45px] shadow-sm flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tight">Skill Balance</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/analytics-hub');
                                }}
                                className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                                aria-label="View full skill analytics"
                            >
                                <Expand className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="relative h-[180px] w-[180px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={timeData}
                                        innerRadius={65}
                                        outerRadius={80}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {timeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-4xl font-black italic text-[#1E2342]">110</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-6">
                            <LegendItem color="bg-[#FF7D54]" label="Core" />
                            <LegendItem color="bg-[#4F46E5]" label="Soft" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BIOGRAPHIC HUB (RIGHT PANEL) */}
            <div className="w-full xl:w-[380px] space-y-10 animate-in slide-in-from-right duration-700">
                <div className="bg-white p-10 rounded-[60px] shadow-sm border border-slate-50 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-80 bg-indigo-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-30" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-44 w-44 rounded-[55px] bg-gradient-to-br from-indigo-100 to-purple-50 p-2 mb-8 shadow-2xl shadow-indigo-100/50 rotate-3 transition-transform hover:rotate-0 duration-500">
                            <div className="h-full w-full rounded-[45px] bg-slate-800 flex items-center justify-center text-white text-6xl font-black italic p-2 border-4 border-white shadow-inner">
                                {profile.name.charAt(0)}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter mb-1 leading-none">{profile.name}</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 italic">@{profile.name.toLowerCase().replace(' ', '')}</p>

                        <div className="space-y-6 w-full text-left mb-10">
                            <InfoRow icon={Calendar} label="Class of 2025" />
                            <InfoRow icon={School} label={profile.branch || "Tech Institute"} />
                            <InfoRow icon={MapPin} label={profile.location || "Earth Node 1"} />
                        </div>

                        <div className="bg-[#1E2342] p-8 rounded-[45px] text-white w-full text-left relative group cursor-pointer shadow-xl shadow-indigo-900/10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">Bio Protocol</p>
                                <div className="h-8 w-8 bg-white/5 rounded-xl flex items-center justify-center"><Brain className="h-4 w-4 text-indigo-400" /></div>
                            </div>
                            <p className="text-[11px] font-bold italic leading-relaxed text-slate-300">
                                {profile.about || "Cognitive footprint initializing. Higher-level intelligence mapping required for recruiter synchronization."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Teacher History Simplified */}
                <div className="bg-white p-8 rounded-[45px] shadow-sm">
                    <h3 className="text-[11px] font-black italic text-slate-800 uppercase tracking-[0.3em] mb-6 border-b-2 border-emerald-500 pb-1 inline-block">Mentor Network</h3>
                    <div className="flex -space-x-3 overflow-hidden px-2">
                        {['RB', 'DL', 'BV', 'IR', 'MK'].map((initials, i) => (
                            <div key={i} className={cn(
                                "inline-block h-12 w-12 rounded-2xl border-4 border-white flex items-center justify-center text-[10px] font-black italic text-white shadow-sm ring-1 ring-slate-100",
                                ['bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-600', 'bg-blue-600'][i % 5]
                            )}>
                                {initials}
                            </div>
                        ))}
                        <div className="inline-block h-12 w-12 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black italic text-slate-400 shadow-sm ring-1 ring-slate-100">
                            +2
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// HELPERS
function InterestBar({ label, value, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-900 uppercase tracking-widest italic">
                <span>{label}</span>
                <span className="text-slate-400">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function OngoingItem({ label, date, color }: any) {
    return (
        <div className={cn("p-4 bg-white rounded-3xl border-l-[6px] border border-slate-50 flex items-center justify-between group cursor-default transition-all hover:bg-slate-50/50", color)}>
            <div>
                <p className="font-black italic text-slate-900 uppercase tracking-tighter text-sm mb-1">{label}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{date}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-900 transition-all font-black" />
        </div>
    );
}

function LegendItem({ color, label }: any) {
    return (
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
            <span className="text-[9px] font-black text-slate-500 uppercase italic">{label} Value</span>
        </div>
    );
}

function InfoRow({ icon: Icon, label }: any) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic leading-none">{label}</span>
        </div>
    );
}
