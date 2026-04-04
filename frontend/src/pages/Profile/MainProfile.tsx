import React, { useEffect, useState } from "react";
import {
    Expand,
    ChevronRight,
    Trophy,
    History,
    Calendar,
    School,
    MapPin,
    Brain,
    Rocket,
    Gamepad2,
    Code2,
    Mic2,
    Palette,
    ArrowUpRight,
    Briefcase,
    Zap,
    GraduationCap,
    Clock,
    CheckCircle2,
    Target,
    Activity,
    Award,
    Sparkles,
    Layers,
    Cpu,
    Mail,
    Phone,
    Globe,
    Github,
    Linkedin,
    Twitter,
    Terminal
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { cn } from "../../utils/cn";
import { ProfileCompleteness } from "../../components/ProfileCompleteness";

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function MainProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/students/profile");
                setProfile((res.data as any).data);
            } catch (err) {
                console.error("Profile sync failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
                <div className="h-12 w-12 border-4 border-apple-blue/10 border-t-apple-blue rounded-full animate-spin" />
                <p className="text-sm font-bold text-apple-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Profile...</p>
            </div>
        );
    }

    if (!profile) return (
        <div className="p-20 text-center bg-white rounded-[40px] border border-apple-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight">Access Denied</h3>
            <p className="text-apple-gray-400 mt-2 font-medium">Profile synchronization failed. Please try again.</p>
        </div>
    );

    const radarData = [
        { s: "Logic", A: profile.aptitudeScore || 70 },
        { s: "Creative", A: 75 },
        { s: "Syntax", A: profile.codingScore || 85 },
        { s: "Neural", A: 80 },
        { s: "Focus", A: 95 },
    ];

    const distributionData = [
        { name: "Technical", value: profile.technicalScore || 65, color: "#0071e3" },
        { name: "Soft Skills", value: profile.interviewScore || 45, color: "#6366f1" },
    ];

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="text-sm font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Identity</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Student Profile</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Your professional footprint and skill matrix.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate("/onboarding")} className="apple-btn-secondary px-6 py-2.5 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Update Skills</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-base font-bold uppercase tracking-wider">Profile Optimized</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Bio & Core Info */}
                <div className="lg:col-span-4 space-y-8 sm:y-10">
                    <motion.div variants={stagger.item} className="apple-card p-6 sm:p-12 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-apple-blue/10 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-[30px] sm:rounded-[40px] bg-white p-1 mb-6 sm:mb-8 shadow-2xl relative group/avatar">
                                <div className="h-full w-full rounded-[28px] sm:rounded-[38px] bg-apple-gray-800 flex items-center justify-center text-slate-900 text-5xl sm:text-6xl font-bold overflow-hidden">
                                    {profile.name.charAt(0)}
                                    <div className="absolute inset-0 bg-apple-blue/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 sm:h-10 sm:w-10 bg-apple-blue rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-apple-gray-900 tracking-tight mb-2">{profile.name}</h2>
                            <p className="text-sm font-bold text-apple-blue uppercase tracking-[0.3em] mb-8">Software Engineer</p>

                            <div className="space-y-4 w-full text-left">
                                <InfoRow icon={Calendar} label="Class of 2025" detail="Graduation Year" />
                                <InfoRow icon={School} label={profile.branch || "Technology"} detail="Department" />
                                <InfoRow icon={MapPin} label={profile.location || "Bengaluru, IN"} detail="Location" />
                            </div>

                            <div className="mt-10 pt-10 border-t border-apple-gray-50 w-full flex justify-center gap-5 flex-wrap">
                                <SocialBtn icon={Github} href={profile.github} />
                                <SocialBtn icon={Linkedin} href={profile.linkedin} color="hover:text-apple-blue" />
                                <SocialBtn icon={Code2} href={profile.leetcode} color="hover:text-amber-500" />
                                <SocialBtn icon={Terminal} href={profile.hackerrank} color="hover:text-emerald-500" />
                                <SocialBtn icon={Globe} href={profile.website} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={stagger.item} className="apple-card p-10">
                        <h3 className="text-lg font-bold text-apple-gray-900 mb-6">About</h3>
                        <p className="text-base leading-relaxed text-apple-gray-500 font-medium">
                            {profile.about || "Your professional bio is currently being analyzed. Add more details to improve your recruiter resonance score."}
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Metrics & Skill Matrix */}
                <div className="lg:col-span-8 space-y-10">
                    <ProfileCompleteness profile={profile} />

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Skill Radar */}
                        <motion.div variants={stagger.item} className="apple-card p-10 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-apple-gray-900">Skill Portfolio</h3>
                                    <p className="text-sm text-apple-gray-400 font-semibold uppercase tracking-wider mt-1">Cognitive Matrix</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-apple-blue border border-apple-blue/20 flex items-center justify-center text-slate-900 shadow-lg shadow-apple-blue/20">
                                    <Target className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#f0f0f0" />
                                        <PolarAngleAxis dataKey="s" tick={{ fill: "#888", fontSize: 10, fontWeight: 600 }} />
                                        <Radar name="Level" dataKey="A" stroke="#0071e3" fill="#0071e3" fillOpacity={0.15} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Skill Equilibrium */}
                        <motion.div variants={stagger.item} className="apple-card p-10 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-10">
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-apple-gray-900">Performance</h3>
                                    <p className="text-sm text-apple-gray-400 font-semibold uppercase tracking-wider mt-1">Resonance Score</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-slate-900 shadow-lg shadow-orange-500/20">
                                    <Zap className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="relative h-56 w-56">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-base font-bold text-apple-gray-400 uppercase tracking-widest mb-1">Global</span>
                                    <span className="text-5xl font-bold text-apple-gray-900 tracking-tighter">92</span>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4 w-full justify-center">
                                {distributionData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-2.5 px-4 py-2 bg-apple-gray-50 rounded-xl border border-apple-gray-100 transition-colors hover:border-apple-blue/30">
                                        <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                                        <span className="text-base font-bold text-apple-gray-500 uppercase tracking-widest">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Proficiency Streaks */}
                        <motion.div variants={stagger.item} className="apple-card p-10">
                            <h3 className="text-lg font-bold text-apple-gray-900 mb-8">Proficiency Matrix</h3>
                            <div className="space-y-6">
                                <ProficiencyBar label="Algorithms" value={85} color="bg-apple-blue" />
                                <ProficiencyBar label="Frontend Architecture" value={70} color="bg-indigo-500" />
                                <ProficiencyBar label="Systems Design" value={60} color="bg-amber-500" />
                                <ProficiencyBar label="Machine Learning" value={45} color="bg-rose-500" />
                            </div>
                        </motion.div>

                        {/* Badges and Achievements */}
                        <motion.div variants={stagger.item} className="apple-card p-10">
                            <h3 className="text-lg font-bold text-apple-gray-900 mb-8 flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                Earned Badges
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {(profile.codingScore || 0) >= 80 && (
                                    <BadgeItem icon={Code2} title="Code Ninja" desc="Top 20%" color="text-indigo-600" bgColor="bg-indigo-50" border="border-indigo-100" />
                                )}
                                {(profile.aptitudeScore || 0) >= 80 && (
                                    <BadgeItem icon={Brain} title="Logic Master" desc="Elite" color="text-amber-600" bgColor="bg-amber-50" border="border-amber-100" />
                                )}
                                {(profile.interviewScore || 0) >= 80 && (
                                    <BadgeItem icon={Mic2} title="Silver Tongue" desc="Elo 80+" color="text-rose-600" bgColor="bg-rose-50" border="border-rose-100" />
                                )}
                                {(profile.cgpa || 0) >= 9.0 && (
                                    <BadgeItem icon={GraduationCap} title="Scholar" desc="Academic" color="text-emerald-600" bgColor="bg-emerald-50" border="border-emerald-100" />
                                )}
                                {(profile.resumeScore || 0) >= 80 && (
                                    <BadgeItem icon={Sparkles} title="Profile Perfect" desc="Stellar" color="text-apple-blue" bgColor="bg-apple-blue/10" border="border-apple-blue/20" />
                                )}
                            </div>
                        </motion.div>

                        {/* Geographical Footprint - Mapping Integration */}
                        <motion.div variants={stagger.item} className="apple-card p-0 overflow-hidden relative group md:col-span-2">
                            <div className="p-10 pb-0 absolute top-0 left-0 z-10">
                                <h3 className="text-lg font-bold text-apple-gray-900">Geographical Footprint</h3>
                                <p className="text-sm text-apple-gray-400 font-semibold uppercase tracking-wider mt-1">{profile.location || "Sathy, Tamil Nadu"}</p>
                            </div>
                            <div className="h-[300px] w-full bg-slate-100 relative group-hover:scale-[1.02] transition-transform duration-700">
                                {/* Mock high-end map visualization */}
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/77.0,11.0,4,0,0/800x400?access_token=pk.mock')] bg-cover bg-center opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="h-12 w-12 rounded-full bg-apple-blue/20 flex items-center justify-center animate-ping" />
                                    <div className="h-4 w-4 rounded-full bg-apple-blue border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                                </div>
                                <div className="absolute bottom-10 right-10 flex gap-2">
                                    <div className="px-5 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-apple-gray-100 text-[10px] font-black uppercase tracking-widest text-apple-gray-900 shadow-sm">
                                        Neural Location Sync Active
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// HELPERS
function ProficiencyBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-base font-bold text-apple-gray-400 uppercase tracking-widest">
                <span>{label}</span>
                <span className="text-apple-gray-900">{value}%</span>
            </div>
            <div className="h-2 w-full bg-apple-gray-50 rounded-full overflow-hidden border border-apple-gray-100">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full shadow-lg shadow-apple-blue/10", color)}
                />
            </div>
        </div>
    );
}

