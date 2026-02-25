import React, { useState, useEffect } from "react";
import {
    Briefcase, Calendar, Users, Edit, Trash2, CheckCircle,
    XCircle, Eye, MoreHorizontal, ArrowUpRight, Search, ChevronRight
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    deadline?: string;
    status: 'active' | 'closed' | 'completed';
    applicantsCount: number;
}

export default function JobManager() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: "10"
                });
                if (debouncedSearch) queryParams.append("search", debouncedSearch);

                const { data } = await api.get<{ jobs: Job[], totalPages: number }>(`/admin/jobs?${queryParams.toString()}`);
                setJobs(data.jobs || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                toast.error("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [page, debouncedSearch]);

    const handleAction = async (id: string, action: 'close' | 'delete' | 'complete') => {
        if (!window.confirm(`Are you sure you want to ${action} this job?`)) return;
        try {
            if (action === 'delete') {
                await api.delete(`/jobs/${id}`);
                setJobs(prev => prev.filter(j => j._id !== id));
            } else {
                const status = action === 'close' ? 'closed' : 'completed';
                await api.put(`/admin/jobs/${id}/status`, { status });
                setJobs(prev => prev.map(j => j._id === id ? { ...j, status } : j));
            }
            toast.success(`Job ${action}d successfully`);
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Job Operations</h1>
                    <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Lifecycle • Compliance • Audit</p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search jobs or companies..."
                        className="w-full bg-[#0F1121] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-600 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0F1121] border border-white/5 rounded-[30px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Role / Company</th>
                            <th className="px-8 py-6">Package</th>
                            <th className="px-8 py-6">Deadline</th>
                            <th className="px-8 py-6">Applicants</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="p-10 text-center text-slate-500 italic">Accessing Ledger...</td></tr>
                        ) : jobs.map((job) => (
                            <tr key={job._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-200">{job.title}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{job.company} • {job.location}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-emerald-400 font-mono text-xs">{job.salary}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-slate-400 text-xs flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No Deadline'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-slate-300 font-bold">
                                        <Users className="h-4 w-4 text-slate-500" />
                                        {job.applicantsCount || 0}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${job.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        job.status === 'closed' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                            "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                        }`}>
                                        {job.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/jobs/${job._id}`} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="View">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleAction(job._id, 'close')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="Close">
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleAction(job._id, 'delete')} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 bg-[#0F1121] px-6 py-3 border border-white/5 shadow-sm rounded-full w-max mx-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white px-4 border-x border-white/5">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
