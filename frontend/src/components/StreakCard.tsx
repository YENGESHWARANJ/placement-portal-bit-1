import React from "react";
import { Flame } from "lucide-react";
import { useStreak } from "../hooks/useStreak";

export function StreakCard() {
    const { streak } = useStreak();

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Flame className="h-5 w-5 text-amber-600 dark:text-amber-600 fill-amber-500 dark:fill-amber-400" aria-hidden />
            </div>
            <div>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none">{streak} day streak</p>
                <p className="text-base font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">Keep it up!</p>
            </div>
        </div>
    );
}
