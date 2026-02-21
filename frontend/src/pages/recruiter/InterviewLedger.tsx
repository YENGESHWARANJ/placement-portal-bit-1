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
    Brain
} from 'lucide-react';
import { getInterviews } from '../../services/recruiter.service';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';

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
            toast.error("Failed to load interview ledger");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse italic font-black uppercase tracking-widest">Loading Ledger...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
                        Interview Ledger <span className="text-indigo-600">Protocol</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Unified Feedback & Scheduling Intelligence</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {interviews.filter(i => i.status === 'Completed').length} Completed
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {interviews.filter(i => i.status === 'Scheduled').length} Upcoming
                    </div>
                </div>
            </div>

            {interviews.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No interview records found in the protocol.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {interviews.map((interview) => (
                        <div key={interview._id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row">
                            {/* Left Side: Status & Time */}
                            <div className={cn(
                                "md:w-64 p-6 flex flex-col justify-center items-center text-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 transition-colors",
                                interview.status === 'Completed' ? "bg-emerald-50/30" : "bg-blue-50/30"
                            )}>
                                <div className={cn(
                                    "h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white",
                                    interview.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {interview.status === 'Completed' ? <CheckCircle2 className="h-8 w-8" /> : <Clock className="h-8 w-8" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled Date</p>
                                    <p className="font-black text-slate-900 italic">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    interview.status === 'Completed' ? "bg-emerald-500 text-white border-emerald-400" : "bg-indigo-500 text-white border-indigo-400"
                                )}>
                                    {interview.status}
                                </div>
                            </div>

                            {/* Center: Details */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Briefcase className="h-4 w-4 text-indigo-500" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Opportunity</p>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">
                                                {interview.jobId.title} @ <span className="text-slate-500">{interview.jobId.company}</span>
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 mb-1 justify-end">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate</p>
                                            </div>
                                            <p className="font-bold text-slate-900 italic uppercase tracking-tighter">{interview.studentId.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{interview.studentId.branch}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-6">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100">
                                                {interview.mode === 'Virtual' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Format</p>
                                                <p className="text-xs font-black italic">{interview.mode} - {interview.type}</p>
                                            </div>
                                        </div>
                                        {interview.link && interview.status === 'Scheduled' && (
                                            <a href={interview.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all font-black uppercase tracking-widest text-[10px] italic">
                                                Join Meeting Protocol
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom: AI Comparison / Feedback Preview */}
                                {interview.status === 'Completed' && interview.feedback && (
                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Brain className="h-4 w-4 text-purple-600" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                                                AI Sync Comparison
                                                <span className="h-1 w-1 rounded-full bg-purple-300 animate-ping" />
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100/50">
                                            <p className="text-xs text-purple-900 font-bold italic leading-relaxed">
                                                "{interview.aiComparison || "Candidate analysis synchronized with baseline mock interview scores. Reliability index: High."}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Score Summary */}
                            {interview.status === 'Completed' && (
                                <div className="md:w-56 p-6 bg-slate-900 text-white flex flex-col justify-center items-center text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Final Evaluation</p>
                                    <div className="relative">
                                        <svg className="h-24 w-24 transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                            <circle
                                                cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 - (251.2 * (interview.feedback.overallScore * 10)) / 100}
                                                className="text-indigo-500 transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black italic">{interview.feedback.overallScore}</span>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Score / 10</span>
                                        </div>
                                    </div>
                                    <button className="mt-6 flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors group/btn">
                                        Full Dossier <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
