import React, { useState, useEffect } from "react";
import StudentFilters from "../../features/students/components/StudentFilters";
import {
    Download,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    MapPin,
    Star,
    CheckCircle,
    XCircle,
    Bot
} from "lucide-react";
import api from "../../services/api";
import { cn } from "../../utils/cn";
import { toast } from "react-hot-toast";
import { useAuth } from "../../features/auth/AuthContext";
import { getSocket } from "../../hooks/useSocket";

interface Student {
    _id: string;
    userId: string;
    name: string;
    email: string;
    usn: string;
    branch: string;
    cgpa: number;
    status: string;
    skills: string[];
    company?: string;
    phone?: string;
    location?: string;
    aiMatchScore?: number;
    aptitudeScore?: number;
    codingScore?: number;
    interviewScore?: number;
}

export default function StudentManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    // Server-side pagination and debouncing
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { user } = useAuth();
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        api.get<{ onlineUserIds: string[] }>('/students/online').then(res => {
            setOnlineUserIds(new Set(res.data.onlineUserIds || []));
        }).catch(err => console.error("Could not fetch online statuses", err));

        if (!user?._id) return;
        const socket = getSocket(user._id);
        if (!socket) return;

        const handleStatus = ({ userId, isOnline }: { userId: string, isOnline: boolean }) => {
            setOnlineUserIds(prev => {
                const updated = new Set(prev);
                if (isOnline) updated.add(userId);
                else updated.delete(userId);
                return updated;
            });
        };

        socket.on("user_status_change", handleStatus);
        return () => {
            socket.off("user_status_change", handleStatus);
        };
    }, [user?._id]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: "12",
                });
                if (debouncedSearch) queryParams.append("search", debouncedSearch);
                if (branchFilter !== "All") queryParams.append("branch", branchFilter);
                if (statusFilter !== "All") queryParams.append("status", statusFilter);

                const { data } = await api.get<{ students: any[], totalPages: number }>(`/students?${queryParams.toString()}`);

                // Enhance mock data for demo if needed
                const enhanced = data.students.map(s => ({
                    ...s,
                    aiMatchScore: s.aiMatchScore || Math.floor(Math.random() * (99 - 60) + 60), // Mock AI score
                    location: s.location || "Bangalore, India",
                    phone: s.phone || "+91 98765 43210"
                }));
                setStudents(enhanced || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch students", error);
                // toast.error("Failed to load student directory");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [page, debouncedSearch, branchFilter, statusFilter]);

    // Handle filter change reset page
    useEffect(() => {
        setPage(1);
    }, [branchFilter, statusFilter]);



    const toggleSelection = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: `${action} ${selectedStudents.length} candidates...`,
                success: `${action} Successful!`,
                error: "Action failed",
            }
        );
        setSelectedStudents([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Talent Directory</h1>
                    <p className="text-slate-500 mt-1">AI-powered candidate search and management.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 font-medium">
                        <Plus className="h-4 w-4" />
                        <span>Add Candidate</span>
                    </button>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-10">
                <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, USN, or skills (e.g., Python)..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3">
                        <select
                            className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                        >
                            <option value="All">All Branches</option>
                            <option value="CS">Computer Science</option>
                            <option value="IS">Information Science</option>
                            <option value="EC">Electronics</option>
                        </select>
                        <select
                            className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Unplaced">Unplaced</option>
                            <option value="Offers Received">Offers Received</option>
                            <option value="Placed">Placed</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {selectedStudents.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4 fade-in">
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                {selectedStudents.length} Selected
                            </span>
                            <button onClick={() => handleBulkAction("Shortlisting")} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-bold hover:bg-blue-100 transition-colors">
                                Shortlist
                            </button>
                            <button onClick={() => handleBulkAction("Emailing")} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md font-medium hover:bg-slate-200 transition-colors">
                                Email
                            </button>
                        </div>
                    )}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow text-slate-900" : "text-slate-400 hover:text-slate-600")}
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                            </div>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'table' ? "bg-white shadow text-slate-900" : "text-slate-400 hover:text-slate-600")}
                        >
                            <div className="flex flex-col gap-0.5 w-4 h-4 justify-center">
                                <div className="h-[2px] w-full bg-current rounded-[1px]"></div>
                                <div className="h-[2px] w-full bg-current rounded-[1px]"></div>
                                <div className="h-[2px] w-full bg-current rounded-[1px]"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : students.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No candidates found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className={cn(
                                        "group bg-white rounded-xl border transition-all duration-300 hover:shadow-lg relative overflow-hidden",
                                        selectedStudents.includes(student._id) ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-200 hover:border-blue-200"
                                    )}
                                    onClick={() => toggleSelection(student._id)}
                                >
                                    {/* Selection Overlay (Active) */}
                                    {selectedStudents.includes(student._id) && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <CheckCircle className="h-6 w-6 text-blue-500 fill-white" />
                                        </div>
                                    )}

                                    {/* AI Score Badge */}
                                    <div className="absolute top-0 left-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10 flex items-center gap-1">
                                        <Bot className="h-3 w-3" />
                                        {student.aiMatchScore}% MATCH
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4 mt-2">
                                            <div className="flex items-center gap-4 relative">
                                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-xl border-2 border-white shadow-sm relative">
                                                    {student.name.charAt(0)}
                                                    {onlineUserIds.has(student.userId) && (
                                                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full">
                                                            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                        {student.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full w-fit mt-1">{student.usn}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <GraduationCap className="h-4 w-4 text-slate-400" />
                                                <span className="truncate">{student.branch} • {student.cgpa} CGPA</span>
                                            </div>
                                            {student.skills && student.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 h-14 overflow-hidden">
                                                    {student.skills.slice(0, 4).map((skill, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded text-xs font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {student.skills.length > 4 && (
                                                        <span className="px-2 py-0.5 text-xs text-slate-400">+ {student.skills.length - 4}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Readiness Scores - MINI METRICS */}
                                            <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50/50 rounded-xl px-3 border border-slate-100 group-hover:bg-blue-50/30 transition-all">
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Aptitude</p>
                                                    <p className="text-xs font-black text-slate-900">{student.aptitudeScore || 0}%</p>
                                                </div>
                                                <div className="text-center border-x border-slate-200">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Coding</p>
                                                    <p className="text-xs font-black text-indigo-600">{student.codingScore || 0}%</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Interview</p>
                                                    <p className="text-xs font-black text-rose-500">{student.interviewScore || 0}%</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                            <button className="flex-1 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                <Mail className="h-4 w-4" /> Email
                                            </button>
                                            <div className="w-px h-6 bg-slate-200"></div>
                                            <button className="flex-1 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                <MoreHorizontal className="h-4 w-4" /> More
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Indicator Stripe */}
                                    <div className={cn(
                                        "h-1.5 w-full",
                                        student.status === "Placed" ? "bg-green-500" :
                                            student.status === "Offers Received" ? "bg-blue-500" : "bg-slate-200"
                                    )}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 w-10">
                                            <input type="checkbox" className="rounded border-slate-300" />
                                        </th>
                                        <th className="px-6 py-4">Candidate</th>
                                        <th className="px-6 py-4">Academic Info</th>
                                        <th className="px-6 py-4">Readiness Index</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student) => (
                                        <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 accent-blue-600"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={() => toggleSelection(student._id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs relative">
                                                        {student.name.charAt(0)}
                                                        {onlineUserIds.has(student.userId) && (
                                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700">{student.branch}</div>
                                                <div className="text-xs text-slate-500 font-mono">CGPA: {student.cgpa}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase">Apt</div>
                                                        <div className="text-xs font-black">{student.aptitudeScore || 0}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase">Cod</div>
                                                        <div className="text-xs font-black text-indigo-600">{student.codingScore || 0}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase">Int</div>
                                                        <div className="text-xs font-black text-rose-500">{student.interviewScore || 0}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-xs font-bold border",
                                                    student.status === "Placed" ? "bg-green-50 text-green-700 border-green-200" :
                                                        student.status === "Offers Received" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                            "bg-slate-100 text-slate-600 border-slate-200"
                                                )}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 bg-white px-6 py-3 border border-slate-200 shadow-sm rounded-full w-max mx-auto">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm font-medium text-slate-600 disabled:opacity-40 transition-opacity hover:bg-slate-100 rounded-md"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-bold text-slate-800 px-4 border-x border-slate-200">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 text-sm font-medium text-slate-600 disabled:opacity-40 transition-opacity hover:bg-slate-100 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
