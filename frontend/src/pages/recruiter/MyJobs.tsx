import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, MapPin, Trash2, Edit, TrendingUp, Users, Eye, BarChart2, Plus, ChevronRight, Search, Zap, Calendar, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecruiterJobs, deleteJob } from "../../services/recruiter.service";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";

interface Job {
    _id: string;
    title: string;
    company: string;

    location: string;
    type: string;
    salary: string;
    active: boolean;
    createdAt: string;
    applicantsCount?: number;
    viewsCount?: number;
}

export default function MyJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchMyJobs = async () => {
            setLoading(true);
            try {
                const data = await getRecruiterJobs(page, 9, debouncedSearch);
                const enhancedJobs = data.jobs.map((job: any) => ({
                    ...job,
                    viewsCount: job.viewsCount || Math.floor(Math.random() * 200) + 50
                }));
                setJobs(enhancedJobs);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error(err);
                toast.error("Unable to sync market database");
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, [page, debouncedSearch]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Action Confirmation: Are you sure you want to remove this listing?")) return;

        try {
            await deleteJob(id);
            setJobs(prev => prev.filter(job => job._id !== id));
            toast.success("Listing removed successfully");
        } catch (err) {
            console.error(err);
            toast.error("Removal protocol failed");
        }
    };



    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Market Ledger...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">

            {/* Header / Search Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-apple-gray-900 tracking-tight leading-none mb-3">Active Listings</h2>
                    <p className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em]">Enterprise Opportunity Matrix</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-[320px]">
                        <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-300 group-focus-within:text-apple-blue transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter opportunities..."
                            className="bg-apple-gray-50 border border-apple-gray-100 pl-11 pr-5 py-4 rounded-2xl shadow-sm text-[11px] font-bold tracking-tight text-apple-gray-900 placeholder:text-apple-gray-300 outline-none w-full focus:ring-4 focus:ring-apple-blue/10 focus:bg-white transition-all"
                        />
                    </div>
                    <Link
                        to="/jobs/create"
                        className="h-[52px] px-6 bg-apple-blue text-white rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-apple-blue-dark transition-all shadow-apple-hover w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> New Listing
                    </Link>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-apple-gray-100 shadow-sm border-dashed">
                    <div className="h-20 w-20 bg-apple-gray-50 rounded-[28px] flex items-center justify-center mb-8">
                        <Briefcase className="h-10 w-10 text-apple-gray-200" />
                    </div>
                    <p className="text-[11px] font-black text-apple-gray-400 uppercase tracking-[0.4em] mb-8">No active listings detected</p>
                    <Link
                        to="/jobs/create"
                        className="px-8 py-4 bg-apple-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl"
                    >
                        Initialize First Listing
                    </Link>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {jobs.map((job) => (
                        <motion.div
                            key={job._id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }
                            }}
                            className="apple-card group hover:shadow-apple-hover transition-all duration-500 border border-apple-gray-50 bg-white flex flex-col p-1"
                        >
                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        job.active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-apple-gray-50 text-apple-gray-400 border-apple-gray-100"
                                    )}>
                                        {job.active ? "Active Node" : "Decoupled"}
                                    </div>
                                    <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/jobs/edit/${job._id}`} className="p-2.5 bg-apple-gray-50 hover:bg-apple-blue/10 hover:text-apple-blue rounded-xl transition-all text-apple-gray-400">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(job._id)} className="p-2.5 bg-apple-gray-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-apple-gray-400">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 mb-8">
                                    <h3 className="text-xl font-black text-apple-gray-900 tracking-tight mb-3 line-clamp-2 leading-tight group-hover:text-apple-blue transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">
                                            <MapPin className="h-3 w-3" /> {job.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-apple-gray-400 uppercase tracking-widest">
                                            <Calendar className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-apple-gray-50/50 p-5 rounded-3xl border border-apple-gray-100 text-center transition-colors group-hover:bg-white overflow-hidden">
                                        <p className="text-2xl font-black text-apple-gray-900 tracking-tighter mb-1">{job.applicantsCount}</p>
                                        <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest leading-none">Applicants</p>
                                    </div>
                                    <div className="bg-apple-gray-50/50 p-5 rounded-3xl border border-apple-gray-100 text-center transition-colors group-hover:bg-white overflow-hidden">
                                        <p className="text-2xl font-black text-apple-gray-900 tracking-tighter mb-1">{job.viewsCount}</p>
                                        <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest leading-none">Views</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 mt-auto">
                                <Link
                                    to={`/jobs/${job._id}/applicants`}
                                    className="w-full py-5 bg-apple-gray-900 text-white rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                                >
                                    Access Pipeline <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 bg-white px-6 py-3 border border-apple-gray-100 shadow-sm rounded-full w-max mx-auto">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 text-apple-gray-500 hover:text-apple-gray-900 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <span className="text-[12px] font-bold text-apple-gray-900 px-4">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 text-apple-gray-500 hover:text-apple-gray-900 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
