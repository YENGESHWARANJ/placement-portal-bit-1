import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { cn } from "../../utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={cn(
                    "relative w-14 h-7 rounded-full cursor-pointer transition-all duration-500 p-1 flex items-center shadow-inner",
                    isDark ? "bg-slate-800" : "bg-blue-100"
                )}
            >
                {/* Icons inside track */}
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <Sun className={cn("h-3 w-3 transition-opacity duration-300", isDark ? "opacity-20 text-slate-400" : "opacity-100 text-amber-500")} />
                    <Moon className={cn("h-3 w-3 transition-opacity duration-300", isDark ? "opacity-100 text-blue-400" : "opacity-20 text-slate-400")} />
                </div>

                {/* Sliding Knob */}
                <div
                    className={cn(
                        "h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-500 flex items-center justify-center z-10",
                        isDark ? "translate-x-7" : "translate-x-0"
                    )}
                >
                    {isDark ? (
                        <Moon className="h-3 w-3 text-slate-800" />
                    ) : (
                        <Sun className="h-3 w-3 text-amber-500" />
                    )}
                </div>
            </div>
        </div>
    );
}
