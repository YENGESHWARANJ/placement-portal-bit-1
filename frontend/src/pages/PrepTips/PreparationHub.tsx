import { motion } from 'framer-motion';
import {
    Brain, Code2, Mic2, BookOpen, Trophy,
    Sparkles, TrendingUp, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const PREP_MODULES = [
    { id: 'aptitude', title: 'Cognitive', subtitle: 'Aptitude & Logic', icon: Brain, color: 'bg-indigo-600', desc: 'Quantitative, logical, and verbal matrix decoding.', tags: ['Logic', 'Math', 'IQ'], href: '/aptitude-test' },
    { id: 'coding', title: 'Synapse', subtitle: 'Algorithmic Drills', icon: Code2, color: 'bg-rose-600', desc: 'Dynamic programming, data structures, and optimization.', tags: ['DP', 'Graphs', 'BigO'], href: '/coding-test' },
    { id: 'interview', title: 'Echo', subtitle: 'Voice Analysis', icon: Mic2, color: 'bg-emerald-600', desc: 'AI-driven sentiment analysis and behavior decoding.', tags: ['HR', 'Speech', 'EQ'], href: '/interview-test' },
    { id: 'qa', title: 'Library', subtitle: 'Strategic Assets', icon: BookOpen, color: 'bg-amber-600', desc: 'Curated repository of top-tier company resources.', tags: ['Docs', 'PDF', 'SOPs'], href: '/interview-qa' },
];

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
    }
};

const HeaderBackground = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] -ml-72 -mb-72" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </div>
);

