import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DropZone from "../../features/resume/components/DropZone";
import AnalysisMock from "../../features/resume/components/AnalysisMock";
import ResumeAnalysis from "../../features/resume/components/ResumeAnalysis";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Zap, Binary, ChevronRight, Activity, Cpu } from "lucide-react";
import { cn } from "../../utils/cn";

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

            {/* Elite Header - Neural Scanning Node UPGRADE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-[#0A0C1B] rounded-[60px] p-16 text-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] group border border-white/5"
            >
                <div className="absolute top-0 right-0 p-80 bg-blue-600/10 rounded-full blur-[150px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-[3000ms]"></div>
                <div className="absolute bottom-0 left-0 p-60 bg-indigo-600/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>

                {/* Visual Scanner Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-5 mb-10">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1, boxShadow: "0 0 40px rgba(59,130,246,0.5)" }}
                                className="h-20 w-20 rounded-[35px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl border border-white/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                <Binary className="h-10 w-10 text-white relative z-10" />
                            </motion.div>
                            <div>
                                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-blue-400 italic">Neural Scanning Node</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Status: SYNCHRONIZED_STABLE</p>
                            </div>
                        </div>

                        <h1 className="text-8xl font-black tracking-[-0.08em] leading-[0.85] mb-12 uppercase italic">
                            RESUME{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]">
                                INTELLIGENCE
                            </span>
                        </h1>
                        <p className="text-slate-400 text-2xl font-bold leading-tight max-w-2xl italic">
                            Distill your professional trajectory into <span className="text-white italic underline decoration-blue-500 decoration-4 underline-offset-8">actionable AI insights</span>.
                        </p>
                    </div>

                    <div className="hidden lg:flex gap-10 shrink-0">
                        {[
                            { label: 'ATS_SYNC', value: '100%', icon: ShieldCheck, color: 'text-emerald-400' },
                            { label: 'CORE_CACHE', value: 'SECURE', icon: Binary, color: 'text-blue-400' }
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -15, backgroundColor: "rgba(255,255,255,0.08)" }}
                                className="bg-white/5 border border-white/10 p-12 rounded-[50px] text-center min-w-[200px] backdrop-blur-3xl shadow-3xl relative overflow-hidden group/stat"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                                <s.icon className={cn("h-8 w-8 mx-auto mb-6 transition-transform group-hover/stat:scale-125", s.color)} />
                                <p className="text-5xl font-black tracking-tighter italic mb-2 text-white drop-shadow-lg">{s.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-12">
                {/* Upload Area */}
                {!result && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-premium p-10 rounded-[60px] shadow-[0_40px_100px_rgba(59,130,246,0.1)] border border-white/5 overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -top-40 -right-40 p-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                        <div className="relative z-10 border-4 border-dashed border-white/5 rounded-[50px] hover:border-blue-500/30 transition-all duration-700 bg-black/20 backdrop-blur-3xl p-4">
                            <DropZone onFileSelect={handleFileSelect} />
                        </div>
                    </motion.div>
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
