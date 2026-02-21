import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Award, BookOpen, FileText,
    Github, Linkedin, Globe, ArrowLeft, CheckCircle2, XCircle,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { getStudentById } from '../../services/student.service';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import api from '../../services/api';

export default function StudentProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const data = await getStudentById(id!);
            setStudent(data);
        } catch (error) {
            toast.error("Failed to load student dossier");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 italic tracking-[0.3em] uppercase text-xl">Decrypting Personnel File...</div>;
    if (!student) return null;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Nav */}
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors font-bold uppercase tracking-widest text-xs">
                <ArrowLeft className="h-4 w-4" /> Return to Pipeline
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden text-center group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-purple-600" />

                        <div className="relative mt-12 mb-6">
                            <div className="h-28 w-28 mx-auto bg-white rounded-[30px] p-2 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <div className="h-full w-full bg-slate-100 rounded-[22px] flex items-center justify-center overflow-hidden">
                                    {student.profilePicture ? (
                                        <img src={student.profilePicture} alt={student.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-10 w-10 text-slate-300" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-1">{student.name}</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{student.branch} • Batch {student.year}</p>

                        <div className="flex justify-center gap-3 mb-8">
                            {student.linkedin && (
                                <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0077b5]/10 text-[#0077b5] rounded-xl hover:bg-[#0077b5] hover:text-white transition-all">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                            {student.github && (
                                <a href={student.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                    <Github className="h-4 w-4" />
                                </a>
                            )}
                            {student.website && (
                                <a href={student.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                    <Globe className="h-4 w-4" />
                                </a>
                            )}
                        </div>

                        <div className="space-y-4 text-left bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><Mail className="h-3.5 w-3.5" /></div>
                                <div className="overflow-hidden">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Frequency</p>
                                    <p className="text-xs font-bold text-slate-700 truncate">{student.userId?.email || "Hidden"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><FileText className="h-3.5 w-3.5" /></div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">USN Identified</p>
                                    <p className="text-xs font-bold text-slate-700">{student.usn}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Action */}
                    <div className="bg-[#1E2342] p-8 rounded-[40px] text-white flex items-center justify-between shadow-xl shadow-indigo-900/20 group cursor-pointer hover:scale-[1.02] transition-transform">
                        <div>
                            <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Dossier File</p>
                            <h3 className="text-xl font-black italic uppercase">Download CV</h3>
                        </div>
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#1E2342] transition-colors">
                            <FileText className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Metrics */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'CGPA', value: student.cgpa, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { label: 'Aptitude', value: `${student.aptitudeScore || 0}%`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Coding', value: `${student.codingScore || 0}%`, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                            { label: 'Interview', value: `${student.interviewScore || 0}%`, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                                <p className={cn("text-2xl font-black italic mb-1", stat.color)}>{stat.value}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* About & Skills */}
                    <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-slate-50 rounded-full -mr-16 -mt-16 z-0" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-500" /> Bio Manifest
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed italic mb-10">
                                {student.about || "No bio manifest uploaded by candidate."}
                            </p>

                            <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <Award className="h-4 w-4 text-indigo-500" /> Technical Arsenal
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {student.skills?.map((skill: string, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    {new URLSearchParams(window.location.search).get('appId') && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={async () => {
                                    const appId = new URLSearchParams(window.location.search).get('appId');
                                    if (!appId) return;
                                    try {
                                        await api.put(`/applications/${appId}`, { status: 'Rejected' });
                                        toast.success("Candidate status updated: Rejected");
                                        navigate(-1);
                                    } catch (err) {
                                        toast.error("Failed to update status");
                                    }
                                }}
                                className="py-5 bg-white border border-rose-100 text-rose-500 rounded-[30px] font-black uppercase tracking-widest text-xs hover:bg-rose-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <XCircle className="h-4 w-4" /> Reject Candidate
                            </button>
                            <button
                                onClick={async () => {
                                    const appId = new URLSearchParams(window.location.search).get('appId');
                                    if (!appId) return;
                                    try {
                                        await api.put(`/applications/${appId}`, { status: 'Shortlisted' });
                                        toast.success("Candidate status updated: Shortlisted");
                                        navigate(-1);
                                    } catch (err) {
                                        toast.error("Failed to update status");
                                    }
                                }}
                                className="py-5 bg-emerald-500 text-white rounded-[30px] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Shortlist for Review
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
