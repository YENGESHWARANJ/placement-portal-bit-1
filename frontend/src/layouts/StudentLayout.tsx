import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Menu,
    X,
    LogOut,
    UserCircle,
    GraduationCap,
    Book,
    Brain,
    Building2,
    Bell,
    Settings,
    Code2,
    Map,
    Search,
    Users,
    Rocket,
    BookOpen,
    CreditCard,
    HelpCircle,
    ChevronRight,
    Expand,
    Zap,
    Trophy,
    History,
    Mic2,
    Palette,
    Gamepad2,
    ShieldCheck,
    Target,
    BarChart3,
    Sparkles,
    Heart,
    Lightbulb,
    MessageCircle
} from "lucide-react";
import { CommandMenu } from "../components/CommandMenu";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { cn } from "../utils/cn";
import { useAuth } from "../features/auth/AuthContext";
import { FloatingAI } from "../components/FloatingAI";

export default function StudentLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/ai-coach", icon: Brain, label: "AI Coach" },
        { to: "/roadmap", icon: BookOpen, label: "Career Roadmap" },
        { to: "/applications", icon: Briefcase, label: "Applications" },
        { to: "/aptitude-test", icon: CreditCard, label: "Assessments" },
        { to: "/interview", icon: Zap, label: "Mock Interview" },
        { to: "/resume-builder", icon: FileText, label: "Resume Builder" },
        { to: "/arena", icon: Target, label: "Arena Hub" },
        { to: "/job-recommendations", icon: Rocket, label: "Job Intel" },
        { to: "/analytics-hub", icon: BarChart3, label: "Advanced Analytics" },
        { to: "/portfolio", icon: Code2, label: "My Portfolio" },
        { to: "/companies", icon: Building2, label: "Companies" },
        { to: "/resources", icon: Book, label: "Resources" },
        { to: "/student-intel", icon: UserCircle, label: "My Profile" },
        { to: "/saved-jobs", icon: Heart, label: "Saved Jobs" },
        { to: "/prep-tips", icon: Lightbulb, label: "Prep Tips" },
        { to: "/goals", icon: Target, label: "Goals" },
        { to: "/interview-qa", icon: MessageCircle, label: "Interview Q&A" },
    ];

    const advancedNavItems = [
        { to: "/insights", icon: Sparkles, label: "Insights Hub" },
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
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Rocket className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white font-black italic uppercase tracking-tighter text-xl">MAYO<span className="text-emerald-400">DREAM</span></span>
                    </div>

                    <div className="relative mb-12 group cursor-pointer" onClick={() => navigate("/student-intel")}>
                        <div className="h-24 w-24 rounded-[35px] bg-slate-700/50 p-1.5 overflow-hidden border border-white/10 ring-8 ring-white/5 transition-all duration-500 hover:rotate-6">
                            <div className="h-full w-full rounded-[25px] bg-slate-500 flex items-center justify-center text-white text-3xl font-black italic">
                                {user?.name?.charAt(0) || "S"}
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2D345B] px-4 py-1.5 rounded-full border border-white/5 text-[8px] font-black text-white/50 tracking-widest uppercase italic whitespace-nowrap group-hover:text-white transition-colors">
                            Active / @{user?.name?.toLowerCase().replace(' ', '')}
                        </div>
                    </div>

                    <nav className="w-full space-y-10 flex-1 overflow-y-auto px-2 scrollbar-hide" role="navigation" aria-label="Student sidebar">
                        <div role="group" aria-labelledby="nav-heading-main">
                            <p id="nav-heading-main" className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Pusat Navigasi</p>
                            <div className="space-y-4">
                                {navItems.slice(0, 4).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                            </div>
                        </div>
                        <div role="group" aria-labelledby="nav-heading-intel">
                            <p id="nav-heading-intel" className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Layanan Intel</p>
                            <div className="space-y-4">
                                {navItems.slice(4).map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
                                <MenuLink icon={Settings} label="Pengaturan" to="/settings" active={location.pathname === "/settings"} />
                            </div>
                        </div>
                        <div role="group" aria-labelledby="nav-heading-advanced">
                            <p id="nav-heading-advanced" className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Advanced</p>
                            <div className="space-y-4">
                                {advancedNavItems.map((item) => (
                                    <MenuLink key={item.to} {...item} active={location.pathname === item.to} />
                                ))}
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
                            <button type="button" className="lg:hidden p-2 rounded-xl bg-white shadow-sm text-slate-600" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
                                <Menu className="h-5 w-5" aria-hidden />
                            </button>
                            <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-[20px] border border-slate-100 shadow-sm w-80 group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                                <input
                                    placeholder="Search intelligence nodes..."
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
                            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-1.5 pr-5 rounded-[22px] border border-white shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/student-intel")}>
                                <div className="h-9 w-9 rounded-[18px] bg-slate-800 flex items-center justify-center text-white text-sm font-black italic shadow-inner">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-tighter">{user?.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Prime Operator</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Hub - Providing the Outlet for sub-routes */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-10 min-h-0">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-[#1E2342]/90 backdrop-blur-xl z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}>
                    <div className="w-[300px] bg-[#1E2342] h-full p-10 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <Rocket className="h-6 w-6 text-white" />
                                <span className="text-white font-black italic tracking-tighter">MAYODREAM</span>
                            </div>
                            <X className="h-6 w-6 text-white/50" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                        <nav className="flex-1 space-y-2" role="navigation" aria-label="Mobile menu">
                            {navItems.map((item) => (
                                <MenuLink key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsSidebarOpen(false)} />
                            ))}
                            {advancedNavItems.map((item) => (
                                <MenuLink key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsSidebarOpen(false)} />
                            ))}
                        </nav>
                        <button onClick={handleLogout} className="mt-auto p-5 bg-[#FF7D54] text-white rounded-[25px] font-black uppercase text-[10px] italic flex items-center justify-center gap-3">
                            <LogOut className="h-4 w-4" /> Decouple Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// HELPERS
function MenuLink({ icon: Icon, label, active = false, to, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; to: string; onClick?: () => void }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            aria-current={active ? "page" : undefined}
            className={({ isActive }) => cn(
                "flex items-center gap-4 p-3 rounded-2xl transition-all font-black italic uppercase text-[10px] tracking-widest group",
                isActive ? "bg-white/10 text-white shadow-xl shadow-slate-900/50" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
        >
            <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                active ? "bg-[#FF7D54] text-white shadow-lg shadow-orange-500/30" : "bg-transparent text-white/20 group-hover:text-white"
            )} aria-hidden>
                <Icon className="h-4 w-4" />
            </div>
            <span>{label}</span>
        </NavLink>
    );
}
