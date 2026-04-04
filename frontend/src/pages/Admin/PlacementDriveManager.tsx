import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar, MapPin, Users, Plus, Edit, Trash2, CheckCircle, X,
    Loader2, ClipboardList, TrendingUp, Clock, Briefcase, Zap
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface Drive {
    _id: string;
    company: string;
    jobRole: string;
    packageName: string;
    date: string;
    deadline: string;
    venue: string;
    criterias: { 
        cgpa: number; 
        branches: string[];
        arrearsAllowed: boolean;
    };
    status: 'Open' | 'Closed' | 'Completed' | 'Cancelled';
}

export default function PlacementDriveManager() {
    const navigate = useNavigate();
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        company: "",
        jobRole: "",
        packageName: "",
        date: "",
        deadline: "",
        venue: "",
        cgpa: 7.0,
        branches: "CSE, IT, MECH, ECE",
        arrearsAllowed: false
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const { data } = await api.get<{ drives: Drive[] }>('/placement-drives');
            setDrives(data.drives || []);
        } catch (error) {
            toast.error("Failed to fetch placement drives");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                company: form.company,
                jobRole: form.jobRole,
                packageName: form.packageName,
                date: form.date,
                deadline: form.deadline,
                venue: form.venue,
                criterias: {
                    cgpa: Number(form.cgpa),
                    branches: form.branches.split(',').map(b => b.trim()),
                    arrearsAllowed: form.arrearsAllowed
                },
                status: 'Open'
            };
            const { data } = await api.post<{ drive: Drive }>('/placement-drives', payload);
            setDrives(prev => [data.drive, ...prev]);
            toast.success("Intelligence Drive Broadcasted!");
            setIsAdding(false);
            setForm({ 
                company: "", jobRole: "", packageName: "", date: "", deadline: "", 
                venue: "", cgpa: 7.0, branches: "CSE, IT, MECH, ECE", arrearsAllowed: false 
            });
        } catch (error) {
            toast.error("Command Failed: Drive not initialized");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this drive?")) return;
        try {
            await api.delete(`/placement-drives/${id}`);
            setDrives(prev => prev.filter(d => d._id !== id));
            toast.success("Drive deleted");
        } catch (error) {
            toast.error("Failed to delete drive");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-apple-soft border border-apple-gray-50">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-emerald-50 rounded-[30px] flex items-center justify-center border border-emerald-100/50 shadow-inner">
                        <Calendar className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-apple-gray-900 tracking-[-0.05em] uppercase italic">Placement Drives</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm mt-1 flex items-center gap-2">
                             Nexus // Schedule • Manage • Execute
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[25px] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 border border-slate-800"
                >
                    <Plus className="h-5 w-5" /> Schedule Drive
                </motion.button>
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Drive Registry...</p>
                </div>
            ) : drives.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[50px]">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-apple-soft border border-slate-100">
                        <ClipboardList className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-apple-gray-900 uppercase italic">No Active Drives</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Begin by scheduling your first recruitment broadcast</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mt-4 text-emerald-600 font-black uppercase text-xs tracking-widest hover:text-emerald-700 transition-colors"
                    >
                        + Initialize First Node
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {drives.map(drive => (
                        <motion.div
                            layout
                            key={drive._id}
                            className="bg-white p-8 rounded-[45px] shadow-apple-soft border border-apple-gray-50 relative group hover:border-emerald-500/30 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/30 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/5 transition-colors" />

                            <div className="flex justify-between items-start mb-6 relative">
                                <div>
                                    <h3 className="text-2xl font-black text-apple-gray-900 italic tracking-tight">{drive.company}</h3>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">{drive.jobRole}</p>
                                </div>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                    drive.status === 'Open' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
                                        drive.status === 'Closed' ? "bg-rose-50 text-rose-600 border-emerald-100/50" :
                                        drive.status === 'Completed' ? "bg-amber-50 text-amber-600 border-amber-100/50" :
                                            "bg-slate-50 text-slate-600 border-slate-100/50"
                                )}>
                                    {drive.status}
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Package Index</p>
                                        <p className="text-sm font-bold text-apple-gray-900">{drive.packageName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Drive Date</p>
                                        <p className="text-sm font-bold text-apple-gray-900">{new Date(drive.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Clock className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Application Deadline</p>
                                        <p className="text-sm font-bold text-apple-gray-900">{new Date(drive.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <MapPin className="h-4 w-4 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Physical Node</p>
                                        <p className="text-sm font-bold text-apple-gray-900">{drive.venue}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Users className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Eligibility Protocol</p>
                                        <p className="text-sm font-bold text-apple-gray-900 line-clamp-1">{drive.criterias.branches.join(', ')} ({drive.criterias.cgpa}+)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 relative mt-6">
                                <button 
                                    onClick={() => navigate(`/admin/drives/${drive._id}/applications`)}
                                    className="flex-1 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-emerald-100/50"
                                >
                                    <Users className="h-3.5 w-3.5" /> Manage Applicants
                                </button>
                                <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(drive._id)} className="p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl text-rose-500 transition-all border border-rose-100 shadow-sm"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-xl bg-white rounded-[50px] shadow-2xl p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                            <button
                                onClick={() => setIsAdding(false)}
                                className="absolute right-8 top-8 text-slate-400 hover:text-slate-900 transition-all h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-apple-gray-900 uppercase italic tracking-tighter">Schedule Intelligence</h2>
                                <p className="text-emerald-600 font-black uppercase text-xs tracking-[0.3em] mt-1">Broadcast recruitment node to network</p>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
                                        <input
                                            required
                                            value={form.company}
                                            onChange={e => setForm({ ...form, company: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                            placeholder="e.g. Google"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Role</label>
                                        <input
                                            required
                                            value={form.jobRole}
                                            onChange={e => setForm({ ...form, jobRole: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                            placeholder="e.g. SDE-1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Package (LPA)</label>
                                        <input
                                            required
                                            value={form.packageName}
                                            onChange={e => setForm({ ...form, packageName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                            placeholder="e.g. 12.5 LPA"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Drive Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={form.date}
                                            onChange={e => setForm({ ...form, date: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Application Deadline</label>
                                        <input
                                            required
                                            type="date"
                                            value={form.deadline}
                                            onChange={e => setForm({ ...form, deadline: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deployment Venue</label>
                                        <input
                                            required
                                            value={form.venue}
                                            onChange={e => setForm({ ...form, venue: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                            placeholder="Convention Center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CGPA Cutoff</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.1"
                                            value={form.cgpa}
                                            onChange={e => setForm({ ...form, cgpa: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="arrearsAllowed"
                                            checked={form.arrearsAllowed}
                                            onChange={e => setForm({ ...form, arrearsAllowed: e.target.checked })}
                                            className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <label htmlFor="arrearsAllowed" className="text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer">Arrears Allowed</label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Authorized Branches</label>
                                    <textarea
                                        required
                                        value={form.branches}
                                        onChange={e => setForm({ ...form, branches: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none h-24"
                                        placeholder="Comma separated: CSE, IT, MECH..."
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full bg-slate-900 text-white py-5 rounded-[25px] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            Initialize Drive Node
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

