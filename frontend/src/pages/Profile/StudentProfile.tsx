import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    User, Mail, Phone, MapPin, Edit, Camera, Linkedin, Github, Globe,
    Award, BookOpen, Briefcase, Share2, Check, X, GraduationCap, Database, Plus
} from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';

export default function StudentProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        branch: '',
        year: 2025,
        cgpa: 0,
        skills: [] as string[],
        about: '',
        location: 'Bangalore, India',
        linkedin: '',
        github: '',
        website: '',
        profilePicture: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get<{ data: any }>('/students/profile');
                const data = res.data.data;
                setProfile(data);
                if (data) {
                    setFormData({
                        name: data.name || user?.name || '',
                        usn: data.usn || '',
                        branch: data.branch || '',
                        year: data.year || 2025,
                        cgpa: data.cgpa || 0,
                        skills: data.skills || [],
                        about: data.about || '',
                        location: data.location || 'Bangalore, India',
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        website: data.website || '',
                        profilePicture: data.profilePicture || ''
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                toast.error("Could not load profile details");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Mock upload or use a service
        // For now let's convert to base64 or just simulate
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, profilePicture: base64String }));
            toast.success("Image staged. Click Apply to save!");
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            const res = await api.post<{ data: any }>('/students/profile', formData);
            setProfile(res.data.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!', { icon: '🚀' });
        } catch (err: any) {
            console.error("Update failed", err);
            const msg = err.response?.data?.message || "Failed to save changes";
            toast.error(msg);
        }
    };

    const addSkill = (skill: string) => {
        if (!skill) return;
        if (formData.skills.includes(skill)) {
            toast.error("Skill already exists");
            return;
        }
        setFormData({ ...formData, skills: [...formData.skills, skill] });
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-black tracking-widest uppercase italic">Loading Profile Sphere...</div>;

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-10 italic">
            {/* 1. Hero Section */}
            <div className="relative mb-24">
                <div className="h-64 w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[40px] relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="absolute -bottom-16 left-8 right-8 bg-white dark:bg-slate-900 rounded-[35px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] p-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-10 -mt-24 md:-mt-0">
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-40 w-40 rounded-[45px] bg-white dark:bg-slate-800 p-1.5 shadow-2xl ring-8 ring-white dark:ring-slate-900 overflow-hidden transform transition-all group-hover:rotate-6 cursor-pointer"
                            >
                                <img
                                    src={formData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                    alt="Profile"
                                    className="h-full w-full rounded-[35px] bg-slate-100 dark:bg-slate-700 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[35px]">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{formData.name || user?.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <GraduationCap className="h-3 w-3 text-blue-500" /> {formData.branch || 'General'} • Class of {formData.year || '2025'}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                    <Database className="h-3 w-3" /> CGPA: {formData.cgpa || '0.0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={cn(
                                "px-10 py-4 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 shadow-2xl hover:scale-[1.03] active:scale-95",
                                isEditing ? "bg-emerald-600 text-white shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)]" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-slate-200"
                            )}
                        >
                            {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            {isEditing ? "Apply Changes" : "Edit Profile"}
                        </button>
                        {isEditing && (
                            <button onClick={() => setIsEditing(false)} className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-[22px] flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-28">
                {/* Left Column: Personal Details */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[45px] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 bg-blue-500/5 rounded-full blur-3xl -mr-5 -mt-5"></div>
                        <h3 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
                            <User className="h-4 w-4 text-blue-500" /> Core Bio
                        </h3>

                        {isEditing ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">About Yourself</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all resize-none"
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        placeholder="Describe your passion and career goals..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">LinkedIn URL</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                placeholder="linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">GitHub URL</label>
                                        <div className="relative">
                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900 dark:text-white" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                placeholder="github.com/username"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Portfolio/Website URL</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="your-portfolio.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-bold italic">
                                {formData.about || "Initialize your biography to help recruiters understand your professional vision."}
                            </p>
                        )}

                        <div className="flex gap-5 mt-10">
                            <a href={formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <Linkedin className={cn("h-6 w-6 transition-all hover:scale-125 cursor-pointer", formData.linkedin ? "text-blue-600" : "text-slate-300")} />
                            </a>
                            <a href={formData.github.startsWith('http') ? formData.github : `https://${formData.github}`} target="_blank" rel="noopener noreferrer">
                                <Github className={cn("h-6 w-6 transition-all hover:scale-125 cursor-pointer", formData.github ? "text-slate-900 dark:text-white" : "text-slate-300")} />
                            </a>
                            <a href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`} target="_blank" rel="noopener noreferrer">
                                <Globe className={cn("h-6 w-6 transition-all hover:scale-125 cursor-pointer", formData.website ? "text-indigo-600" : "text-slate-300")} />
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[45px] shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.3em] text-[10px] flex items-center justify-between">
                            Technical Sphere
                            {isEditing && <span className="text-[8px] text-blue-500 animate-pulse">Edit Mode Active</span>}
                        </h3>

                        {isEditing && (
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Add skill (e.g. React)..."
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousSibling as HTMLInputElement;
                                            addSkill(input.value);
                                            input.value = '';
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {formData.skills.map((skill, i) => (
                                <span key={i} className="group px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 flex items-center gap-2 hover:border-blue-500/30 transition-all">
                                    {skill}
                                    {isEditing && (
                                        <button onClick={() => removeSkill(skill)} className="text-slate-300 group-hover:text-rose-500 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {formData.skills.length === 0 && <p className="text-slate-400 text-[10px] font-bold">No skills documented.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Academic & Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    {isEditing ? (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                                <Database className="h-7 w-7 text-blue-500" /> Academic Credentials
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">University Serial Number (USN)</label>
                                    <input
                                        type="text"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold outline-none focus:border-blue-500 transition-all"
                                        value={formData.usn}
                                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Branch / Specialization</label>
                                    <input
                                        type="text"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold outline-none focus:border-blue-500 transition-all"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Graduation Year</label>
                                    <input
                                        type="number"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold outline-none focus:border-blue-500 transition-all"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Current CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold outline-none focus:border-blue-500 transition-all"
                                        value={formData.cgpa}
                                        onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end gap-5">
                                <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic">Discard Changes</button>
                                <button onClick={handleSave} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-700 transition-all shadow-blue-200">Seal Configuration</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 tracking-tight italic">Academic Timeline</h3>
                                <div className="space-y-10 relative">
                                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-50 dark:bg-slate-800"></div>
                                    <div className="flex gap-8 items-start relative z-10">
                                        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white">{profile?.branch || "Student"} Degree</h4>
                                            <p className="text-sm text-slate-500 font-bold italic">Institute of Strategic Technology</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">{profile?.year - 4 || '2021'} - {profile?.year || '2025'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 items-start relative z-10">
                                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white">Senior Secondary Certification</h4>
                                            <p className="text-sm text-slate-500 font-bold italic">National Academy of Excellence</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">2019 - 2021</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 tracking-tight flex items-center gap-4 italic">
                                    <Briefcase className="h-6 w-6 text-blue-500" /> Professional Experience
                                </h3>
                                <div className="p-12 border-4 border-dashed border-slate-50 dark:border-slate-800/50 rounded-[40px] text-center">
                                    <div
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success("Profile link copied to clipboard!");
                                        }}
                                        className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all group/share"
                                    >
                                        <Share2 className="h-8 w-8 text-slate-300 group-hover/share:text-blue-500 transition-colors" />
                                    </div>
                                    <p className="text-slate-400 text-sm font-bold italic mb-6">Your professional timeline is currently empty. Start documenting internships or research projects to increase visibility.</p>
                                    <button
                                        onClick={() => {
                                            toast.success("Timeline initialization sequence started!", { icon: "🛠️" });
                                            setIsEditing(true); // Switch to edit mode to encourage data entry
                                        }}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-8 py-3 rounded-xl hover:bg-blue-100 transition-all italic"
                                    >
                                        Initialize Timeline
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
