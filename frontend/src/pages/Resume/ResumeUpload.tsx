import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DropZone from "../../features/resume/components/DropZone";
import AnalysisMock from "../../features/resume/components/AnalysisMock";
import ResumeAnalysis from "../../features/resume/components/ResumeAnalysis";
import ResumePrepQuestions from "../../features/resume/components/ResumePrepQuestions";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Zap, Binary, Activity, Target } from "lucide-react";
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
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in zoom-in duration-700 pb-20">

            {/* Premium AI Header Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-[40px] p-10 lg:p-14 shadow-2xl shadow-indigo-900/20 group border border-slate-800"
            >
                {/* Glow & Backdrop Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -mr-40 -mt-40 transition-all duration-[2000ms] group-hover:bg-blue-400/25 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">
                    <div className="max-w-2xl w-full text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row items-center gap-5 mb-8">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.05 }}
                                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/20 shrink-0"
                            >
                                <Binary className="h-8 w-8 text-white relative z-10" />
                            </motion.div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1">
                                    Neural Content Scanner
                                </p>
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Ready & Synchronized</p>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-white">
                            Resume{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Intelligence
                            </span>
                        </h1>
                        <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Distill your professional trajectory into actionable insights. Optimize for modern ATS pipelines and immediately track your readiness vector.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-6 shrink-0 justify-center lg:justify-end overflow-visible">
                        {[
                            { label: 'ATS Validation', value: '100%', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/30' },
                            { label: 'Cloud Scan', value: 'Secure', icon: Activity, color: 'text-blue-400', border: 'border-blue-500/30' }
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className={cn("bg-white/5 border p-7 rounded-[30px] text-center min-w-[160px] backdrop-blur-xl shadow-xl transition-all duration-300 relative group/stat overflow-hidden", s.border)}
                            >
                                <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none">
                                    <s.icon className={cn("h-32 w-32 -mt-6 -mr-6 transition-transform group-hover/stat:rotate-12", s.color)} />
                                </div>
                                <s.icon className={cn("h-7 w-7 mx-auto mb-4 relative z-10", s.color)} />
                                <p className="text-3xl font-black tracking-tight text-white relative z-10">{s.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1.5 relative z-10">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-10">
                {/* Upload Section */}
                {!result && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 lg:p-12 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100/50 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none" />
                        <div className="relative z-10 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/50 transition-all duration-500 rounded-[30px] p-2">
                            <DropZone onFileSelect={handleFileSelect} />
                        </div>
                    </motion.div>
                )}

                {/* Loading Protocol */}
                {loading && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700 bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <AnalysisMock />
                            <div className="mt-12 space-y-3">
                                <p className="text-xl font-black text-slate-900 tracking-tight animate-pulse">
                                    Orchestrating Deep Neural Analysis...
                                </p>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Extracting vital metrics & capabilities</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Intelligence Report Results */}
                {result && !loading && result.resume && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700 relative space-y-10">

                        <div className="bg-emerald-600 p-8 lg:p-10 rounded-[35px] shadow-2xl shadow-emerald-500/20 flex flex-col lg:flex-row justify-between items-center gap-8 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
                                <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform duration-500 shrink-0 border border-white/20">
                                    <Sparkles className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-2xl tracking-tight mb-1">Intelligence Finalized</p>
                                    <p className="text-emerald-100 text-sm font-semibold">Biometric profile data integrated seamlessly.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 relative z-10">
                                <button
                                    onClick={() => { setFile(null); setResult(null); }}
                                    className="w-full sm:w-auto text-sm font-black text-white bg-emerald-700 hover:bg-emerald-800 px-8 py-4 rounded-full transition-all active:scale-95 text-center"
                                >
                                    Recalibrate
                                </button>
                                <Link
                                    to="/companies"
                                    className="w-full sm:w-auto text-sm font-black text-emerald-700 bg-white hover:bg-emerald-50 px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
                                >
                                    Open Global Markets <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <ResumeAnalysis data={result} />
                        </div>

                        {/* PREP RECOMMENDATIONS */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <ResumePrepQuestions skills={result.resume?.skills || []} />
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Informational Sub-Banner */}
            {!result && (
                <div className="bg-white border border-slate-200 p-8 lg:p-10 rounded-[35px] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-lg shadow-slate-100/50">
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-20 -mb-20 pointer-events-none"></div>
                    
                    <div className="h-20 w-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shrink-0 relative z-10">
                        <Zap className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-slate-900 text-xl font-black mb-3 tracking-tight">Accelerate Your Trajectory</h4>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-2xl">
                            Our proprietary systems don't just parse text—they decode your raw professional value. Clear, well-structured documents synchronize 40% faster and yield remarkably higher matching fidelity.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

