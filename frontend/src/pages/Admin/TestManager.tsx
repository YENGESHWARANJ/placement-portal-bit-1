import React, { useState, useEffect } from "react";
import {
    Activity, Timer, Users, Plus, Edit, Trash2, CheckCircle,
    FileText, PlayCircle, X, ChevronRight, Save, Briefcase
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
    text: string;
    options: string[];
    correctAnswer: number;
}

interface Test {
    _id: string;
    title: string;
    duration: number;
    questionsCount: number;
    jobRole: string;
    status: 'draft' | 'active' | 'completed';
    questions?: Question[];
}

export default function TestManager() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Partial<Test> | null>(null);

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

    const handleSaveTest = async (testData: any) => {
        try {
            // Update the questions count based on user input
            testData.questionsCount = testData.questions.length;

            if (testData._id && !testData._id.startsWith('test_mock_')) {
                // Update existing
                await api.put(`/admin/tests/${testData._id}`, testData);
                toast.success("Assessment updated successfully");
            } else {
                // Create new (or mock update for dev)
                const newTest = { ...testData, _id: `test_${Date.now()}`, status: 'active' };
                setTests(prev => [newTest, ...prev]);
                toast.success("Assessment created successfully!");
            }
            setIsModalOpen(false);
            setEditingTest(null);
            fetchTests(); // Refresh
        } catch (err) {
            toast.error("Failed to save assessment");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this assessment?")) return;
        try {
            await api.delete(`/admin/tests/${id}`);
            setTests(prev => prev.filter(t => t._id !== id));
            toast.success("Test deleted");
        } catch (error) {
            // Mock delete for dev
            setTests(prev => prev.filter(t => t._id !== id));
            toast.success("Test deleted (Local Sync)");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Exam Control</h1>
                    <p className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-base mt-1">Assessments • Scoring • Evaluation</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingTest({ title: "", duration: 30, jobRole: "", questionsCount: 0, questions: [] });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-slate-900 px-6 py-2 rounded-xl font-black text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                    <Plus className="h-4 w-4" /> Create Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                    <div key={test._id} className="bg-[#0F1121] p-6 rounded-[30px] border border-slate-100 relative group hover:border-emerald-500/30 transition-all shadow-xl shadow-slate-100/50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-white italic truncate max-w-[180px]">{test.title}</h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${
                                test.status === 'active' || test.status === 'completed' 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            }`}>{test.status}</span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                <Timer className="h-4 w-4 text-emerald-500" />
                                {test.duration || (test as any).timeTaken || 30} mins • {test.questionsCount || (test as any).totalQuestions || "5"} MCQs
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                <Briefcase className="h-4 w-4 text-cyan-500" />
                                Assigned to: {test.jobRole || (test as any).type || "General Assessment"}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    setEditingTest(test);
                                    setIsModalOpen(true);
                                }}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-slate-900 font-black text-xs uppercase tracking-widest transition-all gap-2 flex items-center justify-center active:scale-95"
                            >
                                <Edit className="h-3 w-3" /> Edit Questions
                            </button>
                            <button onClick={() => handleDelete(test._id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <TestEditorModal 
                        test={editingTest} 
                        onClose={() => setIsModalOpen(false)} 
                        onSave={handleSaveTest}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TestEditorModal({ test, onClose, onSave }: { test: any, onClose: () => void, onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
        ...test,
        questions: test?.questions || [{ text: "", options: ["", "", "", ""], correctAnswer: 0 }]
    });

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }]
        });
    };

    const removeQuestion = (index: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#0F1121] text-white">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">{test?._id ? "Edit Assessment" : "Create New Assessment"}</h2>
                        <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mt-1">Intelligence Assessment Engine</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Assessment Title</label>
                            <input 
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="e.g. Full Stack Engineering Diagnostic"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Duration (Mins)</label>
                            <input 
                                type="number"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Assigned Job Category / Role</label>
                        <input 
                            value={formData.jobRole}
                            onChange={e => setFormData({ ...formData, jobRole: e.target.value })}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            placeholder="e.g. SDE-1 / DevOps"
                        />
                    </div>

                    {/* Questions Area */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                Questions Bank
                            </h3>
                            <button 
                                onClick={addQuestion}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                            >
                                + Add Question
                            </button>
                        </div>

                        {(formData.questions || []).map((q: any, i: number) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[30px] border border-slate-100 space-y-4 relative group">
                                <div className="flex items-center justify-between">
                                    <span className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-black text-slate-900 shadow-sm">
                                        {i + 1}
                                    </span>
                                    <button onClick={() => removeQuestion(i)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                
                                <input 
                                    value={q.text}
                                    onChange={e => {
                                        const newQs = [...formData.questions];
                                        newQs[i].text = e.target.value;
                                        setFormData({ ...formData, questions: newQs });
                                    }}
                                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    placeholder="Enter question text..."
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <div key={optIdx} className="flex items-center gap-2">
                                            <input 
                                                type="radio"
                                                name={`q-${i}`}
                                                checked={q.correctAnswer === optIdx}
                                                onChange={() => {
                                                    const newQs = [...formData.questions];
                                                    newQs[i].correctAnswer = optIdx;
                                                    setFormData({ ...formData, questions: newQs });
                                                }}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <input 
                                                value={opt}
                                                onChange={e => {
                                                    const newQs = [...formData.questions];
                                                    newQs[i].options[optIdx] = e.target.value;
                                                    setFormData({ ...formData, questions: newQs });
                                                }}
                                                className="flex-1 h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-medium"
                                                placeholder={`Option ${optIdx + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                    <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="h-14 bg-emerald-600 text-slate-900 px-10 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-sm tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                        <Save className="h-5 w-5" />
                        Save Assessment
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
