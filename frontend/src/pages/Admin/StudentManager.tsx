import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Download, Plus, Search, Filter, MoreHorizontal, Mail,
    Trash2, Edit, Ban, CheckCircle, Upload, FileText, X,
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
    const [branchFilter, setBranchFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bulkData, setBulkData] = useState("");

    const navigate = useNavigate();

    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        usn: "",
        branch: "CSE",
        year: 2025,
        cgpa: 8.0,
        password: "student123"
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchStudents();
    }, [page, debouncedSearch, branchFilter, statusFilter]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "10"
            });
            if (debouncedSearch) queryParams.append("search", debouncedSearch);
            if (branchFilter !== "All") queryParams.append("branch", branchFilter);
            if (statusFilter !== "All") queryParams.append("status", statusFilter);

            const { data } = await api.get<{ students: any[], totalPages: number }>(`/students?${queryParams.toString()}`);
            setStudents(data.students);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/students/register", newStudent);
            toast.success("Student added successfully");
            setShowAddModal(false);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Addition failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBulkIngest = async () => {
        if (!bulkData.trim()) return;
        setSubmitting(true);
        try {
            const studentsData = JSON.parse(bulkData);
            await api.post("/students/bulk-register", { students: studentsData });
            toast.success("Bulk ingestion completed");
            setShowBulkModal(false);
            setBulkData("");
            fetchStudents();
        } catch (err) {
            toast.error("Invalid JSON format or server error");
        } finally {
            setSubmitting(false);
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
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white rounded-[30px] sm:rounded-[60px] p-8 sm:p-12 md:p-16 text-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.5)] group border border-slate-100"
            >
                <div className="absolute top-0 right-0 p-32 sm:p-64 bg-emerald-600/10 rounded-full blur-[100px] sm:blur-[150px] -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-600/20 transition-all duration-[4000ms]"></div>

                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 md:gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-4 sm:mb-6">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                            </div>
                            <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-emerald-600 italic">Neural_Student_Index</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">
                            NETWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">REGISTRY™</span>
                        </h1>
                        <p className="text-slate-500 text-base sm:text-xl font-bold max-w-xl italic">
                            Orchestrating the platform's <span className="text-slate-900">academic assets</span> and talent synchronization pathways.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 shrink-0 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowBulkModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-slate-50 px-6 sm:px-8 py-4 sm:py-5 rounded-[20px] sm:rounded-[28px] text-sm sm:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-500 border border-slate-200 hover:border-emerald-500/40 hover:text-emerald-600 transition-all shadow-2xl backdrop-blur-3xl"
                        >
                            <Upload className="h-4 w-4" /> BULK_INGEST
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[20px] sm:rounded-[28px] text-sm sm:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] border border-slate-200 shadow-2xl shadow-emerald-900/60"
                        >
                            <Plus className="h-4 w-4" /> ADD_NODE
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 p-6 rounded-[40px] flex flex-col md:flex-row gap-6 items-center shadow-md shadow-slate-200/40"
            >
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="IDENTIFY NODE BY ID, NAME OR PAYLOAD..."
                        className="w-full bg-white/40 border border-slate-100 rounded-[30px] pl-16 pr-8 py-6 text-sm font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-700 transition-all"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <select 
                        className="bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:border-emerald-500/50 appearance-none min-w-[120px]"
                        value={branchFilter}
                        onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }}
                    >
                        <option value="All">All Branches</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">MECH</option>
                        <option value="AI&DS">AI&DS</option>
                    </select>
                    <select 
                        className="bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:border-emerald-500/50 appearance-none min-w-[140px]"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Placed">Placed</option>
                        <option value="Unplaced">Unplaced</option>
                        <option value="Offers Received">Offers Received</option>
                    </select>
                    <button className="p-6 bg-slate-50 border border-slate-100 rounded-[28px] text-slate-500 hover:text-teal-600 hover:bg-slate-100 transition-all active:scale-95 group">
                        <Download className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-[28px] border border-emerald-500/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-emerald-600 animate-pulse" />
                    </div>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 border border-slate-100 rounded-[50px] overflow-hidden shadow-md shadow-slate-200/40 backdrop-blur-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-base font-black uppercase tracking-[0.4em] italic border-b border-slate-100">
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
                                            <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-base italic">Synchronizing_Registry...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <Search className="h-12 w-12 text-slate-700" />
                                            <span className="text-slate-500 font-black uppercase tracking-[0.5em] text-base italic">No nodes identified in current cluster</span>
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
                                        className="hover:bg-slate-50 transition-all group/row cursor-pointer"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-[22px] bg-emerald-50 flex items-center justify-center text-xl font-black text-emerald-600 border border-slate-100 group-hover/row:scale-110 group-hover/row:rotate-6 transition-all shadow-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-lg tracking-tighter group-hover/row:text-emerald-600 transition-colors uppercase italic">{student.name}</div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-slate-600 font-black uppercase tracking-[0.2em]">{student.usn}</span>
                                                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-slate-500 font-black text-sm uppercase tracking-wider">{student.branch}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                        <span className="text-base text-indigo-600 font-black italic tracking-widest">{student.cgpa || 0} GPA</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                {student.skills?.slice(0, 3).map((skill, si) => (
                                                    <span key={si} className="px-3 py-1.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 hover:bg-white transition-all">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={cn(
                                                "inline-flex items-center gap-3 px-5 py-2 rounded-[20px] border transition-all shadow-sm",
                                                student.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-rose-50 text-rose-600 border-rose-100/50"
                                            )}>
                                                <div className={cn("h-2 w-2 rounded-full", student.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                                                <span className="text-base font-black uppercase tracking-[0.3em] italic">
                                                    {student.isActive ? "NODE_ACTIVE" : "NODE_BLOCKED"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                                                <button 
                                                    onClick={() => navigate(`/students/${student._id}`)}
                                                    className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-100 transition-all" 
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    onClick={() => toggleStatus(student._id, student.isActive)}
                                                    className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all",
                                                        student.isActive ? "bg-rose-50 text-rose-400 hover:text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-400 hover:text-emerald-600 border-emerald-100"
                                                    )}
                                                >
                                                    {student.isActive ? <Ban className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 hover:text-rose-500 border border-rose-100 transition-all"
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 bg-white border border-slate-100 px-6 py-3 shadow-sm rounded-full w-max mx-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-xs font-black uppercase text-slate-500 disabled:opacity-40"
                    >
                        Prev
                    </button>
                    <span className="text-xs font-black text-slate-900 border-x px-4 border-slate-100">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-xs font-black uppercase text-slate-500 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative"
                        >
                            <button onClick={() => setShowAddModal(false)} className="absolute right-10 top-10 text-slate-400">
                                <X className="h-6 w-6" />
                            </button>
                            <h2 className="text-3xl font-black uppercase italic mb-8">Node Provisioning</h2>
                            <form onSubmit={handleAddStudent} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <input className="bg-slate-50 border p-4 rounded-2xl" placeholder="Full Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required />
                                    <input className="bg-slate-50 border p-4 rounded-2xl" placeholder="Email" type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} required />
                                    <input className="bg-slate-50 border p-4 rounded-2xl" placeholder="USN" value={newStudent.usn} onChange={e => setNewStudent({...newStudent, usn: e.target.value})} required />
                                    <select className="bg-slate-50 border p-4 rounded-2xl" value={newStudent.branch} onChange={e => setNewStudent({...newStudent, branch: e.target.value})}>
                                        <option>CSE</option><option>IT</option><option>ECE</option><option>MECH</option>
                                    </select>
                                    <input className="bg-slate-50 border p-4 rounded-2xl" placeholder="CGPA" type="number" step="0.01" value={newStudent.cgpa} onChange={e => setNewStudent({...newStudent, cgpa: Number(e.target.value)})} required />
                                    <input className="bg-slate-50 border p-4 rounded-2xl" placeholder="Initial Key" type="password" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} required />
                                </div>
                                <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase">
                                    {submitting ? <Activity className="animate-spin mx-auto" /> : "Deploy Node"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
                {showBulkModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative"
                        >
                            <button onClick={() => setShowBulkModal(false)} className="absolute right-10 top-10 text-slate-400">
                                <X className="h-6 w-6" />
                            </button>
                            <h2 className="text-3xl font-black uppercase italic mb-8">Bulk Ingestion</h2>
                            <textarea 
                                className="w-full h-64 bg-slate-50 border p-6 rounded-2xl font-mono text-xs" 
                                placeholder="[JSON Payload...]" 
                                value={bulkData}
                                onChange={e => setBulkData(e.target.value)}
                            />
                            <button onClick={handleBulkIngest} disabled={submitting} className="w-full mt-6 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase">
                                {submitting ? <Activity className="animate-spin mx-auto" /> : "Initiate Synchronization"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
