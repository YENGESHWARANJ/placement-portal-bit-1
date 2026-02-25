import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import JobForm from "../../features/jobs/components/JobForm";
import JobPreview from "../../features/jobs/components/JobPreview";
import Button from "../../components/ui/Button";
import { createJob, getJobById, updateJob } from "../../services/job.service";
import api from "../../services/api";
import { Sparkles, Wand2, ArrowLeft, Target, Cpu, Activity, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";

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

export default function JobPosting() {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const isEditMode = Boolean(jobId);

    const [formData, setFormData] = useState({
        title: "",
        company: "Tech Corp", // Default
        location: "",
        ctc: "",
        deadline: "",
        description: "",
        requirements: "",
        type: "Full-time",
    });

    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode && jobId) {
            const fetchJob = async () => {
                try {
                    const data = await getJobById(jobId);
                    if (data && data.job) {
                        const job = data.job;
                        setFormData({
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            ctc: job.salary,
                            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
                            description: job.description,
                            requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements,
                            type: job.type
                        });
                    }
                } catch (err) {
                    toast.error("Failed to load job details");
                    navigate("/jobs/my");
                }
            };
            fetchJob();
        }
    }, [isEditMode, jobId, navigate]);

    // Generate Job Details with AI
    const handleAIFill = async () => {
        if (!formData.title) {
            toast.error("Please enter a job title");
            return;
        }

        setGenerating(true);
        try {
            const resData = await api.post<{ description: string; requirements: string; salary: string }>("/ai/generate-job", { title: formData.title });
            const { description, requirements, salary } = resData.data;

            setFormData(prev => ({
                ...prev,
                description: description,
                requirements: requirements,
                ctc: salary,
                location: prev.location || "Hybrid / Remote"
            }));

            toast.success("Job intelligence generated", { icon: "✨" });
        } catch (err) {
            toast.error("Generation failed");
        } finally {
            setGenerating(false);
        }
    };

    const handlePostJob = async () => {
        setLoading(true);
        setError("");

        try {
            const payload = {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                type: formData.type,
                salary: formData.ctc,
                description: formData.description,
                requirements: typeof formData.requirements === 'string'
                    ? formData.requirements.split(/[\n,]+/).map(req => req.trim()).filter(Boolean)
                    : formData.requirements,
                deadline: formData.deadline
            };

            if (isEditMode && jobId) {
                await updateJob(jobId, payload);
                toast.success("Blueprint updated");
            } else {
                await createJob(payload);
                toast.success("Job broadcasted");
            }
            navigate("/jobs/my");

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Operational node failure");
            toast.error("Failed to save blueprint");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="pb-20 space-y-12 mt-4"
        >
            <motion.div
                variants={stagger.item}
                className="flex flex-col md:flex-row md:items-center justify-between gap-10"
            >
                <div className="flex items-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#f2f2f7' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/jobs/my")}
                        className="h-14 w-14 rounded-2xl bg-white border border-apple-gray-100 flex items-center justify-center shadow-sm text-apple-gray-400 hover:text-apple-blue transition-all"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </motion.button>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-apple-gray-900 tracking-tight leading-none mb-4">
                            {isEditMode ? "Modify Opportunity" : "Architect Job"}
                        </h1>
                        <p className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em]">
                            Recruitment Structural Module // v2.0
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAIFill}
                    disabled={generating}
                    className="flex items-center gap-3 bg-apple-gray-900 text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-apple-hover disabled:opacity-50 transition-all border border-black/10"
                >
                    {generating ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Synthesizing...
                        </>
                    ) : (
                        <>
                            <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
                            Auto-Fill Inteligences
                        </>
                    )}
                </motion.button>
            </motion.div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-[24px] text-[13px] font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="apple-card p-12 bg-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-apple-blue/5 rounded-full blur-[60px] -ml-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-apple-gray-400">Blueprint Declaration</h3>
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>

                    <JobForm formData={formData} setFormData={setFormData} />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePostJob}
                        disabled={loading}
                        className="w-full mt-12 bg-apple-blue text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-apple-hover border border-white/10 transition-all"
                    >
                        {loading ? "Transmitting..." : (isEditMode ? "Synchronize Blueprint" : "Broadcast Opportunity")}
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:sticky lg:top-10 space-y-8"
                >
                    <div className="apple-card p-12 bg-apple-gray-50/50 border border-apple-gray-100 border-dashed relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="text-xl font-black text-apple-gray-900 tracking-tight">Live Perspective</h3>
                            </div>
                            <span className="text-[9px] font-black text-apple-gray-300 uppercase tracking-[0.2em]">Student Viewport</span>
                        </div>

                        <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                            <JobPreview data={formData} />
                        </div>
                    </div>

                    <div className="apple-card p-8 bg-white flex items-center gap-5 border border-apple-gray-100">
                        <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-apple-gray-900">Preview Resonance</p>
                            <p className="text-[9px] font-bold text-apple-gray-400 uppercase tracking-tight mt-1">Real-time Synchronization Active</p>
                        </div>
                        <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Add simple CSS for dashed border visualization if needed or rely on Tailwind
// .dashed-border { border-style: dashed; }
