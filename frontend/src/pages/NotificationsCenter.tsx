import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    BellRing,
    Check,
    X,
    Briefcase,
    FileText,
    Calendar,
    MessageSquare,
    Award,
    Info,
    Zap,
    Clock,
    Search,
    CheckCircle2,
    Trash2,
    Sparkles,
    ShieldCheck,
    Signal,
    Activity,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import api from "../services/api";
import { cn } from "../utils/cn";
import { toast } from "react-hot-toast";
import { loadReadIds, saveReadIds } from "../hooks/useNotifications";

type NotificationType = "job" | "application" | "interview" | "message" | "achievement" | "system";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    priority: "low" | "medium" | "high";
    actionUrl?: string;
}

function mapNoticeType(title: string, typeVal: string): NotificationType {
    const t = title.toLowerCase();
    if (t.includes("interview")) return "interview";
    if (t.includes("applicant") || t.includes("application")) return "application";
    if (t.includes("job")) return "job";
    return "system";
}

export default function NotificationsCenter() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<"all" | "unread" | "job" | "application" | "system">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(loadReadIds);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.get<{ notices: any[] }>("/notices");
                const list = (res.data?.notices || []).map((n: any) => ({
                    id: n._id,
                    type: mapNoticeType(n.title || "", n.type),
                    title: n.title,
                    message: n.content,
                    timestamp: new Date(n.createdAt),
                    priority: ((n.priority || "Medium") as string).toLowerCase() as "low" | "medium" | "high",
                    actionUrl: (n.title || "").toLowerCase().includes("interview") ? "/interview" :
                        (n.title || "").toLowerCase().includes("applicant") ? "/dashboard" :
                            n.type === "Student" || n.type === "All" ? "/job-recommendations" : undefined,
                }));
                setNotifications(list);
            } catch {
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

    const getIcon = (type: NotificationType): LucideIcon => {
        switch (type) {
            case "job": return Briefcase;
            case "application": return FileText;
            case "interview": return Calendar;
            case "message": return MessageSquare;
            case "achievement": return Award;
            case "system":
            default: return Signal;
        }
    };

    const iconBgClass: Record<NotificationType, string> = {
        job: "from-blue-500/20 to-indigo-500/20",
        application: "from-purple-500/20 to-pink-500/20",
        interview: "from-emerald-500/20 to-teal-500/20",
        message: "from-orange-500/20 to-amber-500/20",
        achievement: "from-yellow-500/20 to-orange-500/20",
        system: "from-slate-500/20 to-slate-700/20",
    };

    const iconColorClass: Record<NotificationType, string> = {
        job: "text-blue-400",
        application: "text-purple-400",
        interview: "text-emerald-400",
        message: "text-orange-400",
        achievement: "text-yellow-400",
        system: "text-slate-400",
    };

    const markAsRead = (id: string) => {
        setReadIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            saveReadIds(next);
            return next;
        });
        toast.success("Packet Synchronized", {
            icon: "✅",
            style: { borderRadius: "20px", background: "#0D0F1F", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", fontWeight: "900" }
        });
    };

    const markAllAsRead = () => {
        setReadIds((prev) => {
            const next = new Set(notifications.map((n) => n.id));
            notifications.forEach((n) => next.add(n.id));
            saveReadIds(next);
            return next;
        });
        toast.success("Batch Sync Complete", {
            style: { borderRadius: "20px", background: "#0D0F1F", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", fontWeight: "900" }
        });
    };

    const deleteNotification = async (id: string) => {
        try {
            await api.delete(`/notices/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
        toast.error("Signal Purged", {
            icon: "🗑️",
            style: { borderRadius: "20px", background: "#0D0F1F", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", fontWeight: "900" }
        });
    };

    const filteredNotifications = notifications.filter((n) => {
        const read = readIds.has(n.id);
        if (filter === "unread" && read) return false;
        if (filter === "job" && n.type !== "job") return false;
        if (filter === "application" && n.type !== "application") return false;
        if (filter === "system" && n.type !== "system") return false;
        if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const stats = {
        job: notifications.filter((n) => n.type === "job").length,
        application: notifications.filter((n) => n.type === "application").length,
        interview: notifications.filter((n) => n.type === "interview").length,
        system: notifications.filter((n) => n.type === "system").length,
    };

    return (
        <div className="flex-1 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">

            {/* 1. ELITE COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black italic text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Signal Intelligence Center</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Real-Time Event Stream Monitoring</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 group"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:translate-x-1 transition-transform">Synchronize All</span>
                    </button>
                </div>
            </div>

            {/* AI Global Stats Banner - REFINED FOR NOTIFICATIONS */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#0D0F1F] via-[#1E2342] to-[#0D0F1F] p-10 rounded-[60px] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-[0_40px_100px_rgba(30,35,66,0.3)] border border-white/5"
            >
                <div className="relative z-10 space-y-6 max-w-xl text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[28px] flex items-center justify-center border border-white/10 shadow-2xl relative">
                            <BellRing className="h-8 w-8 text-blue-400 animate-bounce" />
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 h-6 w-6 bg-rose-600 rounded-full flex items-center justify-center border-2 border-[#1E2342]">
                                    <span className="text-[10px] font-black">{unreadCount}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-blue-400">Security & Alerts Terminal</span>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mt-1">
                                {unreadCount > 0 ? "Pending Signal Alerts" : "All Signals Synchronized"}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 w-full lg:w-auto">
                    <StatItem label="Job Signals" value={stats.job} color="text-blue-400" />
                    <StatItem label="Apps" value={stats.application} color="text-purple-400" />
                    <StatItem label="Interview" value={stats.interview} color="text-emerald-400" />
                    <StatItem label="Notice" value={stats.system} color="text-slate-400" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
            </motion.div>

            {/* Neural Controls - Search & Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan Signal Cache..."
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 text-xs font-black uppercase tracking-[0.2em] transition-all italic text-white placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="lg:col-span-8 flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {["all", "unread", "job", "application", "system"].map((f) => (
                        <motion.button
                            key={f}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                            )}
                        >
                            {f}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Signal Stream */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="py-40 text-center glass-premium rounded-[60px] border border-white/5">
                            <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Frequency...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-40 text-center glass-premium rounded-[60px] border border-white/5"
                        >
                            <Activity className="h-16 w-16 text-slate-700 mx-auto mb-6 opacity-30" />
                            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em] italic">No Signals Detected</h3>
                            <p className="text-slate-600 mt-2 font-black uppercase tracking-widest text-[10px]">Frequency clear. No events currently being processed.</p>
                        </motion.div>
                    ) : (
                        filteredNotifications.map((n, i) => {
                            const Icon = getIcon(n.type);
                            const isRead = readIds.has(n.id);

                            return (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "glass-premium p-6 rounded-[35px] border border-white/5 shadow-xl group transition-all relative overflow-hidden",
                                        !isRead && "border-blue-500/30 bg-blue-500/[0.03]"
                                    )}
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center border border-white/10 shadow-2xl relative group-hover:scale-110 transition-transform duration-500",
                                            iconBgClass[n.type]
                                        )}>
                                            <Icon className={cn("h-6 w-6", iconColorClass[n.type])} />
                                            {!isRead && (
                                                <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-600 rounded-full border-2 border-[#0D0F1F] animate-pulse" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={cn(
                                                        "text-[15px] font-black uppercase tracking-tighter italic transition-colors",
                                                        isRead ? "text-slate-400 group-hover:text-white" : "text-white"
                                                    )}>
                                                        {n.title}
                                                    </h3>
                                                    <p className="text-xs font-bold text-slate-500 leading-relaxed mt-1 line-clamp-1">
                                                        {n.message}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!isRead && (
                                                        <button
                                                            onClick={() => markAsRead(n.id)}
                                                            className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(n.id)}
                                                        className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest italic font-mono">
                                                        <Clock className="h-3 w-3" />
                                                        {n.timestamp.toLocaleString()}
                                                    </div>
                                                    {n.priority === "high" && (
                                                        <div className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase tracking-widest italic bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                                            <Zap className="h-2 w-2" /> High Intensity
                                                        </div>
                                                    )}
                                                </div>

                                                {n.actionUrl && (
                                                    <button
                                                        onClick={() => navigate(n.actionUrl!)}
                                                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-all group/btn"
                                                    >
                                                        Execute Command <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Left Status Bar */}
                                    <div className={cn(
                                        "absolute top-0 left-0 w-1 h-full transition-all",
                                        !isRead ? "bg-blue-600" : "bg-transparent group-hover:bg-white/10"
                                    )} />
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Internal Stat Item
const StatItem = ({ label, value, color }: any) => (
    <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-[28px] border border-white/5 text-center min-w-[100px] flex flex-col justify-center">
        <p className={cn("text-2xl font-black italic leading-none mb-1", color)}>{value}</p>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none opacity-60">{label}</p>
    </div>
);
