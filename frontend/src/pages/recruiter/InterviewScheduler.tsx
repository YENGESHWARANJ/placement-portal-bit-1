import React, { useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    Video,
    MapPin,
    ShieldCheck,
    Send,
    Briefcase
} from 'lucide-react';
import { scheduleInterview } from '../../services/recruiter.service';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface Props {
    application: any;
    onClose: () => void;
    onScheduled: () => void;
}

export default function InterviewScheduler({ application, onClose, onScheduled }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        scheduledAt: '',
        type: 'Technical',
        mode: 'Virtual',
        link: '',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await scheduleInterview({
                applicationId: application._id,
                ...formData
            });
            toast.success("Interview Synchronized & Protocols Sent!");
            onScheduled();
            onClose();
        } catch (error) {
            toast.error("Protocol failure: Unable to schedule interview");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Scheduling Protocol</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Initialize Strategic Engagement</p>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50">
                        <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 font-black italic">
                            {application.studentId.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Candidate</p>
                            <p className="font-bold italic uppercase tracking-tighter">{application.studentId.name}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target Role</p>
                            <p className="font-bold italic uppercase tracking-tighter text-sm">Tech Stack Evolution</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Engagement Time</label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm italic"
                                value={formData.scheduledAt}
                                onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Session Type</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm italic"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Technical</option>
                                <option>HR</option>
                                <option>Managerial</option>
                                <option>System Design</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Engagement Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'Virtual' })}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] italic",
                                    formData.mode === 'Virtual' ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <Video className="h-4 w-4" /> Virtual Hub
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'In-Person' })}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] italic",
                                    formData.mode === 'In-Person' ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <MapPin className="h-4 w-4" /> Physical Grid
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                            {formData.mode === 'Virtual' ? 'Meeting Link Protocol' : 'Location Grid Coordinates'}
                        </label>
                        <input
                            required
                            type="text"
                            placeholder={formData.mode === 'Virtual' ? "https://zoom.us/j/..." : "Boardroom 4, Section A"}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm italic"
                            value={formData.mode === 'Virtual' ? formData.link : formData.location}
                            onChange={e => formData.mode === 'Virtual' ? setFormData({ ...formData, link: e.target.value }) : setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-[25px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group disabled:opacity-50"
                        >
                            <Send className={cn("h-4 w-4 transition-transform", loading ? "animate-ping" : "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                            <span className="font-black italic uppercase tracking-[0.2em] text-[10px]">
                                {loading ? "Synchronizing..." : "Initiate engagement protocol"}
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Encrypted Scheduling Pipeline Active
                    </div>
                </form>
            </div>
        </div>
    );
}
