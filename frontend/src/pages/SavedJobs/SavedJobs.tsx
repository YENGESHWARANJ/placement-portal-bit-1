import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Heart, Trash2, ChevronRight } from "lucide-react";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { cn } from "../../utils/cn";

export default function SavedJobs() {
    const { savedItems, removeSaved } = useSavedJobs();

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic flex items-center gap-3">
                    <Heart className="h-8 w-8 text-rose-500 fill-rose-500" aria-hidden />
                    Saved Jobs
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 italic">
                    {savedItems.length} job{savedItems.length !== 1 ? "s" : ""} saved for later
                </p>
            </div>

            {savedItems.length === 0 ? (
                <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <Briefcase className="h-16 w-16 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic mb-2">No saved jobs yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mb-6">Save jobs from Job Intel to view them here.</p>
                    <Link
                        to="/job-recommendations"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                    >
                        Browse Jobs <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedItems.map((job) => (
                        <div
                            key={job.id}
                            className={cn(
                                "flex items-center justify-between gap-4 p-6 rounded-2xl border bg-white dark:bg-slate-800/50",
                                "border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all"
                            )}
                        >
                            <Link to={`/jobs/${job.id}`} className="flex-1 min-w-0 group">
                                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {job.title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">{job.company}</p>
                            </Link>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors"
                                    aria-label={`View ${job.title}`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => removeSaved(job.id)}
                                    className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-colors"
                                    aria-label={`Remove ${job.title} from saved`}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
