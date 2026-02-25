import React, { useState, useEffect } from "react";
import {
    Briefcase, Search, Filter, CheckCircle, Ban, Trash2,
    Eye, MoreHorizontal, UserCheck, XCircle, Globe, Zap,
    ArrowUpRight, Activity, Users, ShieldCheck, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Recruiter {
    _id: string;
    name: string;
    email: string;
    company: string;
    status: 'pending' | 'active' | 'rejected' | 'suspended';
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            {/* Header - ELITE UPGRADE */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-[#0A0D1E] rounded-[60px] p-16 text-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] group border border-white/5"
            >
                <div className="absolute top-0 right-0 p-64 bg-emerald-600/10 rounded-full blur-[150px] -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-600/20 transition-all duration-[4000ms]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Briefcase className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-400 italic">Partner_Network_Node</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
                        RECRUITER <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">NEXUS™</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-bold max-w-xl italic">
                        Orchestrating the platform's <span className="text-white">corporate synergies</span> and recruitment velocity pathways.
                    </p>
                </div>
            </motion.div>

            {/* Table - ELITE UPGRADE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0D1E]/60 border border-white/5 rounded-[50px] overflow-hidden shadow-3xl backdrop-blur-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] italic border-b border-white/5">
                                <th className="px-10 py-8">Corporate_Node</th>
                                <th className="px-10 py-8">Communication_Link</th>
                                <th className="px-10 py-8">Authorization_State</th>
                                <th className="px-10 py-8">Job_Velocity</th>
                                <th className="px-10 py-8 text-right">Matrix_Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] italic">Synchronizing_Network...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : recruiters.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <Search className="h-12 w-12 text-slate-700" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] italic">No active partner nodes found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recruiters.map((recruiter, i) => (
                                    <motion.tr
                                        key={recruiter._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-white/[0.03] transition-all group/row cursor-pointer"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-[22px] bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center text-xl font-black text-emerald-400 border border-white/5 group-hover/row:scale-110 transition-all shadow-2xl">
                                                    <Briefcase className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-lg tracking-tighter group-hover/row:text-emerald-400 transition-colors uppercase italic">{recruiter.company}</div>
                                                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">{recruiter.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-slate-700" />
                                                <span className="text-slate-400 text-[11px] font-mono tracking-tighter italic">{recruiter.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={cn(
                                                "inline-flex items-center gap-3 px-5 py-2 rounded-[20px] border transition-all shadow-lg",
                                                recruiter.status === 'active'
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                    : recruiter.status === 'pending'
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                                                        : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5"
                                            )}>
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    recruiter.status === 'active' ? "bg-emerald-500 animate-pulse" :
                                                        recruiter.status === 'pending' ? "bg-amber-500 animate-ping" : "bg-rose-500"
                                                )} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                                                    NODE_{recruiter.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(recruiter.activeJobs * 10, 100)}%` }} />
                                                </div>
                                                <span className="text-white font-black italic text-xs tracking-tighter">{recruiter.activeJobs}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                                                {recruiter.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleAction(recruiter._id, 'approve'); }}
                                                            className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all shadow-lg"
                                                            title="Authorize Access"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleAction(recruiter._id, 'reject'); }}
                                                            className="h-12 w-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all shadow-lg"
                                                            title="Deny Access"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 border border-white/5 transition-all" title="View Dossier">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAction(recruiter._id, 'delete'); }}
                                                    className="h-12 w-12 bg-rose-500/5 rounded-2xl flex items-center justify-center text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                                    title="Purge Node"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
