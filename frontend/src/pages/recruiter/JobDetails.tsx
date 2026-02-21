import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Building2, MapPin, DollarSign, Calendar, Briefcase,
    ChevronLeft, Share2, Bookmark, CheckCircle, Info,
    Users, TrendingUp, ShieldCheck, ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    requirements: string[];
    type: string;
    deadline?: string;
    active: boolean;
}

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await api.get<Job>(`/jobs/${id}`);
            setJob(data);

            // Check if already applied
            const { data: appsData } = await api.get<{ applications: any[] }>("/applications/my");
            const applied = appsData.applications.some((app: any) => app.jobId._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error("Failed to fetch job", error);
            toast.error("Job details not found");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await api.post("/applications", { jobId: id });
            toast.success("Applied successfully!");
            setHasApplied(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="p-10 animate-pulse space-y-8">
            <div className="h-48 bg-slate-100 rounded-3xl"></div>
            <div className="space-y-4">
                <div className="h-8 bg-slate-100 w-1/3 rounded-lg"></div>
                <div className="h-4 bg-slate-100 w-full rounded-lg"></div>
                <div className="h-4 bg-slate-100 w-5/6 rounded-lg"></div>
            </div>
        </div>
    );

    if (!job) return null;

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-20">

            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group"
                >
                    <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </button>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all shadow-sm">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all shadow-sm">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Job Info (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Card */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative">
                        {/* Decorative Banner */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative -mt-12 mb-6">
                                <div className="h-24 w-24 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 group transition-transform hover:scale-105">
                                    <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <Building2 className="h-10 w-10 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 font-bold hover:underline cursor-pointer">{job.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            {job.type}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-start md:items-end gap-2">
                                    <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        {job.salary}
                                    </div>
                                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Posted 2 days ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Info className="h-5 w-5 text-blue-500" />
                            Job Description
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                            {job.description || "No description provided."}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            What you'll need
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job?.requirements?.length ? (
                                job.requirements.map((req, i) => (
                                    <div key={i} className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0 mt-0.5">
                                            <CheckCircle className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">{req}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm italic col-span-full">No specific requirements listed.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info & Apply (Right 1 Column) */}
                <div className="space-y-6">

                    {/* Apply Card */}
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-50"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4">Start your journey at {job.company}</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Join a high-performing team and build the future of technology. Applications close on <span className="text-white font-bold">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "TBD"}</span>.
                            </p>

                            {hasApplied ? (
                                <div className="w-full bg-green-500/20 text-green-400 py-3.5 rounded-xl text-center font-bold border border-green-500/30 flex items-center justify-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Application Submitted
                                </div>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {applying ? "Applying..." : "Apply Now"}
                                    {!applying && <ArrowRight className="h-4 w-4" />}
                                </button>
                            )}

                            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
                                AI Matching: <span className="text-blue-400">92% Strength</span>
                            </p>
                        </div>
                    </div>

                    {/* Company Metrics */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Candidate Activity</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Total Applicants</span>
                                </div>
                                <span className="font-bold text-slate-900">142</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Avg. CTC</span>
                                </div>
                                <span className="font-bold text-slate-900">12 - 18 LPA</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Hiring Success</span>
                                </div>
                                <span className="font-bold text-slate-900">85%</span>
                            </div>
                        </div>
                    </div>

                    {/* Similar Jobs Preview */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Similar Opportunities</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <Link key={i} to="/dashboard" className="block group">
                                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {i === 1 ? "M" : "A"}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{i === 1 ? "Full Stack Engineer" : "Backend Developer"}</h4>
                                            <p className="text-xs text-slate-500">{i === 1 ? "Microsoft" : "Apple"}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
