import React from "react";
import { Link } from "react-router-dom";
import {
    Briefcase,
    Heart,
    Trash2,
    ChevronRight,
    Zap,
    Clock,
    Rocket,
    Activity,
    Compass,
    ShieldCheck,
    Layers,
    Cpu,
    ArrowUpRight,
    Search,
    Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { cn } from "../../utils/cn";
import { toast } from "react-hot-toast";

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function SavedJobs() {
    const { savedItems, removeSaved } = useSavedJobs();

    const handleRemove = (id: string, title: string) => {
        removeSaved(id);
        toast.success(`${title} removed from favorites`, {
            style: {
                borderRadius: "16px",
                background: "#fff",
                color: "#1d1d1f",
                border: "1px solid #f5f5f7",
                fontSize: "13px",
                fontWeight: "600",
            }
        });
    };

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="flex-1 space-y-12 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="text-sm font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Favorites</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Saved Jobs</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Keep track of the roles you're most interested in.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-apple-blue/5 text-apple-blue rounded-xl border border-apple-blue/10">
                        <Bookmark className="h-4 w-4 fill-apple-blue" />
                        <span className="text-sm font-bold uppercase tracking-wider">{savedItems.length} Saved</span>
                    </div>
                </div>
            </motion.div>

            {/* Empty State or Content */}
            <div className="space-y-8">
                <AnimatePresence mode="popLayout" initial={false}>
                    {savedItems.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-32 text-center apple-card"
                        >
                            <div className="h-20 w-20 bg-apple-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-apple-gray-300">
                                <Bookmark className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight">No jobs saved yet</h3>
                            <p className="text-apple-gray-400 mt-2 font-medium max-w-xs mx-auto">Explore job recommendations and save the ones that match your skills.</p>
                            <Link
                                to="/job-recommendations"
                                className="mt-10 apple-btn-primary px-8 py-3 inline-flex items-center gap-2"
                            >
                                <span>Find Jobs</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedItems.map((job, i) => (
                                <motion.div
                                    key={job.id}
                                    variants={stagger.item}
                                    layout
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="apple-card p-8 flex flex-col justify-between group hover:shadow-apple-hover transition-all duration-500"
                                >
                                    <div>
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="h-14 w-14 bg-white border border-apple-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-apple-blue/20 transition-colors overflow-hidden">
                                                {job.logo ? (
                                                    <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                                                ) : (
                                                    <Briefcase className="h-7 w-7 text-apple-blue" />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemove(job.id, job.title)}
                                                className="p-2 text-apple-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Remove from favorites"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight line-clamp-2 md:min-h-[56px] group-hover:text-apple-blue transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm font-semibold text-apple-gray-500 mt-1 uppercase tracking-wider">
                                            {job.company}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-6">
                                            <span className="text-base font-bold px-3 py-1 bg-apple-gray-50 text-apple-gray-500 rounded-full border border-apple-gray-100 uppercase tracking-widest">
                                                {job.location || "Remote"}
                                            </span>
                                            <span className="text-base font-bold px-3 py-1 bg-apple-blue/10 text-apple-blue rounded-full border border-apple-blue/10 uppercase tracking-widest">
                                                {job.type || "Full Time"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-apple-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-apple-gray-300 uppercase tracking-widest">Salary Estimate</span>
                                            <span className="text-base font-bold text-apple-gray-900 tracking-tight">{job.salary || "$120k - $150k"}</span>
                                        </div>
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="h-11 w-11 bg-apple-gray-50 border border-apple-gray-100 rounded-xl flex items-center justify-center text-apple-gray-400 hover:bg-apple-blue hover:text-slate-900 hover:border-apple-blue transition-all group/btn"
                                        >
                                            <ArrowUpRight className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Recommendation Banner */}
            {savedItems.length > 0 && (
                <motion.div variants={stagger.item} className="apple-card p-10 bg-apple-blue relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Looking for more matches?</h3>
                            <p className="text-slate-900/70 font-medium mt-1">Our AI engine has identified 5 new roles that match your skills.</p>
                        </div>
                        <Link
                            to="/job-recommendations"
                            className="bg-white text-apple-blue px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            View New Matches
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
