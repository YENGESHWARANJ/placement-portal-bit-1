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
import { motion, AnimatePresence } from 'framer-motion';
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
            toast.success("Interview Synchronized!");
            onScheduled();
            onClose();
        } catch (error) {
            toast.error("Unable to schedule: Protocol failure");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white/90 backdrop-blur-xl w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 p-2"
            >
                <div className="bg-white rounded-[32px] p-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-apple-blue/10 flex items-center justify-center text-apple-blue shadow-inner border border-apple-blue/5">
                                <Calendar className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-apple-gray-900 tracking-tight">Interview Setup</h2>
                                <p className="text-base font-black uppercase tracking-[0.4em] text-apple-gray-300">Synchronize Protocol</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="h-10 w-10 flex items-center justify-center hover:bg-apple-gray-50 rounded-full transition-colors text-apple-gray-400">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-5 bg-apple-gray-50/50 p-6 rounded-3xl border border-apple-gray-100">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-apple-gray-900 font-black tracking-tighter text-lg shadow-sm border border-apple-gray-100">
                            {application.studentId.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-black uppercase text-apple-gray-300 tracking-[0.2em]">Selected Candidate</p>
                            <p className="font-black text-apple-gray-900 tracking-tight">{application.studentId.name}</p>
                        </div>
                        <div className="ml-auto text-right space-y-0.5">
                            <p className="text-xs font-black uppercase text-apple-gray-300 tracking-[0.2em]">Target Node</p>
                            <p className="font-black text-apple-blue tracking-tight text-sm">Tech Evolution</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-base font-black uppercase tracking-[0.3em] text-apple-gray-400 ml-1">Deployment Time</label>
                                <input
                                    required
                                    type="datetime-local"
                                    className="w-full px-5 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all font-bold text-base text-apple-gray-900"
                                    value={formData.scheduledAt}
                                    onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-base font-black uppercase tracking-[0.3em] text-apple-gray-400 ml-1">Evaluation Type</label>
                                <select
                                    className="w-full px-5 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all font-bold text-base text-apple-gray-900 appearance-none"
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

                        <div className="space-y-3">
                            <label className="text-base font-black uppercase tracking-[0.3em] text-apple-gray-400 ml-1">Format</label>
                            <div className="grid grid-cols-2 gap-5">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode: 'Virtual' })}
                                    className={cn(
                                        "flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-base",
                                        formData.mode === 'Virtual' ? "bg-apple-blue/5 border-apple-blue text-apple-blue shadow-[0_0_20px_rgba(0,122,255,0.1)]" : "bg-white border-apple-gray-100 text-apple-gray-400 hover:border-apple-gray-200"
                                    )}
                                >
                                    <Video className="h-4 w-4" /> Virtual Hub
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode: 'In-Person' })}
                                    className={cn(
                                        "flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-base",
                                        formData.mode === 'In-Person' ? "bg-apple-blue/5 border-apple-blue text-apple-blue shadow-[0_0_20px_rgba(0,122,255,0.1)]" : "bg-white border-apple-gray-100 text-apple-gray-400 hover:border-apple-gray-200"
                                    )}
                                >
                                    <MapPin className="h-4 w-4" /> Strategic Site
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-base font-black uppercase tracking-[0.3em] text-apple-gray-400 ml-1">
                                {formData.mode === 'Virtual' ? 'Meeting Link Protocol' : 'Location Grid'}
                            </label>
                            <input
                                required
                                type="text"
                                placeholder={formData.mode === 'Virtual' ? "https://zoom.us/j/..." : "Executive Boardroom 12"}
                                className="w-full px-5 py-4 bg-apple-gray-50 border border-apple-gray-100 rounded-2xl focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all font-bold text-base text-apple-gray-900"
                                value={formData.mode === 'Virtual' ? formData.link : formData.location}
                                onChange={e => formData.mode === 'Virtual' ? setFormData({ ...formData, link: e.target.value }) : setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-apple-blue text-slate-900 rounded-2xl flex items-center justify-center gap-3 hover:bg-apple-blue-dark transition-all shadow-apple-hover group disabled:opacity-50"
                        >
                            <Send className={cn("h-4 w-4 transition-transform", loading ? "animate-ping" : "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                            <span className="font-black uppercase tracking-[0.2em] text-base">
                                {loading ? "Synchronizing..." : "Initialize Protocol"}
                            </span>
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-apple-gray-300">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Secure Deployment Active
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
