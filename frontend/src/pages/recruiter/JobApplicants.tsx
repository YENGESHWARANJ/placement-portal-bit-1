import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Users,
    ArrowLeft,
    MoreHorizontal,
    Mail,
    Phone,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Zap,
    Brain,
    Target as TargetIcon,
    Sparkles,
    Eye
} from 'lucide-react';
import { fastTrackApplicant } from '../../services/recruiter.service';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import InterviewScheduler from './InterviewScheduler';

// Define types
interface Applicant {
    _id: string;
    studentId: {
        _id: string;
        name: string;
        email: string;
        branch: string;
        cgpa: number;
        skills: string[];
        aptitudeScore?: number;
        codingScore?: number;
        interviewScore?: number;
        about?: string;
    };
    status: string;
    resumeUrl?: string;
    appliedAt: string;
    matchScore?: number;
    aiInsights?: string;
}

const columns = {
    Applied: { id: 'Applied', title: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    Shortlisted: { id: 'Shortlisted', title: 'Shortlisted', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    Interviewing: { id: 'Interviewing', title: 'Interviewing', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    Selected: { id: 'Selected', title: 'Selected', color: 'bg-green-50 text-green-700 border-green-200' },
    Rejected: { id: 'Rejected', title: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function JobApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [boardData, setBoardData] = useState<any>({});
    const [schedulingApp, setSchedulingApp] = useState<Applicant | null>(null);

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            const { data } = await api.get<{ applications: Applicant[] }>(`/applications/job/${jobId}`);
            setApplicants(data.applications);
            organizeBoard(data.applications);
        } catch (error) {
            console.error("Failed to fetch applicants", error);
            toast.error("Failed to load applicants");
        } finally {
            setLoading(false);
        }
    };

    const organizeBoard = (apps: Applicant[]) => {
        const newBoard: any = {};
        Object.keys(columns).forEach(key => {
            newBoard[key] = apps.filter(app => app.status === key);
        });
        setBoardData(newBoard);
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = boardData[source.droppableId];
            const destColumn = boardData[destination.droppableId];
            const sourceItems = [...sourceColumn];
            const destItems = [...destColumn];
            const [removed] = sourceItems.splice(source.index, 1);

            // Optimistic UI Update
            const updatedItem = { ...removed, status: destination.droppableId };
            destItems.splice(destination.index, 0, updatedItem);

            setBoardData({
                ...boardData,
                [source.droppableId]: sourceItems,
                [destination.droppableId]: destItems
            });

            try {
                // Call API
                await api.put(`/applications/${draggableId}`, { status: destination.droppableId });
                toast.success(`Moved to ${destination.droppableId}`);
            } catch (error) {
                console.error("Failed to update status", error);
                toast.error("Failed to update status");
                // Revert on error (could be improved)
                fetchApplicants();
            }
        }
    };

    const handleFastTrack = async (id: string) => {
        try {
            await fastTrackApplicant(id);
            toast.success("Candidate Fast-Tracked! Notified student.");
            fetchApplicants();
        } catch (error) {
            toast.error("Fast-track failed");
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
            <p className="text-apple-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Pipeline...</p>
        </div>
    );

    return (
        <motion.div
            variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            initial="initial"
            animate="animate"
            className="h-[calc(100vh-120px)] flex flex-col pt-4"
        >
            {/* Header Section */}
            <motion.div
                variants={{
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } }
                }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2"
            >
                <div className="flex items-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#f2f2f7' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="h-12 w-12 rounded-2xl bg-white border border-apple-gray-100 flex items-center justify-center shadow-sm text-apple-gray-400 hover:text-apple-blue transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </motion.button>
                    <div>
                        <h1 className="text-3xl font-black text-apple-gray-900 tracking-tight flex items-center gap-3">
                            Pipeline
                            <span className="bg-apple-gray-900 text-white text-[11px] px-3 py-1 rounded-full font-black tracking-tighter shadow-sm">{applicants.length}</span>
                        </h1>
                        <p className="text-apple-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">Strategic Selection Hub // Neural Evaluation Matrix</p>
                    </div>
                </div>

                <Link to="/interviews/ledger" className="w-full md:w-auto px-6 py-4 bg-white text-apple-gray-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest border border-apple-gray-100 shadow-sm hover:bg-apple-gray-50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                    <Calendar className="h-4 w-4" /> Engagement Ledger
                </Link>
            </motion.div>

            {/* Kanban Board - Responsive Container */}
            <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-fit px-2 md:gap-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.entries(columns).map(([columnId, colDef]) => (
                            <div key={columnId} className="flex flex-col w-[340px] shrink-0 bg-apple-gray-50/50 rounded-[32px] border border-apple-gray-100/50 max-h-full">
                                <div className="p-6 pb-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm",
                                            columnId === 'Applied' ? 'bg-apple-blue' :
                                                columnId === 'Shortlisted' ? 'bg-purple-500' :
                                                    columnId === 'Interviewing' ? 'bg-orange-500' :
                                                        columnId === 'Selected' ? 'bg-emerald-500' : 'bg-rose-500'
                                        )} />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-apple-gray-400">{colDef.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-black text-apple-gray-300 bg-white px-2.5 py-1 rounded-full border border-apple-gray-50 shadow-sm group-hover:bg-apple-blue group-hover:text-white transition-all">
                                        {boardData[columnId]?.length || 0}
                                    </span>
                                </div>

                                <Droppable droppableId={columnId}>
                                    {(provided: any, snapshot: any) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar min-h-[150px] transition-all",
                                                snapshot.isDraggingOver ? 'bg-apple-blue/5 rounded-b-[32px]' : ''
                                            )}
                                        >
                                            {boardData[columnId]?.map((app: Applicant, index: number) => (
                                                <Draggable key={app._id} draggableId={app._id} index={index}>
                                                    {(provided: any, snapshot: any) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "apple-card p-6 bg-white border border-apple-gray-50 hover:shadow-apple-hover transition-all duration-300 group relative",
                                                                snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 ring-4 ring-apple-blue/10 border-apple-blue/30' : ''
                                                            )}
                                                        >
                                                            {/* AI Badge */}
                                                            {(app.matchScore || 0) > 85 && (
                                                                <div className="absolute -top-3 -right-3 h-10 w-10 bg-apple-blue text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10 animate-bounce group-hover:animate-none">
                                                                    <Zap className="h-5 w-5 fill-white" />
                                                                </div>
                                                            )}
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-12 w-12 rounded-[18px] bg-apple-gray-900 flex items-center justify-center text-white font-black text-base shadow-lg group-hover:scale-110 transition-transform">
                                                                        {app.studentId.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-black text-apple-gray-900 text-[15px] truncate max-w-[140px] leading-tight mb-1">{app.studentId.name}</h4>
                                                                        <div className={cn(
                                                                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border shadow-sm",
                                                                            (app.matchScore || 0) > 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                                (app.matchScore || 0) > 60 ? "bg-blue-50 text-apple-blue border-apple-blue/10" : "bg-apple-gray-50 text-apple-gray-400 border-apple-gray-100"
                                                                        )}>
                                                                            <Sparkles className="h-2.5 w-2.5" />
                                                                            {app.matchScore || 0}% Match
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button className="text-apple-gray-200 hover:text-apple-blue transition-colors p-1">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </button>
                                                            </div>

                                                            {app.aiInsights && (
                                                                <div className="mb-4 p-3 bg-apple-gray-50 rounded-[14px] border border-apple-gray-100/50">
                                                                    <p className="text-[10px] font-bold text-apple-gray-500 leading-relaxed flex items-start gap-2">
                                                                        <Brain className="h-3 w-3 text-purple-500 shrink-0 mt-0.5" />
                                                                        {app.aiInsights}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="space-y-3 mb-5 pt-4 border-t border-apple-gray-50/50">
                                                                <div className="flex items-center gap-3 text-[9px] text-apple-gray-400 font-bold uppercase tracking-widest">
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-apple-gray-50/50 rounded-lg">
                                                                        <span className="text-apple-gray-900 font-black">{app.studentId.cgpa}</span> CGPA
                                                                    </div>
                                                                    <div className="text-apple-gray-200">•</div>
                                                                    <span className="truncate max-w-[100px]">{app.studentId.branch}</span>
                                                                </div>

                                                                {app.studentId.skills && app.studentId.skills.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {app.studentId.skills.slice(0, 3).map((skill, i) => (
                                                                            <span key={i} className="px-2.5 py-1 bg-apple-gray-50 text-apple-gray-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-apple-gray-100/50 group-hover:border-apple-blue/20 transition-colors">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-4 border-t border-apple-gray-50">
                                                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-apple-gray-300">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {(app.matchScore || 0) > 85 && app.status === 'Applied' && (
                                                                        <button
                                                                            onClick={() => handleFastTrack(app._id)}
                                                                            className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm border border-orange-100 hover:border-transparent"
                                                                            title="Fast Track Elite Talent"
                                                                        >
                                                                            <Zap className="h-3.5 w-3.5 fill-current" />
                                                                        </button>
                                                                    )}
                                                                    {app.status === 'Shortlisted' && (
                                                                        <button
                                                                            onClick={() => setSchedulingApp(app)}
                                                                            className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl transition-all shadow-sm border border-purple-100 hover:border-transparent"
                                                                            title="Schedule Protocol"
                                                                        >
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    )}
                                                                    <Link
                                                                        to={`/students/${app.studentId._id}?appId=${app._id}`}
                                                                        className="p-2 bg-white border border-apple-gray-100 text-apple-gray-400 hover:text-apple-blue hover:border-apple-blue/20 rounded-xl transition-all shadow-sm"
                                                                        title="View Profile"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                    {app.resumeUrl && (
                                                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-apple-gray-100 text-apple-gray-400 hover:text-emerald-500 hover:border-emerald-100 rounded-xl transition-all shadow-sm" title="View Resume">
                                                                            <FileText className="h-3.5 w-3.5" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            </div>

            {schedulingApp && (
                <InterviewScheduler
                    application={schedulingApp}
                    onClose={() => setSchedulingApp(null)}
                    onScheduled={fetchApplicants}
                />
            )}
        </motion.div>
    );
}
