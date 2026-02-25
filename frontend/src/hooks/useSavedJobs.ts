import { useState, useCallback, useEffect } from "react";
import api from "../services/api";

const STORAGE_KEY = "placement_saved_jobs";

export interface SavedJobItem {
    id: string;
    title: string;
    company: string;
    logo?: string;
    location?: string;
    type?: string;
    salary?: string;
}

function loadSavedFromStorage(): SavedJobItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveToStorage(items: SavedJobItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useSavedJobs() {
    const [savedItems, setSavedItems] = useState<SavedJobItem[]>([]);
    const [synced, setSynced] = useState(false);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await api.get<{ savedJobs: SavedJobItem[] }>("/students/saved-jobs");
                const list = res.data?.savedJobs || [];
                setSavedItems(list);
                saveToStorage(list);
            } catch {
                setSavedItems(loadSavedFromStorage());
            } finally {
                setSynced(true);
            }
        };
        fetchSaved();
    }, []);

    const isSaved = useCallback((id: string) => savedItems.some((s) => s.id === id), [savedItems]);

    const toggleSave = useCallback(
        async (job: { _id: string; title?: string; company?: string; logo?: string; location?: string; type?: string; salary?: string }) => {
            const id = job._id;
            const title = job.title ?? "Untitled";
            const company = job.company ?? "Unknown";
            const logo = job.logo;
            const location = job.location;
            const type = job.type;
            const salary = job.salary;

            let wasRemoved = false;
            setSavedItems((prev) => {
                const exists = prev.some((s) => s.id === id);
                wasRemoved = exists;
                const next = exists
                    ? prev.filter((s) => s.id !== id)
                    : [...prev, { id, title, company, logo, location, type, salary }];
                saveToStorage(next);
                return next;
            });

            try {
                if (wasRemoved) {
                    await api.delete(`/students/saved-jobs/${id}`);
                } else {
                    await api.post("/students/saved-jobs", { jobId: id });
                }
            } catch {
                setSavedItems(loadSavedFromStorage());
            }
        },
        []
    );

    const removeSaved = useCallback(async (id: string) => {
        setSavedItems((prev) => {
            const next = prev.filter((s) => s.id !== id);
            saveToStorage(next);
            return next;
        });
        try {
            await api.delete(`/students/saved-jobs/${id}`);
        } catch {
            setSavedItems(loadSavedFromStorage());
        }
    }, []);

    return { savedItems, isSaved, toggleSave, removeSaved, synced };
}
