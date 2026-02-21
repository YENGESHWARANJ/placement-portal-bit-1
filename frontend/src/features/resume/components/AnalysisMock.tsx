import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, Cpu, Database, Fingerprint, ShieldCheck } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function AnalysisMock() {
    const [steps, setSteps] = useState([
        { label: "Deconstructing Bio-Neural Data", status: "pending", icon: Fingerprint },
        { label: "Analyzing Technical Sphere", status: "pending", icon: Cpu },
        { label: "Validating Format Compliance", status: "pending", icon: ShieldCheck },
        { label: "Synchronizing Intelligence Cache", status: "pending", icon: Database },
    ]);

    useEffect(() => {
        let currentStep = 0;

        const interval = setInterval(() => {
            setSteps((prev) => {
                const newSteps = [...prev];
                if (currentStep < newSteps.length) {
                    if (currentStep > 0) newSteps[currentStep - 1].status = "completed";
                    newSteps[currentStep].status = "processing";
                    currentStep++;
                    return [...newSteps];
                } else {
                    newSteps[newSteps.length - 1].status = "completed";
                    clearInterval(interval);
                    return [...newSteps];
                }
            });
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    const completedCount = steps.filter(s => s.status === "completed").length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <div className="bg-transparent p-4 max-w-xl mx-auto italic">

            <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Neural Progress</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-50 dark:border-slate-800">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className={cn(
                            "flex items-center gap-6 p-5 rounded-[25px] border transition-all duration-500",
                            step.status === "completed" ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50" :
                                step.status === "processing" ? "bg-white dark:bg-slate-900 border-blue-500/30 shadow-xl shadow-blue-500/5 rotate-1" :
                                    "bg-slate-50/50 dark:bg-slate-800/20 border-transparent opacity-40"
                        )}>
                            <div className="relative">
                                {step.status === "completed" ? (
                                    <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                ) : step.status === "processing" ? (
                                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col text-left">
                                <span className={cn(
                                    "text-sm font-black uppercase tracking-tight italic",
                                    step.status === "pending" ? "text-slate-400" :
                                        step.status === "processing" ? "text-blue-600 dark:text-blue-400" :
                                            "text-emerald-700 dark:text-emerald-400"
                                )}>
                                    {step.label}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    {step.status === "completed" ? "Successfully Processed" :
                                        step.status === "processing" ? "Active Execution" :
                                            "Waiting for sequence"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
