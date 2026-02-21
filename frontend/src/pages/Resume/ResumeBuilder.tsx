import React, { useState } from 'react';
import {
    FileText, Download, Plus, Trash2, Sparkles,
    CheckCircle, Brain, Layout, ArrowRight, Target,
    User, Mail, Phone, MapPin, Linkedin, GraduationCap,
    Briefcase, Code2, ChevronLeft, Zap, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const STEPS = [
    { id: 1, label: 'Identity', icon: User, color: 'from-blue-500 to-indigo-600' },
    { id: 2, label: 'Education', icon: GraduationCap, color: 'from-purple-500 to-violet-600' },
    { id: 3, label: 'Experience', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
    { id: 4, label: 'Launch', icon: Zap, color: 'from-amber-500 to-orange-600' },
];

const TIPS = [
    { icon: Sparkles, text: 'Use strong action verbs', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Target, text: 'Quantify achievements', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Layout, text: 'Keep layout minimalist', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Star, text: 'Tailor to each job', color: 'text-purple-500', bg: 'bg-purple-50' },
];

function FieldInput({ label, placeholder, value, onChange, type = 'text', icon: Icon }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                {Icon && <Icon className="h-3 w-3" />} {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-14 bg-slate-50 border-2 border-transparent rounded-2xl px-5 font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
            />
        </div>
    );
}

export default function ResumeBuilder() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personal: { name: '', email: '', phone: '', linkedin: '', location: '' },
        education: [{ school: '', degree: '', year: '', cgpa: '' }],
        experience: [{ company: '', role: '', duration: '', tasks: '' }],
        skills: '',
        summary: ''
    });
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const updatePersonal = (field: string, val: string) =>
        setFormData(p => ({ ...p, personal: { ...p.personal, [field]: val } }));

    const updateEducation = (i: number, field: string, val: string) =>
        setFormData(p => {
            const ed = [...p.education];
            ed[i] = { ...ed[i], [field]: val };
            return { ...p, education: ed };
        });

    const updateExperience = (i: number, field: string, val: string) =>
        setFormData(p => {
            const ex = [...p.experience];
            ex[i] = { ...ex[i], [field]: val };
            return { ...p, experience: ex };
        });

    const analyzeATS = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setAtsScore(Math.floor(Math.random() * 30) + 65);
            setIsAnalyzing(false);
            toast.success('ATS Analysis Complete!', { icon: '📊' });
        }, 2200);
    };

    const downloadResume = () => toast.success('Generating High-Resolution PDF...');

    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 italic pb-24">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14"
            >
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-3 flex items-center gap-2">
                        <FileText className="h-3 w-3 text-blue-500" /> Professional Identity Engineering v1.0
                    </p>
                    <h1 className="text-6xl font-black text-slate-900 tracking-[-0.04em] uppercase leading-none">
                        Resume{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                            Architect
                        </span>
                    </h1>
                </div>
                <div className="flex gap-4 shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={analyzeATS} disabled={isAnalyzing}
                        className="px-7 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm disabled:opacity-60"
                    >
                        {isAnalyzing
                            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                            : <Brain className="h-4 w-4 text-blue-600" />}
                        ATS Optimization
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={downloadResume}
                        className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
                    >
                        <Download className="h-4 w-4" /> Export PDF
                    </motion.button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                {/* ── Form Side ── */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Step Pills */}
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {STEPS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setStep(s.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-6 py-3 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap border-2",
                                    step === s.id
                                        ? `bg-gradient-to-r ${s.color} text-white border-transparent shadow-lg`
                                        : step > s.id
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                )}
                            >
                                {step > s.id
                                    ? <CheckCircle className="h-4 w-4" />
                                    : <s.icon className="h-4 w-4" />}
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl space-y-10"
                        >
                            {/* Step 1: Personal */}
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tight">Personal Details</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity node configuration</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FieldInput label="Full Name" placeholder="John Doe" icon={User}
                                            value={formData.personal.name} onChange={(v: string) => updatePersonal('name', v)} />
                                        <FieldInput label="Email Address" placeholder="john@domain.com" icon={Mail} type="email"
                                            value={formData.personal.email} onChange={(v: string) => updatePersonal('email', v)} />
                                        <FieldInput label="Phone Number" placeholder="+91 98765 43210" icon={Phone}
                                            value={formData.personal.phone} onChange={(v: string) => updatePersonal('phone', v)} />
                                        <FieldInput label="Location" placeholder="Mumbai, India" icon={MapPin}
                                            value={formData.personal.location} onChange={(v: string) => updatePersonal('location', v)} />
                                        <div className="md:col-span-2">
                                            <FieldInput label="LinkedIn URL" placeholder="linkedin.com/in/johndoe" icon={Linkedin}
                                                value={formData.personal.linkedin} onChange={(v: string) => updatePersonal('linkedin', v)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Summary</label>
                                        <textarea
                                            rows={4}
                                            value={formData.summary}
                                            onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))}
                                            placeholder="Core competencies and career goals..."
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[28px] p-6 font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Education */}
                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
                                                <GraduationCap className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tight">Education</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic credentials</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => setFormData(p => ({ ...p, education: [...p.education, { school: '', degree: '', year: '', cgpa: '' }] }))}
                                            className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-100 transition-all border-2 border-purple-100"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </motion.button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.education.map((edu, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 bg-slate-50 rounded-[35px] space-y-6 border-2 border-transparent hover:border-purple-100 transition-all relative group"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry {i + 1}</span>
                                                    {formData.education.length > 1 && (
                                                        <button onClick={() => setFormData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }))}
                                                            className="h-8 w-8 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-5">
                                                    {[
                                                        { field: 'school', placeholder: 'University / College' },
                                                        { field: 'degree', placeholder: 'Degree / Course' },
                                                        { field: 'year', placeholder: 'Graduation Year' },
                                                        { field: 'cgpa', placeholder: 'CGPA / Percentage' },
                                                    ].map(f => (
                                                        <input key={f.field}
                                                            value={(edu as any)[f.field]}
                                                            onChange={e => updateEducation(i, f.field, e.target.value)}
                                                            placeholder={f.placeholder}
                                                            className="bg-white border-2 border-transparent rounded-2xl px-5 py-3.5 font-bold text-slate-800 text-sm focus:outline-none focus:border-purple-400 transition-all placeholder:text-slate-300"
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Experience */}
                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                                <Briefcase className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tight">Work Experience</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional history nodes</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => setFormData(p => ({ ...p, experience: [...p.experience, { company: '', role: '', duration: '', tasks: '' }] }))}
                                            className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-all border-2 border-emerald-100"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </motion.button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.experience.map((exp, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 bg-slate-50 rounded-[35px] space-y-5 border-2 border-transparent hover:border-emerald-100 transition-all relative group"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role {i + 1}</span>
                                                    {formData.experience.length > 1 && (
                                                        <button onClick={() => setFormData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }))}
                                                            className="h-8 w-8 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-5">
                                                    {[
                                                        { field: 'company', placeholder: 'Company Name' },
                                                        { field: 'role', placeholder: 'Role / Designation' },
                                                        { field: 'duration', placeholder: 'Duration (e.g. Jun–Aug 2024)' },
                                                    ].map(f => (
                                                        <input key={f.field}
                                                            value={(exp as any)[f.field]}
                                                            onChange={e => updateExperience(i, f.field, e.target.value)}
                                                            placeholder={f.placeholder}
                                                            className={cn("bg-white border-2 border-transparent rounded-2xl px-5 py-3.5 font-bold text-slate-800 text-sm focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300",
                                                                f.field === 'duration' ? 'col-span-2' : '')}
                                                        />
                                                    ))}
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    value={exp.tasks}
                                                    onChange={e => updateExperience(i, 'tasks', e.target.value)}
                                                    placeholder="Key responsibilities and achievements (use bullet points)..."
                                                    className="w-full bg-white border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-slate-800 text-sm focus:outline-none focus:border-emerald-400 transition-all resize-none placeholder:text-slate-300"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                            <Code2 className="h-3 w-3" /> Skills (comma-separated)
                                        </label>
                                        <input
                                            value={formData.skills}
                                            onChange={e => setFormData(p => ({ ...p, skills: e.target.value }))}
                                            placeholder="React, TypeScript, Node.js, Python..."
                                            className="w-full h-14 bg-slate-50 border-2 border-transparent rounded-2xl px-5 font-bold text-slate-800 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Launch */}
                            {step === 4 && (
                                <div className="space-y-10 text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className="h-28 w-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[45px] flex items-center justify-center mx-auto shadow-[0_20px_60px_rgba(245,158,11,0.4)] border border-white/20"
                                    >
                                        <CheckCircle className="h-14 w-14 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Generation Ready</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                                            Your professional blueprint is ready for final assembly and ATS indexing.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                                        {[
                                            { label: 'Sections', value: '4', color: 'text-blue-600' },
                                            { label: 'ATS Score', value: atsScore ? `${atsScore}%` : '--', color: 'text-emerald-600' },
                                            { label: 'Status', value: 'Ready', color: 'text-amber-600' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-slate-50 rounded-[25px] p-5 border border-slate-100">
                                                <p className={cn("text-2xl font-black italic", s.color)}>{s.value}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={downloadResume}
                                        className="px-14 py-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[35px] font-black uppercase tracking-widest text-sm hover:shadow-2xl transition-all flex items-center gap-4 mx-auto shadow-xl"
                                    >
                                        <Download className="h-5 w-5" /> Launch PDF Generation
                                    </motion.button>
                                </div>
                            )}

                            {/* Nav Buttons */}
                            <div className="flex justify-between pt-8 border-t border-slate-50">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    disabled={step === 1}
                                    onClick={() => setStep(p => p - 1)}
                                    className="flex items-center gap-2 px-8 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest disabled:opacity-0 hover:text-slate-700 transition-all"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Reverse
                                </motion.button>
                                {step < 4 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => setStep(p => p + 1)}
                                        className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:shadow-blue-200 transition-all"
                                    >
                                        Advance <ArrowRight className="h-4 w-4" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-8">
                    {/* ATS Score Ring */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#080B1A] p-10 rounded-[50px] text-white relative overflow-hidden border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -mr-12 -mt-12" />
                        <div className="relative z-10 space-y-8 text-center pt-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">ATS IQ Metric</p>
                            <div className="relative inline-block">
                                <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        cx="80" cy="80" r="70"
                                        stroke="url(#atsGrad)"
                                        strokeWidth="10"
                                        fill="transparent"
                                        strokeLinecap="round"
                                        strokeDasharray={440}
                                        animate={{ strokeDashoffset: 440 - (440 * (atsScore || 0)) / 100 }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                    />
                                    <defs>
                                        <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    {isAnalyzing ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                            <Brain className="h-8 w-8 text-blue-400" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-black italic">{atsScore !== null ? atsScore : '--'}</span>
                                            {atsScore && <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">/ 100</span>}
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic uppercase px-2">
                                {atsScore === null
                                    ? 'Initiate optimization to view recruitment compatibility.'
                                    : atsScore > 80
                                        ? '✅ Excellent compatibility. Profile is recruiter-optimized.'
                                        : '⚠️ Room for improvement. Add more domain keywords.'}
                            </p>
                            {atsScore !== null && (
                                <div className="flex justify-center gap-2">
                                    {['Keywords', 'Format', 'Length'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Tips */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl space-y-6"
                    >
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-amber-500" /> Optimization Tips
                        </h4>
                        <div className="space-y-4">
                            {TIPS.map((tip, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    className={cn("flex items-center gap-4 p-4 rounded-[22px] border border-transparent hover:border-slate-100 transition-all", tip.bg)}
                                >
                                    <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <tip.icon className={cn("h-4 w-4", tip.color)} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{tip.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Step Progress */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl space-y-6"
                    >
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Build Progress</h4>
                        <div className="space-y-4">
                            {STEPS.map(s => (
                                <div key={s.id} className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                        step > s.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                            : step === s.id ? `bg-gradient-to-br ${s.color} text-white shadow-md`
                                                : "bg-slate-50 text-slate-300"
                                    )}>
                                        {step > s.id ? <CheckCircle className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-[11px] font-black uppercase tracking-widest",
                                            step >= s.id ? "text-slate-700" : "text-slate-300")}>{s.label}</p>
                                    </div>
                                    {step > s.id && <span className="text-[9px] font-black text-emerald-500 uppercase">Done</span>}
                                    {step === s.id && <span className="text-[9px] font-black text-blue-500 uppercase animate-pulse">Active</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
