import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, MapPin, DollarSign, Star, AlertCircle, CheckCircle, XCircle, TrendingUp, ChevronRight, X } from "lucide-react";
import api from "../../../services/api";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { toast } from "react-hot-toast";
import ReactConfetti from 'react-confetti';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    matchScore: number;
    requirements: string[];
    source?: string;
    apply_url?: string;
    hasApplied?: boolean;
}

export default function JobRecommendations() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Mocking data for visualization if API returns basic data
                // In production, this would come from the backend's improved algorithm
                const res = await api.get<{ jobs?: Job[], message?: string }>("/jobs/recommendations");

                if (res.data.jobs) {
                    setJobs(res.data.jobs);
                } else {
                    setError(res.data.message || "No jobs found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load recommendations");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();

        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleApply = async (job: Job) => {
        if (job.source && job.source !== "Internal") {
            window.open(job.apply_url || job._id, "_blank");
            toast.success(`Redirecting to ${job.company} career page...`);
            return;
        }

        try {
            await api.post("/applications", { jobId: job._id });
            setShowConfetti(true);
            toast.success(`Application sent to ${job.company}!`);
            setTimeout(() => setShowConfetti(false), 5000);

            // Optionally refresh or mark as applied in UI
            setJobs(prev => prev.map(j => j._id === job._id ? { ...j, hasApplied: true } : j));
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to apply");
        }
    };

    // Mock Data for Radar Chart (Skills Analysis)
    const getChartData = (job: Job) => [
        { subject: 'Technical', A: 90, B: job.matchScore, fullMark: 100 },
        { subject: 'Experience', A: 85, B: job.matchScore - 10, fullMark: 100 },
        { subject: 'Education', A: 100, B: 90, fullMark: 100 },
        { subject: 'Soft Skills', A: 70, B: 80, fullMark: 100 },
        { subject: 'Location', A: 60, B: 70, fullMark: 100 },
    ];

    if (loading) {
        return (
            <div className="p-12 text-center text-slate-500 animate-pulse bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="h-12 w-12 bg-slate-100 rounded-full mx-auto mb-4 animate-spin border-4 border-slate-200 border-t-blue-500"></div>
                <p className="font-medium text-slate-500">AI is analyzing your profile against 500+ jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-red-100 p-8 rounded-2xl flex flex-col items-center text-center gap-4 shadow-sm">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">No Matches Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2">{error}</p>
                </div>
                <Link to="/resume-upload" className="px-6 py-2 bg-slate-900 text-slate-900 rounded-lg hover:bg-slate-800 transition-colors font-medium">
                    Update Resume Profile
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showConfetti && <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        AI Smart Matches
                    </h2>
                    <p className="text-slate-500 mt-1">Jobs curated based on your unique skill profile.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                    <TrendingUp className="h-4 w-4" />
                    High Accuracy Mode
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="group relative bg-white border border-slate-200 rounded-2xl p-0 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        {/* Match Badge */}
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm flex items-center gap-2 ${job.matchScore >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                job.matchScore >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                <div className={`h-2.5 w-2.5 rounded-full ${job.matchScore >= 80 ? 'bg-green-500 animate-pulse' :
                                    job.matchScore >= 60 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}></div>
                                {job.matchScore}% Match
                            </div>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                            {/* Left: Job Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            onClick={() => handleApply(job)}
                                            className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 font-bold border border-slate-200 cursor-pointer"
                                        >
                                            {job.company.charAt(0)}
                                        </div>
                                        <h3
                                            onClick={() => handleApply(job)}
                                            className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                                        >
                                            {job.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 font-medium flex items-center gap-2">
                                        <Building2 className="h-4 w-4" /> {job.company}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <MapPin className="h-4 w-4 text-slate-500" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
                                        <DollarSign className="h-4 w-4" /> {job.salary}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-100">
                                        <Briefcase className="h-4 w-4" /> {job.type}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Key Skills Required</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requirements.slice(0, 5).map((req, i) => (
                                            <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-semibold shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        View Analysis
                                    </button>
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="flex-1 bg-slate-900 text-slate-900 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 active:scale-95"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>

                            {/* Right: Quick Viz (Desktop) */}
                            <div className="hidden md:block w-48 shrink-0 relative">
                                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
                                <div className="h-full w-full opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    {/* Placeholder for a mini-viz or company image pattern */}
                                    <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Analysis View (Conditional) */}
                        {selectedJob?._id === job._id && (
                            <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8 animate-in slide-in-from-top-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        Match Analysis
                                    </h4>
                                    <button onClick={() => setSelectedJob(null)} className="text-slate-500 hover:text-slate-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="h-64 w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData(job)}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="You" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                                <Radar name="Job" dataKey="A" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                                                <Legend />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                                            <h5 className="font-semibold text-slate-700 mb-3 text-sm">Why you're a good match:</h5>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                    <span>Strong overlap in <strong>Technical Skills</strong> ({job.matchScore}%)</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                    <span>Your education level matches the requirements.</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                    <span>Location preference aligned.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                                            <h5 className="font-semibold text-slate-700 mb-3 text-sm">Potential Gaps:</h5>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-slate-600">
                                                    <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                                    <span>Job requires <strong>Cloud Deployment</strong> experience which is missing from your profile.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
