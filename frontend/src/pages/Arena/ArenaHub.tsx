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
        <div className="pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700 italic selection:bg-indigo-500 selection:text-white">

            {/* ── Hero Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-[#080B1A] rounded-[60px] p-16 text-white mb-14 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            >
                {/* Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

                {/* Live Ticker */}
                <div className="absolute top-6 right-8 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md overflow-hidden max-w-xs">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={tickerIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-300 truncate"
                        >
                            {TICKER_MESSAGES[tickerIdx]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="h-16 w-16 rounded-[28px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.4)] border border-white/20"
                            >
                                <Swords className="h-8 w-8 text-white" />
                            </motion.div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400">Collaborative Intelligence Network</p>
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Decentralized Knowledge Protocol</p>
                            </div>
                        </div>

                        <h1 className="text-7xl md:text-8xl font-black tracking-[-0.05em] leading-[0.9] mb-8 uppercase">
                            The{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                                Arena
                            </span>
                        </h1>
                        <p className="text-slate-400 text-xl font-bold leading-relaxed max-w-2xl">
                            A decentralized node for student intelligence. Share interview protocols, solve logical bottlenecks, and build the{' '}
                            <span className="text-white italic underline decoration-indigo-500 underline-offset-4">peer-to-peer knowledge graph</span>.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 shrink-0">
                        {[
                            { label: 'Active Nodes', value: '1.2k+', icon: Users, color: 'text-indigo-400' },
                            { label: 'Weekly Intel', value: '450', icon: Flame, color: 'text-orange-400' },
                            { label: 'Protocols', value: '98%', icon: Shield, color: 'text-emerald-400' },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-[40px] text-center min-w-[140px] backdrop-blur-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <s.icon className={cn("h-5 w-5 mx-auto mb-3", s.color)} />
                                <p className="text-4xl font-black tracking-tighter italic mb-1">{s.value}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="relative z-10 mt-14 flex gap-4">
                    {(['Experiences', 'Discussions'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative px-10 py-4 rounded-[30px] font-black italic uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-3 overflow-hidden",
                                activeTab === tab
                                    ? "bg-white text-slate-900 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {tab === 'Experiences' ? <History className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            {tab === 'Experiences' ? 'Interview Protocols' : 'Logic Discussions'}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-white rounded-[30px] -z-10"
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
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                                {activeTab === 'Experiences' ? 'Shared Protocols' : 'Active Flux'}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">
                                {activeTab === 'Experiences' ? 'Real interview intelligence from the network' : 'Live discussion threads'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => activeTab === 'Experiences' ? setShowExpModal(true) : setShowDiscModal(true)}
                            className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[28px] font-black italic uppercase tracking-widest text-[11px] hover:bg-indigo-500 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)]"
                        >
                            <Plus className="h-4 w-4" />
                            {activeTab === 'Experiences' ? 'Post Intel' : 'Start Node'}
                        </motion.button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={arenaSearch}
                            onChange={(e) => { setArenaSearch(e.target.value); setArenaDisplayCount(8); }}
                            placeholder={activeTab === 'Experiences' ? "Search by company, role, tips..." : "Search by title, content, tags..."}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 rounded-[30px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all text-[11px]"
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
                                                <DiscussionCard key={disc._id} disc={disc} idx={idx} />
                                            ))}
                                            {hasMoreDisc && (
                                                <button
                                                    type="button"
                                                    onClick={() => setArenaDisplayCount((c) => c + 8)}
                                                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 rounded-[30px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all text-[11px]"
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
                        className="bg-white dark:bg-[#0A0C1B] p-10 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-24 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12" />
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Elite Contributors</h3>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Top intelligence nodes</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {[
                                { name: 'Arjun Mehta', intel: 34, badge: '🥇', color: 'text-amber-500' },
                                { name: 'Priya Sharma', intel: 28, badge: '🥈', color: 'text-slate-400' },
                                { name: 'Rohan Verma', intel: 21, badge: '🥉', color: 'text-orange-400' },
                            ].map((u, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 6 }}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-[25px] border border-transparent hover:border-indigo-500/20 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl">{u.badge}</span>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-tight">{u.name}</p>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{u.intel} Intel Shared</p>
                                        </div>
                                    </div>
                                    <Zap className={cn("h-4 w-4 fill-current", u.color)} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Live Ticker Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-900 via-[#0A0C1B] to-purple-950 p-10 rounded-[50px] text-white relative overflow-hidden shadow-[0_30px_60px_rgba(99,102,241,0.2)] border border-white/5"
                    >
                        <div className="absolute top-0 right-0 opacity-10 rotate-12 -mr-8 -mt-8">
                            <TrendingUp className="h-40 w-40" />
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="h-5 w-5 text-indigo-400 animate-pulse" />
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
                                        "flex gap-4 text-[10px] font-bold italic border-l-2 pl-4 py-1.5 transition-all",
                                        i === tickerIdx % 4 ? "border-indigo-400 text-white" : "border-indigo-800 text-slate-500"
                                    )}
                                >
                                    <Clock className="h-3 w-3 shrink-0 mt-0.5 opacity-50" />
                                    {msg}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="p-10 bg-white dark:bg-[#060813] border border-slate-100 dark:border-white/5 rounded-[50px] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 italic">Quick Actions</p>
                        <div className="space-y-4">
                            {[
                                { label: 'Share Interview Intel', icon: Sparkles, color: 'bg-indigo-600', action: () => setShowExpModal(true) },
                                { label: 'Start Discussion', icon: MessageSquare, color: 'bg-purple-600', action: () => setShowDiscModal(true) },
                            ].map((a, i) => (
                                <button
                                    key={i}
                                    onClick={a.action}
                                    className="w-full flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-[25px] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all group"
                                >
                                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", a.color)}>
                                        <a.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 italic">{a.label}</span>
                                    <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</label>
                                    <select className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-white outline-none" value={expForm.difficulty} onChange={e => setExpForm({ ...expForm, difficulty: e.target.value })}>
                                        {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verdict</label>
                                    <select className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-white outline-none" value={expForm.verdict} onChange={e => setExpForm({ ...expForm, verdict: e.target.value })}>
                                        {['Selected', 'Rejected', 'Waitlisted'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Strategic Tips</label>
                                <textarea className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all font-bold min-h-[100px] text-slate-900 dark:text-white outline-none resize-none" placeholder="Focus on OS, DBMS, specific coding patterns..." value={expForm.tips} onChange={e => setExpForm({ ...expForm, tips: e.target.value })} />
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content Spectrum</label>
                                <textarea className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all font-bold min-h-[150px] text-slate-900 dark:text-white outline-none resize-none" placeholder="Explain your logic bottleneck..." value={discForm.content} onChange={e => setDiscForm({ ...discForm, content: e.target.value })} />
                            </div>
                            <ModalInput label="Tags (Comma Delimited)" placeholder="python, backend, algorithms..." value={discForm.tags} onChange={v => setDiscForm({ ...discForm, tags: v })} />
                            <button onClick={handlePostDiscussion} className="w-full py-5 bg-[#1E2342] text-white rounded-[30px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <MessageSquare className="h-5 w-5" /> Initialize Flux
                            </button>
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
        setLikeCount(c => (liked ? c - 1 : c + 1));
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
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-[#0A0C1B] p-10 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden"
        >
            <div className="absolute -top-20 -right-20 h-60 w-60 bg-indigo-500/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[28px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-indigo-200 dark:shadow-none border-2 border-white/20">
                        {exp.studentId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white italic uppercase tracking-tighter text-2xl leading-none">
                            {exp.company} <span className="text-slate-400 text-base font-bold">/ {exp.role}</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mt-2">
                            <span>{exp.studentId?.name}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{exp.studentId?.branch}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
                <span className={cn("px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border italic", verdictColor)}>
                    {exp.verdict}
                </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 font-bold italic mb-8 line-clamp-2 text-lg leading-relaxed">{exp.tips}</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {exp.roundWiseDetails?.map((round: any, i: number) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-white/5 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10">
                        {round.roundName}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors group/like",
                            liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                        )}
                    >
                        <Heart className={cn("h-4 w-4 group-hover/like:scale-125 transition-transform", liked && "fill-rose-500")} /> {likeCount}
                    </button>
                    <button
                        type="button"
                        onClick={handleDiscuss}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" /> Discuss
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleShare}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl text-slate-300 hover:text-slate-600 transition-all"
                    aria-label="Share"
                >
                    <Share2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}

function DiscussionCard({ disc, idx }: { disc: any; idx: number }) {
    const handleJoinNode = () => {
        toast.success(`Joined discussion: ${disc.title}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-[#0A0C1B] p-10 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-purple-100 dark:hover:border-purple-500/20 transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[11px] font-black italic text-white shadow-md">
                    {disc.studentId?.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{disc.studentId?.name} Node</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(disc.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">{disc.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 font-bold italic mb-8 line-clamp-3 leading-relaxed">{disc.content}</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {disc.tags?.map((tag: any, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                    ))}
                    <div className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                        +{disc.replies?.length || 0}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleJoinNode}
                    className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-7 py-3.5 rounded-[25px] text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-500/20"
                >
                    Join Node <Swords className="h-3.5 w-3.5" />
                </button>
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
                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic uppercase">{label}</h3>
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
                className="relative bg-white dark:bg-[#0A0C1B] w-full max-w-2xl rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 dark:border-white/5"
            >
                <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{title}</h3>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">{sub}</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <input
                type={type}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-white outline-none italic placeholder:text-slate-400 dark:placeholder:text-slate-700"
                placeholder={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
        </div>
    );
}
