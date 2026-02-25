import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import {
    LayoutDashboard, Users, ShieldCheck, Settings, BarChart3, Bell,
    Search, LogOut, Menu, X, Globe, Database, Cpu, Activity,
    Briefcase, FileText, Calendar, ChevronRight, Shield, User, Swords
} from 'lucide-react';
import { cn } from '../utils/cn';
import { FloatingAI } from '../components/FloatingAI';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useUnreadCount } from '../hooks/useNotifications';

const NAV_GROUPS = [
    {
        label: "Operations",
        items: [
            { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/arena", icon: Swords, label: "The Arena" },
            { to: "/admin/system", icon: Cpu, label: "System Control" },
            { to: "/notifications", icon: Bell, label: "Signals" },
        ],
    },
    {
        label: "People",
        items: [
            { to: "/admin/students", icon: Users, label: "Student Directory" },
            { to: "/admin/recruiters", icon: Briefcase, label: "Recruiter Network" },
            { to: "/admin/companies", icon: Globe, label: "Partner Ecosystem" },
        ],
    },
    {
        label: "Placement",
        items: [
            { to: "/admin/jobs", icon: FileText, label: "Job Postings" },
            { to: "/admin/drives", icon: Calendar, label: "Placement Drives" },
            { to: "/admin/tests", icon: Activity, label: "Exam Control" },
        ],
    },
    {
        label: "Reports",
        items: [
            { to: "/admin/reports", icon: BarChart3, label: "Analytics & Reports" },
        ],
    },
    {
        label: "System",
        items: [
            { to: "/admin/settings", icon: Settings, label: "Global Config" },
        ],
    },
];

function SideNavItem({ to, icon: Icon, label, badge, onClick }: {
    to: string; icon: React.ComponentType<any>; label: string; badge?: number; onClick?: () => void;
}) {
    return (
        <NavLink to={to} onClick={onClick}
            className={({ isActive }) => cn("sidebar-nav-item group flex items-center gap-3 relative", isActive && "active")}>
            <div className="sidebar-icon shrink-0">
                <Icon className="h-[15px] w-[15px]" />
            </div>
            <span className="flex-1 truncate text-[13.5px]">{label}</span>
            {badge && badge > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-red-500 shadow-md">
                    {badge}
                </span>
            )}
        </NavLink>
    );
}

