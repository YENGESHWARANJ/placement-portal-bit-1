import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ChevronLeft, Search, Filter, Download, User, Mail, 
    MoreHorizontal, CheckCircle2, XCircle, Clock, Timer,
    ArrowUpRight, FileText, CheckCircle, Ban
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface Applicant {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
        usn: string;
        branch: string;
        cgpa: number;
    };
    status: string;
    appliedAt: string;
}

export default function DriveApplications() {
    const { driveId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchApplicants();
    }, [driveId]);

    const fetchApplicants = async () => {
        try {
            const { data } = await api.get<{ applications: Applicant[] }>(`/applications/drive/${driveId}`);
            setApplicants(data.applications || []);
        } catch (error) {
            toast.error("Failed to fetch applicants");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkStatusUpdate = async (newStatus: string) => {
        if (selectedIds.length === 0) {
            toast.error("Select applicants first");
            return;
        }
        try {
            await api.put('/applications/bulk-status', { 
                applicationIds: selectedIds, 
                status: newStatus 
            });
            toast.success(`Updated ${selectedIds.length} applicants to ${newStatus}`);
            setSelectedIds([]);
            fetchApplicants();
        } catch (error) {
            toast.error("Bulk update failed");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredApplicants = applicants.filter(a => {
        const matchesSearch = a.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             a.student.usn.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white p-8 rounded-[40px] shadow-apple-soft border border-apple-gray-50">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100"
                    >
                        <ChevronLeft className="h-6 w-6 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-apple-gray-900 tracking-[-0.05em] uppercase italic">Drive Applications</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs mt-1">
                            Operational Command // Applicant Orchestration
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or USN..."
                        className="w-full bg-white border border-slate-100 rounded-[25px] pl-14 pr-6 py-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-100 rounded-[20px] px-6 py-4 text-xs font-black uppercase tracking-widest outline-none shadow-sm"
                    >
                        <option value="All">All statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-[30px] shadow-2xl"
                    >
                        <div className="flex items-center gap-4 ml-4">
                            <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-black">
                                {selectedIds.length}
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest">Candidates Selected</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleBulkStatusUpdate("Shortlisted")}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Shortlist
                            </button>
                            <button 
                                onClick={() => handleBulkStatusUpdate("Selected")}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Mark Selected
                            </button>
                            <button 
                                onClick={() => handleBulkStatusUpdate("Rejected")}
                                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => setSelectedIds([])}
                                className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Applicants List */}
            <div className="bg-white rounded-[45px] shadow-apple-soft border border-apple-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6">
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 rounded border-slate-300"
                                        checked={selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0}
                                        onChange={() => {
                                            if (selectedIds.length === filteredApplicants.length) setSelectedIds([]);
                                            else setSelectedIds(filteredApplicants.map(a => a._id));
                                        }}
                                    />
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Index</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Applied Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compiling Applicant Matrix...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApplicants.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No candidates found in cluster
                                    </td>
                                </tr>
                            ) : (
                                filteredApplicants.map(applicant => (
                                    <tr key={applicant._id} className="hover:bg-slate-50/50 transition-all select-none group">
                                        <td className="px-8 py-6">
                                            <input 
                                                type="checkbox" 
                                                className="h-5 w-5 rounded border-slate-300"
                                                checked={selectedIds.includes(applicant._id)}
                                                onChange={() => toggleSelect(applicant._id)}
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-apple-gray-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg border border-slate-100">
                                                    {applicant.student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-apple-gray-900 italic">{applicant.student.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{applicant.student.usn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-slate-600">{applicant.student.branch}</p>
                                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{applicant.student.cgpa} CGPA</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                                                applicant.status === 'Applied' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                applicant.status === 'Shortlisted' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                applicant.status === 'Selected' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                "bg-rose-50 text-rose-600 border-rose-100"
                                            )}>
                                                {applicant.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-500">{new Date(applicant.appliedAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => navigate(`/students/${applicant.student._id}`)}
                                                className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                            >
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
