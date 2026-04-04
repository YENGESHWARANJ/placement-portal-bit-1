import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, SlidersHorizontal, Users, GraduationCap,
    ChevronRight, ArrowUpRight, Target, Brain, Download,
    Zap, Sparkles, Cpu, Activity, ShieldCheck, Database
} from "lucide-react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { toast } from "react-hot-toast";

interface Student {
    _id: string;
    name: string;
    email: string;
    usn: string;
    branch: string;
    cgpa: number;
    skills: string[];
    readinessScore: number;
}

export default function TalentDiscovery() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("All");

    useEffect(() => {
        fetchTalentPool();
    }, []);

    const fetchTalentPool = async () => {
        try {
            const { data } = await api.get<{ students: Student[] }>('/students');
            setStudents(data.students || []);
        } catch (error) {
            toast.error("Unable to sync talent pool");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        (branchFilter === "All" || s.branch === branchFilter) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                <div>
                    <h1 className="text-4xl font-black text-apple-gray-900 tracking-tight">Talent Discovery</h1>
                    <p className="text-apple-gray-400 font-bold uppercase tracking-[0.2em] text-base mt-2">Elite candidate search & neural resonance mapping</p>
                </div>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-[20px] text-sm font-black uppercase tracking-widest text-apple-gray-900 border border-apple-gray-100 shadow-sm hover:bg-apple-gray-50 transition-all"
                    >
                        <Download className="h-4 w-4" /> Export Talent Pool
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-apple-blue text-slate-900 px-6 py-3.5 rounded-[20px] text-sm font-black uppercase tracking-widest shadow-apple-hover border border-slate-200"
                    >
                        <Target className="h-4 w-4" /> AI Analysis
                    </motion.button>
                </div>
            </div>

            {/* Filter Terminal */}
            <div className="apple-card p-4 bg-white shadow-sm border border-apple-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-300 group-focus-within:text-apple-blue transition-colors" />
                    <input
                        placeholder="Search talent..."
                        className="w-full pl-14 pr-6 py-4 bg-apple-gray-50/50 rounded-[18px] border border-transparent focus:bg-white focus:border-apple-blue/20 focus:ring-4 focus:ring-apple-blue/5 transition-all text-base font-bold text-apple-gray-900 placeholder:text-apple-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="flex-1 md:flex-none px-6 py-4 bg-apple-gray-50/50 rounded-[18px] border border-transparent font-bold text-sm uppercase tracking-widest text-apple-gray-500 focus:bg-white focus:border-apple-blue/20 transition-all cursor-pointer appearance-none md:min-w-[180px]"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    >
                        <option value="All">All Disciplines</option>
                        <option value="CSE">CSE</option>
                        <option value="ISE">ISE</option>
                        <option value="ECE">ECE</option>
                    </select>
                    <button className="p-4 bg-apple-gray-50 text-apple-gray-400 rounded-[18px] hover:bg-apple-gray-100 transition-all border border-transparent shrink-0">
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Grid of Results */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
                    <p className="text-apple-gray-400 font-black uppercase tracking-widest text-base">Decoding Talent Matrix...</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredStudents.map((student) => (
                            <motion.div
                                key={student._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                            >
                                <Link
                                    to={`/students/${student._id}`}
                                    className="block apple-card p-10 bg-white hover:translate-y-[-6px] transition-all duration-300 relative group border border-apple-gray-50"
                                >
                                    {/* Readiness Badge */}
                                    <div className="absolute top-8 right-8 text-right">
                                        <div className="flex items-center gap-2 justify-end mb-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-xl font-black text-apple-gray-900 tracking-tighter">{student.readinessScore}%</p>
                                        </div>
                                        <p className="text-sm font-black text-apple-gray-300 uppercase tracking-widest">Readiness</p>
                                    </div>

                                    <div className="mb-8 text-center">
                                        <div className="mx-auto h-24 w-24 rounded-[30px] bg-white flex items-center justify-center text-slate-900 text-3xl font-black mb-6 shadow-lg group-hover:scale-105 transition-transform">
                                            {student.name.charAt(0)}
                                        </div>
                                        <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight leading-none mb-2">{student.name}</h3>
                                        <p className="text-base font-black text-apple-blue uppercase tracking-widest mb-1">{student.branch}</p>
                                        <p className="text-xs font-bold text-apple-gray-300 uppercase tracking-widest">{student.usn}</p>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {student.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-apple-gray-50 text-apple-gray-500 text-xs font-bold uppercase tracking-widest rounded-xl border border-apple-gray-100 group-hover:border-apple-blue/20 group-hover:text-apple-blue transition-all">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-base font-black uppercase tracking-widest pt-6 border-t border-apple-gray-50">
                                            <span className="text-apple-gray-300">GPA Protocol</span>
                                            <span className="text-apple-gray-900">{student.cgpa.toFixed(2)} / 10.0</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-apple-gray-300 group-hover:text-apple-blue transition-all">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-4 w-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Profile Insights</span>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
