import { ShieldCheck, Mail, Phone, User, FileText, Code2, Cpu, CheckCircle, ArrowRight, BookOpen, Briefcase, Zap, Star } from "lucide-react";
import { cn } from "../../../utils/cn";

interface ParsedResume {
    name: string | null;
    email: string | null;
    phone: string | null;
    skills: string[];
    education?: string[];
    experience?: string[];
    projects?: string[];
    rawPreview: string;
}

interface RankingData {
    score: number;
    match_percentage: number;
    missing_skills: string[];
    matched_skills: string[];
    feedback?: string[];
}

interface ResumeAnalysisProps {
    data: {
        resume: ParsedResume;
        ranking?: RankingData;
    };
}

export default function ResumeAnalysis({ data }: ResumeAnalysisProps) {
    if (!data || !data.resume) return null;

    const { resume, ranking } = data;
    const isExtractionFailed = resume.name === "Extraction Failed" || !resume.skills || resume.skills.length === 0;

    return (
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl mx-auto rounded-[50px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">

            {/* Neural Header */}
            <div className={cn(
                "p-12 border-b flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden",
                isExtractionFailed
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900"
                    : "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800"
            )}>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent"></div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className={cn(
                        "h-20 w-20 rounded-[28px] flex items-center justify-center shadow-2xl transition-transform duration-700 hover:rotate-6",
                        isExtractionFailed ? "bg-rose-500 text-white" : "bg-blue-600 text-white"
                    )}>
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-slate-900 mb-2 tracking-tighter">
                            Intelligence {isExtractionFailed ? "Collision" : "Report"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-500 text-base font-black uppercase tracking-[0.3em]">
                            {isExtractionFailed ? "Parsing Protocols Disrupted" : "High-Density Neural Scan Finalized"}
                        </p>
                    </div>
                </div>

                {ranking && (
                    <div className="bg-white dark:bg-slate-800 px-10 py-6 rounded-[35px] border border-slate-100 dark:border-slate-700 text-center shadow-xl relative z-10">
                        <span className="block text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Neural Match Score</span>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl font-black text-blue-600 dark:text-blue-600 tracking-tighter">{ranking.score}<span className="text-2xl opacity-50">%</span></span>
                        </div>
                    </div>
                )}
            </div>

            {isExtractionFailed && (
                <div className="bg-rose-500 p-8 text-center animate-pulse">
                    <p className="text-slate-900 text-lg font-black tracking-tight mb-2">
                        NO BIOMETRIC TEXT DETECTED
                    </p>
                    <p className="text-slate-900/80 text-base font-bold uppercase tracking-widest">
                        Document format appears non-standard or image-based. Re-upload as text-searchable PDF for high-fidelity scanning.
                    </p>
                </div>
            )}

            <div className="p-12 grid md:grid-cols-2 gap-12">
                {/* Candidate Info Card */}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 flex items-center gap-4 tracking-tight">
                        <User className="h-6 w-6 text-blue-500" />
                        Genetic Profile
                    </h3>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 space-y-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 shadow-sm hover:shadow-xl">
                        <div className="flex flex-col border-b border-slate-200 dark:border-slate-700 pb-5">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Full Identity</span>
                            <span className="font-black text-2xl text-slate-900 dark:text-slate-900 tracking-tighter">
                                {resume.name || "N/A"}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:bg-blue-600 group-hover:text-slate-900 transition-all">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Email Access</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-500">{resume.email || "N/A"}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Comm Node</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-500">{resume.phone || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Analysis */}
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 flex items-center gap-4 tracking-tight">
                        <Cpu className="h-6 w-6 text-purple-500" />
                        Technical Sphere
                    </h3>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 min-h-[300px] flex flex-wrap gap-3 items-start shadow-sm">
                        {resume.skills && resume.skills.length > 0 ? (
                            resume.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-500 border border-slate-100 dark:border-slate-700 rounded-2xl text-base font-black uppercase tracking-widest hover:border-blue-500/50 hover:scale-110 transition-all cursor-default shadow-sm"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-center py-10">
                                <Code2 className="h-12 w-12 text-slate-200 mb-4" />
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No Competencies Identified</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-4">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Verified against global tech stack
                    </div>
                </div>

                {/* EXPERIENCE SECTION */}
                {resume.experience && resume.experience.length > 0 && (
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 flex items-center gap-4 tracking-tight">
                            <Briefcase className="h-6 w-6 text-blue-500" />
                            Professional Timeline
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[45px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl"></div>
                            <ul className="space-y-6 relative z-10">
                                {resume.experience.map((exp, i) => (
                                    <li key={i} className="flex items-start gap-6 group">
                                        <div className="mt-2 h-3 w-3 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-150 transition-transform duration-500" />
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-500 leading-relaxed">{exp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* AI FEEDBACK SECTION */}
                {ranking && ranking.feedback && ranking.feedback.length > 0 && (
                    <div className="col-span-1 md:col-span-2 space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 flex items-center gap-4 tracking-tight">
                            <Zap className="h-6 w-6 text-yellow-500" />
                            Intelligence Refinement Protocol
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {ranking.feedback.map((tip, i) => (
                                <div key={i} className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-8 rounded-[35px] flex gap-6 items-start hover:scale-[1.02] transition-transform duration-500">
                                    <div className="shrink-0 h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-yellow-100/80 leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* RAW DATA DRAWER */}
            <div className="bg-slate-900 p-12">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-4 tracking-tight">
                        <FileText className="h-5 w-5 text-slate-500" />
                        Neural Data Stream
                    </h3>
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-slate-600">Encrypted Extraction Preview</span>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl text-base text-slate-500 font-mono leading-relaxed h-48 overflow-y-auto custom-scrollbar border border-slate-100 shadow-inner">
                    {resume.rawPreview || "No biometric data extracted."}
                </div>
            </div>
        </div>
    );
}
