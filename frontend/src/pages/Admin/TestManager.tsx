import React, { useState, useEffect } from "react";
import {
    Activity, Timer, Users, Plus, Edit, Trash2, CheckCircle,
    FileText, PlayCircle
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Test {
    _id: string;
    title: string;
    duration: number;
    questionsCount: number;
    jobRole: string;
    status: 'draft' | 'active' | 'completed';
}

export default function TestManager() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const { data } = await api.get<{ tests: Test[] }>('/admin/tests');
            setTests(data.tests || []);
        } catch (error) {
            toast.error("Failed to fetch assessment ledger");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this assessment?")) return;
        try {
            await api.delete(`/assessments/${id}`);
            setTests(prev => prev.filter(t => t._id !== id));
            toast.success("Test deleted");
        } catch (error) {
            toast.error("Failed to delete test");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Exam Control</h1>
                    <p className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-base mt-1">Assessments • Scoring • Evaluation</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-slate-900 px-6 py-2 rounded-xl font-black text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                    <Plus className="h-4 w-4" /> Create Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                    <div key={test._id} className="bg-[#0F1121] p-6 rounded-[30px] border border-slate-100 relative group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-slate-900 italic">{test.title}</h3>
                            <span className={`px-3 py-1 rounded-lg text-base font-black uppercase tracking-widest border ${test.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                }`}>{test.status}</span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                <Timer className="h-4 w-4 text-emerald-500" />
                                {test.duration} mins • {test.questionsCount} MCQs
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                <Briefcase className="h-4 w-4 text-cyan-500" />
                                Assigned to: {test.jobRole}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-slate-900 font-black text-base uppercase tracking-widest transition-all gap-2 flex items-center justify-center">
                                <Edit className="h-3 w-3" /> Edit Questions
                            </button>
                            <button onClick={() => handleDelete(test._id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Briefcase(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
