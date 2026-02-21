import { useState, useEffect } from "react";
import {
    Sparkles, MapPin, DollarSign, Briefcase, Clock, Users,
    TrendingUp, Heart, ExternalLink, Filter,
    Search, Zap, Target, Award, Building2, Calendar, CheckCircle2,
    Loader2, ArrowUpRight, ChevronRight, Bookmark
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getRecommendedJobs, applyJob } from "../services/job.service";
import { useSavedJobs } from "../hooks/useSavedJobs";
import { cn } from "../utils/cn";

interface Job {
    _id: string;
    title: string;
    company: string;
    logo?: string;
    location: string;
    salary: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    experience?: string;
    matchScore: number;
    skills: string[];
    createdAt?: string;
    applicantsCount?: number;
    saved?: boolean;
    applied?: boolean;
    trending?: boolean;
}

// Normalize raw API job data to guarantee no undefined fields crash the UI
function normalizeJob(raw: any): Job {
    return {
        _id: raw._id || '',
        title: raw.title || 'Untitled Position',
        company: raw.company || 'Unknown Company',
        logo: raw.logo,
        location: raw.location || 'Remote',
        salary: raw.salary || 'Negotiable',
        type: raw.type || 'Full-time',
        experience: raw.experience,
        matchScore: raw.matchScore || 0,
        skills: Array.isArray(raw.skills) ? raw.skills : [],
        createdAt: raw.createdAt,
        applicantsCount: raw.applicantsCount,
        saved: raw.saved || false,
        applied: raw.applied || false,
        trending: raw.trending || false,
    };
}

