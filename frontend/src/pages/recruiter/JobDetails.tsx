import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Building2, MapPin, DollarSign, Calendar, Briefcase,
    ChevronLeft, Share2, Bookmark, CheckCircle, Info,
    Users, TrendingUp, ShieldCheck, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const stagger = {
    container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, damping: 25, stiffness: 200 }
        }
    }
};

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    requirements: string[];
    type: string;
    deadline?: string;
    active: boolean;
}

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await api.get<Job>(`/jobs/${id}`);
            setJob(data);

            const { data: appsData } = await api.get<{ applications: any[] }>("/applications/my");
            const applied = appsData.applications.some((app: any) => app.jobId._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error("Failed to fetch job", error);
            toast.error("Job details not found");
            navigate("/recruit/jobs"); // Changed to recruiter path
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await api.post("/applications", { jobId: id });
            toast.success("Applied successfully!");
            setHasApplied(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing Listing Intelligence...</p>
        </div>
    );

    if (!job) return null;

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10 pb-20 mt-4"
        >

            {/* Header / Navigation */}
            <motion.div variants={stagger.item} className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-apple-gray-400 hover:text-apple-blue transition-all font-black text-[10px] uppercase tracking-widest group"
                >
                    <div className="h-10 w-10 rounded-2xl bg-white border border-apple-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ChevronLeft className="h-4 w-4" />
                    </div>
                    Recruitment Intelligence
                </button>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-10 w-10 bg-white border border-apple-gray-100 rounded-xl hover:bg-apple-gray-50 text-apple-gray-400 hover:text-apple-blue transition-all shadow-sm flex items-center justify-center"
                    >
                        <Share2 className="h-4 w-4" />
                    </motion.button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Job Info (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Hero Listing Card */}
                    <motion.div variants={stagger.item} className="apple-card bg-white overflow-hidden border border-apple-gray-50 relative p-1 shadow-sm group">
                        <div className="h-48 md:h-60 bg-apple-gray-50 rounded-[36px] relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/10 via-purple-500/10 to-transparent" />
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <Building2 className="h-24 w-24 text-apple-blue/20" />
                            </motion.div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-apple-blue/5 text-apple-blue rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-apple-blue/10">
                                        <ShieldCheck className="h-3 w-3" /> Verified Protocol
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-apple-gray-900 tracking-tight leading-none">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-y-4 gap-x-10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-apple-gray-50 flex items-center justify-center text-apple-blue shadow-inner">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-apple-gray-400 leading-none mb-1">Company</p>
                                                <p className="text-[15px] font-black text-apple-gray-900 tracking-tight">{job.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-apple-gray-50 flex items-center justify-center text-apple-gray-400 shadow-inner">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-apple-gray-400 leading-none mb-1">Origin</p>
                                                <p className="text-[15px] font-black text-apple-gray-900 tracking-tight">{job.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-apple-gray-50 flex items-center justify-center text-apple-gray-400 shadow-inner">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-apple-gray-400 leading-none mb-1">Mission</p>
                                                <p className="text-[15px] font-black text-apple-gray-900 tracking-tight">{job.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-4 shrink-0 bg-apple-gray-50/50 p-6 rounded-[28px] border border-apple-gray-100">
                                    <div className="px-5 py-2.5 bg-apple-gray-900 text-white rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-xl">
                                        {job.salary}
                                    </div>
                                    <span className="text-[9px] font-black text-apple-gray-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                                        <Calendar className="h-3.5 w-3.5" /> Deployment: 48h Ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Job Intelligence */}
                    <motion.div variants={stagger.item} className="apple-card p-12 bg-white border border-apple-gray-50 shadow-sm">
                        <h2 className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                            <Info className="h-4 w-4" /> Operational Briefing
                        </h2>
                        <div className="text-apple-gray-700 font-bold leading-relaxed text-[16px] space-y-8 prose prose-apple max-w-none">
                            {job.description || "Analytical parameters pending deployment."}
                        </div>
                    </motion.div>

                    {/* Tactical Requirements */}
                    <motion.div variants={stagger.item} className="apple-card p-12 bg-white border border-apple-gray-50 shadow-sm">
                        <h2 className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                            <CheckCircle className="h-4 w-4" /> Core Prerequisites
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {job?.requirements?.length ? (
                                job.requirements.map((req, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,113,227,0.02)' }}
                                        className="flex gap-5 bg-apple-gray-50/30 p-6 rounded-2xl border border-apple-gray-100 hover:border-apple-blue/30 transition-all group"
                                    >
                                        <div className="h-7 w-7 rounded-xl bg-white flex items-center justify-center text-apple-blue shadow-sm border border-apple-gray-100 group-hover:bg-apple-blue group-hover:text-white transition-all shrink-0">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <span className="text-[14px] text-apple-gray-800 font-bold leading-tight">{req}</span>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-apple-gray-300 text-[11px] font-black uppercase tracking-widest col-span-full italic">Parameters not specified.</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info & Apply (Right 1 Column) */}
                <div className="space-y-8">

                    {/* Apply Card - THE ACTION HUB */}
                    <motion.div variants={stagger.item} className="apple-card p-10 bg-apple-gray-900 border border-black shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-apple-blue to-transparent opacity-50" />
                        <div className="relative z-10 space-y-8 w-full">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-4 uppercase">Intake Terminal</h3>
                                <p className="text-apple-gray-400 text-[13px] font-bold leading-relaxed">
                                    Finalizing selection for {job.company}. Intel window closes <span className="text-white font-black">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "TBD"}</span>.
                                </p>
                            </div>

                            {hasApplied ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full bg-apple-blue/20 text-apple-blue py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-apple-blue/30 flex items-center justify-center gap-3"
                                >
                                    <CheckCircle className="h-5 w-5" /> Dossier Finalized
                                </motion.div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full bg-apple-blue hover:bg-white hover:text-apple-gray-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-apple-hover transition-all flex items-center justify-center gap-3 group"
                                >
                                    {applying ? "Synchronizing..." : "Initialize Profile"}
                                    {!applying && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                                </motion.button>
                            )}

                            <div className="pt-8 border-t border-white/10 flex flex-col items-center">
                                <span className="text-[9px] font-black text-apple-gray-500 uppercase tracking-[0.4em] mb-4">Neural Match Signal</span>
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '92%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-apple-blue rounded-full shadow-[0_0_15px_rgba(0,113,227,0.8)]"
                                        />
                                    </div>
                                    <span className="text-[12px] font-black text-apple-blue">92%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Company Metrics */}
                    <motion.div variants={stagger.item} className="apple-card p-10 bg-white border border-apple-gray-50 shadow-sm">
                        <h3 className="text-[11px] font-black text-apple-gray-900 tracking-[0.3em] uppercase mb-10">Neural Activity</h3>
                        <div className="space-y-10">
                            {[
                                { icon: Users, label: 'Applicants', value: '142', color: 'text-apple-blue', bg: 'bg-apple-blue/5' },
                                { icon: TrendingUp, label: 'CTC Target', value: '12 - 18L', color: 'text-purple-500', bg: 'bg-purple-100/50' },
                                { icon: ShieldCheck, label: 'Confidence', value: 'High', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-apple-gray-50", stat.bg, stat.color)}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[11px] font-black text-apple-gray-400 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <span className="font-black text-apple-gray-900 tracking-tighter text-[16px]">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Link */}
                    <motion.div variants={stagger.item}>
                        <Link to="/recruit/jobs" className="flex items-center justify-between p-8 bg-apple-gray-50 rounded-[32px] border border-apple-gray-100 group transition-all hover:bg-white hover:shadow-apple-hover">
                            <div>
                                <p className="text-[9px] font-black text-apple-gray-400 uppercase tracking-[0.2em] mb-1">Global Command</p>
                                <p className="text-[14px] font-black text-apple-gray-900 uppercase">Universal Access</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white border border-apple-gray-100 flex items-center justify-center text-apple-gray-300 group-hover:text-apple-blue group-hover:scale-110 transition-all">
                                <ChevronLeft className="h-5 w-5 rotate-180" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}
