import { useNavigate, Link } from "react-router-dom";
import {
    GraduationCap, ArrowRight, Zap, Shield, TrendingUp,
    CheckCircle2, Globe, Users, LogOut, LayoutDashboard
} from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../utils/cn";

export default function LandingPage() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any }
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden selection:bg-apple-blue/10">
            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 apple-glass border-b border-apple-gray-100 px-6 sm:px-12 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 bg-apple-blue rounded-[12px] flex items-center justify-center shadow-lg shadow-apple-blue/15">
                        <GraduationCap className="h-5.5 w-5.5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-apple-gray-900 font-black text-lg tracking-tight leading-none uppercase">PlacementCell</p>
                        <p className="text-apple-blue font-black text-[8px] tracking-[0.3em] uppercase mt-1">Intelligence Nexus</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="apple-btn-primary px-6 py-2.5 text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="h-10 px-5 rounded-[14px] bg-apple-gray-50 border border-apple-gray-100 text-apple-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="apple-btn-primary px-8 py-3 text-[13px] font-black uppercase tracking-widest group">
                            <span className="flex items-center gap-2">
                                Enter Portal
                                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* ── HERO SECTION ────────────────────────────────────────── */}
            <section className="relative pt-40 pb-20 px-8">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-apple-blue/5 blur-[120px]" />
                    <motion.div style={{ y: y2 }} className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] rounded-full bg-indigo-50/20 blur-[130px]" />
                </div>

                <motion.div
                    style={{ opacity }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-blue/5 border border-apple-blue/10 mb-8">
                        <Zap className="h-3.5 w-3.5 text-apple-blue fill-apple-blue" />
                        <span className="text-[10px] font-black text-apple-blue uppercase tracking-[0.3em]">Version 5.0 — Evolution</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-black text-apple-gray-900 tracking-tighter leading-[0.95] mb-10 italic uppercase"
                    >
                        Redefining the <br />
                        <span className="text-apple-blue">Hiring Universe.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-apple-gray-400 text-lg md:text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto mb-12 leading-relaxed opacity-60"
                    >
                        Neural matching, architectural clarity, and systematic placement orchestration for the next generation.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        {isAuthenticated ? (
                            <button onClick={() => navigate("/dashboard")} className="apple-btn-primary px-12 py-5 text-[15px] font-black uppercase tracking-widest shadow-2xl shadow-apple-blue/30 group">
                                <span className="flex items-center gap-3">
                                    Return to Command Center
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="apple-btn-primary px-12 py-5 text-[15px] font-black uppercase tracking-widest shadow-2xl shadow-apple-blue/30 group">
                                    <span className="flex items-center gap-3">
                                        Establish Access
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link to="/register" className="h-16 px-10 rounded-[28px] bg-white border border-apple-gray-100 hover:border-apple-gray-200 hover:bg-apple-gray-50 flex items-center justify-center text-apple-gray-900 font-black text-[14px] uppercase tracking-widest transition-all">
                                    Apply Now
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── FEATURES GRID ────────────────────────────────────────── */}
            <section className="py-24 px-8 bg-apple-gray-50/50 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-apple-gray-100 to-transparent" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                label: "Enterprise Security",
                                title: "Verified Protocols",
                                desc: "End-to-end encryption for every dossier and placement transaction."
                            },
                            {
                                icon: TrendingUp,
                                label: "Neural Intelligence",
                                title: "Resonant Matching",
                                desc: "AI algorithms that align talent nodes with precision industry requirements."
                            },
                            {
                                icon: Globe,
                                label: "Partner Network",
                                title: "Global Reach",
                                desc: "Connecting thousands of students with the world's elite recruitment hubs."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-10 bg-white border border-apple-gray-50 rounded-[40px] shadow-sm hover:shadow-apple-lg hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="h-14 w-14 rounded-[22px] bg-apple-blue/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6 text-apple-blue" />
                                </div>
                                <p className="text-[10px] font-black text-apple-blue uppercase tracking-[0.3em] mb-3">{feature.label}</p>
                                <h3 className="text-2xl font-black text-apple-gray-900 tracking-tight uppercase mb-4 italic leading-none">{feature.title}</h3>
                                <p className="text-apple-gray-400 font-bold text-[13px] uppercase tracking-widest leading-relaxed opacity-60">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────── */}
            <footer className="py-20 px-8 bg-white border-t border-apple-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-apple-gray-900" />
                        <span className="font-extrabold uppercase tracking-tight text-apple-gray-900">PlacementCell v5.0</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Intelligence Nexus</p>
                        <p className="text-[10px] font-black uppercase tracking-widest">Privacy Protocol</p>
                        <p className="text-[10px] font-black uppercase tracking-widest">Terms of Entry</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
