import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    User, Bell, Palette, Shield, Zap, Save, CheckCircle2,
    ShieldCheck, Key, Loader2, TrendingUp, ChevronRight,
    Rocket, Activity, Lock, RefreshCw, Sun, Moon, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentProfile, updateStudentProfile } from '../../services/student.service';
import { cn } from '../../utils/cn';

const TABS = [
    { id: 'profile', label: 'Identity', icon: User, color: 'from-blue-500 to-indigo-600' },
    { id: 'security', label: 'Security', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600' },
    { id: 'notifications', label: 'Alerts', icon: Bell, color: 'from-amber-500 to-orange-500' },
    { id: 'display', label: 'Display', icon: Palette, color: 'from-purple-500 to-violet-600' },
];

function SettingField({ label, value, onChange, icon: Icon, type = 'text', placeholder = '' }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                {Icon && <Icon className="h-3 w-3" />} {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-14 bg-slate-50 border-2 border-transparent rounded-2xl pl-5 pr-5 font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-500"
                />
            </div>
        </div>
    );
}

function ToggleRow({ icon: Icon, label, desc, enabled, onToggle, color = 'bg-blue-500' }: any) {
    return (
        <motion.div whileHover={{ x: 4 }}
            className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all group">
            <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-[20px] bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                    <p className="text-sm font-black italic text-slate-800 uppercase tracking-tight">{label}</p>
                    <p className="text-base font-bold text-slate-500 uppercase tracking-widest">{desc}</p>
                </div>
            </div>
            <button onClick={onToggle}
                className={cn("relative h-8 w-16 rounded-full transition-all duration-300 border-2 border-transparent", enabled ? color : 'bg-slate-200')}>
                <motion.div
                    animate={{ x: enabled ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute top-1 h-6 w-6 bg-white rounded-full shadow-md"
                />
            </button>
        </motion.div>
    );
}

function SecurityCard({ icon: Icon, label, desc, active = false, onAction }: any) {
    return (
        <motion.div whileHover={{ y: -2 }}
            className="p-8 bg-white rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-[24px] flex items-center justify-center shadow-sm border transition-all",
                    active ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-slate-50 border-slate-100 text-slate-500 group-hover:border-blue-100 group-hover:text-blue-500")}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="font-black italic text-slate-900 uppercase tracking-tight text-sm mb-1">{label}</p>
                    <p className="text-base font-bold text-slate-500 uppercase tracking-widest">{desc}</p>
                </div>
            </div>
            {active
                ? <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">Active</span>
                : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAction}
                    className="px-6 py-2.5 bg-slate-900 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">
                    Enable
                </motion.button>}
        </motion.div>
    );
}

export default function StudentSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [notifs, setNotifs] = useState({ jobs: true, interviews: true, results: false, newsletter: false });
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

    useEffect(() => {
        getStudentProfile()
            .then(data => setProfile(data))
            .catch(() => toast.error("Failed to load profile."))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateStudentProfile({
                cgpa: profile.cgpa,
                year: profile.year,
                skills: typeof profile.skills === 'string'
                    ? profile.skills.split(',').map((s: string) => s.trim())
                    : profile.skills,
                about: profile.about
            });
            toast.success("Profile synchronized successfully!", { icon: '✅' });
        } catch {
            toast.error("Failed to sync profile changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <RefreshCw className="h-8 w-8 text-blue-500" />
            </motion.div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 pb-24 italic">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <p className="text-base font-black uppercase tracking-[0.5em] text-slate-500 mb-3">Control Panel v2.0</p>
                <h1 className="text-6xl font-black text-slate-900 tracking-[-0.04em] uppercase leading-none">
                    Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">System</span>
                </h1>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-10">

                {/* ── Left Sidebar ── */}
                <div className="w-full xl:w-72 space-y-3 shrink-0">
                    {TABS.map((tab, i) => (
                        <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-5 rounded-[28px] transition-all group border-2",
                                activeTab === tab.id
                                    ? "bg-[#080B1A] text-slate-900 border-transparent shadow-xl"
                                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-700"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                                    activeTab === tab.id
                                        ? `bg-gradient-to-br ${tab.color} shadow-md`
                                        : "bg-slate-50 group-hover:bg-slate-100"
                                )}>
                                    <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-slate-900" : "text-slate-500")} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                            </div>
                            <ChevronRight className={cn("h-4 w-4 transition-all", activeTab === tab.id ? "text-slate-500 opacity-100" : "opacity-0 group-hover:opacity-100")} />
                        </motion.button>
                    ))}

                    {/* Stats card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mt-6 bg-[#080B1A] p-8 rounded-[40px] text-slate-900 relative overflow-hidden border border-slate-100"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-5">Profile Integrity</p>
                        {[
                            { label: 'Bio Shield', value: 100, color: 'bg-emerald-500' },
                            { label: 'Node Sync', value: 88, color: 'bg-blue-500' },
                            { label: 'Data Depth', value: 72, color: 'bg-indigo-500' },
                        ].map((s, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase mb-1.5">
                                    <span>{s.label}</span><span>{s.value}%</span>
                                </div>
                                <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.value}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className={cn("h-full rounded-full", s.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Main Panel ── */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl relative overflow-hidden min-h-[560px]"
                        >
                            <div className="absolute top-0 right-0 h-64 w-64 bg-blue-50 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />

                            {/* ── Profile Tab ── */}
                            {activeTab === 'profile' && (
                                <div className="space-y-10 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900">Biometric Identity</h3>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-500 mt-1">Academic & skills configuration</p>
                                        </div>
                                        <Activity className="h-6 w-6 text-blue-500 animate-pulse" />
                                    </div>

                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[35px]">
                                        <div className="h-20 w-20 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-slate-900 text-2xl font-black shadow-xl shadow-blue-200">
                                            {(user?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xl font-black italic uppercase tracking-tight text-slate-900">{user?.name || 'Student'}</p>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-500 mt-1">{user?.email}</p>
                                            <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
                                                {user?.role || 'Student'} Node
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SettingField label="CGPA Magnitude" placeholder="e.g. 8.5" icon={TrendingUp} type="number"
                                            value={profile?.cgpa} onChange={(v: any) => setProfile({ ...profile, cgpa: v })} />
                                        <SettingField label="Graduation Year" placeholder="e.g. 2025" icon={Rocket} type="number"
                                            value={profile?.year} onChange={(v: any) => setProfile({ ...profile, year: v })} />
                                        <div className="md:col-span-2">
                                            <SettingField label="Technical Skills (comma-separated)" placeholder="React, Node.js, Python..." icon={Zap}
                                                value={Array.isArray(profile?.skills) ? profile.skills.join(', ') : profile?.skills}
                                                onChange={(v: any) => setProfile({ ...profile, skills: v })} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-base font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                                <User className="h-3 w-3" /> Bio Manifest
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={profile?.about || ''}
                                                onChange={e => setProfile({ ...profile, about: e.target.value })}
                                                placeholder="Define your operative footprint..."
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[28px] p-6 font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Security Tab ── */}
                            {activeTab === 'security' && (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900">Access Protocol</h3>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-500 mt-1">Defensive shield configuration</p>
                                        </div>
                                        <Shield className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <SecurityCard icon={Key} label="Password Reset" desc="Rotate your credential node for data safety." onAction={() => toast('Password reset link sent!')} />
                                    <SecurityCard icon={ShieldCheck} label="2-Factor Integrity" desc="Secondary verification layer active." active />
                                    <SecurityCard icon={Globe} label="Active Sessions" desc="Manage all login sessions across devices." onAction={() => toast('Sessions listed.')} />
                                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[28px] flex items-center gap-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <p className="text-xs font-bold text-emerald-700 italic">Your account security score is <strong>92/100</strong> — Elite tier protection active.</p>
                                    </div>
                                </div>
                            )}

                            {/* ── Notifications Tab ── */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900">Alert Config</h3>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-500 mt-1">Notification stream control</p>
                                        </div>
                                        <Bell className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <ToggleRow icon={Zap} label="Job Matches" desc="Real-time AI job recommendations" color="bg-blue-500"
                                        enabled={notifs.jobs} onToggle={() => setNotifs(n => ({ ...n, jobs: !n.jobs }))} />
                                    <ToggleRow icon={Activity} label="Interview Alerts" desc="Reminders for scheduled interviews" color="bg-indigo-500"
                                        enabled={notifs.interviews} onToggle={() => setNotifs(n => ({ ...n, interviews: !n.interviews }))} />
                                    <ToggleRow icon={CheckCircle2} label="Assessment Results" desc="Score updates from aptitude tests" color="bg-emerald-500"
                                        enabled={notifs.results} onToggle={() => setNotifs(n => ({ ...n, results: !n.results }))} />
                                    <ToggleRow icon={Bell} label="Newsletter" desc="Weekly placement insights & tips" color="bg-amber-500"
                                        enabled={notifs.newsletter} onToggle={() => setNotifs(n => ({ ...n, newsletter: !n.newsletter }))} />
                                </div>
                            )}

                            {/* ── Display Tab ── */}
                            {activeTab === 'display' && (
                                <div className="space-y-10 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900">Visual Interface</h3>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-500 mt-1">Theme & display preferences</p>
                                        </div>
                                        <Palette className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black uppercase tracking-widest text-slate-500 mb-5">Interface Theme</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'light', label: 'Light', icon: Sun, desc: 'Bright & clear' },
                                                { id: 'dark', label: 'Dark', icon: Moon, desc: 'Low light mode' },
                                                { id: 'auto', label: 'Auto', icon: Globe, desc: 'System default' },
                                            ].map(t => (
                                                <motion.button key={t.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => setTheme(t.id as any)}
                                                    className={cn("p-6 rounded-[30px] flex flex-col items-center gap-3 border-2 transition-all",
                                                        theme === t.id ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100" : "border-slate-100 bg-slate-50 hover:bg-white")}>
                                                    <t.icon className={cn("h-6 w-6", theme === t.id ? "text-blue-600" : "text-slate-500")} />
                                                    <span className={cn("text-base font-black uppercase tracking-widest", theme === t.id ? "text-blue-700" : "text-slate-500")}>{t.label}</span>
                                                    <span className="text-xs text-slate-500 font-bold">{t.desc}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                    <ToggleRow icon={Zap} label="Compact Mode" desc="Reduce padding and spacing throughout" color="bg-purple-500"
                                        enabled={false} onToggle={() => toast('Compact mode toggled!')} />
                                    <ToggleRow icon={Activity} label="Animations" desc="Interface micro-animations & transitions" color="bg-indigo-500"
                                        enabled={true} onToggle={() => toast('Animations toggled!')} />
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end relative z-10">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-slate-900 rounded-[30px] font-black uppercase tracking-widest text-base shadow-2xl hover:shadow-slate-300 transition-all flex items-center gap-4 disabled:opacity-60"
                                >
                                    {saving
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</>
                                        : <><Save className="h-4 w-4" /> Commit Changes</>}
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
