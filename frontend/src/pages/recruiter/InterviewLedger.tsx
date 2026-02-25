import React, { useEffect, useState } from 'react';
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Sparkles,
    User,
    Briefcase,
    Brain,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterviews } from '../../services/recruiter.service';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';

const stagger = {
    container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, damping: 25, stiffness: 200 }
        }
    }
};

export default function InterviewLedger() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const data = await getInterviews();
            setInterviews(data);
        } catch (error) {
            toast.error("Unable to sync interview protocol");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Evaluation Ledger...</p>
        </div>
    );

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20"
        >
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight leading-none mb-3">Interview Ledger</h1>
                    <p className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em]">Unified Feedback & Scheduling Intelligence</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="shrink-0 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {interviews.filter(i => i.status === 'Completed').length} Completed
                    </div>
                    <div className="shrink-0 bg-apple-blue/5 text-apple-blue px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-apple-blue/10 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {interviews.filter(i => i.status === 'Scheduled').length} Upcoming
                    </div>
                </div>
            </motion.div>

            {interviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-apple-gray-100 shadow-sm border-dashed">
                    <div className="h-20 w-20 bg-apple-gray-50 rounded-[28px] flex items-center justify-center mb-8">
                        <Users className="h-10 w-10 text-apple-gray-200" />
                    </div>
                    <p className="text-[11px] font-black text-apple-gray-400 uppercase tracking-[0.4em]">No interview records found</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {interviews.map((interview) => (
                        <motion.div
                            key={interview._id}
                            variants={stagger.item}
                            className="apple-card group hover:shadow-apple-hover transition-all duration-500 border border-apple-gray-50 bg-white overflow-hidden flex flex-col lg:flex-row p-1"
                        >
                            {/* Left Section: Status & Time */}
                            <div className={cn(
                                "lg:w-72 p-10 flex flex-col justify-center items-center text-center gap-6 rounded-[30px] transition-colors relative h-full",
                                interview.status === 'Completed' ? "bg-emerald-50/20" : "bg-apple-blue/5"
                            )}>
                                <div className={cn(
                                    "h-20 w-20 rounded-[24px] flex items-center justify-center shadow-inner border border-white",
                                    interview.status === 'Completed' ? "bg-white text-emerald-500" : "bg-white text-apple-blue"
                                )}>
                                    {interview.status === 'Completed' ? <CheckCircle2 className="h-10 w-10" /> : <Clock className="h-10 w-10" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-apple-gray-300">Scheduled Intelligence</p>
                                    <p className="text-lg font-black text-apple-gray-900 tracking-tight">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                                    <p className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest">{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className={cn(
                                    "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                    interview.status === 'Completed' ? "bg-emerald-500 text-white border-emerald-400" : "bg-apple-blue text-white border-apple-blue-dark"
                                )}>
                                    {interview.status}
                                </div>
                            </div>

                            {/* Center Section: Details */}
                            <div className="flex-1 p-10 flex flex-col justify-between space-y-8">
                                <div>
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-6 w-6 rounded-lg bg-apple-blue/10 flex items-center justify-center text-apple-blue">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-apple-blue">Enterprise Selection</p>
                                            </div>
                                            <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight leading-tight">
                                                {interview.jobId.title} <span className="text-apple-gray-300 font-medium">@</span> {interview.jobId.company}
                                            </h3>
                                        </div>
                                        <div className="md:text-right space-y-3">
                                            <div className="flex items-center gap-3 md:justify-end">
                                                <div className="h-6 w-6 rounded-lg bg-apple-gray-100 flex items-center justify-center text-apple-gray-400">
                                                    <User className="h-3.5 w-3.5" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-apple-gray-300">Target Talent</p>
                                            </div>
                                            <p className="text-lg font-black text-apple-gray-900 tracking-tight">{interview.studentId.name}</p>
                                            <p className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest">{interview.studentId.branch}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-5 mt-10">
                                        <div className="flex items-center gap-4 px-5 py-3 bg-apple-gray-50/50 rounded-2xl border border-apple-gray-100 group-hover:bg-white transition-colors">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-apple-gray-400 shadow-sm border border-apple-gray-100">
                                                {interview.mode === 'Virtual' ? <Video className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-apple-gray-300 leading-none mb-1">Format</p>
                                                <p className="text-[11px] font-black text-apple-gray-900">{interview.mode} - {interview.type}</p>
                                            </div>
                                        </div>
                                        {interview.link && interview.status === 'Scheduled' && (
                                            <a href={interview.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-apple-gray-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all font-black uppercase tracking-widest text-[11px] w-full sm:w-auto justify-center">
                                                Join Command Center <Sparkles className="h-4 w-4 text-apple-blue" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* AI Comparison / Feedback Hub */}
                                {interview.status === 'Completed' && interview.feedback && (
                                    <div className="pt-10 border-t border-apple-gray-50 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Brain className="h-4 w-4 text-purple-500" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">Neural Sync Analysis</p>
                                        </div>
                                        <div className="bg-apple-gray-50 p-6 rounded-2xl border border-apple-gray-100/50 relative overflow-hidden group-hover:bg-white transition-colors">
                                            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 opacity-50" />
                                            <p className="text-[13px] text-apple-gray-700 font-bold leading-relaxed relative z-10 italic">
                                                "{interview.aiComparison || "Candidate analysis synchronized with baseline performance metrics. Reliability index: High."}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Section: Core Metrics */}
                            {interview.status === 'Completed' && (
                                <div className="lg:w-64 p-10 bg-apple-gray-900 text-white flex flex-col justify-center items-center text-center rounded-[30px] m-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-apple-gray-500 mb-6">Aggregate Evaluatory Score</p>
                                    <div className="relative">
                                        <svg className="h-24 w-24 sm:h-32 sm:w-32 transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-apple-gray-800" />
                                            <circle
                                                cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray="264"
                                                strokeDashoffset={264 - (264 * (interview.feedback.overallScore * 10)) / 100}
                                                className="text-apple-blue transition-all duration-1500 stroke-round"
                                                style={{ strokeLinecap: 'round' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none">{interview.feedback.overallScore}</span>
                                            <span className="text-[8px] sm:text-[9px] font-black text-apple-gray-500 uppercase tracking-widest mt-1">/ 10 PTS</span>
                                        </div>
                                    </div>
                                    <button className="mt-8 sm:mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-apple-blue hover:text-white transition-all group/btn">
                                        View Dossier <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
