import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import {
    LayoutDashboard, Users, ShieldCheck, Settings, BarChart3, Bell,
    Search, LogOut, Menu, X, Command, Globe, Database, Cpu, Activity,
    Target, Zap, Rocket, ChevronRight, Expand, Briefcase, FileText, Calendar
} from 'lucide-react';
import { cn } from '../utils/cn';
import { FloatingAI } from '../components/FloatingAI';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/system", icon: Cpu, label: "System Control" },
        { to: "/admin/students", icon: Users, label: "Student Directory" },
        { to: "/admin/recruiters", icon: Briefcase, label: "Recruiter Network" },
        { to: "/admin/companies", icon: Globe, label: "Partner Ecosystem" },
        { to: "/admin/jobs", icon: FileText, label: "Job Postings" },
        { to: "/admin/drives", icon: Calendar, label: "Placement Drives" },
        { to: "/admin/tests", icon: Activity, label: "Exam Control" },
        { to: "/admin/reports", icon: BarChart3, label: "Reports" },
        { to: "/admin/settings", icon: Settings, label: "Global Config" },
    ];

    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <div className="min-h-screen bg-[#0A0C1B] p-4 md:p-8 flex items-center justify-center font-sans overflow-x-hidden transition-all duration-700">
            <FloatingAI />

            {/* Main Premium Shared Infrastructure (The Card) */}
            <div className="w-full max-w-[1750px] h-full min-h-[920px] bg-[#0F1121] rounded-[60px] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden border border-white/5 relative">

                {/* Background Ambient Glows inside the card */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* 1. MASTER SIDEBAR (LEFT) */}
                <aside className="hidden lg:flex flex-col w-[320px] bg-[#060813] p-10 items-center border-r border-white/5 relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                    <div className="w-full flex items-center gap-4 mb-12">
                        <div className="h-10 w-10 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white font-black italic uppercase tracking-tighter text-xl">ROOT<span className="text-cyan-500">CONTROL</span></span>
                    </div>

                    <div className="relative mb-12 group cursor-pointer" onClick={() => navigate("/profile")}>
                        <div className="h-28 w-28 rounded-[45px] bg-slate-800/50 p-1.5 overflow-hidden border border-white/5 ring-8 ring-white/5 transition-all duration-500 hover:rotate-2">
                            <div className="h-full w-full rounded-[38px] bg-gradient-to-br from-slate-950 to-cyan-950 flex items-center justify-center text-white text-4xl font-black italic border border-white/10 shadow-inner">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cyan-600 px-5 py-2 rounded-full border border-white/10 text-[8px] font-black text-white tracking-[0.2em] uppercase italic whitespace-nowrap shadow-xl">
                            Super User / Node-01
                        </div>
                    </div>

                    <nav className="w-full space-y-12 flex-1 overflow-y-auto px-2 scrollbar-hide">
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-8 ml-2">Main Ops</p>
                            <div className="space-y-5">
                                {navItems.slice(0, 5).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-8 ml-2">System Control</p>
                            <div className="space-y-5">
                                {navItems.slice(5).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                            </div>
                        </div>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-12 p-6 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-[35px] flex items-center justify-center gap-4 transition-all font-black italic uppercase text-[10px] tracking-widest group shadow-2xl"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Terminate Terminal
                    </button>
                </aside>

                {/* 2. CENTRAL HUD CONTAINER */}
                <div className="flex-1 bg-transparent flex flex-col h-full min-h-0 relative z-10">
                    {/* Integrated Modern Header */}
                    <header className="h-24 px-12 flex items-center justify-between bg-white/[0.02] backdrop-blur-3xl sticky top-0 z-10 border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <button className="lg:hidden p-3 rounded-2xl bg-white/5 text-slate-400" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="hidden md:flex items-center bg-white/5 px-6 py-3.5 rounded-[25px] border border-white/5 shadow-inner w-[450px] group focus-within:bg-white/10 transition-all font-mono text-cyan-400">
                                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-cyan-400" />
                                <input
                                    placeholder="Execute network search protocol..."
                                    className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-300 px-4 w-full placeholder:text-slate-600"
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="text-[9px] font-black text-slate-600 bg-black/40 px-2 py-1 rounded-lg border border-white/5 tracking-tighter">CMD</kbd>
                                    <kbd className="text-[9px] font-black text-slate-600 bg-black/40 px-2 py-1 rounded-lg border border-white/5 tracking-tighter">K</kbd>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <ThemeToggle />
                            <div className="relative group cursor-pointer">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-all shadow-lg">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-[#0F1121]"></span>
                                </div>
                            </div>
                            <div className="h-px w-10 bg-white/10" />
                            <div className="flex items-center gap-5 bg-white/5 backdrop-blur-md p-2 pr-6 rounded-[30px] border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                                <div className="h-11 w-11 rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg font-black italic shadow-lg group-hover:rotate-6 transition-transform">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[11px] font-black text-white leading-none uppercase tracking-tighter mb-1">{user?.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic text-cyan-500/80">Root Access</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area - Providing the Slot for children */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-12 min-h-0 bg-[#0F1121]/50">
                        <Outlet />

                        {/* System Telemetry Footer */}
                        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
                            <div className="flex items-center gap-10 text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                                <span className="flex items-center gap-2"><Globe className="h-3 w-3 text-cyan-500" /> Region: G-NODE-1</span>
                                <span className="flex items-center gap-2"><Database className="h-3 w-3 text-blue-500" /> Flux DB: 0.12ms</span>
                                <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-emerald-500" /> Uptime: 99.98%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">System build 8.4.2</span>
                                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse" />
                            </div>
                        </footer>
                    </main>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}>
                    <div className="w-[320px] bg-[#060813] h-full p-12 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="h-8 w-8 text-cyan-500" />
                                <span className="text-white font-black italic tracking-tighter text-2xl">ROOT CONTROL</span>
                            </div>
                            <X className="h-8 w-8 text-white/20 hover:text-white" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                        <nav className="flex-1 space-y-4">
                            {navItems.map((item) => (
                                <MenuLink key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsSidebarOpen(false)} />
                            ))}
                        </nav>
                        <button onClick={handleLogout} className="mt-auto p-6 bg-rose-600/10 text-rose-500 rounded-[35px] font-black uppercase text-[11px] italic flex items-center justify-center gap-4 border border-rose-500/20">
                            <LogOut className="h-5 w-5" /> TERMINATE
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
                "flex items-center gap-5 p-4 rounded-[25px] transition-all font-black italic uppercase text-[11px] tracking-widest group",
                isActive ? "bg-cyan-600 text-white shadow-2xl shadow-cyan-600/20" : "text-white/30 hover:text-white hover:bg-white/5"
            )}
        >
            <div className={cn(
                "h-9 w-9 rounded-2xl flex items-center justify-center transition-all",
                active ? "bg-white/20 text-white" : "bg-transparent text-white/10 group-hover:text-white"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            {label}
        </NavLink>
    );
}
