import React, { useState, useEffect } from "react";
import {
    Download, Plus, Search, Filter, MoreHorizontal, Mail,
    Trash2, Edit, Ban, CheckCircle, Upload, FileText
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Student {
    _id: string;
    name: string;
    email: string;
    usn: string;
    branch: string;
    cgpa: number;
    status: string;
    skills: string[];
    isActive: boolean;
}

export default function StudentManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get<{ students: any[] }>("/students");
            setStudents(data.students.map(s => ({ ...s, isActive: true }))); // Mock isActive
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/admin/students/${id}`);
            toast.success("Student deleted");
            fetchStudents();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/students/${id}/status`, { isActive: !currentStatus });
            setStudents(prev => prev.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
            toast.success(`Account ${currentStatus ? 'Disabled' : 'Enabled'}`);
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Student Database</h1>
                    <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Manage • Audit • Control</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-[#0F1121] text-slate-300 border border-white/10 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                        <Upload className="h-4 w-4" /> Bulk Upload
                    </button>
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20">
                        <Plus className="h-4 w-4" /> Add Student
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#0F1121] p-4 rounded-[20px] border border-white/5 flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Email..."
                        className="w-full bg-black/20 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-purple-500/50"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <button className="p-3 bg-black/20 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Filter className="h-4 w-4" />
                </button>
                <button className="p-3 bg-black/20 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Download className="h-4 w-4" />
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#0F1121] border border-white/5 rounded-[30px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Student</th>
                            <th className="px-8 py-6">Academic</th>
                            <th className="px-8 py-6">Skills</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-10 text-center text-slate-500 italic">Searching Database...</td></tr>
                        ) : filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 font-bold border border-white/5">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200">{student.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-slate-300 font-bold text-xs">{student.branch}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">CGPA: {student.cgpa}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        {student.skills?.slice(0, 2).map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-400 uppercase">{skill}</span>
                                        ))}
                                        {student.skills?.length > 2 && <span className="text-[9px] text-slate-600 self-center">+{student.skills.length - 2}</span>}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${student.isActive
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                        }`}>
                                        {student.isActive ? "Active" : "Disabled"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="View Profile">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(student._id, student.isActive)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                                            title={student.isActive ? "Disable" : "Enable"}
                                        >
                                            <Ban className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student._id)}
                                            className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
