import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import {
    LayoutDashboard, Bell, Search, Menu, X, ChevronRight,
    LogOut, Settings, User, Bot, Sparkles, Trophy, BookOpen,
    Rocket, ClipboardList, Bookmark, Users, Brain, Code2, Mic2, Activity,
    Target, FileText, Route, TrendingUp, GraduationCap, Swords, UsersRound
} from "lucide-react";
import { cn } from "../utils/cn";
import { AICopilot } from "../components/copilot/AICopilot";
import { useUnreadCount } from "../hooks/useNotifications";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const NAV_GROUPS = [
    {
        label: "Overview",
        items: [
            { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/analytics-hub", icon: TrendingUp, label: "Analytics" },
            { to: "/notifications", icon: Bell, label: "Signals" },
        ],
    },
    {
        label: "Career",
        items: [
            { to: "/job-recommendations", icon: Rocket, label: "Job Matches" },
            { to: "/applications", icon: ClipboardList, label: "Applications" },
            { to: "/saved-jobs", icon: Bookmark, label: "Saved" },
            { to: "/companies", icon: Users, label: "Companies" },
            { to: "/alumni", icon: UsersRound, label: "Alumni Hub" },
        ],
    },
    {
        label: "Skills & Tests",
        items: [
            { to: "/arena", icon: Swords, label: "The Arena" },
            { to: "/aptitude-test", icon: Brain, label: "Aptitude" },
            { to: "/coding-test", icon: Code2, label: "Coding" },
            { to: "/interview", icon: Mic2, label: "Mock AI" },
            { to: "/interview-qa", icon: BookOpen, label: "Resources" },
        ],
    },
    {
        label: "Profile",
        items: [
            { to: "/student-intel", icon: Target, label: "My Intel" },
            { to: "/resume-builder", icon: FileText, label: "Resume" },
            { to: "/roadmap", icon: Route, label: "Roadmap" },
            { to: "/activity", icon: Activity, label: "History" },
        ],
    },
    {
        label: "AI Suite",
        items: [
            { to: "/ai-coach", icon: Bot, label: "AI Coach" },
            { to: "/insights", icon: Sparkles, label: "Insights" },
            { to: "/prep-tips", icon: Trophy, label: "Prep Tips" },
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
                "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300",
                isActive
                    ? "bg-apple-blue/10 text-apple-base font-semibold"
                    : "text-apple-gray-400 hover:bg-apple-gray-50 hover:text-apple-gray-900"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-4.5 w-4.5 transition-colors",
                        "group-hover:text-apple-gray-900",
                        isActive ? "text-apple-base" : ""
                    )} />
                    <span className="text-[13px] tracking-tight flex-1">{label}</span>
                    {badge && (
                        <span className="h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-apple-blue shadow-lg shadow-apple-blue/20">
                            {badge}
                        </span>
                    )}
                    {isActive && (
                        <motion.div
                            layoutId="appleNavActive"
                            className="absolute left-0 w-1 h-5 bg-apple-blue rounded-r-full"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

export default function StudentLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const unreadCount = useUnreadCount();

    const handleLogout = () => { logout(); navigate("/"); };

    useEffect(() => {
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
        .toUpperCase() || "S";

    return (
        <div className="min-h-screen bg-apple-gray-50 flex">
            {/* Sidebar - Apple Minimal Desk */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-apple-gray-100 bg-white sticky top-0 h-screen overflow-y-auto z-40">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-9 w-9 rounded-xl bg-apple-blue flex items-center justify-center shadow-lg shadow-apple-blue/20">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-apple-gray-900 font-bold text-sm tracking-tight leading-none">PlaceIQ</p>
                            <p className="text-apple-gray-300 text-[10px] font-bold uppercase tracking-widest mt-1">Student</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.label}>
                                <h3 className="text-[11px] font-bold text-apple-gray-300 uppercase tracking-widest mb-3 ml-3.5">
                                    {group.label}
                                </h3>
                                <div className="space-y-1">
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

                <div className="mt-auto p-4 border-t border-apple-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-apple-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium text-[13px]"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar - Apple Glass */}
                <header className="h-16 apple-glass border-b border-apple-gray-100 px-6 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="lg:hidden p-2 text-apple-gray-400"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="max-w-md w-full relative hidden md:block">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-300" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search everything..."
                                className="w-full h-10 bg-apple-gray-50 border-none rounded-xl pl-10 pr-4 text-[13.5px] focus:ring-2 focus:ring-apple-blue/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button
                            className="p-2 text-apple-gray-400 hover:text-apple-gray-900 transition-colors relative"
                            onClick={() => navigate("/notifications")}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-apple-blue rounded-full border-2 border-white" />
                            )}
                        </button>

                        <div className="h-6 w-px bg-apple-gray-100" />

                        <div className="relative" ref={menuRef}>
                            <button
                                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-apple-gray-100 hover:border-apple-gray-200 transition-all active:scale-[0.98]"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            >
                                <div className="h-8 w-8 rounded-full bg-apple-blue flex items-center justify-center text-white text-[12px] font-bold">
                                    {initials}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-[13px] font-bold text-apple-gray-900 leading-none">{user?.name?.split(" ")[0]}</p>
                                    <p className="text-[10px] font-medium text-apple-gray-300 leading-tight">Student</p>
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
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-apple-gray-100 overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-apple-gray-50 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue text-[14px] font-bold shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-apple-gray-900 truncate">{user?.name}</p>
                                                <p className="text-[11px] text-apple-gray-400 truncate mt-0.5">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/student-intel"); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-apple-gray-500 hover:text-apple-gray-900 hover:bg-apple-gray-50 rounded-xl transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                My Profile
                                            </button>
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); navigate("/settings"); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-apple-gray-500 hover:text-apple-gray-900 hover:bg-apple-gray-50 rounded-xl transition-colors"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </button>
                                        </div>
                                        <div className="p-2 border-t border-apple-gray-50">
                                            <button
                                                onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 lg:p-10 custom-scrollbar overflow-y-auto relative">
                    <AICopilot />
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[60] flex flex-col p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 bg-apple-blue rounded-xl flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-bold text-apple-gray-900">PlaceIQ</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="text-apple-gray-400">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-6">
                                {NAV_GROUPS.map((group) => (
                                    <div key={group.label}>
                                        <h3 className="text-[11px] font-bold text-apple-gray-300 uppercase tracking-widest mb-3 ml-3.5">
                                            {group.label}
                                        </h3>
                                        <div className="space-y-1">
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