function NavGroup({ group, onNav }: { group: (typeof NAV_GROUPS)[0]; onNav?: () => void }) {
    return (
        <div className="mb-5">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/20 px-3 mb-2">
                {group.label}
            </p>
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

    const handleLogout = () => { logout(); navigate("/"); };

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name
        ?.split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "A";

    return (
        <div
            className="font-sans"
            style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                background: "#080c14",
                ["--sidebar-bg" as any]: "#060a14",
                ["--sidebar-indicator" as any]: "#10b981",
                ["--sidebar-active-bg" as any]: "rgba(16,185,129,0.12)",
                ["--header-bg" as any]: "rgba(6,10,20,0.92)",
                ["--header-border" as any]: "rgba(255,255,255,0.05)",
                ["--bg-page" as any]: "#090d1a",
            }}
        >
            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <aside
                className="hidden lg:flex flex-col shrink-0"
                style={{
                    width: "var(--sidebar-w, 264px)",
                    background: "var(--sidebar-bg)",
                    borderRight: "1px solid rgba(255,255,255,0.055)",
                    zIndex: 40,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-teal-600/6 blur-3xl pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3 px-5 py-5 border-b border-white/[0.055] shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                        <Shield className="h-[18px] w-[18px] text-white" />
                    </div>
                    <div>
                        <p className="text-white font-black text-[15px] tracking-tight leading-none">PlaceIQ</p>
                        <p className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">Admin Control</p>
                    </div>
                </div>

                {/* Profile card */}
                <div className="relative z-10 mx-3 my-4 p-3 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center gap-3 cursor-pointer hover:bg-emerald-500/12 transition-colors shrink-0"
                    onClick={() => navigate("/profile")}>
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-md shadow-emerald-500/20">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-white/90 font-semibold text-[13px] truncate leading-tight">{user?.name || "Admin"}</p>
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-black uppercase tracking-wider">ROOT</span>
                        </div>
                        <p className="text-white/35 text-[11px] truncate mt-0.5">{user?.email}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-white/20 shrink-0" />
                </div>

                {/* Nav */}
                <nav className="relative z-10 flex-1 overflow-y-auto px-3 scrollbar-hide py-1">
                    {NAV_GROUPS.map(group => (
                        <NavGroup key={group.label} group={{ ...group, unreadCount } as any} />
                    ))}
                </nav>

                {/* Bottom */}
                <div className="relative z-10 px-3 pb-5 pt-3 border-t border-white/[0.055] shrink-0">
                    <button
                        onClick={handleLogout}
                        className="sidebar-nav-item w-full text-left hover:!text-red-400 hover:!bg-red-500/10 transition-colors"
                    >
                        <div className="sidebar-icon !text-red-500/50 !bg-red-500/10"><LogOut className="h-[15px] w-[15px]" /></div>
                        <span className="text-[13.5px]">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] shrink-0 sticky top-0 z-30"
                    style={{ background: "var(--header-bg)", backdropFilter: "blur(20px)" }}>
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-xl bg-white/8 text-slate-400 hover:bg-white/12 transition-colors"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        {/* Search */}
                        <div className="hidden sm:flex items-center gap-3 bg-white/[0.05] border border-white/[0.07] rounded-xl px-4 h-10 w-72 focus-within:w-80 focus-within:border-emerald-500/40 focus-within:bg-white/[0.07] transition-all duration-200">
                            <Search className="h-4 w-4 text-slate-500 shrink-0" />
                            <input
                                placeholder="Search students, reports, settings..."
                                className="bg-transparent border-none outline-none text-[13.5px] text-slate-300 w-full placeholder:text-slate-600"
                                style={{ fontFamily: "var(--font-sans)" }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* Auth log pulse */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-400">System Online</span>
                        </div>

                        <button
                            className="relative h-9 w-9 rounded-xl bg-white/8 text-slate-400 flex items-center justify-center hover:bg-white/12 transition-colors border border-white/[0.07]"
                            onClick={() => navigate("/notifications")}
                        >
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-[#060a14] animate-pulse" />
                            )}
                        </button>

                        <div className="h-6 w-px bg-white/[0.07]" />

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/8 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[12px] font-black shadow-sm shadow-emerald-500/20">
                                    {initials}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[13px] font-semibold text-slate-200 leading-none">{user?.name?.split(" ")[0]}</p>
                                    <p className="text-[11px] text-emerald-500/80 mt-0.5 leading-none font-semibold">Root Access</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {profileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-xl border border-white/[0.05] overflow-hidden z-50"
                                        style={{ background: "rgba(6,10,20,0.95)", backdropFilter: "blur(20px)" }}
                                    >
                                        <div className="p-4 border-b border-white/[0.05] flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-[14px] font-bold shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-slate-200 truncate">{user?.name || "Admin"}</p>
                                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/admin/settings"); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Global Config
                                            </button>
                                        </div>
                                        <div className="p-2 border-t border-white/[0.05]">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Terminate Session
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#090d1a]">
                    <FloatingAI />
                    <Outlet />
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="fixed left-0 top-0 bottom-0 w-[264px] flex flex-col z-[60] shadow-2xl"
                            style={{ background: "#060a14" }}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.055]">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white font-black text-[15px]">Admin Control</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)}
                                    className="h-8 w-8 rounded-xl bg-white/8 text-white/50 hover:text-white flex items-center justify-center">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                                {NAV_GROUPS.map(group => (
                                    <NavGroup key={group.label} group={{ ...group, unreadCount } as any} onNav={() => setMobileOpen(false)} />
                                ))}
                            </nav>
                            <div className="px-3 pb-6 pt-3 border-t border-white/[0.055]">
                                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="sidebar-nav-item w-full text-left">
                                    <div className="sidebar-icon !text-red-500/50 !bg-red-500/10"><LogOut className="h-[15px] w-[15px]" /></div>
                                    <span className="text-[13.5px]">Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
