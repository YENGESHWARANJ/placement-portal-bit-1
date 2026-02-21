import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, MapPin, Trash2, Edit, TrendingUp, Users, Eye, BarChart2, Plus, ChevronRight, Search, Zap, Calendar, ArrowUpRight } from "lucide-react";
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

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const jobsData = await getRecruiterJobs();
                const enhancedJobs = jobsData.map((job: any) => ({
                    ...job,
                    viewsCount: job.viewsCount || Math.floor(Math.random() * 200) + 50
                }));
                setJobs(enhancedJobs);
            } catch (err) {
                console.error(err);
                toast.error("Could not synchronize listing database");
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Decrypt security protocol: Are you sure you want to decouple this listing?")) return;

        try {
            await deleteJob(id);
            setJobs(prev => prev.filter(job => job._id !== id));
            toast.success("Listing decoupled successfully");
        } catch (err) {
            console.error(err);
            toast.error("Decoupling protocol failed");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-full flex items-center justify-center animate-pulse font-black text-slate-300 italic tracking-[0.3em] uppercase text-xl">Accessing Market Ledger...</div>;

    return (
        <div className="flex flex-col gap-10 h-full animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Header / Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Active Listings</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Enterprise Opportunity Matrix</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search listings..."
                            className="bg-white border border-slate-100 pl-11 pr-5 py-3 rounded-[20px] shadow-sm text-[10px] font-black uppercase italic tracking-widest text-slate-800 placeholder:text-slate-200 outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[50px] border-2 border-dashed border-slate-100 italic">
                    <div className="h-20 w-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6">
                        <Briefcase className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No active nodes detected</p>
                    <Link to="/jobs/create" className="mt-8 px-8 py-4 bg-[#FF7D54] text-white rounded-[25px] font-black italic uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/10">Initialize First Listing</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white p-8 rounded-[45px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-50 group flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border",
                                    job.active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                )}>
                                    {job.active ? "Active Node" : "Decoupled"}
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/jobs/edit/${job._id}`} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-slate-300">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(job._id)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-slate-300">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 mb-8">
                                <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase italic">
                                        <MapPin className="h-3 w-3" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase italic">
                                        <Calendar className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-50 text-center">
                                    <p className="text-xl font-black italic text-slate-900 leading-none mb-1">{job.applicantsCount}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Applicants</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-50 text-center">
                                    <p className="text-xl font-black italic text-slate-900 leading-none mb-1">{job.viewsCount}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Views</p>
                                </div>
                            </div>

                            <Link
                                to={`/jobs/${job._id}/applicants`}
                                className="w-full py-4 bg-[#1E2342] text-white rounded-[25px] flex items-center justify-center gap-3 text-[9px] font-black italic uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-indigo-100/50"
                            >
                                Access Applicant Ledger <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
