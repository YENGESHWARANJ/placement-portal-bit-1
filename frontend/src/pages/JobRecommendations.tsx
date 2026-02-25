import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

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
        persistToggleSave({
            _id: job._id,
            title: job.title,
            company: job.company,
            logo: job.logo,
            location: job.location,
            type: job.type,
            salary: job.salary
        });
        setJobs(jobs.map(j => (j._id === job._id ? { ...j, saved: nowSaved } : j)));
        toast.success(nowSaved ? "Added to favorites" : "Removed from favorites");
    };

    const handleApply = async (id: string) => {
        try {
            await applyJob(id);
            setJobs(jobs.map(job =>
                job._id === id ? { ...job, applied: true } : job
            ));
            toast.success("Application submitted successfully!");
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
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[11px] font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Curation</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Job Matches</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Smart recommendations based on your unique skill lattice.</p>
                </div>

                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-300" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search roles or companies..."
                        className="w-full pl-11 pr-5 py-3.5 bg-white border border-apple-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue/50 transition-all shadow-sm"
                    />
                </div>
            </motion.div>

            {/* AI Highlight Banner */}
            <motion.div
                variants={stagger.item}
                className="bg-apple-gray-900 p-10 rounded-[40px] text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl"
            >
                <div className="relative z-10 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                        <div className="h-8 w-8 bg-apple-blue rounded-xl flex items-center justify-center">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-apple-blue">Optimization Insight</span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-2 italic">95% Resonance Detected</h3>
                    <p className="text-apple-gray-400 font-medium">Your coding patterns perfectly align with top-tier startup roles.</p>
                </div>

                <div className="flex gap-6 relative z-10 items-center">
                    <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[28px] backdrop-blur-3xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-1">
                            <Sparkles className="h-4 w-4 text-apple-blue" />
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">High Probability Matches</p>
                        </div>
                        <p className="text-2xl font-bold italic text-white tracking-tight">
                            <span className="text-apple-blue">{jobs.filter(j => (j.matchScore || 0) >= 90).length}</span> Premium Tiers
                        </p>
                    </div>
                </div>

                {/* Decorative Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-apple-blue/5 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />
            </motion.div>

            {/* Controls HUD */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row gap-4 p-2 bg-apple-gray-50 rounded-2xl border border-apple-gray-100">
                <div className="flex gap-1.5 flex-wrap">
                    {(["all", "recommended", "saved", "applied"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setFilterType(filter)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
                                filterType === filter
                                    ? "bg-white text-apple-gray-900 shadow-sm border border-apple-gray-200"
                                    : "text-apple-gray-400 hover:text-apple-gray-600 px-4"
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
                        className="bg-transparent text-[11px] font-bold uppercase tracking-wider text-apple-gray-500 px-4 py-2 outline-none cursor-pointer hover:text-apple-gray-900 transition-all"
                    >
                        <option value="match">Resonance Index</option>
                        <option value="recent">Temporal Sort</option>
                        <option value="salary">Salary Bracket</option>
                    </select>
                </div>
            </motion.div>

            {/* Jobs Ledger */}
            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border border-apple-gray-50 animate-pulse transition-all">
                        <Loader2 className="h-10 w-10 text-apple-blue animate-spin mb-4" />
                        <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Opportunities...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white py-32 rounded-[40px] border border-apple-gray-50 text-center">
                        <Briefcase className="h-12 w-12 text-apple-gray-100 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight">No Matches Detected</h3>
                        <p className="text-apple-gray-400 mt-2 font-medium uppercase tracking-widest text-[9px]">Zero high-resonance signals found in current flux</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job._id}
                                variants={stagger.item}
                                className="apple-card p-10 group hover:shadow-apple-hover transition-all duration-500 flex flex-col relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="h-16 w-16 bg-apple-gray-900 text-white rounded-[20px] flex items-center justify-center text-3xl shadow-xl group-hover:bg-apple-blue transition-all duration-700">
                                        {job.logo || "🏢"}
                                    </div>
                                    <div className="flex flex-col items-end gap-3 h-14 w-14 rounded-full border-4 border-apple-gray-50 relative flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" className="text-apple-gray-50" />
                                            <motion.circle
                                                initial={{ strokeDashoffset: 150.8 }}
                                                animate={{ strokeDashoffset: 150.8 * (1 - job.matchScore / 100) }}
                                                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="150.8" className="text-apple-blue" strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="text-[10px] font-bold text-apple-gray-900 relative z-10 leading-none">{job.matchScore || 85}%</span>
                                    </div>
                                </div>

                                <div className="flex-1 mb-8">
                                    <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight mb-2 group-hover:text-apple-blue transition-colors duration-500 line-clamp-2">{job.title}</h3>
                                    <div className="flex items-center gap-2.5 mb-8">
                                        <Building2 className="h-4 w-4 text-apple-gray-400" />
                                        <p className="text-[12px] font-bold text-apple-gray-400 uppercase tracking-widest leading-none">{job.company}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <DataTag icon={MapPin} label={job.location} />
                                        <DataTag icon={Briefcase} label={job.type} />
                                        <DataTag icon={Award} label={job.experience || "Entry"} />
                                        <DataTag icon={DollarSign} label={job.salary} colored />
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(job.skills || []).slice(0, 3).map((skill, index) => (
                                            <span key={index} className="px-4 py-1.5 bg-apple-gray-50 text-apple-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-transparent group-hover:border-apple-blue/20 group-hover:text-apple-blue transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Resonance Positive</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-auto pt-8 border-t border-apple-gray-50">
                                    {!job.applied ? (
                                        <button
                                            onClick={() => handleApply(job._id)}
                                            className="flex-1 apple-btn-primary py-4 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            Apply Role <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <div className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-[24px] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                                            <CheckCircle2 className="h-4 w-4" /> Applied
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleSave(job)}
                                        className={cn(
                                            "h-[56px] w-[56px] rounded-[24px] flex items-center justify-center transition-all duration-300",
                                            isSaved(job._id)
                                                ? "bg-rose-50 text-rose-500 shadow-sm"
                                                : "bg-apple-gray-50 text-apple-gray-300 hover:bg-rose-50 hover:text-rose-500"
                                        )}
                                    >
                                        <Heart className={cn("h-5 w-5", isSaved(job._id) ? "fill-current" : "")} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// HELPERS
function DataTag({ icon: Icon, label, colored = false }: any) {
    return (
        <div className="flex items-center gap-2.5 bg-apple-gray-50/50 p-2 rounded-[18px] border border-apple-gray-50 transition-all group-hover:bg-white group-hover:shadow-sm">
            <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center", colored ? "bg-emerald-50 text-emerald-600" : "bg-white text-apple-gray-400 border border-apple-gray-100")}>
                <Icon className="h-3.5 w-3.5" />
            </div>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest truncate", colored ? "text-emerald-700" : "text-apple-gray-400")}>{label}</span>
        </div>
    );
}
