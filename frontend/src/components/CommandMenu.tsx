import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    Settings,
    LogOut,
    Search,
    Moon,
    Sun,
    Laptop,
    Brain,
    Rocket,
    ShieldCheck,
    Cpu,
    Globe,
    Activity,
    Target,
    Sparkles,
    Heart,
    Lightbulb,
    MessageCircle
} from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../features/auth/AuthContext";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { logout, user } = useAuth();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <div className="fixed z-50">
            {/* Press Cmd+K Hint (Visible only when menu is closed) */}
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open command menu (Ctrl+K or ⌘K)"
                    className="fixed bottom-6 right-6 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-medium text-slate-500 dark:text-slate-300"
                >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                    <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-slate-100 dark:bg-slate-700 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400 opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            )}

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Command Menu"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center border-b border-slate-100 dark:border-slate-600 px-4">
                    <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-slate-400" aria-hidden />
                    <Command.Input
                        placeholder="Type a command or search..."
                        aria-label="Search commands"
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-800 dark:text-slate-100"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2" aria-label="Command list">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 font-bold italic uppercase tracking-widest animate-pulse">
                        No Intelligence Found.
                    </Command.Empty>

                    <Command.Group heading="Protocol Alpha (Student)" className="text-[10px] font-black text-slate-400 p-2 uppercase tracking-[0.4em] mt-4 mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/dashboard"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard Matrix</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/ai-coach"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Brain className="h-4 w-4" />
                            <span>AI Intelligence Coach</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/applications"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Briefcase className="h-4 w-4" />
                            <span>Application Pipeline</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/roadmap"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <FileText className="h-4 w-4" />
                            <span>Career Roadmap</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 dark:bg-slate-600 my-4 outline-none" />

                    <Command.Group heading="Protocol Beta (Recruiter)" className="text-[10px] font-black text-slate-400 p-2 uppercase tracking-[0.4em] mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/jobs/create"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Post Opportunity</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/talent-discovery"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Search className="h-4 w-4" />
                            <span>Talent Discovery</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/hiring-intel"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Activity className="h-4 w-4" />
                            <span>Hiring Intelligence</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 dark:bg-slate-600 my-4 outline-none" />

                    <Command.Group heading="Root Command (Admin)" className="text-[10px] font-black text-slate-400 p-2 uppercase tracking-[0.4em] mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/admin/dashboard"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Global Master Terminal</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/admin/system"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Cpu className="h-4 w-4" />
                            <span>System Core Control</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 dark:bg-slate-600 my-4 outline-none" />

                    <Command.Group heading="Advanced (Next Level)" className="text-[10px] font-black text-slate-400 p-2 uppercase tracking-[0.4em] mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/insights"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Insights Hub</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/saved-jobs"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Heart className="h-4 w-4" />
                            <span>Saved Jobs</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/prep-tips"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Lightbulb className="h-4 w-4" />
                            <span>Prep Tips</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/goals"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Target className="h-4 w-4" />
                            <span>Goals & Milestones</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/interview-qa"))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Interview Q&A Bank</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 dark:bg-slate-600 my-4 outline-none" />

                    <Command.Group heading="System Protocols" className="text-[10px] font-black text-slate-400 p-2 uppercase tracking-[0.4em] mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-700 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <Sun className="h-4 w-4 dark:hidden" />
                            <Moon className="h-4 w-4 hidden dark:block" />
                            <span>Theme Atmosphere Shift</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => { logout(); navigate('/login'); })}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer aria-selected:bg-rose-50 transition-all font-black text-[10px] italic uppercase tracking-widest"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Decouple Protocol</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command.Dialog>
        </div>
    );
}

const Plus = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);