function BadgeItem({ icon: Icon, title, desc, color, bgColor, border }: any) {
    return (
        <div className={cn("p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 hover:shadow-lg border", bgColor, border)}>
            <div className={cn("h-12 w-12 rounded-full flex items-center justify-center bg-white shadow-sm", color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="font-bold text-apple-gray-900 text-sm leading-tight">{title}</p>
                <p className={cn("text-base font-bold uppercase tracking-wider mt-1 opacity-80", color)}>{desc}</p>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, detail }: any) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="h-10 w-10 bg-apple-gray-50 rounded-xl flex items-center justify-center text-apple-gray-400 border border-apple-gray-100 group-hover:bg-apple-blue/5 group-hover:text-apple-blue group-hover:border-apple-blue/20 transition-all duration-500">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold text-apple-gray-900 leading-none mb-1">{label}</span>
                <span className="text-base font-semibold text-apple-gray-400 uppercase tracking-widest leading-none">{detail}</span>
            </div>
        </div>
    );
}


function SocialBtn({ icon: Icon, href, color = "hover:text-apple-blue" }: any) {
    if (!href) return null;
    const url = href.startsWith('http') ? href : `https://${href}`;
    
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
                "h-10 w-10 rounded-xl bg-white border border-apple-gray-100 flex items-center justify-center text-apple-gray-400 hover:border-apple-blue/30 hover:shadow-apple-hover transition-all",
                color
            )}
        >
            <Icon className="h-4 w-4" />
        </a>
    );
}