export default function JobRecommendations() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "recommended" | "saved" | "applied">("recommended");
    const [sortBy, setSortBy] = useState<"match" | "salary" | "recent">("match");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const { isSaved, toggleSave: persistToggleSave } = useSavedJobs();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getRecommendedJobs();
            const normalized = Array.isArray(data) ? data.map(normalizeJob) : [];
            setJobs(normalized);
        } catch (error) {
            console.error("Fetch jobs error:", error);
            toast.error("Failed to load recommendations");
        } finally {
            setLoading(false);
        }
    };

    const toggleSave = (job: Job) => {
        const nowSaved = !isSaved(job._id);
        persistToggleSave({ _id: job._id, title: job.title, company: job.company });
        setJobs(jobs.map(j => (j._id === job._id ? { ...j, saved: nowSaved } : j)));
        toast.success(nowSaved ? "Saved successfully!" : "Removed from saved", { icon: nowSaved ? "❤️" : "💔" });
    };

    const handleApply = async (id: string) => {
        try {
            await applyJob(id);
            setJobs(jobs.map(job =>
                job._id === id ? { ...job, applied: true } : job
            ));
            toast.success("Application submitted successfully!", { icon: "🚀" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Application failed");
        }
    };

    const [locationFilter, setLocationFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [salaryRange, setSalaryRange] = useState("all");

    const filteredJobs = jobs
        .filter(job => {
            if (filterType === "recommended") return (job.matchScore || 0) >= 80;
            if (filterType === "saved") return isSaved(job._id);
            if (filterType === "applied") return job.applied;
            return true;
        })
        .filter(job => {
            const loc = job.location || '';
            if (locationFilter !== "all" && !loc.toLowerCase().includes(locationFilter.toLowerCase())) return false;
            if (typeFilter !== "all" && job.type !== typeFilter) return false;

            if (salaryRange !== "all") {
                const minRequired = parseInt(salaryRange);
                const salaryMatch = (job.salary || '').match(/(\d+)/);
                if (salaryMatch) {
                    const jobMin = parseInt(salaryMatch[0]);
                    if (jobMin < minRequired) return false;
                }
            }
            return true;
        })
        .filter(job =>
            searchQuery === "" ||
            (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.company || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "match") return (b.matchScore || 0) - (a.matchScore || 0);
            if (sortBy === "salary") return 0; // Simple fallback
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });


    return (
        <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">

            {/* 1. ELITE COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Market Intelligence</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Real-time AI Match Synthesis Hub</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Execute search protocol..."
                            className="w-64 pl-11 pr-5 py-3 bg-white border border-slate-100 rounded-[22px] text-[10px] font-black uppercase italic tracking-widest text-slate-800 placeholder:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* AI Global Stats Banner */}
            <div className="bg-[#1E2342] p-8 rounded-[45px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
                <div className="absolute top-0 right-0 p-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-[26px] flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                        <Zap className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-[0.3em] mb-1 italic leading-none">Global Accuracy</p>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">95% Resonance</h3>
                    </div>
                </div>
                <div className="flex gap-6 relative z-10">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">Synchronization</p>
                        <p className="text-lg font-black italic uppercase tracking-tighter leading-none text-emerald-400">Locked</p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm">
                        <p className="text-[10px] font-black italic text-white uppercase tracking-widest leading-none">12 Perfect Matches Found</p>
                    </div>
                </div>
            </div>

            {/* Quick Filter Control HUD */}
            <div className="flex flex-col md:flex-row gap-6 p-4 bg-white/50 backdrop-blur-sm rounded-[35px] border border-white shadow-sm">
                <div className="flex gap-2 flex-wrap">
                    {(["all", "recommended", "saved", "applied"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setFilterType(filter)}
                            className={cn(
                                "px-6 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all italic",
                                filterType === filter
                                    ? "bg-[#FF7D54] text-white shadow-xl shadow-orange-500/20"
                                    : "bg-white text-slate-400 hover:text-slate-800 border border-slate-50"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="md:ml-auto flex gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-white border border-slate-100 text-[9px] font-black uppercase tracking-widest italic text-slate-500 px-4 py-2 rounded-[18px] outline-none cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <option value="match">Resonance Index</option>
                        <option value="recent">Temporal Sort</option>
                        <option value="salary">Credit Value</option>
                    </select>
                </div>
            </div>

            {/* Jobs Ledger Area */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-100 rounded-[50px] animate-pulse">
                        <Loader2 className="h-10 w-10 text-slate-200 animate-spin mb-4" />
                        <p className="text-slate-300 font-black uppercase tracking-widest text-[9px] italic">Scouring Market Plasm...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white p-20 rounded-[50px] border border-slate-50 text-center italic">
                        <Briefcase className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching nodes detected in current flux</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white p-8 rounded-[50px] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="h-16 w-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-3xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                                        {job.logo || "🏢"}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <div className="h-10 w-10 rounded-full border-2 border-slate-50 relative flex items-center justify-center group-hover:border-indigo-100 transition-colors">
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-50" />
                                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="113.1" strokeDashoffset={113.1 * (1 - job.matchScore / 100)} className="text-indigo-600 transition-all duration-1000" strokeLinecap="round" />
                                            </svg>
                                            <span className="text-[8px] font-black text-indigo-600 italic leading-none">{job.matchScore}%</span>
                                        </div>
                                        {job.trending && <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest italic border border-amber-100"><Zap className="h-2.5 w-2.5" /> High Pulse</span>}
                                    </div>
                                </div>

                                <div className="flex-1 mb-6">
                                    <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none flex items-center gap-2 mb-6">
                                        <Building2 className="h-3 w-3" /> {job.company}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <DataTag icon={MapPin} label={job.location} />
                                        <DataTag icon={Briefcase} label={job.type} />
                                        <DataTag icon={Award} label={job.experience || "Entry"} />
                                        <DataTag icon={DollarSign} label={job.salary} colored />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {(job.skills || []).slice(0, 3).map((skill, index) => (
                                            <span key={index} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[8px] font-black uppercase tracking-widest italic border border-slate-100">{skill}</span>
                                        ))}
                                        {(job.skills || []).length > 3 && <span className="px-3 py-1.5 text-slate-300 text-[8px] font-black uppercase tracking-widest italic">+{(job.skills || []).length - 3} More</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    {!job.applied ? (
                                        <button
                                            onClick={() => handleApply(job._id)}
                                            className="flex-1 py-4 bg-[#1E2342] hover:bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            Initiate Application <ArrowUpRight className="h-3.5 w-3.5" />
                                        </button>
                                    ) : (
                                        <button className="flex-1 py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 cursor-not-allowed">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Node Synchronized
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleSave(job)}
                                        className={cn(
                                            "h-[56px] w-[56px] rounded-[24px] flex items-center justify-center border transition-all hover:scale-105 active:scale-90 shadow-sm",
                                            isSaved(job._id) ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white border-slate-100 text-slate-300 hover:border-rose-100 hover:text-rose-500"
                                        )}
                                    >
                                        <Heart className={cn("h-5 w-5", isSaved(job._id) ? "fill-current" : "")} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// HELPERS
function DataTag({ icon: Icon, label, colored = false }: any) {
    return (
        <div className="flex items-center gap-2.5 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-50/50 group-hover:bg-white transition-colors">
            <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center", colored ? "bg-emerald-50 text-emerald-600" : "bg-white text-slate-300 shadow-sm")}>
                <Icon className="h-3.5 w-3.5" />
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-widest italic truncate", colored ? "text-emerald-700" : "text-slate-500")}>{label}</span>
        </div>
    );
}
