import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Menu,
    X,
    LogOut,
    Building2,
    Bell,
    Settings,
    Plus,
    BarChart3,
    Users,
    ChevronRight,
    Search,
    UserCircle,
    Target,
    Activity,
    Rocket,
    Zap,
    Download
} from "lucide-react";
import { CommandMenu } from "../components/CommandMenu";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { cn } from "../utils/cn";
import { useAuth } from "../features/auth/AuthContext";
import { FloatingAI } from "../components/FloatingAI";

export default function RecruiterLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Hiring Desk" },
        { to: "/jobs/create", icon: Plus, label: "Post Opportunity" },
        { to: "/jobs/my", icon: Briefcase, label: "Active Listings" },
        { to: "/talent-discovery", icon: Search, label: "Talent Discovery" },
        { to: "/hiring-intel", icon: BarChart3, label: "Hiring Intel" },
        { to: "/interviews/ledger", icon: Activity, label: "Interview Ledger" },
        { to: "/profile", icon: UserCircle, label: "Partner Profile" },
    ];

    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 flex items-center justify-center font-sans overflow-x-hidden transition-colors duration-500">
            <CommandMenu />
            <FloatingAI />

            {/* Main Premium Shared Infrastructure (The Card) */}
            <div className="w-full max-w-[1700px] h-full min-h-[900px] bg-white rounded-[60px] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.12)] flex flex-col md:flex-row overflow-hidden border border-slate-100/50">

                {/* 1. PREMIUM SIDEBAR (LEFT) */}
                <aside className="hidden lg:flex flex-col w-[300px] bg-[#1E2342] p-10 items-center border-r border-white/5 relative z-20">
                    <div className="w-full flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white font-black italic uppercase tracking-tighter text-xl">TALENT<span className="text-blue-400">OPS</span></span>
                    </div>

                    <div className="relative mb-12 group cursor-pointer" onClick={() => navigate("/profile")}>
                        <div className="h-24 w-24 rounded-[35px] bg-slate-700/50 p-1.5 overflow-hidden border border-white/10 ring-8 ring-white/5 transition-all duration-500 hover:rotate-6">
                            <div className="h-full w-full rounded-[25px] bg-slate-500 flex items-center justify-center text-white text-3xl font-black italic">
                                {user?.name?.charAt(0) || "R"}
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2D345B] px-4 py-1.5 rounded-full border border-white/5 text-[8px] font-black text-white/50 tracking-widest uppercase italic whitespace-nowrap group-hover:text-white transition-colors">
                            Recruiter / @{user?.name?.toLowerCase().replace(' ', '')}
                        </div>
                    </div>

                    <nav className="w-full space-y-10 flex-1 overflow-y-auto px-2 scrollbar-hide">
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Console Utama</p>
                            <div className="space-y-4">
                                {navItems.slice(0, 4).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">System Control</p>
                            <div className="space-y-4">
                                {navItems.slice(4).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                                <MenuLink icon={Settings} label="System Config" to="/settings" active={location.pathname === "/settings"} />
                            </div>
                        </div>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-10 p-5 bg-[#FF7D54] hover:bg-orange-600 text-white rounded-[30px] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-orange-500/20 font-black italic uppercase text-xs tracking-widest group"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Decouple
                    </button>
                </aside>

                {/* 2. CENTRAL HUD & RIGHT PANEL CONTAINER */}
                <div className="flex-1 bg-[#F4F7FE] flex flex-col h-full min-h-0 relative">
                    {/* Compact Modern Header */}
                    <header className="h-20 px-10 flex items-center justify-between bg-[#F4F7FE]/60 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100/50">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden p-2 rounded-xl bg-white shadow-sm text-slate-600" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-[20px] border border-slate-100 shadow-sm w-96 group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                                <input
                                    placeholder="Search applicant ledger..."
                                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase italic tracking-widest text-slate-800 px-3 w-full placeholder:text-slate-300"
                                />
                                <kbd className="text-[9px] font-black text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100 tracking-tighter">⌘K</kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <ThemeToggle />
                            <div className="relative group cursor-pointer">
                                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full ring-4 ring-white shadow-sm"></span>
                                </div>
                            </div>
                            <div className="h-px w-8 bg-slate-200" />
                            <div className="flex gap-4">
                                <Link to="/jobs/create" className="hidden lg:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                                    <Plus className="h-3.5 w-3.5" /> Post Listing
                                </Link>
                                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-1.5 pr-5 rounded-[22px] border border-white shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/profile")}>
                                    <div className="h-9 w-9 rounded-[18px] bg-slate-900 flex items-center justify-center text-white text-sm font-black italic shadow-inner">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-tighter">{user?.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Partner Terminal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Hub - Providing the Outlet for sub-routes */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-10 min-h-0">
                        <div className="max-w-[1600px] mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-[#1E2342]/90 backdrop-blur-xl z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}>
                    <div className="w-[300px] bg-[#1E2342] h-full p-10 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <Target className="h-6 w-6 text-white" />
                                <span className="text-white font-black italic tracking-tighter uppercase">TALENT OPS</span>
                            </div>
                            <X className="h-6 w-6 text-white/50" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => (
                                <MenuLink key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsSidebarOpen(false)} />
                            ))}
                        </nav>
                        <button onClick={handleLogout} className="mt-auto p-5 bg-[#FF7D54] text-white rounded-[25px] font-black uppercase text-[10px] italic flex items-center justify-center gap-3">
                            <LogOut className="h-4 w-4" /> Exit terminal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// HELPERS
function MenuLink({ icon: Icon, label, active = false, to, onClick }: any) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center gap-4 p-3 rounded-2xl transition-all font-black italic uppercase text-[10px] tracking-widest group text-left",
                isActive ? "bg-white/10 text-white shadow-xl shadow-slate-900/50" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
        >
            <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-transparent text-white/20 group-hover:text-white"
            )}>
                <Icon className="h-4 w-4" />
            </div>
            {label}
        </NavLink>
    );
}
