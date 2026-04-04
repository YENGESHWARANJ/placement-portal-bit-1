import React, { useEffect, useState } from 'react';
import {
    Swords, MessageSquare, MessageCircle, History, Trophy,
    TrendingUp, Share2, Heart, Plus, Tag, Zap, X, Search,
    Flame, Globe, Users, Activity, Star, ChevronRight,
    Sparkles, Shield, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const TICKER_MESSAGES = [
    "Google results synchronized in Block A",
    "New Interview Protocol: Microsoft SDE-1",
    "System Design flux increasing in CSE Dept",
    "Mock Arena sessions starting at 18:00",
    "Amazon OA round decoded — 3 new patterns shared",
    "Flipkart SDE-2 protocol uploaded by Node_Arjun",
];

export default function ArenaHub() {
    const [activeTab, setActiveTab] = useState<'Experiences' | 'Discussions'>('Experiences');
    const [experiences, setExperiences] = useState<any[]>([]);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showExpModal, setShowExpModal] = useState(false);
    const [showDiscModal, setShowDiscModal] = useState(false);
    const [tickerIdx, setTickerIdx] = useState(0);
    const [expForm, setExpForm] = useState({
        company: '', role: '', difficulty: 'Medium',
        verdict: 'Selected', tips: '',
        roundWiseDetails: [{ roundName: 'Technical Round 1', details: '' }]
    });
    const [discForm, setDiscForm] = useState({ title: '', content: '', tags: '' });
    const [arenaSearch, setArenaSearch] = useState("");
    const [arenaDisplayCount, setArenaDisplayCount] = useState(8);
    const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res: any = await api.get('/students/leaderboard');
            setLeaderboard(res.data.leaderboard || []);
        } catch (e) {
            console.error("Failed to sync ELO ratings", e);
        }
    };


    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIdx(i => (i + 1) % TICKER_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'Experiences') {
                const res: any = await api.get('/arena/experience');
                setExperiences(res.data.experiences || []);
            } else {
                const res: any = await api.get('/arena/discussion');
                setDiscussions(res.data.discussions || []);
            }
        } catch {
            toast.error("Failed to sync with The Arena");
        } finally {
            setLoading(false);
        }
    };

    const handlePostExperience = async () => {
        try {
            await api.post('/arena/experience', expForm);
            toast.success("Intelligence shared in the network");
            setShowExpModal(false);
            fetchData();
        } catch {
            toast.error("Failed to transmit protocol");
        }
    };

    const handlePostDiscussion = async () => {
        try {
            const payload = { ...discForm, tags: discForm.tags.split(',').map(t => t.trim()).filter(t => t) };
            await api.post('/arena/discussion', payload);
            toast.success("Discussion node initialized");
            setShowDiscModal(false);
            fetchData();
        } catch {
            toast.error("Failed to start discussion flux");
        }
    };

    const handlePostReply = async () => {
        if (!replyContent.trim()) return;
        setSubmittingReply(true);
        try {
            const res: any = await api.post(`/arena/reply/${selectedDiscussion._id}`, { content: replyContent });
            toast.success("Reply added to the flux");
            setReplyContent("");
            setSelectedDiscussion(res.data.discussion);
            fetchData();
        } catch {
            toast.error("Failed to post reply");
        } finally {
            setSubmittingReply(false);
        }
    };


    const filterExperiences = (list: any[]) => {
        if (!arenaSearch.trim()) return list;
        const q = arenaSearch.toLowerCase();
        return list.filter(
            (e: any) =>
                (e.company || "").toLowerCase().includes(q) ||
                (e.role || "").toLowerCase().includes(q) ||
                (e.tips || "").toLowerCase().includes(q) ||
                (e.verdict || "").toLowerCase().includes(q) ||
                (e.studentId?.name || "").toLowerCase().includes(q)
        );
    };
    const filterDiscussions = (list: any[]) => {
        if (!arenaSearch.trim()) return list;
        const q = arenaSearch.toLowerCase();
        return list.filter(
            (d: any) =>
                (d.title || "").toLowerCase().includes(q) ||
                (d.content || "").toLowerCase().includes(q) ||
                (Array.isArray(d.tags) ? d.tags.join(" ").toLowerCase() : "").includes(q) ||
                (d.studentId?.name || "").toLowerCase().includes(q)
        );
    };
    const filteredExperiences = filterExperiences(experiences);
    const filteredDiscussions = filterDiscussions(discussions);
    const displayedExperiences = filteredExperiences.slice(0, arenaDisplayCount);
    const displayedDiscussions = filteredDiscussions.slice(0, arenaDisplayCount);
    const hasMoreExp = filteredExperiences.length > arenaDisplayCount;
    const hasMoreDisc = filteredDiscussions.length > arenaDisplayCount;

    return (
        <div className="pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700 italic selection:bg-indigo-500 selection:text-slate-900">

            {/* ── Hero Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="neural-map relative overflow-hidden bg-[#080B1A] rounded-3xl sm:rounded-[60px] p-6 sm:p-16 text-slate-900 mb-10 sm:mb-14 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-slate-100"
            >
                {/* Hot Topics Bar */}
                <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                    {['#Google_OA', '#Microsoft_SDE2', '#System_Design', '#DSA_Blind75'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-sm font-black uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-md animate-pulse">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

                {/* Live Ticker */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-8 flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md overflow-hidden max-w-[150px] sm:max-w-xs">
                    <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={tickerIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] sm:text-base font-black uppercase tracking-widest text-slate-500 truncate"
                        >
                            {TICKER_MESSAGES[tickerIdx]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-5 mb-10">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                                className="h-20 w-20 rounded-[35px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl border border-slate-200 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                <Swords className="h-10 w-10 text-slate-900 relative z-10" />
                            </motion.div>
                            <div>
                                <p className="text-lg font-black uppercase tracking-[0.6em] text-indigo-600 italic">Neural Network Active</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Convergence Factor: 0.982_SECURE</p>
                            </div>
                        </div>

                        <h1 className="text-5xl sm:text-8xl md:text-[10rem] font-black tracking-[-0.08em] leading-[0.85] mb-6 sm:mb-12 uppercase italic">
                            THE{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_50px_rgba(99,102,241,0.6)]">
                                ARENA
                            </span>
                        </h1>
                        <p className="text-slate-500 text-2xl font-bold leading-tight max-w-2xl italic">
                            The collective <span className="text-slate-900 italic underline decoration-indigo-500 decoration-4 underline-offset-8">neurological uplink</span> for elite candidate intelligence.
                        </p>
                    </div>

                    {/* Elite Stats Hub */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:flex lg:gap-10 shrink-0">
                        {[
                            { label: 'Network Sync', value: '4.8k', icon: Activity, color: 'text-cyan-600' },
                            { label: 'Intel Velocity', value: '+142%', icon: TrendingUp, color: 'text-indigo-600' }
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -15, backgroundColor: "rgba(255,255,255,0.08)" }}
                                className="bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-3xl sm:rounded-[50px] text-center min-w-0 sm:min-w-[200px] backdrop-blur-3xl shadow-md shadow-slate-200/40 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <s.icon className={cn("h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-4 sm:mb-6 transition-transform group-hover:scale-125", s.color)} />
                                <p className="text-3xl sm:text-5xl font-black tracking-tighter italic mb-1 sm:mb-2 text-slate-900 drop-shadow-lg">{s.value}</p>
                                <p className="text-[10px] sm:text-base font-black uppercase tracking-[0.4em] text-slate-500 italic">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="relative z-10 mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4">
                    {(['Experiences', 'Discussions'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative px-6 sm:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-[30px] font-black italic uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 flex items-center justify-center sm:justify-start gap-3 overflow-hidden",
                                activeTab === tab
                                    ? "bg-white text-slate-900 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            {tab === 'Experiences' ? <History className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            {tab === 'Experiences' ? 'Interview Protocols' : 'Logic Discussions'}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-white rounded-2xl sm:rounded-[30px] -z-10"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Feed */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-slate-900">
                                {activeTab === 'Experiences' ? 'Shared Protocols' : 'Active Flux'}
                            </h2>
                            <p className="text-base font-black uppercase tracking-[0.3em] text-slate-500 mt-1">
                                {activeTab === 'Experiences' ? 'Real interview intelligence from the network' : 'Live discussion threads'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => activeTab === 'Experiences' ? setShowExpModal(true) : setShowDiscModal(true)}
                            className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[28px] font-black italic uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)]"
                        >
                            <Plus className="h-4 w-4" />
                            {activeTab === 'Experiences' ? 'Post Intel' : 'Start Node'}
                        </motion.button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            value={arenaSearch}
                            onChange={(e) => { setArenaSearch(e.target.value); setArenaDisplayCount(8); }}
                            placeholder={activeTab === 'Experiences' ? "Search by company, role, tips..." : "Search by title, content, tags..."}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-52 bg-slate-100 dark:bg-slate-800/50 rounded-[45px] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {activeTab === 'Experiences' ? (
                                    displayedExperiences.length === 0 ? (
                                        <EmptyState
                                            label={filteredExperiences.length === 0 && experiences.length > 0 ? "No matches" : "No protocols shared yet"}
                                            sub={arenaSearch ? "Try a different search." : "Be the first to upload your interview intelligence."}
                                        />
                                    ) : (
                                        <>
                                            {displayedExperiences.map((exp: any, idx: number) => (
                                                <ExperienceCard key={exp._id} exp={exp} idx={idx} />
                                            ))}
                                            {hasMoreExp && (
                                                <button
                                                    type="button"
                                                    onClick={() => setArenaDisplayCount((c) => c + 8)}
                                                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 rounded-[30px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all text-sm"
                                                >
                                                    Load more ({filteredExperiences.length - arenaDisplayCount} more)
                                                </button>
                                            )}
                                        </>
                                    )
                                ) : (
                                    displayedDiscussions.length === 0 ? (
                                        <EmptyState
                                            label={filteredDiscussions.length === 0 && discussions.length > 0 ? "No matches" : "No discussions yet"}
                                            sub={arenaSearch ? "Try a different search." : "Initialize the first logic flux node."}
                                        />
                                    ) : (
                                        <>
                                            {displayedDiscussions.map((disc: any, idx: number) => (
                                                <DiscussionCard key={disc._id} disc={disc} idx={idx} onClick={() => setSelectedDiscussion(disc)} />
                                            ))}
                                            {hasMoreDisc && (
                                                <button
                                                    type="button"
                                                    onClick={() => setArenaDisplayCount((c) => c + 8)}
                                                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 rounded-[30px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all text-sm"
                                                >
                                                    Load more ({filteredDiscussions.length - arenaDisplayCount} more)
                                                </button>
                                            )}
                                        </>
                                    )
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-slate-100 p-6 sm:p-10 rounded-3xl sm:rounded-[60px] border border-slate-100 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-amber-500/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
                        <div className="flex items-center gap-5 mb-12">
                            <div className="h-14 w-14 rounded-[25px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-slate-200">
                                <Trophy className="h-7 w-7 text-slate-900" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Elite Nodes</h3>
                                <p className="text-base font-black uppercase tracking-[0.4em] text-slate-500 mt-1">High-trust contributors</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {leaderboard.length === 0 && (
                                <div className="text-center py-6 text-slate-500 text-base font-black uppercase tracking-widest">Loading ELO Rankings...</div>
                            )}
                            {leaderboard.slice(0, 5).map((u, i) => {
                                const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️';
                                const color = i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-500' : i === 2 ? 'text-orange-400' : 'text-indigo-600';
                                const rankName = i === 0 ? 'ARCHITECT' : i === 1 ? 'ELITE' : i <= 3 ? 'VOYAGER' : 'CHALLENGER';
                                return (
                                    <motion.div
                                        key={u._id}
                                        whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.04)" }}
                                        className="flex items-center justify-between p-5 bg-white/[0.02] rounded-[30px] border border-slate-100 hover:border-indigo-500/30 transition-all cursor-crosshair group/item"
                                    >
                                        <div className="flex items-center gap-5">
                                            <span className="text-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] flex shrink-0 justify-center w-8">{badge}</span>
                                            <div>
                                                <p className="text-lg font-black uppercase text-slate-900 tracking-tight truncate max-w-[120px]">{u.name}</p>
                                                <p className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em]">{rankName} · ELO {u.totalScore}</p>
                                                <div className="flex items-center gap-1 mt-1 text-base grayscale-[0.2]">
                                                    {(u.codingScore || 0) >= 80 && <span title="Code Ninja">💻</span>}
                                                    {(u.aptitudeScore || 0) >= 80 && <span title="Logic Master">🧠</span>}
                                                    {(u.interviewScore || 0) >= 80 && <span title="Silver Tongue">🎤</span>}
                                                    {(u.resumeScore || 0) >= 80 && <span title="Profile Perfect">✨</span>}
                                                    {(u.cgpa || 0) >= 9.0 && <span title="Scholar">🎓</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Zap className={cn("h-4 w-4 fill-current transition-transform group-hover/item:scale-125 group-hover/item:rotate-12", color)} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Live Ticker Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-900 via-[#0A0C1B] to-purple-950 p-6 sm:p-10 rounded-3xl sm:rounded-[50px] text-slate-900 relative overflow-hidden shadow-[0_30px_60px_rgba(99,102,241,0.2)] border border-slate-100"
                    >
                        <div className="absolute top-0 right-0 opacity-10 rotate-12 -mr-8 -mt-8">
                            <TrendingUp className="h-40 w-40" />
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="h-5 w-5 text-indigo-600 animate-pulse" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Live Intel Feed</h3>
                        </div>
                        <div className="space-y-5">
                            {TICKER_MESSAGES.slice(0, 4).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={cn(
                                        "flex gap-4 text-base font-bold italic border-l-2 pl-4 py-1.5 transition-all",
                                        i === tickerIdx % 4 ? "border-indigo-400 text-slate-900" : "border-indigo-800 text-slate-500"
                                    )}
                                >
                                    <Clock className="h-3 w-3 shrink-0 mt-0.5 opacity-50" />
                                    {msg}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="p-6 sm:p-10 bg-white dark:bg-[#060813] border border-slate-100 dark:border-slate-100 rounded-3xl sm:rounded-[50px] shadow-sm">
                        <p className="text-base font-black uppercase tracking-[0.4em] text-slate-500 mb-8 italic">Quick Actions</p>
                        <div className="space-y-4">
                            {[
                                { label: 'Share Interview Intel', icon: Sparkles, color: 'bg-indigo-600', action: () => setShowExpModal(true) },
                                { label: 'Start Discussion', icon: MessageSquare, color: 'bg-purple-600', action: () => setShowDiscModal(true) },
                            ].map((a, i) => (
                                <button
                                    key={i}
                                    onClick={a.action}
                                    className="w-full flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-50 rounded-[25px] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all group"
                                >
                                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shrink-0", a.color)}>
                                        <a.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-500 italic">{a.label}</span>
                                    <ChevronRight className="h-4 w-4 text-slate-500 ml-auto group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Post Experience Modal ── */}
            <AnimatePresence>
                {showExpModal && (
                    <Modal title="Share Protocol" sub="Interview intelligence uplink" onClose={() => setShowExpModal(false)}>
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <ModalInput label="Entity / Company" placeholder="Google, Microsoft..." value={expForm.company} onChange={v => setExpForm({ ...expForm, company: v })} />
                                <ModalInput label="Designation / Role" placeholder="SDE Intern..." value={expForm.role} onChange={v => setExpForm({ ...expForm, role: v })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1">Difficulty</label>
                                    <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-slate-900 outline-none" value={expForm.difficulty} onChange={e => setExpForm({ ...expForm, difficulty: e.target.value })}>
                                        {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1">Verdict</label>
                                    <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-slate-900 outline-none" value={expForm.verdict} onChange={e => setExpForm({ ...expForm, verdict: e.target.value })}>
                                        {['Selected', 'Rejected', 'Waitlisted'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1">Strategic Tips</label>
                                <textarea className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold min-h-[100px] text-slate-900 dark:text-slate-900 outline-none resize-none" placeholder="Focus on OS, DBMS, specific coding patterns..." value={expForm.tips} onChange={e => setExpForm({ ...expForm, tips: e.target.value })} />
                            </div>
                            <button onClick={handlePostExperience} className="w-full py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Zap className="h-5 w-5" /> Broadcast Protocol
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* ── Start Discussion Modal ── */}
            <AnimatePresence>
                {showDiscModal && (
                    <Modal title="Start Node" sub="Initialize logic discussion flux" onClose={() => setShowDiscModal(false)}>
                        <div className="space-y-8">
                            <ModalInput label="Header / Title" placeholder="DP optimization, System Design doubts..." value={discForm.title} onChange={v => setDiscForm({ ...discForm, title: v })} />
                            <div className="space-y-2">
                                <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1">Content Spectrum</label>
                                <textarea className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold min-h-[150px] text-slate-900 dark:text-slate-900 outline-none resize-none" placeholder="Explain your logic bottleneck..." value={discForm.content} onChange={e => setDiscForm({ ...discForm, content: e.target.value })} />
                            </div>
                            <ModalInput label="Tags (Comma Delimited)" placeholder="python, backend, algorithms..." value={discForm.tags} onChange={v => setDiscForm({ ...discForm, tags: v })} />
                            <button onClick={handlePostDiscussion} className="w-full py-5 bg-[#1E2342] text-slate-900 rounded-[30px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <MessageSquare className="h-5 w-5" /> Initialize Flux
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* ── Discussion Detail Modal ── */}
            <AnimatePresence>
                {selectedDiscussion && (
                    <Modal
                        title={selectedDiscussion.title}
                        sub={`Uplink from ${selectedDiscussion.studentId?.name || 'Anonymous'}`}
                        onClose={() => setSelectedDiscussion(null)}
                    >
                        <div className="space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-50 p-8 rounded-[40px] border border-slate-100 dark:border-slate-200">
                                <p className="text-slate-600 dark:text-slate-500 font-bold italic leading-relaxed whitespace-pre-wrap">{selectedDiscussion.content}</p>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {selectedDiscussion.tags?.map((tag: any, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-600 rounded-xl text-sm font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-base font-black uppercase tracking-[0.4em] text-slate-500 italic flex items-center gap-3">
                                    <MessageCircle className="h-3 w-3" /> Replies ({selectedDiscussion.replies?.length || 0})
                                </h4>

                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                    {selectedDiscussion.replies?.length === 0 ? (
                                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-50 rounded-[30px] border border-dashed border-slate-200 dark:border-slate-200">
                                            <p className="text-slate-500 text-base font-black uppercase tracking-widest italic">No replies in this node yet</p>
                                        </div>
                                    ) : (
                                        selectedDiscussion.replies?.map((reply: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white dark:bg-[#060813] p-6 rounded-[30px] border border-slate-100 dark:border-slate-100 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-base font-black text-slate-900">
                                                        {reply.studentId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-slate-500">{reply.studentId?.name || 'Anonymous'}</p>
                                                        <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{new Date(reply.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-500 text-xs font-bold italic leading-relaxed">{reply.content}</p>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-100 space-y-4">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Add your intelligence to this node..."
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs text-slate-900 dark:text-slate-900 outline-none resize-none min-h-[100px] italic"
                                    />
                                    <button
                                        disabled={submittingReply || !replyContent.trim()}
                                        onClick={handlePostReply}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-[25px] font-black uppercase tracking-widest text-base shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submittingReply ? (
                                            <Activity className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        Transmit Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

        </div>
    );
}

/* ── Sub-components ── */

function ExperienceCard({ exp, idx }: { exp: any; idx: number }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(exp.likes ?? 0);
    const verdictColor = exp.verdict === 'Selected'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : exp.verdict === 'Rejected'
            ? 'bg-rose-50 text-rose-600 border-rose-100'
            : 'bg-amber-50 text-amber-600 border-amber-100';

    const handleLike = () => {
        setLiked(prev => !prev);
        setLikeCount((c: number) => (liked ? c - 1 : c + 1));
        toast.success(liked ? 'Unliked' : 'Liked!');
    };

    const handleDiscuss = () => {
        toast('Discussion thread — coming soon. Reply in the Discussions tab.', { icon: '💬' });
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = `${exp.company} – ${exp.role} experience`;
        try {
            if (navigator.share) {
                await navigator.share({ title, url, text: exp.tips?.slice(0, 100) });
                toast.success('Shared');
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard');
            }
        } catch (e) {
            if ((e as Error).name !== 'AbortError') {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group bg-white border border-slate-100 p-6 sm:p-10 rounded-3xl sm:rounded-[60px] border border-slate-100 shadow-2xl hover:shadow-[0_20px_60px_rgba(99,102,241,0.1)] transition-all duration-500 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="absolute -top-20 -right-20 h-60 w-60 bg-indigo-500/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-6">
                    <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-[30px] blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                        <div className="h-16 w-16 rounded-[30px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 font-black italic text-2xl shadow-2xl relative z-10 border border-slate-200">
                            {exp.studentId?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-slate-900 italic uppercase tracking-tighter text-3xl leading-none mb-3 group-hover:text-indigo-600 transition-colors">
                            {exp.company} <span className="text-indigo-500/40 text-lg mx-2">/</span> <span className="text-slate-500 text-lg font-black">{exp.role}</span>
                        </h3>
                        <p className="text-base font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                            <Users className="h-3 w-3 text-indigo-600" />
                            <span className="text-slate-500">{exp.studentId?.name}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="text-indigo-600/60">{exp.studentId?.branch}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="flex items-center gap-1.5"><Clock className="h-2.5 w-2.5" /> {new Date(exp.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
                <div className={cn("px-6 py-2.5 rounded-2xl text-base font-black uppercase tracking-[0.3em] border shadow-lg italic backdrop-blur-md", verdictColor)}>
                    {exp.verdict}
                </div>
            </div>

            <p className="text-slate-600 dark:text-slate-500 font-bold italic mb-8 line-clamp-2 text-lg leading-relaxed">{exp.tips}</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {exp.roundWiseDetails?.map((round: any, i: number) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-200">
                        {round.roundName}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-100">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 text-base font-black uppercase tracking-widest transition-colors group/like",
                            liked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
                        )}
                    >
                        <Heart className={cn("h-4 w-4 group-hover/like:scale-125 transition-transform", liked && "fill-rose-500")} /> {likeCount}
                    </button>
                    <button
                        type="button"
                        onClick={handleDiscuss}
                        className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" /> Discuss
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleShare}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-50 rounded-2xl text-slate-500 hover:text-slate-600 transition-all"
                    aria-label="Share"
                >
                    <Share2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}

function DiscussionCard({ disc, idx, onClick }: { disc: any; idx: number; onClick: () => void }) {
    const handleJoinNode = () => {
        onClick();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            whileHover={{ y: -10, scale: 1.01 }}
            className="group bg-white border border-slate-100 p-6 sm:p-10 rounded-3xl sm:rounded-[60px] border border-slate-100 shadow-2xl hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)] transition-all duration-500 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="absolute -top-20 -left-20 h-64 w-64 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-[25px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-black italic text-slate-900 shadow-xl border border-slate-200">
                        {disc.studentId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-purple-400 italic">Node Origin: {disc.studentId?.name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Epoch: {new Date(disc.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20 text-purple-400">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Active Flux</span>
                </div>
            </div>

            <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-6 group-hover:text-purple-400 transition-colors leading-tight">{disc.title}</h3>
            <p className="text-slate-500 font-bold italic mb-10 line-clamp-3 leading-relaxed text-lg">{disc.content}</p>

            <div className="flex flex-wrap gap-2.5 mb-10">
                {disc.tags?.map((tag: any, i: number) => (
                    <span key={i} className="flex items-center gap-2 px-5 py-2 bg-slate-50 text-slate-500 rounded-2xl text-base font-black uppercase tracking-widest border border-slate-100 hover:border-purple-500/30 hover:text-purple-300 transition-all cursor-pointer">
                        <Tag className="h-3 w-3" /> {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-11 w-11 rounded-full border-2 border-[#0A0D1E] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-base font-black text-slate-900 shadow-xl relative overflow-hidden group/avatar">
                                <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                            </div>
                        ))}
                        <div className="h-11 w-11 rounded-full border-2 border-[#0A0D1E] bg-purple-600 flex items-center justify-center text-base font-black text-slate-900 shadow-xl relative z-10">
                            +{disc.replies?.length || 0}
                        </div>
                    </div>
                    <div>
                        <p className="text-base font-black text-slate-900 italic uppercase tracking-widest">Active Peers</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Current Node Occupancy</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(168,85,247,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleJoinNode}
                    className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[30px] text-sm font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200 hover:border-purple-500/40 hover:text-purple-400 transition-all shadow-lg"
                >
                    ENTER NODE <ChevronRight className="h-4 w-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

function EmptyState({ label, sub }: { label: string; sub: string }) {
    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[60px] p-24 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3 group-hover:rotate-12 transition-transform">
                    <Globe className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-slate-900 mb-4 tracking-tighter italic uppercase">{label}</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-bold text-sm uppercase tracking-widest italic">{sub}</p>
            </div>
        </div>
    );
}

function Modal({ title, sub, onClose, children }: { title: string; sub: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 italic">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-[#0A0C1B] w-full max-w-2xl rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 dark:border-slate-100"
            >
                <div className="p-10 border-b border-slate-100 dark:border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-slate-900 tracking-tighter uppercase italic">{title}</h3>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{sub}</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 bg-slate-50 dark:bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-10 max-h-[70vh] overflow-y-auto">{children}</div>
            </motion.div>
        </div>
    );
}

interface ModalInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}

function ModalInput({ label, placeholder, value, onChange, type = 'text' }: ModalInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
            <input
                type={type}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-slate-900 outline-none italic placeholder:text-slate-500 dark:placeholder:text-slate-700"
                placeholder={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
        </div>
    );
}
