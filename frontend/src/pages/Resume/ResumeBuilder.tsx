import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Wand2, Download, Save, Loader2, GripVertical, ChevronRight, X, Palette, Eye } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../features/auth/AuthContext';
import { cn } from '../../utils/cn';

interface Experience {
    id: string;
    title: string;
    company: string;
    date: string;
    description: string;
}

export default function ResumeBuilder() {
    const { user } = useAuth();
    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/username',
        portfolio: 'github.com/username'
    });

    const [experiences, setExperiences] = useState<Experience[]>([
        {
            id: '1',
            title: 'Software Engineering Intern',
            company: 'Tech Corp',
            date: 'Summer 2023',
            description: 'Developed RESTful APIs using Node.js and Express.\nImproved database query performance by 25%.'
        }
    ]);

    const [skills, setSkills] = useState('React, Node.js, TypeScript, Python, AWS, MongoDB');
    const [education, setEducation] = useState({
        university: 'University of Technology',
        degree: 'B.S. Computer Science',
        date: 'Expected May 2025',
        gpa: '3.8/4.0'
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showPreviewMobile, setShowPreviewMobile] = useState(false);

    const handleOptimizeSection = async (id: string, text: string) => {
        if (!text.trim()) return;
        setIsOptimizing(id);
        try {
            const res = await api.post<{ response: string }>('/ai/chat', {
                query: `Rewrite the following resume experience bullet points to be highly ATS-friendly, impactful, and action-oriented. Use the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]). Return ONLY the optimized text, no markdown styling:\n\n${text}`
            });

            const newText = res.data.response;
            setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, description: newText } : exp));
            toast.success('Section optimized with AI! 🚀');
        } catch (err) {
            toast.error('Failed to optimize section with AI.');
        } finally {
            setIsOptimizing(null);
        }
    };

    const addExperience = () => {
        setExperiences([...experiences, { id: Date.now().toString(), title: '', company: '', date: '', description: '' }]);
    };

    const removeExperience = (id: string) => {
        setExperiences(experiences.filter(e => e.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const exportPDF = async () => {
        setIsGeneratingPdf(true);
        const element = document.getElementById('resume-preview-doc');

        // Dynamically import html2pdf only when needed
        try {
            const html2pdf = (await import('html2pdf.js')).default;

            // Assert type for image config to satisfy html2pdf typings
            const opt: any = {
                margin: 0,
                filename: `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            if (element) {
                await html2pdf().set(opt).from(element).save();
                toast.success('Resume downloaded successfully!');
            } else {
                throw new Error("Preview element not found");
            }
        } catch (err) {
            console.error("PDF Export Error:", err);
            toast.error('Failed to generate PDF.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#f8f9fa] dark:bg-[#0B0F19]">

            {/* Editor Panel */}
            <div className={cn("w-full lg:w-[480px] xl:w-[550px] border-r border-slate-200 dark:border-slate-100 bg-white dark:bg-white shadow-2xl z-10 relative flex flex-col transition-all duration-300", showPreviewMobile ? "hidden lg:flex" : "flex")}>
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-white/80 backdrop-blur-md z-20">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-slate-900 uppercase tracking-tighter italic flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-500" /> AI Auto-Resume
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowPreviewMobile(true)}
                            className="lg:hidden p-2 bg-slate-100 dark:bg-slate-50 text-slate-600 dark:text-slate-500 rounded-lg"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={exportPDF}
                            disabled={isGeneratingPdf}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Export PDF
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-slate-200 dark:border-slate-100 overflow-x-auto no-scrollbar shrink-0">
                    {['personal', 'experience', 'education', 'skills'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-base font-black uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-all ${activeTab === tab
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-600 bg-indigo-50 dark:bg-indigo-500/5'
                                : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'personal' && (
                            <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Full Name</label>
                                    <input type="text" value={personalInfo.name} onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Email</label>
                                    <input type="email" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Phone</label>
                                        <input type="text" value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                    </div>
                                    <div>
                                        <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Location</label>
                                        <input type="text" value={personalInfo.location} onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">LinkedIn</label>
                                    <input type="text" value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Portfolio / GitHub</label>
                                    <input type="text" value={personalInfo.portfolio} onChange={e => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'experience' && (
                            <motion.div key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className="p-5 bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-100 rounded-2xl relative group">
                                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => removeExperience(exp.id)} className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-slate-900 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-10">
                                            <div>
                                                <input type="text" placeholder="Job Title" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-200 px-0 py-2 text-sm font-bold focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-900 placeholder:text-slate-500" />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-200 px-0 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-900 placeholder:text-slate-500" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input type="text" placeholder="Date (e.g. Summer 2023 - Present)" value={exp.date} onChange={e => updateExperience(exp.id, 'date', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-200 px-0 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 text-slate-500 placeholder:text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                placeholder="Describe your achievements..."
                                                value={exp.description}
                                                onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                                className="w-full h-32 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-900 placeholder:text-slate-500"
                                            />
                                            <button
                                                onClick={() => handleOptimizeSection(exp.id, exp.description)}
                                                disabled={isOptimizing === exp.id || !exp.description}
                                                className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-600 hover:bg-indigo-500 hover:text-slate-900 rounded-lg text-base font-black uppercase tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {isOptimizing === exp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                                                AI Enhance
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addExperience}
                                    className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-200 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-50 hover:border-indigo-500/50 hover:text-indigo-500 dark:hover:text-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Add Experience Block
                                </button>
                            </motion.div>
                        )}

                        {activeTab === 'education' && (
                            <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">University Name</label>
                                    <input type="text" value={education.university} onChange={e => setEducation({ ...education, university: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                                <div>
                                    <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Degree / Major</label>
                                    <input type="text" value={education.degree} onChange={e => setEducation({ ...education, degree: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">Date</label>
                                        <input type="text" value={education.date} onChange={e => setEducation({ ...education, date: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                    </div>
                                    <div>
                                        <label className="text-base font-bold uppercase tracking-widest text-slate-500 mb-1 block">GPA</label>
                                        <input type="text" value={education.gpa} onChange={e => setEducation({ ...education, gpa: e.target.value })} className="w-full h-12 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-900" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'skills' && (
                            <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3 text-indigo-600 dark:text-indigo-600">
                                    <Wand2 className="h-5 w-5 shrink-0" />
                                    <p className="text-xs font-medium leading-relaxed">List your core technical and soft skills separated by commas. Our AI parsing engines prefer clean, comma-separated formats for optimal ATS ranking.</p>
                                </div>
                                <textarea
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    className="w-full h-40 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-100 rounded-xl p-5 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-900"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Live Preview Panel */}
            <div className={cn("flex-1 bg-slate-200 dark:bg-white p-4 lg:p-8 items-start lg:items-center justify-center overflow-y-auto no-scrollbar", showPreviewMobile ? "flex" : "hidden lg:flex")}>

                <div className="w-full max-w-[850px] relative flex flex-col items-center">
                    {/* Mobile Header */}
                    {showPreviewMobile && (
                        <div className="w-full flex items-center justify-between mb-4 lg:hidden sticky top-0 bg-slate-200 dark:bg-white z-20 py-2">
                            <button
                                onClick={() => setShowPreviewMobile(false)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-500 rounded-lg text-sm font-bold flex items-center gap-2"
                            >
                                <ChevronRight className="h-4 w-4 rotate-180" /> Back to Editor
                            </button>
                        </div>
                    )}

                    {/* A4 Canvas */}
                    <div
                        id="resume-preview-doc"
                        className="w-full bg-white shadow-2xl relative text-black shrink-0"
                        style={{
                            width: '8.5in',
                            minHeight: '11in',
                            padding: '0.6in 0.8in',
                            fontFamily: '"Times New Roman", Times, serif'
                        }}
                    >
                        {/* Header / Personal Info */}
                        <div className="text-center mb-6 border-b border-black pb-4">
                            <h1 className="text-[28px] font-normal tracking-wide text-black mb-1">{personalInfo.name || 'Your Name'}</h1>
                            <div className="flex flex-wrap items-center justify-center text-[10.5px] font-normal text-black gap-2">
                                <span>{personalInfo.email}</span>
                                {personalInfo.phone && <><span>|</span><span>{personalInfo.phone}</span></>}
                                {personalInfo.location && <><span>|</span><span>{personalInfo.location}</span></>}
                                {personalInfo.linkedin && <><span>|</span><span>{personalInfo.linkedin}</span></>}
                                {personalInfo.portfolio && <><span>|</span><span>{personalInfo.portfolio}</span></>}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="mb-5">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-2 border-b border-black pb-0.5">Education</h2>
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[11.5px] font-bold text-black">{education.university || 'University Name'}</h3>
                                <span className="text-[11.5px] font-normal text-black">{education.date}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-[11.5px] font-normal text-black italic">{education.degree}</p>
                                {education.gpa && <span className="text-sm font-normal text-black">GPA: {education.gpa}</span>}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="mb-5">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-2 border-b border-black pb-0.5">Experience</h2>
                            <div className="space-y-4">
                                {experiences.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="text-[11.5px] font-bold text-black">{exp.company || 'Company Name'}</h3>
                                            <span className="text-[11.5px] font-normal text-black">{exp.date}</span>
                                        </div>
                                        <p className="text-[11.5px] font-normal text-black italic mb-1.5">{exp.title || 'Role Title'}</p>

                                        <ul className="list-disc text-sm font-normal text-black ml-6 space-y-1 pl-1 leading-snug text-justify">
                                            {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                                                <li key={i}>{bullet.replace(/^[-\*\•]\s*/, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Skills */}
                        <div className="mb-5">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-2 border-b border-black pb-0.5">Skills</h2>
                            <p className="text-[11.5px] font-normal text-black leading-relaxed">
                                {skills || 'List your skills here...'}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
