import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import {
    LayoutDashboard, Briefcase, Users, BarChart3, Settings, LogOut,
    Moon, Sun, Bell, Search, Menu, X, FileText, PlusCircle,
    Building2, CalendarDays, Zap, ChevronRight, TrendingUp, Activity,
    Star, Target, User, ShieldCheck, MessageCircle
} from "lucide-react";
import { cn } from "../utils/cn";
import { FloatingAI } from "../components/FloatingAI";
import { useUnreadCount } from "../hooks/useNotifications";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { toast } from "react-hot-toast";

const NAV_GROUPS = [
    {
        label: "Mentor Desk",
        items: [
            { to: "/dashboard", icon: LayoutDashboard, label: "Mentor Dashboard" },
            { to: "/messages", icon: MessageCircle, label: "Messages" },
            { to: "/notifications", icon: Bell, label: "Inbox" },
            { to: "/activity", icon: Activity, label: "History" },
        ],
    },
    {
        label: "Student Watch",
        items: [
            { to: "/students", icon: Users, label: "Monitor Students" },
            { to: "/talent-discovery", icon: Search, label: "Eligibility Filter" },
            { to: "/interviews/ledger", icon: ShieldCheck, label: "Approve Students" },
        ],
    },
    {
        label: "Operations",
        items: [
            { to: "/interviews/ledger", icon: CalendarDays, label: "Interview Ledger" },
            { to: "/hiring-intel", icon: TrendingUp, label: "Analytics" },
        ],
    },
];

function SideNavItem({ to, icon: Icon, label, badge, onClick }: {
    to: string; icon: any; label: string; badge?: number; onClick?: () => void;
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => cn(
                "group relative flex items-center gap-3 py-2.5 pl-5 pr-4 mr-4 rounded-xl transition-all duration-300",
                isActive
                    ? "bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-indigo-600 font-medium"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700 transition-colors")} />
                    <span className="text-sm tracking-wide flex-1">{label}</span>
                    {badge && badge > 0 && (
                        <span className={cn(
                            "h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-black flex items-center justify-center",
                            isActive ? "bg-white text-indigo-600" : "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        )}>
                            {badge}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
}

export default function MentorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const unreadCount = useUnreadCount();

    const handleLogout = () => {
        logout();
        toast.success("Successfully logged out. Secure session terminated.");
        navigate("/");
    };

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "R";

    return (
        <div className="min-h-screen flex text-slate-900 bg-[#f8fafc] font-sans">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-[260px] flex-col border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto z-40 custom-scrollbar">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
                            <span className="text-white font-black text-xs tracking-tighter">BIT</span>
                        </div>
                        <div>
                            <p className="text-slate-900 font-black text-xl tracking-tight leading-none uppercase">Portal</p>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">MENTOR HUB</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.label}>
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-6">
                                    {group.label}
                                </h3>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                        <SideNavItem
                                            key={item.to}
                                            {...item}
                                            badge={item.to === "/notifications" && unreadCount > 0 ? unreadCount : undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-slate-100">
                    <SideNavItem to="/settings" icon={Settings} label="Settings" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm rounded-xl mr-4 mt-1"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-3">BIT v5.0.4</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Navbar */}
                <header className="h-[76px] bg-white border-b border-slate-100 px-8 flex items-center justify-between z-30 shrink-0">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            className="lg:hidden p-2 text-slate-500"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        
                        <h1 className="text-2xl font-black text-slate-900 hidden sm:block tracking-tight">Dashboard</h1>

                        <div className="max-w-md w-full relative hidden md:block ml-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search candidates, jobs..."
                                className="w-full h-[46px] bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button
                            onClick={() => navigate("/jobs/create")}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-all shadow-[0_8px_20px_rgba(244,63,94,0.25)]"
                        >
                            <PlusCircle className="h-4.5 w-4.5" />
                            Post Job
                        </button>

                        <button
                            className="h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-all relative ml-2"
                            onClick={() => navigate("/notifications")}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <div className="relative" ref={menuRef}>
                            <button
                                className="flex items-center gap-4 pr-1 pl-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-[12px] font-black uppercase text-slate-900 leading-tight">Mentor Area</p>
                                    <p className="text-[11px] font-bold text-slate-500 leading-tight truncate max-w-[120px]">{user?.name?.split(" ")[0]}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center text-slate-900 text-sm font-black shadow-md shadow-rose-500/20">
                                    {initials}
                                </div>
                            </button>

                            <AnimatePresence>
                                {profileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 origin-top-right"
                                    >
                                        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-lg font-black shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-black text-slate-900 truncate">{user?.name}</p>
                                                <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 space-y-1">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/companies"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
                                            >
                                                <Building2 className="h-4.5 w-4.5" />
                                                Company Profile
                                            </button>
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
                                            >
                                                <User className="h-4.5 w-4.5" />
                                                My Profile
                                            </button>
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/settings"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
                                            >
                                                <Settings className="h-4.5 w-4.5" />
                                                Settings
                                            </button>
                                        </div>
                                        <div className="p-3 border-t border-slate-100">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
                                            >
                                                <LogOut className="h-4.5 w-4.5" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/50">
                    <FloatingAI />
                    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[60] flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <span className="text-slate-900 font-black text-lg">BIT</span>
                                    </div>
                                    <span className="font-extrabold text-slate-900 text-lg">Mentor</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                                {NAV_GROUPS.map((group) => (
                                    <div key={group.label}>
                                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-6">
                                            {group.label}
                                        </h3>
                                        <div className="space-y-0.5">
                                            {group.items.map((item) => (
                                                <SideNavItem
                                                    key={item.to}
                                                    {...item}
                                                    badge={item.to === "/notifications" && unreadCount > 0 ? unreadCount : undefined}
                                                    onClick={() => setMobileOpen(false)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
