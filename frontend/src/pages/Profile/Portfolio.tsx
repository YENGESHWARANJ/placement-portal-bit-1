import React, { useState } from 'react';
import {
    Plus,
    Github,
    ExternalLink,
    Code2,
    Trash2,
    Edit2,
    Terminal,
    Layout,
    Smartphone,
    Globe,
    CheckCircle2,
    Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialProjects = [
    {
        id: 1,
        title: "AI Resume Parser",
        category: "Web App",
        tech: ["Python", "React", "OpenAI"],
        description: "An end-to-end recruitment platform using BERT for skill extraction and ranking.",
        github: "github.com/user/ai-resume",
        live: "ai-parser.demo.com",
        icon: Terminal
    },
    {
        id: 2,
        title: "Healthcare Dashboard",
        category: "Analytics",
        tech: ["D3.js", "Node.js", "PostgreSQL"],
        description: "Real-time patient monitoring system with predictive analytics for hospital staff.",
        github: "github.com/user/health-dash",
        live: "health.demo.com",
        icon: Layout
    }
];

export default function Portfolio() {
    const [projects, setProjects] = useState(initialProjects);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = (id: number) => {
        setProjects(projects.filter(p => p.id !== id));
        toast.success("Project removed");
    };

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Project Portfolio</h1>
                    <p className="text-slate-500 mt-1">Showcase your technical excellence to top recruiters.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-slate-900 text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Plus className="h-5 w-5" /> Add Project
                </button>
            </div>

            {/* Quick Stats Overlay (Premium Glassmorphism) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Code2 className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-900">{projects.length}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Total Projects</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <Github className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-900">842</p>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">GitHub Commits</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <Briefcase className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-900">12%</p>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Better Match Chance</p>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">

                        {/* Project Banner Mockup */}
                        <div className="h-44 bg-slate-50 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="h-full w-full flex items-center justify-center">
                                <project.icon className="h-16 w-16 text-slate-200 group-hover:text-blue-200 transition-colors group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-lg text-base font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                                    {project.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tech.map(t => (
                                    <span key={t} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-base font-bold border border-slate-100 uppercase tracking-tight group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-colors">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex gap-2">
                                    <a href={`https://${project.github}`} target="_blank" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all">
                                        <Github className="h-4 w-4" />
                                    </a>
                                    <a href={`https://${project.live}`} target="_blank" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-red-600 hover:border-red-200 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Project Empty State Card */}
                <div
                    onClick={() => setShowModal(true)}
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-white transition-all group min-h-[400px]"
                >
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                        <Plus className="h-8 w-8 text-slate-500 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Add New Project</h3>
                    <p className="text-slate-500 text-sm text-center mt-2 px-6">Upload screenshots, source code, and tech specs.</p>
                </div>
            </div>

            {/* Simple Add Modal Overlay (Simplified) */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-500">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>
                        <div className="space-y-4 mb-8">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Project Title</label>
                                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Tech Stack (Comma separated)</label>
                                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" placeholder="React, Python, AWS" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Live URL</label>
                                <input type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" placeholder="https://" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold border border-slate-100 hover:bg-slate-100 transition-all">Cancel</button>
                            <button onClick={() => { setShowModal(false); toast.success("Project added to queue"); }} className="flex-1 px-6 py-3 bg-slate-900 text-slate-900 rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Save Project</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
