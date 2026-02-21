import React, { useState } from "react";
import {
    Settings, Shield, Database, Cpu, Globe,
    Bell, Lock, Save, RefreshCw, Server
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function PortalSettings() {
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        minCgpa: 6.5,
        currentBatch: 2024,
        autoApproval: false,
        systemMaintenance: false,
        maxApplications: 5,
        notifyTpoOnNewJob: true
    });

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("System parameters encrypted and stored");
        }, 1500);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                        <Settings className="h-8 w-8 text-purple-500" />
                        Portal <span className="text-purple-600">Executive</span> Config
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Adjust Global Placement Protocols</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-10 py-4 bg-purple-600 text-white rounded-[25px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-purple-900/40 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Encrypting..." : "Sync Parameters"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Placement Rules */}
                <div className="bg-[#0F1121] p-10 rounded-[50px] border border-white/5 space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tight">Placement Protocols</h3>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Cutoffs & Rules</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <ConfigRow
                            label="Global CGPA Floor"
                            desc="Minimum required for any campus drive entry"
                            value={config.minCgpa}
                            onChange={(val: any) => setConfig({ ...config, minCgpa: parseFloat(val) })}
                            type="number"
                        />
                        <ConfigRow
                            label="Current Intake Batch"
                            desc="Target graduation year for active placement"
                            value={config.currentBatch}
                            onChange={(val: any) => setConfig({ ...config, currentBatch: parseInt(val) })}
                            type="number"
                        />
                        <ConfigRow
                            label="Concurrent App Limit"
                            desc="Max active applications per student"
                            value={config.maxApplications}
                            onChange={(val: any) => setConfig({ ...config, maxApplications: parseInt(val) })}
                            type="number"
                        />
                    </div>
                </div>

                {/* System Control */}
                <div className="bg-[#0F1121] p-10 rounded-[50px] border border-white/5 space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                            <Cpu className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tight">System Infrastructure</h3>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Automation & Visibility</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <ToggleRow
                            label="Auto-Verification"
                            desc="Automatically approve recruiters from trusted domains"
                            checked={config.autoApproval}
                            onChange={(checked: any) => setConfig({ ...config, autoApproval: checked })}
                        />
                        <ToggleRow
                            label="Maintenance Matrix"
                            desc="Set entire portal to Read-Only mode for maintenance"
                            checked={config.systemMaintenance}
                            onChange={(checked: any) => setConfig({ ...config, systemMaintenance: checked })}
                        />
                        <ToggleRow
                            label="TPO Alerts"
                            desc="Email broadcast to placement team on new job entries"
                            checked={config.notifyTpoOnNewJob}
                            onChange={(checked: any) => setConfig({ ...config, notifyTpoOnNewJob: checked })}
                        />
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-600/5 p-10 rounded-[50px] border border-rose-600/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-rose-500 italic tracking-tight uppercase">Critical Override Zone</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic leading-none">High-risk system wide operations</p>
                    </div>
                    <button className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors">
                        Purge Session Cache
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfigRow({ label, desc, value, onChange, type }: any) {
    return (
        <div className="flex items-center justify-between gap-10">
            <div className="flex-1">
                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{label}</p>
                <p className="text-[10px] font-bold text-slate-500 italic">{desc}</p>
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-xs font-black text-purple-400 w-24 text-center focus:bg-white/10 outline-none transition-all"
            />
        </div>
    );
}

function ToggleRow({ label, desc, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{label}</p>
                <p className="text-[10px] font-bold text-slate-500 italic">{desc}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${checked ? 'bg-purple-600' : 'bg-slate-800'}`}
            >
                <div className={`h-6 w-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
