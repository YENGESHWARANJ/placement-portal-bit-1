import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell, BellRing, Check, X, Briefcase, FileText,
    Calendar, MessageSquare, Award, Info, Zap, Clock, Search,
    CheckCircle2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "../services/api";

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

function mapNoticeType(t: string): NotificationType {
    if (t === "Student" || t === "Recruiter" || t === "All") return "system";
    return "system";
}

const READ_IDS_KEY = "placement_notifications_read";

function loadReadIds(): Set<string> {
    try {
        const raw = localStorage.getItem(READ_IDS_KEY);
        if (!raw) return new Set();
        const arr = JSON.parse(raw);
        return new Set(Array.isArray(arr) ? arr : []);
    } catch {
        return new Set();
    }
}

function saveReadIds(ids: Set<string>) {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
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
                    type: mapNoticeType(n.type),
                    title: n.title,
                    message: n.content,
                    timestamp: new Date(n.createdAt),
                    priority: ((n.priority || "Medium") as string).toLowerCase() as "low" | "medium" | "high",
                    actionUrl: n.type === "Student" || n.type === "All" ? "/job-recommendations" : undefined,
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
            default: return Info;
        }
    };

    const iconBgClass: Record<NotificationType, string> = {
        job: "bg-blue-100 dark:bg-blue-900/30",
        application: "bg-purple-100 dark:bg-purple-900/30",
        interview: "bg-emerald-100 dark:bg-emerald-900/30",
        message: "bg-orange-100 dark:bg-orange-900/30",
        achievement: "bg-yellow-100 dark:bg-yellow-900/30",
        system: "bg-slate-100 dark:bg-slate-900/30",
    };
    const iconColorClass: Record<NotificationType, string> = {
        job: "text-blue-600 dark:text-blue-400",
        application: "text-purple-600 dark:text-purple-400",
        interview: "text-emerald-600 dark:text-emerald-400",
        message: "text-orange-600 dark:text-orange-400",
        achievement: "text-yellow-600 dark:text-yellow-400",
        system: "text-slate-600 dark:text-slate-400",
    };

    const markAsRead = (id: string) => {
        setReadIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            saveReadIds(next);
            return next;
        });
    };

    const markAllAsRead = () => {
        setReadIds((prev) => {
            const next = new Set(notifications.map((n) => n.id));
            notifications.forEach((n) => next.add(n.id));
            saveReadIds(next);
            return next;
        });
    };

    const deleteNotification = async (id: string) => {
        try {
            await api.delete(`/notices/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
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
        <div className="max-w-6xl mx-auto space-y-8 pb-20">

            {/* Elite Header */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[40px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[28px] flex items-center justify-center shadow-2xl">
                                    <BellRing className="h-10 w-10 text-white" />
                                </div>
                                {unreadCount > 0 && (
                                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                        <span className="text-white text-xs font-black">{unreadCount}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                                    Notifications
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Stay updated with real-time alerts
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[30px] shadow-xl">
                    <Briefcase className="h-8 w-8 text-white/80 mb-3" />
                    <p className="text-3xl font-black text-white mb-1">{stats.job}</p>
                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Job Alerts</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-[30px] shadow-xl">
                    <FileText className="h-8 w-8 text-white/80 mb-3" />
                    <p className="text-3xl font-black text-white mb-1">{stats.application}</p>
                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Applications</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-[30px] shadow-xl">
                    <Calendar className="h-8 w-8 text-white/80 mb-3" />
                    <p className="text-3xl font-black text-white mb-1">{stats.interview}</p>
                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Interviews</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-[30px] shadow-xl">
                    <MessageSquare className="h-8 w-8 text-white/80 mb-3" />
                    <p className="text-3xl font-black text-white mb-1">{stats.system}</p>
                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Notices</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notifications..."
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {["all", "unread", "job", "application", "system"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white dark:bg-slate-900 p-20 rounded-[40px] border border-slate-100 dark:border-slate-800 text-center">
                        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-20 rounded-[40px] border border-slate-100 dark:border-slate-800 text-center">
                        <Bell className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 dark:text-slate-600 font-bold">No notifications found</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        const isRead = readIds.has(notification.id);

                        return (
                            <div
                                key={notification.id}
                                className={`bg-white dark:bg-slate-900 p-6 rounded-[30px] border shadow-sm transition-all hover:shadow-lg group ${isRead
                                        ? "border-slate-100 dark:border-slate-800"
                                        : "border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
                                    }`}
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass[notification.type]}`}>
                                        <Icon className={`h-7 w-7 ${iconColorClass[notification.type]}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                                                {notification.title}
                                            </h3>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {!isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                                                    title="Dismiss"
                                                >
                                                    <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm mb-3">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {notification.timestamp.toLocaleString()}
                                                </p>
                                                {notification.priority === "high" && (
                                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                        High Priority
                                                    </span>
                                                )}
                                            </div>
                                            {notification.actionUrl && (
                                                <button
                                                    onClick={() => navigate(notification.actionUrl!)}
                                                    className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
                                                >
                                                    View Details
                                                    <Zap className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
