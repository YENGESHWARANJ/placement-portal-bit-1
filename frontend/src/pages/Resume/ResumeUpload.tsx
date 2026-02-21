import { useState } from "react";
import { Link } from "react-router-dom";
import DropZone from "../../features/resume/components/DropZone";
import AnalysisMock from "../../features/resume/components/AnalysisMock";
import ResumeAnalysis from "../../features/resume/components/ResumeAnalysis";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Zap, Binary } from "lucide-react";

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await api.post<{ success: boolean; data: any; message?: string; isOCR?: boolean }>("/resume/scan", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success && res.data.data) {
                setResult(res.data.data);
                toast.success("Intelligence Cache Updated!", { icon: "🧠" });

                try {
                    await api.post("/students/profile", {
                        skills: res.data.data.resume?.skills || [],
                        resumeScore: res.data.data.ranking?.score || 0,
                    });
                    toast.success("Biometric Profile Synchronized!", { icon: "⚡" });
                } catch (syncError) {
                    console.error("Profile sync failed:", syncError);
                }
            } else {
                toast.error(res.data?.message || "Parsing failed");
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "AI service offline. Ensure core brain is active.";
            toast.error(msg);
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in duration-700 pb-20">

            {/* Elite Header */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <Binary className="h-4 w-4 text-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 dark:text-blue-400/60">Neural Scanning Node</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                            Resume Intelligence
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-md">Distill your professional trajectory into actionable AI insights.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-[20px] border border-slate-100 dark:border-slate-700 shadow-inner">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ATS Optimized
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-[20px] border border-slate-100 dark:border-slate-700 shadow-inner">
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                            Secure Core
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-12">
                {/* Upload Area */}
                {!result && !loading && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-[45px] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="relative z-10 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[40px] hover:border-blue-500/20 transition-all duration-500">
                            <DropZone onFileSelect={handleFileSelect} />
                        </div>
                    </div>
                )}

                {/* Loading Protocol */}
                {loading && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700 bg-white dark:bg-slate-900 p-12 rounded-[45px] border border-slate-100 dark:border-slate-800 shadow-2xl text-center">
                        <AnalysisMock />
                        <div className="mt-12 space-y-3">
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter animate-pulse">
                                Orchestrating Genetic Profile Analysis...
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Please remain synchronized with the server</p>
                        </div>
                    </div>
                )}

                {/* Intelligence Report */}
                {result && !loading && result.resume && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700 relative space-y-10">

                        <div className="bg-emerald-600 dark:bg-emerald-500 p-8 rounded-[35px] shadow-2xl shadow-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform duration-500">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl italic tracking-tight">Intelligence Sequence Finalized</p>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Profile data successfully integrated into ecosystem</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => { setFile(null); setResult(null); }}
                                    className="text-[10px] font-black text-white hover:text-emerald-100 uppercase tracking-widest bg-emerald-700 dark:bg-emerald-600 px-8 py-4 rounded-[20px] transition-all hover:scale-105 active:scale-95"
                                >
                                    Recalibrate
                                </button>
                                <Link
                                    to="/companies"
                                    className="text-[10px] font-black text-emerald-600 bg-white hover:bg-emerald-50 px-8 py-4 rounded-[20px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Access Opportunities <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <ResumeAnalysis data={result} />
                        </div>
                    </div>
                )}
            </div>

            {/* Pro Tip Section */}
            {!result && (
                <div className="bg-slate-900 p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                    <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 relative z-10">
                        <Zap className="h-10 w-10 text-yellow-400 group-hover:scale-125 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-white text-xl font-black italic mb-2 tracking-tight">Career Acceleration Protocol</h4>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-2xl">
                            Our neural engine doesn't just parse text—it decodes your professional essence. High-clarity documents synchronize 40% faster and result in more accurate talent matching.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
