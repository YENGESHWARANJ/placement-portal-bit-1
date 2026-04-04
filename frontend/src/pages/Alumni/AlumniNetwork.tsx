import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, GraduationCap, Award, MessageSquare, ChevronRight, X, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AlumniNetwork() {
    const [alumni, setAlumni] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumnus, setSelectedAlumnus] = useState<any | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [sendingRequest, setSendingRequest] = useState(false);

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const { data } = await api.get<{ success: boolean; alumni: any[] }>('/alumni/directory');
            if (data.success) {
                setAlumni(data.alumni);
            }
        } catch (err) {
            toast.error('Failed to load alumni directory');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestMentorship = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAlumnus || !requestMessage.trim()) return;

        setSendingRequest(true);
        try {
            const res = await api.post<{ message: string }>('/alumni/request-mentorship', {
                alumniId: selectedAlumnus._id,
                message: requestMessage
            });
            toast.success(res.data.message || 'Request Sent!');
            setSelectedAlumnus(null);
            setRequestMessage('');
        } catch (err) {
            toast.error('Failed to send request');
        } finally {
            setSendingRequest(false);
        }
    };

    const filteredAlumni = alumni.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-slate-900 uppercase tracking-tighter italic">Alumni <span className="text-indigo-600 dark:text-indigo-600">Network</span></h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Connect with Placed Graduates & Elite Mentors</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by company, role, or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Directory Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                    {filteredAlumni.map((alumnus, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={alumnus._id}
                            className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-200 rounded-[32px] p-6 hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full overflow-hidden relative"
                        >
                            {alumnus.mentorshipAvailable && (
                                <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl border-l border-b border-emerald-500/20">
                                    Mentorship Active
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-xl font-black text-indigo-600 dark:text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 shadow-inner">
                                    {alumnus.profilePicture ? (
                                        <img src={alumnus.profilePicture} alt={alumnus.name} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        alumnus.name?.charAt(0) || 'A'
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-slate-900 text-lg">{alumnus.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Class of {alumnus.year || '2023'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <p className="text-base font-black uppercase tracking-widest text-slate-500 mb-1">Current Role</p>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-900 text-sm">{alumnus.jobTitle}</span>
                                        <span className="text-indigo-600 dark:text-indigo-600 font-black text-sm flex items-center gap-1">@ {alumnus.currentCompany}</span>
                                    </div>
                                </div>

                                {alumnus.skills && alumnus.skills.length > 0 && (
                                    <div>
                                        <p className="text-base font-black uppercase tracking-widest text-slate-500 mb-2">Expertise</p>
                                        <div className="flex flex-wrap gap-2">
                                            {alumnus.skills.slice(0, 3).map((skill: string) => (
                                                <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-50 border border-slate-200 dark:border-slate-200 rounded-full text-base font-bold text-slate-600 dark:text-slate-500">
                                                    {skill}
                                                </span>
                                            ))}
                                            {alumnus.skills.length > 3 && (
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-50 border border-slate-200 dark:border-slate-200 rounded-full text-base font-bold text-slate-500">
                                                    +{alumnus.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedAlumnus(alumnus)}
                                className="mt-6 w-full py-4 bg-slate-50 dark:bg-slate-50 hover:bg-indigo-600 hover:text-slate-900 dark:hover:bg-indigo-500 rounded-[20px] font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-200"
                            >
                                <MessageSquare className="h-4 w-4" /> Request Mentorship
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Mentorship Modal */}
            <AnimatePresence>
                {selectedAlumnus && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAlumnus(null)}
                            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-2xl rounded-[40px] p-8 z-50"
                        >
                            <button onClick={() => setSelectedAlumnus(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-50 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900 transition-colors">
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-xl font-black">
                                    {selectedAlumnus.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-900">{selectedAlumnus.name}</h2>
                                    <p className="text-indigo-600 dark:text-indigo-600 font-bold text-sm">Mentee Application</p>
                                </div>
                            </div>

                            <form onSubmit={handleRequestMentorship} className="space-y-6">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2 block">Your Request Message</label>
                                    <textarea
                                        required
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        placeholder={`Hi ${selectedAlumnus.name.split(' ')[0]}, I'm interested in your journey at ${selectedAlumnus.currentCompany}...`}
                                        className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-200 rounded-2xl p-4 text-sm font-medium resize-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <p className="text-base text-slate-500 mt-2 font-medium">Keep it professional and specific. Explain what you'd like guidance on.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sendingRequest}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {sendingRequest ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageSquare className="h-5 w-5" />}
                                    {sendingRequest ? 'Sending...' : 'Send Request'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
