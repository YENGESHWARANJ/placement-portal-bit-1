import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    Settings, ShieldAlert, Cpu, Database, Activity, Globe, Zap, Server,
    Save, Terminal, Lock, Key, HardDrive, Network, UserCog
} from 'lucide-react';

export default function AdminSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global');

    const handleSave = () => {
        toast.success("Kernel parameters updated!");
    };

    const tabs = [
        { id: 'global', label: 'Global Config', icon: Globe },
        { id: 'security', label: 'Cyber Vault', icon: Lock },
        { id: 'maintenance', label: 'Kernel Ops', icon: Cpu },
        { id: 'backup', label: 'Data Clusters', icon: Database },
    ];

    return (
        <div className="animate-in fade-in zoom-in duration-700 pb-20">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">System Console</h1>
                    <p className="text-purple-500 font-mono text-[10px] uppercase tracking-[0.5em] mt-3">Level 4 Clearance Required</p>
                </div>
                <div className="flex gap-4">
                    <div className="h-14 w-14 bg-slate-900 rounded-[20px] border border-slate-800 flex items-center justify-center text-purple-500">
                        <Activity className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="space-y-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-5 px-8 py-6 rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-500/20 translate-x-3'
                                : 'bg-slate-900/50 text-slate-500 hover:text-slate-200 border border-slate-800'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 bg-slate-950/80 backdrop-blur-3xl rounded-[60px] border border-slate-800 p-14 min-h-[700px] shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-purple-600/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

                    {activeTab === 'global' && (
                        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-10 flex items-center gap-5">
                                    <Globe className="h-8 w-8 text-purple-500" />
                                    Portal Environment
                                </h3>

                                <div className="space-y-8">
                                    {[
                                        { label: "Public Registration", status: "Active", desc: "Allow new users to join the network." },
                                        { label: "AI Resume Processing", status: "Active", desc: "Enable neural network parsing for PDF uploads." },
                                        { label: "Company Verification", status: "Manual", desc: "Require admin approval for new recruiter entries." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-8 bg-slate-900/50 rounded-[35px] border border-slate-800">
                                            <div>
                                                <h4 className="text-white font-black text-sm uppercase tracking-widest">{item.label}</h4>
                                                <p className="text-slate-500 text-xs mt-1 font-bold">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-purple-400 font-mono text-[10px] font-black italic">{item.status}</span>
                                                <div className="h-7 w-12 bg-purple-600 rounded-full flex items-center px-1">
                                                    <div className="h-5 w-5 bg-white rounded-full ml-auto shadow-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-14 right-14 flex gap-6">
                        <button className="px-10 py-5 bg-slate-900 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:text-white transition-all">Emergency Lockdown</button>
                        <button onClick={handleSave} className="px-12 py-5 bg-purple-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-purple-500 transition-all shadow-2xl shadow-purple-600/20">Sync Kernel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
