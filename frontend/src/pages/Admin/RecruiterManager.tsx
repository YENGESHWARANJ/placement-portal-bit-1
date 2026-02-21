import React, { useState, useEffect } from "react";
import {
    Briefcase, Search, Filter, CheckCircle, Ban, Trash2,
    Eye, MoreHorizontal, UserCheck, XCircle
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Recruiter {
    _id: string;
    name: string;
    email: string;
    company: string;
    status: 'pending' | 'active' | 'rejected';
    activeJobs: number;
}

export default function RecruiterManager() {
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        try {
            const { data } = await api.get<{ recruiters: Recruiter[] }>('/admin/recruiters');
            setRecruiters(data.recruiters || []);
        } catch (error) {
            toast.error("Failed to load recruiter network");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
        try {
            if (action === 'delete') {
                if (!window.confirm("Delete this recruiter?")) return;
                // Add delete endpoint to backend if needed, for now just suspend
                await api.put(`/admin/recruiters/${id}/status`, { status: "suspended" });
                setRecruiters(prev => prev.filter(r => r._id !== id));
                toast.success("Recruiter account suspended");
            } else {
                const status = action === 'approve' ? 'active' : 'rejected';
                await api.put(`/admin/recruiters/${id}/status`, { status });
                setRecruiters(prev => prev.map(r => r._id === id ? { ...r, status } : r));
                toast.success(`Recruiter ${action}d successfully`);
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Recruiter Network</h1>
                    <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Approvals • Vetting • Access</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0F1121] border border-white/5 rounded-[30px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Company / Recruiter</th>
                            <th className="px-8 py-6">Contact</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Active Jobs</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {recruiters.map((recruiter) => (
                            <tr key={recruiter._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200">{recruiter.company}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{recruiter.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-slate-400 text-xs font-mono">{recruiter.email}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${recruiter.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        recruiter.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                        }`}>
                                        {recruiter.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-slate-300 font-bold">{recruiter.activeJobs}</div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {recruiter.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleAction(recruiter._id, 'approve')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-500" title="Approve">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleAction(recruiter._id, 'reject')} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500" title="Reject">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="View Profile">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleAction(recruiter._id, 'delete')} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500" title="Remove">
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
