import React, { useState, useEffect } from "react";
import {
    Download, Plus, Search, Filter, MoreHorizontal, Mail,
    Trash2, Edit, Ban, CheckCircle, Upload, FileText,
    GraduationCap, ShieldCheck, Zap, Globe, Cpu, Users,
    ChevronRight, ArrowUpRight, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Student {
    _id: string;
    name: string;
    email: string;
    usn: string;
    branch: string;
    cgpa: number;
    status: string;
    skills: string[];
    isActive: boolean;
}

export default function StudentManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchStudents();
    }, [page, debouncedSearch]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "10"
            });
            if (debouncedSearch) queryParams.append("search", debouncedSearch);

            const { data } = await api.get<{ students: any[], totalPages: number }>(`/students?${queryParams.toString()}`);
            setStudents(data.students.map(s => ({ ...s, isActive: true }))); // Mock isActive
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/admin/students/${id}`);
            toast.success("Student deleted");
            fetchStudents();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/students/${id}/status`, { isActive: !currentStatus });
            setStudents(prev => prev.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
            toast.success(`Account ${currentStatus ? 'Disabled' : 'Enabled'}`);
        } catch (err) {
            toast.error("Status update failed");
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

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <Users className="h-6 w-6 text-emerald-400" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-400 italic">Neural_Student_Index</span>
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
                            NETWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">REGISTRY™</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-bold max-w-xl italic">
                            Orchestrating the platform's <span className="text-white">academic assets</span> and talent synchronization pathways.
                        </p>
                    </div>

                    <div className="flex gap-4 shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-white/5 px-8 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-400 transition-all shadow-2xl backdrop-blur-3xl"
                        >
                            <Upload className="h-4 w-4" /> BULK_INGEST
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 shadow-2xl shadow-emerald-900/60"
                        >
                            <Plus className="h-4 w-4" /> ADD_NODE
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Toolbar - ELITE UPGRADE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-6 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-6 items-center shadow-3xl"
            >
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="IDENTIFY NODE BY ID, NAME OR PAYLOAD..."
                        className="w-full bg-[#0A0D1E]/40 border border-white/5 rounded-[30px] pl-16 pr-8 py-6 text-[11px] font-black tracking-widest text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-700 transition-all"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none p-6 bg-white/5 border border-white/5 rounded-[28px] text-slate-500 hover:text-emerald-400 hover:bg-white/10 transition-all active:scale-95 group">
                        <Filter className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </button>
                    <button className="flex-1 md:flex-none p-6 bg-white/5 border border-white/5 rounded-[28px] text-slate-500 hover:text-teal-400 hover:bg-white/10 transition-all active:scale-95 group">
                        <Download className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-[28px] border border-emerald-500/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
                    </div>
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
                                <th className="px-10 py-8">Identity_Node</th>
                                <th className="px-10 py-8">Academic_Trajectory</th>
                                <th className="px-10 py-8">Neural_Skills</th>
                                <th className="px-10 py-8">Operational_Status</th>
                                <th className="px-10 py-8 text-right">System_Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-12 w-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] italic">Synchronizing_Registry...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <Search className="h-12 w-12 text-slate-700" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] italic">No nodes identified in current cluster</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, i) => (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-white/[0.03] transition-all group/row cursor-pointer"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="h-16 w-16 rounded-[22px] bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center text-xl font-black text-emerald-400 border border-white/5 group-hover/row:scale-110 group-hover/row:rotate-6 transition-all shadow-2xl">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    {student.isActive && (
                                                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-[#0A0D1E] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-lg tracking-tighter group-hover/row:text-emerald-400 transition-colors uppercase italic">{student.name}</div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{student.usn}</span>
                                                        <div className="h-1 w-1 rounded-full bg-slate-800" />
                                                        <span className="text-[9px] text-slate-500 font-bold lowercase opacity-60">{student.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-slate-300 font-black text-[11px] uppercase tracking-wider">{student.branch}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                        <span className="text-[10px] text-indigo-400 font-black italic tracking-widest">{student.cgpa} GPA</span>
                                                    </div>
                                                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-tighter italic">NEURAL_STRENGTH</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                {student.skills?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {student.skills?.length > 3 && (
                                                    <span className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-[9px] font-black text-slate-600 border border-white/5">
                                                        +{student.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={cn(
                                                "inline-flex items-center gap-3 px-5 py-2 rounded-[20px] border transition-all shadow-lg",
                                                student.isActive
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                    : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5"
                                            )}>
                                                <div className={cn("h-2 w-2 rounded-full", student.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                                                    {student.isActive ? "NODE_ACTIVE" : "NODE_DISABLED"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                                                <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 border border-white/5 transition-all" title="View Deep Profile">
                                                    <FileText className="h-5 w-5" />
                                                </button>
                                                <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/5 transition-all" title="Edit Metadata">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleStatus(student._id, student.isActive); }}
                                                    className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 transition-all",
                                                        student.isActive ? "hover:text-rose-400 hover:bg-rose-500/10" : "hover:text-emerald-400 hover:bg-emerald-500/10"
                                                    )}
                                                    title={student.isActive ? "Initiate Disable Protocol" : "Initiate Activation Protocol"}
                                                >
                                                    <Ban className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(student._id); }}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 glass-premium px-6 py-3 border border-white/5 shadow-sm rounded-full w-max mx-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 disabled:opacity-40 transition-opacity hover:bg-white/10 rounded-md"
                    >
                        Previous
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white px-4 border-x border-white/5">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 disabled:opacity-40 transition-opacity hover:bg-white/10 rounded-md"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
