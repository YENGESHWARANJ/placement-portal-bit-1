import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Award, BookOpen, FileText,
    Github, Linkedin, Globe, ArrowLeft, CheckCircle2, XCircle,
    CheckCircle, AlertCircle, Video
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getStudentById } from '../../services/student.service';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const stagger = {
    container: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } },
    item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 200 } } }
};

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

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[10px]">Decoding Dossier...</p>
        </div>
    );
    if (!student) return null;

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="max-w-6xl mx-auto pb-20 mt-4 px-4 sm:px-6"
        >
            {/* Header / Nav */}
            <motion.button
                variants={stagger.item}
                onClick={() => navigate(-1)}
                className="mb-10 flex items-center gap-3 text-apple-gray-400 hover:text-apple-blue transition-all font-black uppercase tracking-widest text-[10px] group"
            >
                <div className="h-10 w-10 rounded-2xl bg-white border border-apple-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                Return to Pipeline
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Identity Card */}
                <motion.div
                    variants={stagger.item}
                    className="lg:col-span-1 space-y-8"
                >
                    <div className="apple-card p-10 bg-white relative overflow-hidden text-center group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-apple-gray-50/50" />

                        <div className="relative mt-8 mb-8">
                            <div className="h-32 w-32 mx-auto bg-white rounded-[32px] p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-apple-gray-50">
                                <div className="h-full w-full bg-apple-gray-50 rounded-[26px] flex items-center justify-center overflow-hidden">
                                    {student.profilePicture ? (
                                        <img src={student.profilePicture} alt={student.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-apple-gray-200" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-apple-gray-900 tracking-tight mb-2">{student.name}</h1>
                        <p className="text-[11px] font-black text-apple-blue uppercase tracking-widest mb-10">{student.branch} • Batch {student.year}</p>

                        <div className="flex justify-center gap-4 mb-10">
                            {student.linkedin && (
                                <motion.a
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    href={student.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="p-3.5 bg-blue-50 text-[#0077b5] rounded-2xl border border-blue-100/50 hover:bg-[#0077b5] hover:text-white transition-all shadow-sm"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </motion.a>
                            )}
                            {student.github && (
                                <motion.a
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    href={student.github} target="_blank" rel="noopener noreferrer"
                                    className="p-3.5 bg-apple-gray-50 text-apple-gray-900 rounded-2xl border border-apple-gray-100 hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                    <Github className="h-4 w-4" />
                                </motion.a>
                            )}
                            {student.website && (
                                <motion.a
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    href={student.website} target="_blank" rel="noopener noreferrer"
                                    className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100/50 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Globe className="h-4 w-4" />
                                </motion.a>
                            )}
                        </div>

                        <div className="space-y-4 text-left bg-apple-gray-50/50 p-6 rounded-[28px] border border-apple-gray-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-apple-gray-400 shadow-sm border border-apple-gray-100"><Mail className="h-4 w-4" /></div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest">Digital Address</p>
                                    <p className="text-[12px] font-bold text-apple-gray-700 truncate">{student.userId?.email || "Restricted access"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-apple-gray-400 shadow-sm border border-apple-gray-100"><FileText className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-[9px] font-black text-apple-gray-300 uppercase tracking-widest">Identification</p>
                                    <p className="text-[12px] font-bold text-apple-gray-700 uppercase tracking-widest">{student.usn}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Action */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-apple-gray-900 p-8 rounded-[40px] text-white flex items-center justify-between shadow-apple-hover group cursor-pointer border border-white/5"
                    >
                        <div>
                            <p className="text-[10px] font-black text-apple-gray-400 uppercase tracking-widest mb-1">Dossier Repository</p>
                            <h3 className="text-xl font-black tracking-tight">Access Curriculum</h3>
                        </div>
                        <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-apple-gray-900 transition-all shadow-inner border border-white/10">
                            <FileText className="h-6 w-6" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column: Detailed Metrics */}
                <motion.div
                    variants={stagger.item}
                    className="lg:col-span-2 space-y-10"
                >
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'CGPA', value: student.cgpa, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { label: 'Aptitude', value: `${student.aptitudeScore || 0}%`, color: 'text-apple-blue', bg: 'bg-blue-50' },
                            { label: 'Coding', value: `${student.codingScore || 0}%`, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { label: 'Interview', value: `${student.interviewScore || 0}%`, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((stat, i) => (
                            <div key={i} className="apple-card p-6 bg-white border border-apple-gray-50 text-center shadow-sm hover:shadow-apple-hover transition-all">
                                <p className={cn("text-3xl font-black tracking-tighter mb-2", stat.color)}>{stat.value}</p>
                                <p className="text-[9px] font-black text-apple-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* About & Skills */}
                    <div className="apple-card p-12 bg-white relative overflow-hidden border border-apple-gray-50">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-apple-gray-50/50 rounded-full -mr-16 -mt-16 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-apple-gray-900 tracking-tight mb-8 flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-apple-blue" /> Manifest Intelligence
                            </h3>
                            <p className="text-apple-gray-600 font-bold leading-relaxed text-[15px] mb-12">
                                {student.about || "Candidate documentation pending initial intake session."}
                            </p>

                            <div className="pt-10 border-t border-apple-gray-50">
                                <h3 className="text-[11px] font-black text-apple-gray-300 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                    <Award className="h-4 w-4" /> Strategic Arsenal
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {student.skills?.map((skill: string, i: number) => (
                                        <span key={i} className="px-5 py-2.5 bg-apple-gray-50/50 text-apple-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-apple-gray-100 hover:border-apple-blue/20 hover:bg-white transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    {new URLSearchParams(window.location.search).get('appId') && (
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    const appId = new URLSearchParams(window.location.search).get('appId');
                                    if (!appId) return;
                                    try {
                                        await api.put(`/applications/${appId}`, { status: 'Rejected' });
                                        toast.success("Dossier archived: Candidate de-selected");
                                        navigate(-1);
                                    } catch (err) {
                                        toast.error("Protocol error");
                                    }
                                }}
                                className="py-5 bg-white border border-rose-100 text-rose-500 rounded-[30px] font-black uppercase tracking-widest text-[11px] hover:bg-rose-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                            >
                                <XCircle className="h-5 w-5" /> Archive Candidate
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    const appId = new URLSearchParams(window.location.search).get('appId');
                                    if (!appId) return;
                                    try {
                                        await api.put(`/applications/${appId}`, { status: 'Shortlisted' });
                                        toast.success("Shortlisted: Transitioning to interview phase");
                                        navigate(-1);
                                    } catch (err) {
                                        toast.error("Protocol error");
                                    }
                                }}
                                className="py-5 bg-apple-blue text-white rounded-[30px] font-black uppercase tracking-widest text-[11px] hover:bg-apple-blue-dark transition-all flex items-center justify-center gap-3 shadow-apple-hover border border-white/10"
                            >
                                <CheckCircle2 className="h-5 w-5" /> Execute Shortlist
                            </motion.button>
                        </div>
                    )}

                    {/* Always visible for recruiters to initiate live session */}
                    <div className="pt-4 border-t border-apple-gray-100">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            onClick={() => navigate(`/interviews/live/${student._id}`)}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 flex-1 to-purple-600 text-white rounded-[30px] font-black uppercase tracking-widest text-[12px] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                            <Video className="h-5 w-5" /> Launch Live Interview Session
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
