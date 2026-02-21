import React, { useState, useEffect } from "react";
import {
    Briefcase, Calendar, Users, Edit, Trash2, CheckCircle,
    XCircle, Eye, MoreHorizontal, ArrowUpRight
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

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get<{ jobs: Job[] }>('/admin/jobs');
                setJobs(data.jobs || []);
            } catch (error) {
                toast.error("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

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
                    <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Lifecycle • Compliance • Audit</p>
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
                                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
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
        </div>
    );
}
