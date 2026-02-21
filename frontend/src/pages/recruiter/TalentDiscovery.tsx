import React, { useState, useEffect } from "react";
import {
    Search, Filter, SlidersHorizontal, Users, GraduationCap,
    ChevronRight, ArrowUpRight, Target, Brain, Download
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
            toast.error("Failed to sync with talent pool");
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
        <div className="space-y-10 animate-in fade-in zoom-in duration-700 pb-20">
            {/* Intel Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Talent Discovery</h1>
                    <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] mt-2 italic flex items-center gap-2">
                        <Target className="h-3.5 w-3.5" /> High-Resolution Candidate Mapping
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-white px-6 py-4 rounded-[25px] border border-slate-100 shadow-sm font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                        <Download className="h-4 w-4" /> Export Leads
                    </button>
                    <button className="flex items-center gap-2 bg-[#1E2342] text-white px-8 py-4 rounded-[25px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all">
                        <Brain className="h-4 w-4" /> AI Match Analysis
                    </button>
                </div>
            </div>

            {/* Filter Terminal */}
            <div className="bg-white p-8 rounded-[45px] shadow-sm border border-slate-50 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        placeholder="Search by name, skills, or USN..."
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-[30px] border-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-bold text-sm tracking-tight"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="px-8 py-5 bg-slate-50 rounded-[30px] border-none font-black uppercase text-[10px] tracking-widest focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    >
                        <option value="All">All Disciplines</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ISE">Info Science</option>
                        <option value="ECE">Electronics</option>
                    </select>
                    <button className="p-5 bg-slate-50 rounded-[25px] text-slate-400 hover:text-indigo-600 transition-all">
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Grid of Results */}
            {loading ? (
                <div className="py-20 text-center animate-pulse italic font-black text-slate-300 uppercase tracking-widest">Inverting Talent Matrix...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStudents.map((student) => (
                        <Link
                            to={`/students/${student._id}`}
                            key={student._id}
                            className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                        >
                            {/* Readiness Badge */}
                            <div className="absolute top-8 right-8 flex flex-col items-end">
                                <p className="text-[10px] font-black italic text-indigo-600 uppercase tracking-widest leading-none mb-1">{student.readinessScore}%</p>
                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none italic">Readiness</p>
                            </div>

                            <div className="mb-8">
                                <div className="h-20 w-20 rounded-[30px] bg-slate-50 p-1 mb-6 border border-slate-100 group-hover:rotate-2 transition-transform">
                                    <div className="h-full w-full rounded-[24px] bg-slate-900 flex items-center justify-center text-white text-3xl font-black italic shadow-inner">
                                        {student.name.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter leading-none mb-1">{student.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{student.branch} • {student.usn}</p>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="flex flex-wrap gap-2">
                                    {student.skills.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                                            {skill}
                                        </span>
                                    ))}
                                    {student.skills.length > 3 && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">+{student.skills.length - 3} More</span>}
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-t border-slate-50 pt-4">
                                    <span className="text-slate-400">CGPA Protocol</span>
                                    <span className="text-emerald-500 font-mono italic">{student.cgpa.toFixed(2)} / 10.0</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[#FF7D54] group-hover:text-indigo-600 transition-colors">
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Analyze Profile</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
