import React, { useState, useEffect } from "react";
import {
    Search, Filter, Briefcase, Building2, MapPin,
    Calendar, ArrowRight, MoreVertical, CheckCircle2,
    Clock, XCircle, AlertCircle, TrendingUp, LayoutGrid, List
} from "lucide-react";
import { cn } from "../../utils/cn";
import api from "../../services/api";

interface Application {
    _id: string;
    jobId: {
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

export default function StudentApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications/my");
                setApplications(response.data.applications || []);
            } catch (err) {
                console.error("Failed to fetch applications", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const statusColors: any = {
        "Applied": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Shortlisted": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
        "Assessment": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        "Interview": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        "Offered": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case "Offered": return <CheckCircle2 className="h-4 w-4" />;
            case "Applied": return <Clock className="h-4 w-4" />;
            case "Rejected": return <XCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    const filteredApplications = applications.filter(app =>
        filterStatus === "All" ? true : app.status === filterStatus
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic">My Journey</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600" /> Tracking {applications.length} Active Applications
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn("p-3 rounded-xl transition-all", viewMode === "list" ? "bg-slate-100 dark:bg-slate-800 text-blue-600 shadow-inner" : "text-slate-400")}
                    >
                        <List className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn("p-3 rounded-xl transition-all", viewMode === "grid" ? "bg-slate-100 dark:bg-slate-800 text-blue-600 shadow-inner" : "text-slate-400")}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats Toolbar */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {["All", "Applied", "Shortlisted", "Assessment", "Interview", "Offered"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                            "px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all border",
                            filterStatus === status
                                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none"
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-blue-200"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-white dark:bg-slate-900 rounded-[40px] animate-pulse border border-slate-100 dark:border-slate-800" />
                    ))}
                </div>
            ) : filteredApplications.length > 0 ? (
                <div className={cn(
                    "grid gap-8",
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {filteredApplications.map((app) => (
                        <div
                            key={app._id}
                            className={cn(
                                "group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all active:scale-[0.98] relative overflow-hidden",
                                viewMode === "list" ? "p-8 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-8" : "p-10 rounded-[50px] flex flex-col"
                            )}
                        >
                            {/* Accent Bar */}
                            <div className={cn("absolute top-0 left-0 bottom-0 w-1.5 opacity-40",
                                app.status === "Offered" ? "bg-emerald-500" :
                                    app.status === "Rejected" ? "bg-red-500" : "bg-blue-500"
                            )}></div>

                            <div className="flex items-center gap-8">
                                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[30px] flex items-center justify-center text-3xl font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    {app.jobId.company.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-all">{app.jobId.title}</h3>
                                        <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2", statusColors[app.status] || statusColors["Applied"])}>
                                            <StatusIcon status={app.status} />
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                            <Building2 className="h-4 w-4" /> {app.jobId.company}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                            <MapPin className="h-4 w-4" /> {app.jobId.location}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                            <Calendar className="h-4 w-4" /> {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={cn(
                                "flex items-center gap-8",
                                viewMode === "grid" ? "mt-10 pt-10 border-t border-slate-50 dark:border-slate-800 justify-between" : "ml-auto"
                            )}>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Match Index</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white italic">{app.matchScore || "88"}%</p>
                                </div>
                                <div className="h-12 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
                                <div className="flex items-center gap-4">
                                    <button className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-all border border-slate-100 dark:border-slate-800">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                    <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:translate-y-[-2px] transition-all flex items-center gap-3 group/btn">
                                        Full Details <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[50px] p-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                        <Briefcase className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No Active Records</h3>
                    <p className="text-slate-400 font-bold max-w-md mx-auto mb-10 leading-relaxed">It looks like you haven't applied for any positions yet. Start your journey by exploring available roles.</p>
                    <button className="px-10 py-5 bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Discover Opportunities</button>
                </div>
            )}
        </div>
    );
}
