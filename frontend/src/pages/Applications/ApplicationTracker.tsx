import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Briefcase, Building2, MapPin, Calendar,
    ArrowRight, MoreVertical, CheckCircle2, Clock, XCircle,
    AlertCircle, TrendingUp, LayoutGrid, List, KanbanSquare,
    Zap, Rocket, Activity, Target, ChevronDown,
    ShieldCheck, Signal, Layers, Cpu, ArrowUpRight,
    ChevronRight, Check, Trash2, Globe, Box
} from "lucide-react";
import { cn } from "../../utils/cn";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Application {
    _id: string;
    jobId: {
        _id: string;
        title: string;
        company: string;
        location: string;
        type: string;
        salary: string;
    };
    status: string;
    createdAt: string;
    matchScore?: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<any>; description: string }> = {
    Applied: { label: "Applied", color: "text-blue-600", bgColor: "bg-blue-50", icon: Signal, description: "Your application has been successfully submitted." },
    Shortlisted: { label: "Shortlisted", color: "text-indigo-600", bgColor: "bg-indigo-50", icon: Target, description: "You've been moved to the priority candidate list." },
    Assessment: { label: "Assessment", color: "text-amber-600", bgColor: "bg-amber-50", icon: Cpu, description: "Action required: Complete the technical assessment." },
    Interview: { label: "Interview", color: "text-apple-blue", bgColor: "bg-apple-blue/5", icon: Globe, description: "Direct synchronization scheduled with the team." },
    Offered: { label: "Offered", color: "text-emerald-600", bgColor: "bg-emerald-50", icon: ShieldCheck, description: "Congratulations! An offer has been extended." },
    Rejected: { label: "Rejected", color: "text-rose-600", bgColor: "bg-rose-50", icon: XCircle, description: "Thank you for your interest. We've decided to move with others." },
    Withdrawn: { label: "Withdrawn", color: "text-apple-gray-500", bgColor: "bg-apple-gray-50", icon: AlertCircle, description: "You have manually withdrawn this application." },
};

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function ApplicationTracker() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await api.get("/applications/my");
            const data = response.data as any;
            setApplications(data.applications || []);
        } catch (err) {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId: string) => {
        setWithdrawingId(applicationId);
        setOpenMenuId(null);
        try {
            await api.patch(`/applications/${applicationId}/withdraw`);
            toast.success("Application Withdrawn");
            fetchApplications();
        } catch {
            toast.error("Withdrawal Failed");
        } finally {
            setWithdrawingId(null);
        }
    };

    const filtered = applications
        .filter(a => filterStatus === "All" || a.status === filterStatus)
        .filter(a =>
            !search ||
            a.jobId.title.toLowerCase().includes(search.toLowerCase()) ||
            a.jobId.company.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const metrics = [
        { label: "Active", value: applications.length, icon: Signal, color: "text-apple-blue", bgColor: "bg-apple-blue/10" },
        { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: Globe, color: "text-indigo-600", bgColor: "bg-indigo-50" },
        { label: "Offers", value: applications.filter(a => a.status === "Offered").length, icon: ShieldCheck, color: "text-emerald-600", bgColor: "bg-emerald-50" },
        { label: "Readiness", value: "92%", icon: Target, color: "text-amber-600", bgColor: "bg-amber-50" },
    ];

    const FILTER_TABS = ["All", "Applied", "Shortlisted", "Assessment", "Interview", "Offered", "Rejected"];

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-sm font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Track</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Applications</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Monitor your recruitment progress in real-time.</p>
                </div>
                <button
                    onClick={() => navigate("/job-recommendations")}
                    className="apple-btn-primary px-6 py-2.5 flex items-center gap-2 w-fit"
                >
                    <Rocket className="h-4 w-4" />
                    <span>Explore Jobs</span>
                </button>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {metrics.map((m, i) => (
                    <motion.div key={i} variants={stagger.item} className="apple-card p-4 sm:p-6 flex flex-col justify-between hover:shadow-apple-hover transition-all duration-500">
                        <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4", m.bgColor)}>
                            <m.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", m.color)} />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-apple-gray-900 tracking-tight">{m.value}</h3>
                            <p className="text-[10px] sm:text-sm font-bold text-apple-gray-400 uppercase tracking-widest mt-1">{m.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <motion.div variants={stagger.item} className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative w-full lg:w-[350px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-300" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full pl-11 pr-5 py-3 bg-white border border-apple-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue/50 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
                    {FILTER_TABS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                filterStatus === f
                                    ? "bg-white text-slate-900 shadow-lg"
                                    : "bg-white text-apple-gray-400 border border-apple-gray-100 hover:border-apple-blue/30 hover:text-apple-blue"
                            )}
                        >
                            {f}
                            {f !== "All" && (
                                <span className="ml-2 opacity-50 text-base">
                                    {applications.filter(a => a.status === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="hidden lg:flex ml-auto bg-apple-gray-50 p-1.5 rounded-xl border border-apple-gray-100">
                    <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-apple-blue shadow-sm" : "text-apple-gray-400 hover:text-apple-gray-600")}>
                        <List className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-apple-blue shadow-sm" : "text-apple-gray-400 hover:text-apple-gray-600")}>
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>

            {/* List / Grid Content */}
            <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-apple-gray-50 shadow-sm animate-pulse">
                            <div className="h-10 w-10 border-4 border-apple-blue/10 border-t-apple-blue rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-lg font-bold text-apple-gray-400 uppercase tracking-widest">Loading Telemetry...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 text-center bg-white rounded-[40px] border border-apple-gray-50 shadow-sm"
                        >
                            <Box className="h-12 w-12 text-apple-gray-100 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight">No Applications Found</h3>
                            <p className="text-apple-gray-400 mt-2 font-medium">You haven't applied to any roles matching these filters yet.</p>
                        </motion.div>
                    ) : (
                        filtered.map((app, i) => {
                            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
                            const Icon = cfg.icon;
                            const matchPct = app.matchScore || 85;

                            return (
                                <motion.div
                                    key={app._id}
                                    layout
                                    variants={stagger.item}
                                    className="apple-card p-10 group hover:shadow-apple-hover transition-all duration-500 overflow-hidden relative"
                                >
                                    <div className="flex flex-col gap-8">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex items-start gap-6">
                                                <div className="h-16 w-16 rounded-[22px] bg-white flex items-center justify-center text-slate-900 font-bold text-2xl shadow-xl group-hover:bg-apple-blue transition-all duration-700">
                                                    {app.jobId.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight group-hover:text-apple-blue transition-colors">
                                                        {app.jobId.title}
                                                    </h3>
                                                    <p className="text-base font-bold text-apple-gray-400 uppercase tracking-wider mt-1.5 flex items-center gap-2">
                                                        <Building2 className="h-3.5 w-3.5" /> {app.jobId.company}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <div className={cn("flex items-center gap-2 text-base font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border", cfg.color, cfg.bgColor, "border-transparent")}>
                                                            <Icon className="h-3.5 w-3.5" /> {cfg.label}
                                                        </div>
                                                        <div className="text-sm font-semibold text-apple-gray-400 flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" /> {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === app._id ? null : app._id); }}
                                                    className="h-10 w-10 rounded-xl bg-apple-gray-50 text-apple-gray-400 hover:text-apple-gray-900 flex items-center justify-center border border-apple-gray-100 transition-all"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                                <AnimatePresence>
                                                    {openMenuId === app._id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute right-0 top-full mt-3 z-20 w-56 bg-white rounded-3xl border border-apple-gray-100 shadow-2xl overflow-hidden p-2"
                                                            >
                                                                <button
                                                                    onClick={() => { navigate(`/jobs/${app.jobId._id}`); setOpenMenuId(null); }}
                                                                    className="w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-wider text-apple-gray-600 hover:text-apple-blue hover:bg-apple-blue/5 rounded-2xl flex items-center gap-3 transition-all"
                                                                >
                                                                    <ArrowUpRight className="h-4 w-4" />
                                                                    View Details
                                                                </button>
                                                                <div className="h-px bg-apple-gray-50 my-1.5" />
                                                                <button
                                                                    onClick={() => handleWithdraw(app._id)}
                                                                    disabled={withdrawingId === app._id}
                                                                    className="w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center gap-3 transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    {withdrawingId === app._id ? "Processing..." : "Withdraw"}
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm font-bold text-apple-gray-400 uppercase tracking-widest">
                                                    <span>Profile Match</span>
                                                    <span className="text-apple-blue">{matchPct}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-apple-gray-50 rounded-full overflow-hidden border border-apple-gray-100">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${matchPct}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-apple-blue rounded-full shadow-lg shadow-apple-blue/20"
                                                    />
                                                </div>
                                                <p className="text-lg text-apple-gray-400 font-medium leading-relaxed italic">
                                                    Status: {cfg.description}
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                                                    className="apple-btn-primary px-8 py-3.5 text-sm flex items-center gap-3 transition-all"
                                                >
                                                    View Role
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
