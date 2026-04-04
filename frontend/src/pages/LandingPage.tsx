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
        <div className="min-h-screen bg-white overflow-hidden selection:bg-indigo-100">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 sm:px-12 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-slate-900 font-black text-lg tracking-tight leading-none uppercase">BIT Placement</p>
                        <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest mt-1">Bannari Amman Institute of Technology</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="h-10 px-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest group hover:bg-indigo-700 transition-all">
                            <span className="flex items-center gap-2">
                                Login to Portal
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-24 px-8">
                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-50 blur-[120px]" />
                    <motion.div style={{ y: y2 }} className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] rounded-full bg-slate-50 blur-[130px]" />
                </div>

                <motion.div
                    style={{ opacity }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                        <Zap className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Empowering Student Careers</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8 uppercase"
                    >
                        Accelerating Your <br />
                        <span className="text-indigo-600">Professional Future.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-slate-500 text-lg sm:text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto mb-12 leading-relaxed px-4 opacity-70"
                    >
                        Connecting ambitious talent with leading global corporations through a unified placement ecosystem.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {isAuthenticated ? (
                            <button onClick={() => navigate("/dashboard")} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all group">
                                <span className="flex items-center gap-3">
                                    Return to Dashboard
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all group">
                                    <span className="flex items-center gap-3">
                                        Login to Portal
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link to="/login" className="px-10 py-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-black text-lg uppercase tracking-widest transition-all">
                                    Browse Drives
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-8 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Shield,
                                label: "Verified Partners",
                                title: "Trusted Network",
                                desc: "Work with top-tier organizations through our rigorously verified institutional network."
                            },
                            {
                                icon: TrendingUp,
                                label: "Career Analytics",
                                title: "Skill Optimization",
                                desc: "Track your performance and placement readiness with data-driven insights."
                            },
                            {
                                icon: Globe,
                                label: "Global Reach",
                                title: "Unified Platform",
                                desc: "Bridge the gap between campus talent and international career opportunities."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-colors">
                                    <feature.icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">{feature.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-4 leading-none">{feature.title}</h3>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 opacity-70">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-black uppercase tracking-tight text-slate-900">BIT Placement</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono italic">© 2026 Bannari Amman Institute of Technology</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
