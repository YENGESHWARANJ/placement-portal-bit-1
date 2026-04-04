import React, { useEffect, useState } from 'react';
import {
    Activity,
    TrendingUp,
    Target,
    Zap,
    Brain,
    Code2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import api from '../../services/api';
import { cn } from '../../utils/cn';

export default function AssessmentAnalysis() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/assessments/my-results');
                setData((res.data as any).assessments);
            } catch (err) {
                console.error("Failed to load assessments", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-black tracking-widest uppercase italic">Mining Performance Data...</div>;

    // Aggregate data for charts
    const recentScores = data.slice(0, 5).reverse().map(a => ({
        name: new Date(a.createdAt).toLocaleDateString(),
        score: Math.round((a.score / a.totalQuestions) * 100),
        type: a.type
    }));

    const radarData = [
        { subject: 'Logic', A: 85, fullMark: 100 },
        { subject: 'Verbal', A: 70, fullMark: 100 },
        { subject: 'Quant', A: 90, fullMark: 100 },
        { subject: 'Coding', A: 75, fullMark: 100 },
        { subject: 'Speed', A: 65, fullMark: 100 },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20 italic">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-slate-900 tracking-tighter italic">Cognitive <span className="text-blue-600">Sync</span></h1>
                    <p className="text-slate-500 text-base font-black uppercase tracking-[0.3em] mt-1">Cross-platform Performance Intelligence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Score Progression */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 tracking-tighter italic uppercase flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-indigo-500" />
                            Growth Velocity
                        </h3>
                    </div>
                    <div className="h-[350px] w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                            <AreaChart data={recentScores}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1) ' }} />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#scoreGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 tracking-tighter mb-8 italic uppercase text-center">Skill Mapping</h3>
                    <div className="h-[350px] w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <Radar name="Student" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Assessment History */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 tracking-tighter mb-10 italic uppercase">Submission Log</h3>
                <div className="space-y-4">
                    {data.map((assessment, i) => (
                        <div key={i} className="group p-8 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 rounded-[35px] border border-transparent hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm",
                                    assessment.type === 'Aptitude' ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
                                )}>
                                    {assessment.type === 'Aptitude' ? <Brain className="h-7 w-7" /> : <Code2 className="h-7 w-7" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-900 uppercase italic">{assessment.title}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-base font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic">
                                            <Calendar className="h-3 w-3" /> {new Date(assessment.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-base font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic">
                                            <Zap className="h-3 w-3" /> {Math.floor(assessment.timeTaken / 60)}m Taken
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Index Result</p>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-slate-900 italic">{Math.round((assessment.score / assessment.totalQuestions) * 100)}%</h4>
                                </div>
                                <div className="h-14 w-px bg-slate-200 dark:bg-slate-800" />
                                <button className="h-14 w-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all shadow-sm">
                                    <ArrowRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
