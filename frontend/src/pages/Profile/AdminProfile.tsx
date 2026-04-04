import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    ShieldCheck, Mail, Cpu, Settings, Database, Activity,
    Lock, Terminal, Zap, Server, Globe, Key, Bell, Search, Users
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AdminProfile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('administration');

    const adminDetails = {
        name: user?.name || "System Admin",
        accessLevel: "L4 - Super User",
        node: "DC-01 (Primary Cluster)",
        status: "Online",
        lastLogin: "2026-02-16 10:45:12 UTC"
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 pb-10">
            {/* Admin Command Header */}
            <div className="bg-slate-950 border border-slate-800 rounded-[50px] p-12 mb-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 h-96 w-96 bg-purple-600/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="relative">
                        <div className="h-40 w-40 rounded-[45px] bg-gradient-to-br from-slate-900 to-slate-950 p-1 ring-1 ring-purple-500/20 shadow-2xl overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${adminDetails.name}&backgroundColor=6d28d9`} className="h-full w-full rounded-[40px] opacity-80" alt="Admin" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-purple-600 rounded-2xl flex items-center justify-center border-4 border-slate-950 shadow-lg">
                            <Key className="h-6 w-6 text-slate-900" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                            <div className="h-2 w-2 bg-purple-500 rounded-full animate-ping" />
                            <span className="text-purple-400 font-mono text-xs font-black uppercase tracking-[0.3em]">Root.Access.Granted</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{adminDetails.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 mt-6 justify-center md:justify-start">
                            <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-800">
                                <ShieldCheck className="h-4 w-4 text-purple-500" />
                                <span className="text-base font-black text-slate-500 uppercase tracking-widest">{adminDetails.accessLevel}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-800">
                                <Server className="h-4 w-4 text-blue-500" />
                                <span className="text-base font-black text-slate-500 uppercase tracking-widest">Node: {adminDetails.node}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidemenu */}
                <div className="space-y-4">
                    {[
                        { id: 'administration', label: 'Administration', icon: Settings },
                        { id: 'security', label: 'Security Protocols', icon: Lock },
                        { id: 'infrastructure', label: 'Infrastructure', icon: Database },
                        { id: 'api', label: 'API Management', icon: Zap },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all font-black text-base tracking-[0.2em] uppercase",
                                activeTab === item.id
                                    ? "bg-purple-600 text-slate-900 shadow-xl shadow-purple-600/20 translate-x-2"
                                    : "bg-slate-900 text-slate-500 hover:text-slate-200 border border-slate-800/50"
                            )}
                        >
                            <item.icon className="h-5 w-5" /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Main: Admin Panels */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="bg-slate-900/40 p-10 rounded-[50px] border border-slate-800/50 shadow-inner">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Terminal className="h-6 w-6 text-purple-500" />
                                    System Core Settings
                                </h3>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2 italic">CAUTION: Changes reflect globally</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "Registration Mode", status: "ENABLED", action: "Toggle", icon: Users },
                                { title: "Placement Portal", status: "ACTIVE", action: "Lock", icon: Globe },
                                { title: "Email SMTP Service", status: "STABLE", action: "Test", icon: Mail },
                                { title: "Resume AI Engine", status: "OPTIMAL", action: "Reboot", icon: Cpu },
                            ].map((config, i) => (
                                <div key={i} className="p-8 bg-slate-950 rounded-[35px] border border-slate-800 hover:border-purple-500/30 transition-all group">
                                    <div className="flex items-center justify-between mb-6">
                                        <config.icon className="h-8 w-8 text-slate-700 group-hover:text-purple-500 transition-colors" />
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-2">{config.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-mono text-emerald-500 font-black">{config.status}</span>
                                        <button className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-purple-400">[{config.action}]</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-12 rounded-[50px] border border-slate-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-purple-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-600/20 transition-all" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="h-20 w-20 bg-slate-800 rounded-[28px] flex items-center justify-center text-purple-500 shadow-xl group-hover:rotate-12 transition-all">
                                <Lock className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Kernel Security Access</h3>
                                <p className="text-slate-500 text-sm font-bold max-w-xl leading-relaxed">System session management and root key rotation services. Advanced security logs are stored in encrypted clusters at Node DC-01.</p>
                                <div className="flex gap-4 mt-8">
                                    <button className="px-8 py-3 bg-purple-600 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 shadow-xl shadow-purple-600/20">Rotate Keys</button>
                                    <button className="px-8 py-3 bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-slate-900 border border-slate-700">Audit Logs</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
