import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    Building2, Mail, Phone, MapPin, Edit, Linkedin, Globe,
    Users, Briefcase, Share2, ShieldCheck, Target, BarChart3, AppWindow
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RecruiterProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || "Corporate Recruiter",
        company: "Tech Giant Global",
        role: "Senior Talent Acquisition Manager",
        location: "Silicon Valley, CA",
        about: "Strategic recruiting leader focused on identifying top-tier technical talent. Leading global hiring initiatives for AI and Cloud infrastructure teams with a focus on diversity and innovation.",
        phone: "+1 (555) 0123-4567",
        website: "techgiant.io/careers",
        linkedin: "linkedin.com/in/corporate-recruiter"
    });

    const stats = [
        { label: 'Active Roles', value: '12', icon: Briefcase, color: 'text-blue-500' },
        { label: 'Avg. Match', value: '88%', icon: Target, color: 'text-indigo-500' },
        { label: 'Applications', value: '2.4k', icon: Users, color: 'text-purple-500' },
        { label: 'Time to Hire', value: '14d', icon: BarChart3, color: 'text-emerald-500' },
    ];

    const hiringData = [
        { month: 'Jan', hires: 4 }, { month: 'Feb', hires: 8 },
        { month: 'Mar', monthhires: 12 }, { month: 'Apr', hires: 6 },
        { month: 'May', hires: 15 }, { month: 'Jun', hires: 10 },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header - Enterprise Slate Design */}
            <div className="bg-slate-900 rounded-[50px] p-12 md:p-16 relative overflow-hidden mb-12 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 h-96 w-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="h-40 w-40 rounded-[45px] bg-slate-800 p-1 ring-8 ring-indigo-500/10 shadow-2xl overflow-hidden group-hover:scale-105 transition-all duration-500">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}&backgroundColor=6366f1`} className="h-full w-full rounded-[40px]" alt="Recruiter" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-lg">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                                    Verified Corporate Access
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tight mb-2">{profileData.name}</h1>
                            <p className="text-indigo-400 font-bold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                                <Building2 className="h-5 w-5" /> {profileData.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800/50 px-4 py-2 rounded-xl">
                                    <MapPin className="h-3 w-3 text-rose-500" /> {profileData.location}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800/50 px-4 py-2 rounded-xl">
                                    <AppWindow className="h-3 w-3 text-indigo-500" /> {profileData.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                            {isEditing ? "Save Ledger" : "Manage Profile"}
                        </button>
                        <button className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-all">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-sm group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner group-hover:rotate-6 transition-all`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Professional Details */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight underline decoration-indigo-500 decoration-4">Company Bio</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium mb-10">
                            {profileData.about}
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <Mail className="h-5 w-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Email</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                < Globe className="h-5 w-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Domain</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{profileData.website}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 h-40 w-40 bg-white/10 rounded-full blur-[80px] -ml-20 -mb-20 group-hover:bg-white/20 transition-all"></div>
                        <h3 className="text-2xl font-black mb-10 tracking-tight">Recruiting Performance</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hiringData}>
                                    <Bar dataKey="hires" radius={[5, 5, 0, 0]}>
                                        {hiringData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="rgba(255,255,255,0.8)" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-8 text-center">Hiring Velocity: Normal</p>
                    </div>
                </div>

                {/* Main: Portfolio & Roles */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Managed Talent Clusters</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-slate-700 px-6 py-3 rounded-2xl shadow-xl">Audit Nodes</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { role: "Senior Software Engineer", applicants: 124, status: "Active" },
                                { role: "UX Designer Intern", applicants: 45, status: "Closing" },
                                { role: "Cloud Architect", applicants: 89, status: "Active" },
                            ].map((job, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border border-slate-100 dark:border-slate-800 hover:scale-[1.01] transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                                            <Briefcase className="h-6 w-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.role}</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{job.applicants} Candidate Nodes</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{job.status}</span>
                                        <Linkedin className="h-5 w-5 text-slate-200 group-hover:text-indigo-500 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
