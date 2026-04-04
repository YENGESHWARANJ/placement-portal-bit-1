import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import {
    LayoutDashboard, Briefcase, Users, BarChart3, Settings, LogOut,
    Moon, Sun, Bell, Search, Menu, X, FileText, PlusCircle,
    Building2, Calendar, Zap, ChevronRight, TrendingUp, Activity,
    Star, Target, User, Swords, Cpu, MessageCircle
} from "lucide-react";
import { cn } from '../utils/cn';
import { FloatingAI } from '../components/FloatingAI';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useUnreadCount } from '../hooks/useNotifications';
import { toast } from 'react-hot-toast';

const NAV_GROUPS = [
    {
        label: "Officer Hub",
        items: [
            { to: "/admin/dashboard", icon: LayoutDashboard, label: "Placement Officer Dashboard" },
            { to: "/admin/reports", icon: BarChart3, label: "Final Selection Track" },
        ],
    },
    {
        label: "Placements Operations",
        items: [
            { to: "/admin/jobs/create", icon: FileText, label: "Drive Create" },
            { to: "/admin/drives", icon: Calendar, label: "Drive Schedule" },
            { to: "/admin/tests", icon: Zap, label: "Test Management" },
        ],
    },
    {
        label: "Partners",
        items: [
            { to: "/admin/companies", icon: Building2, label: "Company Manage" },
            { to: "/admin/students", icon: Users, label: "Student Registry" },
        ],
    },
    {
        label: "System",
        items: [
            { to: "/messages", icon: MessageCircle, label: "Messages" },
            { to: "/notifications", icon: Bell, label: "Office Messages" },
            { to: "/admin/settings", icon: Settings, label: "Settings" },
        ],
    },
];

function SideNavItem({ to, icon: Icon, label, badge, onClick }: {
    to: string; icon: React.ComponentType<any>; label: string; badge?: number; onClick?: () => void;
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => cn(
                "group relative flex items-center gap-3 py-2.5 pl-5 pr-4 mr-4 rounded-xl transition-all duration-300",
                isActive
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200"
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
                            isActive ? "bg-white text-indigo-600" : "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        )}>
                            {badge}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
}

function NavGroup({ group, onNav }: { group: (typeof NAV_GROUPS)[0]; onNav?: () => void }) {
    return (
        <div className="mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-6">
                {group.label}
            </h3>
            <div className="space-y-0.5">
                {group.items.map(item => (
                    <SideNavItem
                        key={item.to}
                        {...item}
                        badge={item.to === "/notifications" ? (group as any).unreadCount : undefined}
                        onClick={onNav}
                    />
                ))}
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const unreadCount = useUnreadCount();

    const handleLogout = () => {
        logout();
        toast.success("Admin session terminated.");
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

    const initials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "A";

    return (
        <div className="min-h-screen flex text-slate-900 bg-[#f8fafc] font-sans">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-[260px] flex-col border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto z-40 custom-scrollbar">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                        <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
                            <span className="text-white font-black text-xs tracking-tighter">BIT</span>
                        </div>
                        <div>
                            <p className="text-slate-900 font-black text-xl tracking-tight leading-none uppercase">PORTAL</p>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">PLACEMENT OFFICER</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-2">
                    {NAV_GROUPS.map(group => (
                        <NavGroup key={group.label} group={{ ...group, unreadCount } as any} />
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-6 py-3 text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm rounded-r-full mr-4"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-3">BIT v1.0.4</p>
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
                                placeholder="Search students, drives, reports..."
                                className="w-full h-[46px] bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button
                            className="h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-all relative"
                            onClick={() => navigate("/notifications")}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        <div className="relative" ref={menuRef}>
                            <button
                                className="flex items-center gap-4 pr-1 pl-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-[12px] font-black uppercase text-slate-900 leading-tight">Placement Officer</p>
                                    <p className="text-[11px] font-bold text-slate-500 leading-tight truncate max-w-[120px]">{user?.name?.split(" ")[0]}</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-100">
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
                                                onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
                                            >
                                                <User className="h-4.5 w-4.5" />
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/admin/settings"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
                                            >
                                                <Settings className="h-4.5 w-4.5" />
                                                Global Config
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

                <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/50">
                    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8">
                        <Outlet />
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[60] flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <span className="text-slate-900 font-black text-lg">BIT</span>
                                    </div>
                                    <span className="font-extrabold text-slate-900 text-lg">Officer View</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto py-6 space-y-6">
                                {NAV_GROUPS.map(group => (
                                    <NavGroup key={group.label} group={{ ...group, unreadCount } as any} onNav={() => setMobileOpen(false)} />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
