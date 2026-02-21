import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Filter, Briefcase, Building2, MapPin,
    Calendar, ArrowRight, MoreVertical, CheckCircle2,
    Clock, XCircle, AlertCircle, TrendingUp, LayoutGrid, List, KanbanSquare,
    Zap, Rocket, Activity, Target
} from "lucide-react";
import { cn } from "../../utils/cn";
import api from "../../services/api";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';

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

const columnDefs = {
    Applied: { id: 'Applied', title: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
    Shortlisted: { id: 'Shortlisted', title: 'Shortlisted', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Briefcase },
    Assessment: { id: 'Assessment', title: 'Assessment', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
    Interview: { id: 'Interview', title: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Calendar },
    Offered: { id: 'Offered', title: 'Offered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    Rejected: { id: 'Rejected', title: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export default function ApplicationTracker() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("list");
    const [filterStatus, setFilterStatus] = useState("All");
    const [boardData, setBoardData] = useState<any>({});
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

    const handleWithdraw = async (applicationId: string) => {
        setWithdrawingId(applicationId);
        setOpenMenuId(null);
        try {
            await api.patch(`/applications/${applicationId}/withdraw`);
            toast.success('Application withdrawn');
            fetchApplications();
        } catch {
            toast.error('Failed to withdraw');
        } finally {
            setWithdrawingId(null);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await api.get("/applications/my");
            const data = response.data as any;
            const apps = data.applications || [];
            setApplications(apps);
            organizeBoard(apps);
        } catch (err) {
            console.error("Failed to fetch applications", err);
            toast.error("Network error fetching applications");
        } finally {
            setLoading(false);
        }
    };

    const organizeBoard = (apps: Application[]) => {
        const newBoard: any = {};
        Object.keys(columnDefs).forEach(key => {
            newBoard[key] = {
                ...columnDefs[key as keyof typeof columnDefs],
                items: apps.filter(app => app.status === key)
            };
        });
        setBoardData(newBoard);
    };

    const statusColors: any = {
        "Applied": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Shortlisted": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
        "Assessment": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        "Interview": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        "Offered": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        "Withdrawn": "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400",
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case "Offered": return <CheckCircle2 className="h-4 w-4" />;
            case "Applied": return <Clock className="h-4 w-4" />;
            case "Rejected": return <XCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    const filteredApplications = applications
        .filter(app => filterStatus === "All" ? true : app.status === filterStatus)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Activity className="h-5 w-5" />
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">Experience Pipeline</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Operative Monitoring Protocol: {applications.length} Active Candidates
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-2xl">
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn("px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === "list" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600")}
                    >
                        <List className="h-4 w-4" /> List
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn("px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === "grid" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600")}
                    >
                        <LayoutGrid className="h-4 w-4" /> Grid
                    </button>
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={cn("px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === "kanban" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600")}
                    >
                        <KanbanSquare className="h-4 w-4" /> Kanban
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatNode label="Pulse Rate" value="98%" detail="Active Sync" icon={Activity} color="text-indigo-600 bg-indigo-50" />
                <StatNode label="Avg Resonance" value="84%" detail="Match Index" icon={Target} color="text-emerald-600 bg-emerald-50" />
                <StatNode label="Pending Nodes" value={applications.filter(a => a.status === 'Applied').length} detail="Initial Phase" icon={Clock} color="text-blue-600 bg-blue-50" />
                <StatNode label="Conversion" value="12%" detail="Offer Ratio" icon={Zap} color="text-amber-600 bg-amber-50" />
            </div>

            {/* View Switcher Logic */}
            {viewMode === "kanban" ? (
                <div className="flex gap-6 h-[calc(100vh-400px)] overflow-x-auto pb-6 items-start px-2 custom-scrollbar">
                    <DragDropContext onDragEnd={() => { }}>
                        {Object.entries(boardData).map(([columnId, column]: [string, any]) => (
                            <div key={columnId} className="flex flex-col w-[350px] shrink-0 bg-slate-50/20 dark:bg-slate-900/20 rounded-[45px] max-h-full border border-slate-100/50 dark:border-slate-800/30 backdrop-blur-md shadow-inner">
                                <div className={cn("p-8 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-between border-b rounded-t-[45px] bg-white/40 dark:bg-slate-900/40 shadow-sm sticky top-0 z-10 italic", column.color)}>
                                    <div className="flex items-center gap-3">
                                        <column.icon className="h-4 w-4" />
                                        {column.title}
                                    </div>
                                    <span className="bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full text-[10px] border border-inherit">{column.items.length}</span>
                                </div>

                                <Droppable droppableId={columnId} isDropDisabled={true}>
                                    {(provided: any) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex-1 p-6 space-y-5 min-h-[200px] overflow-y-auto custom-scrollbar"
                                        >
                                            {column.items.map((app: Application, index: number) => (
                                                <Draggable key={app._id} draggableId={app._id} index={index} isDragDisabled={true}>
                                                    {(provided: any, snapshot: any) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/20 hover:scale-[1.02] transition-all group relative overflow-hidden",
                                                                snapshot.isDragging && "shadow-2xl ring-4 ring-blue-500/30"
                                                            )}
                                                        >
                                                            <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/5 rounded-bl-[50px] -mr-5 -mt-5" />
                                                            <div className="flex items-center gap-5 mb-6">
                                                                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xl italic border-2 border-white/10 shadow-xl group-hover:bg-blue-600 transition-all">
                                                                    {app.jobId.company.charAt(0)}
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <h4 className="font-black text-slate-900 dark:text-white text-sm truncate italic uppercase tracking-tighter">{app.jobId.company}</h4>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">{app.jobId.location}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-base font-black text-slate-800 dark:text-slate-200 mb-6 tracking-tighter leading-tight italic uppercase">{app.jobId.title}</p>
                                                            <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50 dark:border-slate-800/50">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(app.createdAt).toLocaleDateString()}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-600 w-[92%]" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-blue-600 italic">{app.matchScore || "92"}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            ) : (
                <>
                    {/* Quick Stats Toolbar (only for List/Grid) */}
                    <div className="flex flex-wrap gap-4 overflow-x-auto pb-4">
                        {["All", "Applied", "Shortlisted", "Assessment", "Interview", "Offered"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-10 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border italic shrink-0",
                                    filterStatus === status
                                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105"
                                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Content List/Grid */}
                    {loading ? (
                        <div className="space-y-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 w-full bg-white dark:bg-slate-900 rounded-[50px] animate-pulse border border-slate-100 dark:border-slate-800" />
                            ))}
                        </div>
                    ) : filteredApplications.length > 0 ? (
                        <div className={cn(
                            "grid gap-10",
                            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                        )}>
                            {filteredApplications.map((app) => (
                                <div
                                    key={app._id}
                                    className={cn(
                                        "group bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all active:scale-[0.99] relative overflow-hidden shadow-xl",
                                        viewMode === "list" ? "p-10 rounded-[50px] flex flex-col md:flex-row md:items-center justify-between gap-10" : "p-12 rounded-[60px] flex flex-col"
                                    )}
                                >
                                    <div className={cn("absolute top-0 left-0 bottom-0 w-2 opacity-60",
                                        app.status === "Offered" ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                                            app.status === "Rejected" ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" : "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                                    )}></div>

                                    <div className="flex items-center gap-10 flex-1">
                                        <div className="h-24 w-24 bg-slate-900 border-4 border-white dark:border-slate-800 rounded-[35px] flex items-center justify-center text-4xl font-black text-white italic group-hover:bg-indigo-600 transition-all shadow-2xl scale-110 group-hover:rotate-3">
                                            {app.jobId.company.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-all tracking-tighter italic uppercase">{app.jobId.title}</h3>
                                                <span className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic border shadow-sm", statusColors[app.status] || statusColors["Applied"])}>
                                                    <StatusIcon status={app.status} />
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-8">
                                                <span className="text-xs font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic leading-none">
                                                    <Building2 className="h-4 w-4 text-indigo-400" /> {app.jobId.company}
                                                </span>
                                                <span className="text-xs font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic leading-none">
                                                    <MapPin className="h-4 w-4 text-indigo-400" /> {app.jobId.location}
                                                </span>
                                                <span className="text-xs font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic leading-none" title="Applied on">
                                                    <Calendar className="h-4 w-4 text-indigo-400" /> Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-10",
                                        viewMode === "grid" ? "mt-12 pt-12 border-t border-slate-50 dark:border-slate-800 justify-between" : "ml-auto"
                                    )}>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Resonance Index</p>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white italic">{app.matchScore || "88"}<span className="text-indigo-500">%</span></p>
                                        </div>
                                        <div className="h-16 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block"></div>
                                        <div className="flex items-center gap-5 relative">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === app._id ? null : app._id); }}
                                                    className="h-16 w-16 rounded-[25px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-all border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg"
                                                    aria-label="Application actions"
                                                >
                                                    <MoreVertical className="h-6 w-6" />
                                                </button>
                                                {openMenuId === app._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} aria-hidden />
                                                        <div className="absolute right-0 top-full mt-2 z-20 py-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
                                                            <button
                                                                type="button"
                                                                onClick={() => { navigate(`/jobs/${app.jobId._id}`); setOpenMenuId(null); }}
                                                                className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                                                            >
                                                                View job details
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleWithdraw(app._id)}
                                                                disabled={withdrawingId === app._id}
                                                                className="w-full px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl disabled:opacity-50"
                                                            >
                                                                {withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw application'}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                                                className="px-10 py-5 bg-indigo-600 text-white rounded-[25px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 dark:shadow-none hover:translate-y-[-4px] transition-all flex items-center gap-4 group/btn italic"
                                            >
                                                Full Intel <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[60px] p-32 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="h-32 w-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                                    <Rocket className="h-16 w-16 text-indigo-600 animate-bounce" />
                                </div>
                                <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter italic uppercase">Pipeline Vacuum</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-12 font-bold text-sm uppercase tracking-widest leading-relaxed italic">
                                    No active experience nodes detected in the current orbit. Initialize the discovery engine to procure opportunities.
                                </p>
                                <button
                                    onClick={() => navigate("/companies")}
                                    className="px-12 py-6 bg-slate-900 text-white rounded-[30px] text-[11px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 italic flex items-center gap-4 mx-auto"
                                >
                                    Fire Discovery Engine <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function StatNode({ label, value, detail, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 p-20 bg-slate-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{label}</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border border-black/5", color)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                <span className="h-1 w-1 bg-current rounded-full" /> {detail}
            </p>
        </div>
    );
}
