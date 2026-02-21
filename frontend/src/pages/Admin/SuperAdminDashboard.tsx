import React, { useEffect, useState } from 'react';
import {
    Activity, Shield, Users, Database, Server, Cpu,
    Network, Globe, HardDrive, Key, AlertCircle, ChevronRight,
    Search, Terminal, Settings, LogOut, Zap, BarChart3
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { cn } from '../../utils/cn';
import api from '../../services/api';

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const [systemStats, setSystemStats] = useState({
        cpu: 45,
        memory: 62,
        storage: 28,
        uptime: '15d 4h 22m',
        activeUsers: 1240,
        pendingApprovals: 12,
        dbHealth: 'Excellent'
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {/* Super Admin Header */}
            <div className="bg-slate-950 p-10 rounded-[50px] border border-white/10 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-600/20 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 bg-blue-600 rounded-[30px] flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3 group-hover:rotate-0 transition-transform">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Root Command Center</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                                <Terminal className="h-3 w-3 text-blue-500" /> Authorized Access Only • Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[30px] border border-white/5 backdrop-blur-md">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-blue-400 font-black text-xl border border-white/10 shadow-inner">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="pr-6">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{user?.name}</p>
                            <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest italic">System Architect</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Critical Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard icon={Cpu} label="CPU Core Load" value={`${systemStats.cpu}%`} color="text-emerald-500" trend="Nominal" />
                <StatusCard icon={HardDrive} label="Memory Usage" value={`${systemStats.memory}%`} color="text-blue-500" trend="Standard" />
                <StatusCard icon={Database} label="FluxDB Health" value={systemStats.dbHealth} color="text-purple-500" trend="99.9% Sync" />
                <StatusCard icon={Users} label="Pending Vetting" value={systemStats.pendingApprovals} color="text-amber-500" trend="High Priority" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* System Logs / Activity */}
                <div className="lg:col-span-2 bg-[#0F1121] p-10 rounded-[50px] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                                <Activity className="h-6 w-6 text-blue-500" />
                                Audit Trail
                            </h3>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Real-time Authorization Logs</p>
                        </div>
                        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">View Master Log</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { action: 'RBAC_ELEVATION', user: 'Admin_Node_01', target: 'Recruiter_Auth', time: '2m ago', status: 'Success' },
                            { action: 'DB_SYNC_COMPLETE', user: 'System_Daemon', target: 'Global_Index', time: '12m ago', status: 'Optimal' },
                            { action: 'SECURITY_THRESHOLD', user: 'Guard_Node', target: 'API_Gateway', time: '24m ago', status: 'Alert', warning: true },
                            { action: 'USER_PROVISIONED', user: 'Auth_Control', target: 'Node_5621', time: '45m ago', status: 'Success' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[25px] hover:bg-white/[0.05] transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", log.warning ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500")}>
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{log.action}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{log.user} • {log.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{log.time}</span>
                                    <span className={cn("px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border", log.warning ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Control Panel */}
                <div className="space-y-10">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <h3 className="text-2xl font-black mb-8 tracking-tighter italic uppercase">Admin Tools</h3>
                        <div className="space-y-4">
                            <AdminButton icon={Network} label="Network Map" sub="Node Visualization" />
                            <AdminButton icon={Globe} label="Access Control" sub="Manage Admin Roles" />
                            <AdminButton icon={Settings} label="System Core" sub="Infrastructure Config" />
                        </div>
                    </div>

                    <div className="bg-[#0F1121] p-10 rounded-[50px] border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-black text-white tracking-tighter mb-8 italic uppercase">Global Telemetry</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Auth Throughput', value: 88, color: 'bg-blue-500' },
                                { label: 'API Latency', value: 12, color: 'bg-emerald-500' },
                                { label: 'Traffic Density', value: 45, color: 'bg-amber-500' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                        <span>{stat.label}</span>
                                        <span className="text-slate-300">{stat.value}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", stat.color)} style={{ width: `${stat.value}%` }} />
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

function StatusCard({ icon: Icon, label, value, color, trend }: any) {
    return (
        <div className="bg-[#0F1121] p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all group active:scale-95 cursor-pointer shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-all">
                    <Icon className={cn("h-6 w-6", color)} />
                </div>
                <span className="px-3 py-1 bg-white/5 text-slate-500 text-[8px] font-black rounded-lg uppercase tracking-widest border border-white/5">{trend}</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase italic">{value}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function AdminButton({ icon: Icon, label, sub }: any) {
    return (
        <button className="w-full p-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[30px] flex items-center justify-between group transition-all hover:translate-x-2">
            <div className="flex items-center gap-5">
                <div className="h-10 w-10 bg-black/40 rounded-2xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left font-sans">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{label}</p>
                    <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white" />
        </button>
    );
}
