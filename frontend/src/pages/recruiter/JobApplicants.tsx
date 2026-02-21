import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Pipeline...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/jobs/my" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 italic uppercase tracking-tighter">
                        Intelligence Pipeline <span className="bg-slate-100 text-slate-600 text-sm px-2 py-1 rounded-full font-medium border border-slate-200">{applicants.length}</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Strategic Candidate Sorting & AI Evaluation</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <Link to="/interviews/ledger" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all italic flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Engagement Ledger
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-fit px-1">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.entries(columns).map(([columnId, colDef]) => (
                            <div key={columnId} className="flex flex-col w-[320px] shrink-0 bg-slate-50/50 rounded-xl border border-slate-200 max-h-full">
                                <div className={cn(
                                    "p-4 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-between border-b-2 rounded-t-xl bg-white shadow-sm sticky top-0 z-10 italic",
                                    colDef.color
                                )}>
                                    <span>{colDef.title}</span>
                                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-black border border-current opacity-80">
                                        {boardData[columnId]?.length || 0}
                                    </span>
                                </div>

                                <Droppable droppableId={columnId}>
                                    {(provided: any, snapshot: any) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50 ring-2 ring-blue-100 ring-inset' : ''}`}
                                        >
                                            {boardData[columnId]?.map((app: Applicant, index: number) => (
                                                <Draggable key={app._id} draggableId={app._id} index={index}>
                                                    {(provided: any, snapshot: any) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing italic ${snapshot.isDragging ? 'rotate-2 scale-105 ring-4 ring-blue-500/20 z-50 shadow-xl' : 'hover:border-blue-300'}`}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-sm border border-white shadow-sm">
                                                                        {app.studentId.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-black text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{app.studentId.name}</h4>
                                                                        <div className={cn(
                                                                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 mt-1",
                                                                            (app.matchScore || 0) > 80 ? "bg-emerald-100 text-emerald-700" :
                                                                                (app.matchScore || 0) > 60 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                                                                        )}>
                                                                            <Sparkles className="h-2 w-2" />
                                                                            {app.matchScore || 0}% Match
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </button>
                                                            </div>

                                                            {app.aiInsights && (
                                                                <div className="mb-3 px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                                                                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 leading-tight italic">
                                                                        {app.aiInsights}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="space-y-2 mb-3">
                                                                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-widest bg-slate-50 px-2 py-1 rounded w-fit">
                                                                    <span className="text-slate-400">IQ:</span>
                                                                    <span className={app.studentId.cgpa >= 8.5 ? "text-emerald-600" : ""}>{app.studentId.cgpa}</span>
                                                                    <span className="text-slate-300">|</span>
                                                                    <span className="truncate max-w-[100px]">{app.studentId.branch}</span>
                                                                </div>

                                                                {app.studentId.skills && app.studentId.skills.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {app.studentId.skills.slice(0, 3).map((skill, i) => (
                                                                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[8px] font-black uppercase tracking-widest">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                                                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex gap-1.5">
                                                                    {(app.matchScore || 0) > 85 && app.status === 'Applied' && (
                                                                        <button
                                                                            onClick={() => handleFastTrack(app._id)}
                                                                            className="p-1.5 bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-all animate-pulse shadow-sm"
                                                                            title="Fast Track Elite Talent"
                                                                        >
                                                                            <Zap className="h-3.5 w-3.5 fill-current" />
                                                                        </button>
                                                                    )}
                                                                    {app.status === 'Shortlisted' && (
                                                                        <button
                                                                            onClick={() => setSchedulingApp(app)}
                                                                            className="p-1.5 bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-lg transition-all shadow-sm"
                                                                            title="Schedule Protocol"
                                                                        >
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    )}
                                                                    <Link
                                                                        to={`/students/${app.studentId._id}?appId=${app._id}`}
                                                                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                                                                        title="View Profile"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                    <button className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Email Candidate">
                                                                        <Mail className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    {app.resumeUrl ? (
                                                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100" title="View Resume">
                                                                            <FileText className="h-3.5 w-3.5" />
                                                                        </a>
                                                                    ) : (
                                                                        <button className="p-1.5 hover:bg-slate-100 text-slate-300 cursor-not-allowed rounded-lg" title="No Resume">
                                                                            <FileText className="h-3.5 w-3.5" />
                                                                        </button>
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
        </div>
    );
}
