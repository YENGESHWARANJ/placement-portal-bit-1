import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShieldPlus, User, Mail, Lock, Terminal,
    Activity, ChevronRight, Eye, EyeOff, AlertTriangle,
    Fingerprint, Cpu
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { cn } from "../../utils/cn";

export default function AdminRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        adminKey: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleProvisioning = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All Fields Mandatory for Root Provisioning");
            return;
        }

        if (formData.adminKey !== "ROOT_2026") {
            toast.error("Invalid Administrative Authorisation Key");
            return;
        }

        setLoading(true);
        const provisionToast = toast.loading("Provisioning Management Node...");

        try {
            await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: "admin"
            });

            toast.success("✅ Administrative Node Provisioned! You can now login.", { id: provisionToast });
            navigate("/admin-portal");
        } catch (err: any) {
            const message = err?.response?.data?.message || "Provisioning Protocol Failed.";
            toast.error(message, { id: provisionToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden font-mono selection:bg-cyan-500 selection:text-black">
            {/* Advanced Tech Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="flex flex-col items-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 rounded-[35px] blur-2xl opacity-20 animate-pulse"></div>
                        <div className="h-24 w-24 bg-gradient-to-br from-cyan-600 to-blue-900 rounded-[35px] flex items-center justify-center shadow-md shadow-slate-200/40 border border-slate-200 relative z-10 overflow-hidden group">
                            <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ShieldPlus className="h-12 w-12 text-slate-900 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <h1 className="text-4xl font-black text-slate-900 tracking-[-0.05em] uppercase italic flex items-center gap-4">
                            Node <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Provisioning</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700" />
                            <p className="text-slate-500 text-base font-black uppercase tracking-[0.5em] flex items-center gap-2">
                                <Terminal className="h-3 w-3 text-cyan-500" /> L6 Security Clearance
                            </p>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A0C1B]/80 border border-slate-100 rounded-[50px] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-3 text-emerald-500">
                                <Fingerprint className="h-5 w-5 animate-pulse" />
                                <span className="text-sm font-black uppercase tracking-[0.2em] italic">Biometric Ready</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-cyan-500/20" />)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <OperativeInput
                                label="Legal Identifier"
                                placeholder="Operator Name"
                                icon={User}
                                value={formData.name}
                                onChange={(val: string) => setFormData({ ...formData, name: val })}
                            />
                            <OperativeInput
                                label="Network Node"
                                placeholder="operator@internal.net"
                                icon={Mail}
                                type="email"
                                value={formData.email}
                                onChange={(val: string) => setFormData({ ...formData, email: val })}
                            />
                            <div className="relative">
                                <OperativeInput
                                    label="Access Protocol"
                                    placeholder="Secret"
                                    icon={Lock}
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(val: string) => setFormData({ ...formData, password: val })}
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 bottom-4 text-slate-700 hover:text-cyan-500"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <OperativeInput
                                label="Execution Key"
                                placeholder="Auth Code"
                                icon={Cpu}
                                value={formData.adminKey}
                                onChange={(val: string) => setFormData({ ...formData, adminKey: val })}
                                statusColor="text-emerald-500"
                            />
                        </div>

                        <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl flex items-start gap-4">
                            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-1" />
                            <p className="text-xs font-bold text-slate-500 italic leading-relaxed uppercase">
                                Action grants executive access to candidate telemetry and system nodes. All operations monitored by master kernel.
                            </p>
                        </div>

                        <button
                            onClick={handleProvisioning}
                            disabled={loading}
                            className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-slate-900 rounded-[30px] font-black uppercase tracking-[0.3em] italic text-lg flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 group/submit"
                        >
                            {loading ? (
                                <Activity className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Inject Administrative Node
                                    <ChevronRight className="h-5 w-5 group-hover/submit:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                    <div
                        className="px-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-[0.3em] italic cursor-pointer transition-all hover:bg-slate-100"
                        onClick={() => navigate("/login")}
                    >
                        Return to Authentication Portal
                    </div>
                </div>
            </div>
        </div>
    );
}

function OperativeInput({ label, placeholder, icon: Icon, type = "text", value, onChange, statusColor = "text-cyan-500" }: any) {
    return (
        <div className="group">
            <label className="block text-base font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2 italic">
                {label}
            </label>
            <div className="relative">
                <Icon className={cn("absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:transition-colors", `group-focus-within:${statusColor}`)} />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/40 border border-slate-100 rounded-[22px] py-5 pl-14 pr-8 text-slate-900 text-sm font-bold focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all outline-none placeholder:text-slate-800 italic"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
