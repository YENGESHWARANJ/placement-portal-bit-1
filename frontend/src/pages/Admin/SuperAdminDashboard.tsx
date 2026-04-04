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
            <div className="bg-white p-10 rounded-[50px] border border-slate-200 shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-600/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-600/10 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 bg-indigo-600 rounded-[30px] flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3 group-hover:rotate-0 transition-transform">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Root Command Center</h1>
                            <p className="text-slate-500 text-base font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                                <Terminal className="h-3 w-3 text-indigo-500" /> Authorized Access Only • Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-2 rounded-[30px] backdrop-blur-md">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="pr-6">
                            <p className="text-base font-black text-slate-900 uppercase tracking-widest">{user?.name}</p>
                            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest italic">System Architect</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Critical Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard icon={Cpu} label="CPU Core Load" value={`${systemStats.cpu}%`} color="text-indigo-600" trend="Nominal" />
                <StatusCard icon={HardDrive} label="Memory Usage" value={`${systemStats.memory}%`} color="text-blue-600" trend="Standard" />
                <StatusCard icon={Database} label="FluxDB Health" value={systemStats.dbHealth} color="text-indigo-500" trend="99.9% Sync" />
                <StatusCard icon={Users} label="Pending Vetting" value={systemStats.pendingApprovals} color="text-amber-500" trend="High Priority" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* System Logs / Activity */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[50px] border border-slate-200 shadow-xl shadow-indigo-100/10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4">
                                <Activity className="h-6 w-6 text-indigo-600" />
                                Audit Trail
                            </h3>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mt-1">Real-time Authorization Logs</p>
                        </div>
                        <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all uppercase tracking-widest">View Master Log</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { action: 'RBAC_ELEVATION', user: 'Admin_Node_01', target: 'Recruiter_Auth', time: '2m ago', status: 'Success' },
                            { action: 'DB_SYNC_COMPLETE', user: 'System_Daemon', target: 'Global_Index', time: '12m ago', status: 'Optimal' },
                            { action: 'SECURITY_THRESHOLD', user: 'Guard_Node', target: 'API_Gateway', time: '24m ago', status: 'Alert', warning: true },
                            { action: 'USER_PROVISIONED', user: 'Auth_Control', target: 'Node_5621', time: '45m ago', status: 'Success' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[25px] hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/20 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", log.warning ? "bg-rose-500/10 text-rose-500" : "bg-indigo-500/10 text-indigo-500")}>
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900 uppercase tracking-widest">{log.action}</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.user} • {log.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                                    <span className={cn("px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border", log.warning ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-indigo-50 text-indigo-600 border-indigo-100")}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Control Panel */}
                <div className="space-y-10">
                    <div className="bg-indigo-600 p-10 rounded-[50px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <h3 className="text-2xl font-black mb-8 tracking-tighter uppercase">Admin Tools</h3>
                        <div className="space-y-4">
                            <AdminButton icon={Network} label="Network Map" sub="Node Visualization" />
                            <AdminButton icon={Globe} label="Access Control" sub="Manage Admin Roles" />
                            <AdminButton icon={Settings} label="System Core" sub="Infrastructure Config" />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[50px] border border-slate-200 shadow-xl shadow-indigo-100/10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 uppercase">Global Telemetry</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Auth Throughput', value: 88, color: 'bg-indigo-600' },
                                { label: 'API Latency', value: 12, color: 'bg-blue-500' },
                                { label: 'Traffic Density', value: 45, color: 'bg-indigo-400' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <span>{stat.label}</span>
                                        <span className="text-slate-600">{stat.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 hover:border-indigo-600/30 transition-all group active:scale-95 cursor-pointer shadow-xl shadow-indigo-100/20">
            <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className={cn("h-6 w-6 transition-colors", color, "group-hover:text-white")} />
                </div>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200">{trend}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase">{value}</h3>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function AdminButton({ icon: Icon, label, sub }: any) {
    return (
        <button className="w-full p-6 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-[30px] flex items-center justify-between group transition-all hover:translate-x-2 border border-white/10 hover:border-white shadow-lg">
            <div className="flex items-center gap-5">
                <div className="h-10 w-10 bg-white/20 group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white group-hover:text-indigo-600" />
                </div>
                <div className="text-left">
                    <p className="text-base font-black uppercase tracking-widest">{label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{sub}</p>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100" />
        </button>
    );
}
