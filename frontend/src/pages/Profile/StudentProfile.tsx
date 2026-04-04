import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    User, Mail, Phone, MapPin, Edit, Camera, Linkedin, Github, Globe,
    Award, BookOpen, Briefcase, Share2, Check, X, GraduationCap, Database, Plus,
    Calendar, Sparkles, Code2, Terminal
} from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

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
        leetcode: '',
        hackerrank: '',
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
                        leetcode: data.leetcode || '',
                        hackerrank: data.hackerrank || '',
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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
                <div className="h-12 w-12 border-4 border-apple-blue/10 border-t-apple-blue rounded-full animate-spin" />
                <p className="text-sm font-bold text-apple-gray-400 uppercase tracking-widest">Synchronizing Identity...</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20"
        >
            {/* Header & Hero */}
            <motion.div variants={stagger.item} className="relative">
                <div className="h-64 w-full bg-white rounded-[40px] relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/20 via-transparent to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Floating accents */}
                    <div className="absolute top-10 right-20 w-32 h-32 bg-apple-blue/20 rounded-full blur-[80px]" />
                </div>

                <div className="absolute -bottom-16 left-8 right-8 apple-card p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
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
                                className="h-44 w-44 rounded-[45px] bg-white p-1.5 shadow-2xl ring-8 ring-white overflow-hidden transform transition-all group-hover:rotate-3 cursor-pointer"
                            >
                                <img
                                    src={formData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                    alt="Profile"
                                    className="h-full w-full rounded-[38px] bg-apple-gray-50 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[38px]">
                                    <Camera className="h-8 w-8 text-slate-900" />
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-2 right-2 p-3 bg-apple-blue text-slate-900 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl font-bold text-apple-gray-900 tracking-tight mb-3">{formData.name || user?.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <span className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-apple-blue bg-apple-blue/5 px-4 py-2 rounded-xl border border-apple-blue/10">
                                    <GraduationCap className="h-3 w-3" /> {formData.branch || 'General'} • {formData.year || '2025'}
                                </span>
                                <span className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/50">
                                    <Database className="h-3 w-3" /> CGPA: {formData.cgpa || '0.0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={cn(
                                "px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-base transition-all flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95",
                                isEditing ? "bg-emerald-600 text-white" : "bg-white text-slate-900"
                            )}
                        >
                            {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            {isEditing ? "Apply Changes" : "Edit Profile"}
                        </button>
                        {isEditing && (
                            <button onClick={() => setIsEditing(false)} className="h-14 w-14 bg-apple-gray-50 rounded-2xl flex items-center justify-center text-apple-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-apple-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-32">
                {/* Left Column: Personal Details */}
                <div className="space-y-10">
                    <motion.div variants={stagger.item} className="apple-card p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 bg-apple-blue/5 rounded-full blur-3xl -mr-5 -mt-5 transition-all group-hover:bg-apple-blue/10" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 bg-apple-blue/5 rounded-xl flex items-center justify-center text-apple-blue">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-apple-gray-900 uppercase tracking-widest text-sm">Core Biography</h3>
                        </div>

                        {isEditing ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        className="apple-input w-full"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-2">Professional Summary</label>
                                    <textarea
                                        rows={4}
                                        className="apple-input w-full py-4 resize-none"
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        placeholder="Describe your passion and career goals..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-blue" />
                                        <input
                                            type="text"
                                            className="apple-input w-full pl-12 h-12 text-xs"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            placeholder="linkedin.com/in/username"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-900" />
                                        <input
                                            type="text"
                                            className="apple-input w-full pl-12 h-12 text-xs"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            placeholder="github.com/username"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                                        <input
                                            type="text"
                                            className="apple-input w-full pl-12 h-12 text-xs"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="your-portfolio.com"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                                        <input
                                            type="text"
                                            className="apple-input w-full pl-12 h-12 text-xs"
                                            value={formData.leetcode}
                                            onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                                            placeholder="leetcode.com/username"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                        <input
                                            type="text"
                                            className="apple-input w-full pl-12 h-12 text-xs"
                                            value={formData.hackerrank}
                                            onChange={(e) => setFormData({ ...formData, hackerrank: e.target.value })}
                                            placeholder="hackerrank.com/username"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-apple-gray-500 text-[16.5px] leading-relaxed font-medium">
                                    {formData.about || "Initialize your biography to help recruiters understand your professional vision."}
                                </p>
                                <div className="flex gap-6 mt-10">
                                    <a href={formData.linkedin ? (formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`) : '#'} target="_blank" rel="noopener noreferrer" className={cn("transition-transform hover:scale-125", !formData.linkedin && "opacity-20 pointer-events-none")}>
                                        <Linkedin className="h-6 w-6 text-apple-blue" />
                                    </a>
                                    <a href={formData.github ? (formData.github.startsWith('http') ? formData.github : `https://${formData.github}`) : '#'} target="_blank" rel="noopener noreferrer" className={cn("transition-transform hover:scale-125", !formData.github && "opacity-20 pointer-events-none")}>
                                        <Github className="h-6 w-6 text-apple-gray-900" />
                                    </a>
                                    <a href={formData.website ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`) : '#'} target="_blank" rel="noopener noreferrer" className={cn("transition-transform hover:scale-125", !formData.website && "opacity-20 pointer-events-none")}>
                                        <Globe className="h-6 w-6 text-indigo-600" />
                                    </a>
                                    <a href={formData.leetcode ? (formData.leetcode.startsWith('http') ? formData.leetcode : `https://${formData.leetcode}`) : '#'} target="_blank" rel="noopener noreferrer" className={cn("transition-transform hover:scale-125", !formData.leetcode && "opacity-20 pointer-events-none")}>
                                        <Code2 className="h-6 w-6 text-amber-500" />
                                    </a>
                                    <a href={formData.hackerrank ? (formData.hackerrank.startsWith('http') ? formData.hackerrank : `https://${formData.hackerrank}`) : '#'} target="_blank" rel="noopener noreferrer" className={cn("transition-transform hover:scale-125", !formData.hackerrank && "opacity-20 pointer-events-none")}>
                                        <Terminal className="h-6 w-6 text-emerald-600" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div variants={stagger.item} className="apple-card p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Database className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-apple-gray-900 uppercase tracking-widest text-sm">Skill Matrix</h3>
                            </div>
                            {isEditing && <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />}
                        </div>

                        {isEditing && (
                            <div className="mb-8">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Add technology (e.g. React)..."
                                        className="apple-input w-full pr-14"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white text-slate-900 rounded-xl hover:bg-apple-blue transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {formData.skills.map((skill, i) => (
                                <span key={i} className="group px-4 py-2 bg-apple-gray-50 text-apple-gray-600 rounded-xl text-base font-bold uppercase tracking-widest border border-apple-gray-100 flex items-center gap-2 hover:border-apple-blue/30 transition-all">
                                    {skill}
                                    {isEditing && (
                                        <button onClick={() => removeSkill(skill)} className="text-apple-gray-300 group-hover:text-rose-500 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {formData.skills.length === 0 && <p className="text-apple-gray-300 text-base font-bold uppercase tracking-widest">No technology tags added.</p>}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Academic & Timeline */}
                <div className="lg:col-span-2 space-y-10">
                    {isEditing ? (
                        <motion.div variants={stagger.item} className="apple-card p-12 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-apple-gray-900 tracking-tight">Academic Credentials</h3>
                                    <p className="text-base font-bold text-apple-gray-400 uppercase tracking-widest">Verification data for recruiters</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-3">University Serial Number (USN)</label>
                                    <input
                                        type="text"
                                        className="apple-input w-full h-14"
                                        value={formData.usn}
                                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                                        placeholder="e.g., 1MS21CS001"
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-3">Branch / Specialization</label>
                                    <input
                                        type="text"
                                        className="apple-input w-full h-14"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-3">Graduation Year</label>
                                    <input
                                        type="number"
                                        className="apple-input w-full h-14"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-bold text-apple-gray-400 uppercase tracking-widest block mb-3">Current CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="apple-input w-full h-14"
                                        value={formData.cgpa}
                                        onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="pt-10 border-t border-apple-gray-50 flex justify-end gap-6">
                                <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-sm font-bold uppercase tracking-widest text-apple-gray-400 hover:text-apple-gray-900 transition-all">Discard Changes</button>
                                <button onClick={handleSave} className="px-12 py-4 bg-apple-blue text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-[0_15px_30px_-5px_rgba(0,113,227,0.3)] hover:scale-[1.02] transition-all">Save Changes</button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-10">
                            <motion.div variants={stagger.item} className="apple-card p-10">
                                <h3 className="text-xl font-bold text-apple-gray-900 mb-10 tracking-tight">Academic Timeline</h3>
                                <div className="space-y-12 relative animate-in fade-in slide-in-from-left duration-700">
                                    <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-apple-gray-50"></div>
                                    <TimelineItem
                                        icon={BookOpen}
                                        title={profile?.branch || "Student"}
                                        subtitle="Institute of Strategic Technology"
                                        date={`${profile?.year - 4 || '2021'} - ${profile?.year || '2025'}`}
                                        color="text-apple-blue"
                                        bgColor="bg-apple-blue/5"
                                    />
                                    <TimelineItem
                                        icon={Award}
                                        title="Senior Secondary Certification"
                                        subtitle="National Academy of Excellence"
                                        date="2019 - 2021"
                                        color="text-emerald-500"
                                        bgColor="bg-emerald-50"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={stagger.item} className="apple-card p-12 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                                <div className="relative z-10">
                                    <div className="h-20 w-20 bg-apple-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-apple-gray-100 group cursor-pointer hover:bg-apple-blue/5 hover:border-apple-blue/20 transition-all duration-500"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success("Profile link copied to clipboard!");
                                        }}
                                    >
                                        <Share2 className="h-8 w-8 text-apple-gray-200 group-hover:text-apple-blue transition-colors" />
                                    </div>
                                    <h4 className="text-lg font-bold text-apple-gray-900 mb-3">Professional Experience</h4>
                                    <p className="text-apple-gray-400 text-[16.5px] font-medium max-w-md mx-auto mb-8 cursor-default">
                                        Your professional timeline is currently empty. Start documenting internships or research projects to increase your visibility.
                                    </p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-10 py-3.5 bg-white text-apple-gray-900 border border-apple-gray-200 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-sm hover:shadow-apple-hover hover:border-apple-blue/30 transition-all"
                                    >
                                        Initialize Timeline
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function TimelineItem({ icon: Icon, title, subtitle, date, color, bgColor }: any) {
    return (
        <div className="flex gap-8 items-start relative z-10 group">
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-transform group-hover:scale-110", bgColor, color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-apple-gray-900 leading-none mb-1">{title}</h4>
                <p className="text-[16.5px] text-apple-gray-500 font-medium mb-2">{subtitle}</p>
                <div className="flex items-center gap-2 text-base font-bold text-apple-gray-400 uppercase tracking-[0.2em]">
                    <Calendar className="h-3 w-3" />
                    {date}
                </div>
            </div>
        </div>
    );
}

