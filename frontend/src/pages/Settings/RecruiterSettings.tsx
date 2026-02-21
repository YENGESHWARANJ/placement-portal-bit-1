import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    Building2, Lock, Bell, Users, ShieldCheck, Globe, Mail,
    Briefcase, Save, Terminal, BarChart3, Target, Server
} from 'lucide-react';

export default function RecruiterSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('company');

    const handleSave = () => {
        toast.success("Corporate settings synced!");
    };

    const tabs = [
        { id: 'company', label: 'Company Node', icon: Building2 },
        { id: 'hiring', label: 'Recruitment Flow', icon: Target },
        { id: 'team', label: 'Team Access', icon: Users },
        { id: 'security', label: 'Safety Protocols', icon: Lock },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">Terminal Configuration</h1>
                <p className="text-indigo-500 font-black uppercase tracking-[0.34em] text-[9px] mt-2">Partner Portal • Infrastructure Management</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="space-y-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-5 px-8 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30'
                                : 'text-slate-400 hover:text-slate-900 border border-slate-100 hover:border-indigo-100'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 bg-slate-950 rounded-[50px] border border-slate-800 p-12 min-h-[600px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>

                    {activeTab === 'company' && (
                        <div className="space-y-12 animate-in fade-in duration-500">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                    <Server className="h-6 w-6 text-indigo-500" />
                                    Enterprise Identity
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Company Legal Name</label>
                                        <input type="text" defaultValue="Tech Giant Global Inc." className="w-full px-8 py-5 bg-slate-900 rounded-3xl border border-slate-800 outline-none focus:border-indigo-500 transition-all font-black text-white text-sm" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Verification Domain</label>
                                        <input type="text" defaultValue="techgiant.io" className="w-full px-8 py-5 bg-slate-900 rounded-3xl border border-slate-800 outline-none focus:border-indigo-500 transition-all font-black text-white text-sm" />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Hiring Mandate</label>
                                        <textarea rows={4} defaultValue="Build the future of cloud computing by acquiring top 1% talent from premier institutions." className="w-full px-8 py-5 bg-slate-900 rounded-3xl border border-slate-800 outline-none focus:border-indigo-500 transition-all font-bold text-slate-300 text-sm resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-600/10 p-8 rounded-[35px] border border-indigo-500/20 flex items-center justify-between group/audit cursor-pointer hover:bg-indigo-600/20 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                                        <ShieldCheck className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-lg tracking-tight">Enterprise Audit Trail</p>
                                        <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-widest">Logging all recruitment activities since 2024</p>
                                    </div>
                                </div>
                                <Terminal className="h-6 w-6 text-indigo-500 group-hover/audit:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-12 right-12">
                        <button onClick={handleSave} className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
                            Commit Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
