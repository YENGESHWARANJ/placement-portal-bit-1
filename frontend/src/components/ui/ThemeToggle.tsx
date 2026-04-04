import React from 'react';
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    return (
        <div className={cn("flex items-center", className)}>
            <button
                onClick={toggleTheme}
                className={cn(
                    "group relative h-10 w-20 rounded-2xl p-1 transition-all duration-500 overflow-hidden outline-none",
                    isDark 
                        ? "bg-slate-900 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]" 
                        : "bg-amber-50 border border-amber-200/50 shadow-[0_4px_12px_-2px_rgba(251,191,36,0.1)]"
                )}
            >
                {/* Background Sparkle elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Sparkles className={cn(
                        "absolute top-1 left-1 h-2 w-2 transition-transform duration-1000",
                        isDark ? "text-indigo-400 rotate-45 scale-110" : "text-amber-400 rotate-0 scale-75"
                    )} />
                    <div className={cn(
                        "absolute bottom-2 right-4 h-1 w-1 rounded-full transition-all duration-700",
                        isDark ? "bg-indigo-300 scale-150" : "bg-amber-300 scale-50"
                    )} />
                </div>

                {/* Sliding Track Indicator */}
                <motion.div
                    initial={false}
                    animate={{
                        x: isDark ? 40 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                    }}
                    className={cn(
                        "h-full w-8 rounded-xl shadow-lg flex items-center justify-center z-20 relative",
                        isDark 
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                            : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                    )}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDark ? "moon" : "sun"}
                            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Static Background Icons */}
                <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none z-10">
                    <Sun className={cn(
                        "h-4 w-4 transition-all duration-500",
                        isDark ? "text-slate-700 opacity-40 translate-x-2" : "text-amber-500 opacity-0 -translate-x-4"
                    )} />
                    <Moon className={cn(
                        "h-4 w-4 transition-all duration-500",
                        isDark ? "text-indigo-400 opacity-0 translate-x-4" : "text-slate-300 opacity-40 -translate-x-2"
                    )} />
                </div>
            </button>
        </div>
    );
}
