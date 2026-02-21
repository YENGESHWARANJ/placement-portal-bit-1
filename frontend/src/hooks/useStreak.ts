import { useState, useEffect } from "react";

const STORAGE_KEY_LAST = "placement_streak_last";
const STORAGE_KEY_COUNT = "placement_streak_count";

function getToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysDiff(a: string, b: string): number {
    const d1 = new Date(a).getTime();
    const d2 = new Date(b).getTime();
    return Math.round((d2 - d1) / (24 * 60 * 60 * 1000));
}

export function useStreak() {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const today = getToday();
        const last = localStorage.getItem(STORAGE_KEY_LAST);
        let count = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) ?? "0", 10);

        if (!last) {
            count = 1;
        } else if (last !== today) {
            const diff = daysDiff(last, today);
            count = diff === 1 ? count + 1 : 1;
        }

        localStorage.setItem(STORAGE_KEY_LAST, today);
        localStorage.setItem(STORAGE_KEY_COUNT, String(count));
        setStreak(count);
    }, []);

    return { streak };
}