export default function PreparationHub() {
    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 sm:space-y-20 pb-24"
        >
            {/* Elite Daily Protocol Header */}
            <motion.div variants={stagger.item} className="relative group">
                <HeaderBackground />
                <div className="relative bg-white border border-slate-100 p-6 sm:p-14 md:p-20 rounded-3xl sm:rounded-[70px] border border-slate-100 overflow-hidden shadow-2xl">
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-12 sm:gap-16 relative z-10">
                        <div className="max-w-4xl text-center xl:text-left">
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 mb-6 sm:mb-10">
                                <span className="px-6 py-2 bg-blue-600/10 text-blue-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] border border-blue-500/20 italic">
                                    BIT_Protocol_Alpha_Active
                                </span>
                                <span className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                    Live_Sync
                                </span>
                            </div>
                            <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-[-0.05em] sm:tracking-[-0.08em] italic mb-6 sm:mb-8 leading-[0.9] text-slate-900 uppercase drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                MASTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">UNEXPECTED</span>
                            </h2>
                            <p className="text-slate-500 text-lg sm:text-2xl md:text-3xl font-bold leading-tight max-w-2xl mb-12 italic">
                                BIT AI has detected a surge in Dynammic Programming questions at top firms. Prepare for <span className="text-slate-900">Optimal BIT Readiness.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 sm:gap-6">
                                <Link to="/coding-test" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-md shadow-slate-200/40 shadow-blue-500/30 flex items-center justify-center gap-4">
                                    Initialize Session <Code2 className="h-4 w-4" />
                                </Link>
                                <Link to="/interview-test" className="w-full sm:w-auto px-10 py-5 bg-slate-50 text-slate-900 font-black rounded-2xl text-xs sm:text-sm uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-4">
                                    Mock Drill <Mic2 className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex gap-4 sm:gap-8 shrink-0 w-full xl:w-auto">
                            <div className="flex-1 xl:flex-none apple-card p-6 sm:p-10 bg-white border border-slate-100 rounded-3xl sm:rounded-[60px] text-center min-w-[120px] sm:min-w-[280px] shadow-md shadow-slate-200/40 relative overflow-hidden group/stat">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                                <Trophy className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-6 sm:mb-8 text-yellow-500 transition-transform group-hover/stat:scale-125" />
                                <p className="text-6xl sm:text-8xl font-black tracking-tighter italic mb-2 text-slate-900 drop-shadow-lg leading-none">12</p>
                                <p className="text-[10px] sm:text-base font-black uppercase tracking-[0.4em] text-slate-500 italic">Day_Streak</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Preparation Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                {PREP_MODULES.map((module) => (
                    <motion.div
                        key={module.id}
                        variants={stagger.item}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="apple-card p-6 sm:p-10 flex flex-col justify-between hover:shadow-apple-hover transition-all duration-500 relative overflow-hidden group min-h-[auto] sm:min-h-[440px] bg-white border border-apple-gray-50 dark:bg-slate-500 dark:border-slate-100 rounded-3xl"
                    >
                        <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-3xl", module.color)} />

                        <div>
                            <div className={cn("h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-[22px] flex items-center justify-center mb-10 shadow-lg text-slate-900 group-hover:rotate-6 transition-transform", module.color)}>
                                <module.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-apple-gray-900 dark:text-slate-900 tracking-tight leading-none mb-2 italic uppercase">{module.title}</h3>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-apple-gray-400 mb-6">{module.subtitle}</p>
                            <p className="text-base sm:text-lg font-medium text-apple-gray-500 dark:text-slate-500 leading-relaxed mb-8">{module.desc}</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-2">
                                {module.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-apple-gray-50 dark:bg-slate-50 text-apple-gray-400 rounded-full border border-apple-gray-100 dark:border-slate-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <Link
                                to={module.href}
                                className="w-full py-4 sm:py-5 bg-white dark:bg-white text-slate-900 dark:text-black rounded-2xl sm:rounded-[22px] font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-black dark:hover:bg-white/90 transition-all active:scale-95"
                            >
                                START NODE <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Neural Insights Section */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-10">
                <motion.div variants={stagger.item} className="lg:col-span-2 apple-card p-8 sm:p-12 bg-white dark:bg-slate-500 border border-apple-gray-50 dark:border-slate-100 relative overflow-hidden group shadow-xl">
                    <div className="absolute bottom-0 right-0 p-40 bg-apple-blue/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />
                    <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-12 relative z-10">
                        <div className="w-28 h-28 sm:w-40 sm:h-40 bg-apple-gray-50 dark:bg-slate-50 rounded-[35px] sm:rounded-[45px] flex items-center justify-center shrink-0 border border-apple-gray-100 dark:border-slate-100 shadow-inner group-hover:rotate-12 transition-transform">
                            <Sparkles className="h-10 w-10 sm:h-16 sm:w-16 text-apple-blue" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-3xl sm:text-4xl font-black text-apple-gray-900 dark:text-slate-900 tracking-tighter italic mb-4 uppercase">Neural Insights</h4>
                            <p className="text-lg sm:text-xl font-bold text-apple-gray-400 leading-relaxed mb-8 sm:mb-10 italic">
                                Intelligence layer synchronized. Cross-referencing results with <span className="text-apple-blue italic">Fortune 500</span> demand matrix.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/analytics-hub" className="w-full sm:w-auto text-center px-10 py-5 bg-apple-blue/10 text-apple-blue font-black rounded-2xl text-[10px] sm:text-xs uppercase tracking-widest hover:bg-apple-blue hover:text-slate-900 transition-all">
                                    Gap Analysis
                                </Link>
                                <Link to="/prep-tips" className="w-full sm:w-auto text-center px-10 py-5 bg-white dark:bg-white text-slate-900 dark:text-black font-black rounded-2xl text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-white/90 transition-all">
                                    View Dossier
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={stagger.item} className="apple-card p-10 sm:p-14 bg-white text-slate-900 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-1000" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10 sm:mb-14">
                            <TrendingUp className="h-6 w-6 text-emerald-500 animate-pulse" />
                            <p className="text-xs sm:text-base font-black uppercase tracking-[0.4em] text-slate-500 italic">ELO_VELOCITY</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-black tracking-tight leading-tight italic uppercase mb-2">
                            RANKED TOP <span className="text-emerald-500 underline decoration-emerald-500/30 decoration-4 underline-offset-8 italic">5%</span> GLOBALLY.
                        </p>
                        <p className="text-slate-500 text-sm font-black tracking-widest italic uppercase">Market_Resonance: High</p>
                    </div>
                    <div className="relative z-10 mt-12 pt-8 border-t border-slate-100">
                        <p className="text-[10px] sm:text-base font-bold text-slate-500 italic uppercase mb-4 tracking-widest">Next Milestone: Platinum Architect</p>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
