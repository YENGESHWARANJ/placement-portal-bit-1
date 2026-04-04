import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Briefcase, Calendar, MapPin, DollarSign, 
    ArrowUpRight, CheckCircle2, Loader2, Sparkles,
    Zap, Target, GraduationCap, AlertCircle, Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { cn } from "../../utils/cn";
import PlacedShowcase from "../../components/common/PlacedShowcase";

interface Drive {
    _id: string;
    company: string;
    jobRole: string;
    packageName: string;
    date: string;
    venue: string;
    deadline: string;
    status: string;
    criterias: {
        cgpa: number;
        branches: string[];
    };
    salary?: string;
    applied?: boolean;
}

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function PlacementDrives() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const [drivesRes, appsRes] = await Promise.all([
                api.get<{ drives: any[] }>('/placement-drives'),
                api.get<{ applications: any[] }>('/applications/my')
            ]);
            
            const myApps = appsRes.data.applications || [];
            const drivesWithStatus = drivesRes.data.drives.map((d: any) => ({
                ...d,
                applied: myApps.some((a: any) => a.driveId === d._id)
            }));
            
            setDrives(drivesWithStatus);
        } catch (error) {
            toast.error("Failed to load placement drives");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (driveId: string) => {
        try {
            setApplying(driveId);
            await api.post('/applications/drive', { driveId });
            toast.success("Application submitted successfully!");
            fetchDrives();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Eligibility check failed");
        } finally {
            setApplying(null);
        }
    };

    return (
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-10 pb-20">
            {/* Header */}
            <motion.div variants={stagger.item} className="bg-white p-10 rounded-[45px] shadow-apple-soft border border-apple-gray-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <div className="relative z-10">
                    <span className="text-sm font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Recruitment Intelligence</span>
                    <h1 className="text-5xl font-black text-apple-gray-900 tracking-[-0.05em] uppercase italic">Placement Drives</h1>
                    <p className="text-apple-gray-400 mt-4 font-bold uppercase tracking-widest text-base leading-relaxed max-w-2xl">
                        Proprietary synchronization of campus recruitment nodes filtered by your academic profile.
                    </p>
                </div>
            </motion.div>

            {/* Placed Showcase */}
            <motion.div variants={stagger.item}>
                <PlacedShowcase />
            </motion.div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[45px] border border-apple-gray-50 shadow-apple-soft">
                        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-6" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs italic">Compiling Opportunity Matrix...</p>
                    </div>
                ) : drives.length === 0 ? (
                    <div className="bg-white py-32 rounded-[45px] border border-apple-gray-50 text-center shadow-apple-soft">
                        <div className="h-20 w-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                            <Clock className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">No Eligible Drives Detected</h3>
                        <p className="text-slate-400 mt-3 font-bold uppercase tracking-[0.2em] text-sm">Synchronize with TPO for latest academic updates</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {drives.map((drive) => (
                            <motion.div
                                key={drive._id}
                                variants={stagger.item}
                                className="bg-white p-10 rounded-[45px] shadow-apple-soft hover:shadow-apple-hover border border-apple-gray-50 transition-all duration-500 flex flex-col group relative overflow-hidden"
                            >
                                {/* Category Badge */}
                                <div className="absolute top-8 right-8">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50 shadow-sm">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Premium Drive</span>
                                    </div>
                                </div>

                                {/* Company & Role */}
                                <div className="mb-10 pt-4">
                                    <div className="h-16 w-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-3xl font-black mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700 italic">
                                        {drive.company.charAt(0)}
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-[-0.02em] leading-none mb-3 italic uppercase group-hover:text-emerald-600 transition-colors">
                                        {drive.company}
                                    </h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm italic">
                                        {drive.jobRole}
                                    </p>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3 mb-1 text-slate-400">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Package Index</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight italic">{drive.packageName || drive.salary || "N/A"}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3 mb-1 text-slate-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Drive Protocol</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight italic">{new Date(drive.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3 mb-1 text-slate-400">
                                            <Target className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">CGPA Cutoff</span>
                                        </div>
                                        <p className="text-lg font-black text-emerald-600 tracking-tight italic">{drive.criterias.cgpa} Index</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3 mb-1 text-slate-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Final Deadline</span>
                                        </div>
                                        <p className="text-lg font-black text-rose-500 tracking-tight italic">{new Date(drive.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Call to Action */}
                                <div className="mt-auto pt-6">
                                    {!drive.applied ? (
                                        <button
                                            onClick={() => handleApply(drive._id)}
                                            disabled={applying === drive._id}
                                            className="w-full bg-slate-900 text-white hover:bg-emerald-600 py-6 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                                        >
                                            {applying === drive._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>Apply Dossier <ArrowUpRight className="h-4 w-4" /></>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="w-full bg-emerald-50 text-emerald-600 py-6 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 border border-emerald-100">
                                            <CheckCircle2 className="h-4 w-4" /> Application Logged
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
