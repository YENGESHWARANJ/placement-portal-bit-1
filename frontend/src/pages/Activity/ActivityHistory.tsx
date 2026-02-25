import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Loader2 } from "lucide-react";
import api from "../../services/api";

interface ActionLog {
    _id: string;
    action: string;
    description: string;
    createdAt: string;
}

export default function ActivityHistory() {
    const [activities, setActivities] = useState<ActionLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fetchingMore, setFetchingMore] = useState(false);

    useEffect(() => {
        fetchActivities(1);
    }, []);

    const fetchActivities = async (pageNumber: number) => {
        if (pageNumber === 1) setLoading(true);
        else setFetchingMore(true);

        try {
            const res = await api.get<{ activities: ActionLog[], totalPages: number }>(`/activity/my-activity?page=${pageNumber}&limit=10`);
            if (pageNumber === 1) {
                setActivities(res.data.activities);
            } else {
                setActivities((prev) => [...prev, ...res.data.activities]);
            }
            setTotalPages(res.data.totalPages || 1);
            setPage(pageNumber);
        } catch (err) {
            console.error("Failed to load activity", err);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-apple-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-apple-gray-900 tracking-tight">Activity Log</h1>
                <p className="text-apple-gray-500 mt-2">Track all your interactions and updates.</p>
            </header>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-apple-gray-100">
                {activities.length === 0 ? (
                    <div className="text-center py-12 text-apple-gray-400">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activities.map((log) => (
                            <motion.div
                                key={log._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 p-4 rounded-xl hover:bg-apple-gray-50 transition-colors border border-transparent hover:border-apple-gray-100"
                            >
                                <div className="mt-1 flex gap-4 w-full">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-apple-blue/10 text-apple-blue shrink-0">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[14px] font-bold text-apple-gray-900">{log.action}</p>
                                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-apple-gray-400 py-1 px-2.5 rounded-full bg-apple-gray-100">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(log.createdAt).toLocaleString(undefined, {
                                                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-apple-gray-500">{log.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {page < totalPages && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => fetchActivities(page + 1)}
                                    disabled={fetchingMore}
                                    className="px-6 py-2.5 text-sm font-semibold rounded-full bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {fetchingMore ? "Loading..." : "Load Older Activity"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
