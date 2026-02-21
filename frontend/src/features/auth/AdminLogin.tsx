import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShieldAlert, Lock, Terminal, Activity,
    ChevronRight, Cpu, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import api from "../../services/api";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accessKey, setAccessKey] = useState(""); // Extra layer for "Seperate Portal" feel

    const handleAdminLogin = async () => {
        if (!email || !password) {
            toast.error("Credentials Required for Root Access");
            return;
        }

        setLoading(true);
        const adminToast = toast.loading("Initialising Secure Session...");

        try {
            const { data } = await api.post<{ token: string; user: any }>("/auth/login", { email, password });

            if (data.user.role !== 'admin' && data.user.role !== 'officer') {
                toast.error("Unauthorised Access Detected. This incident will be reported.", { id: adminToast });
                return;
            }

            login(data.token, data.user);
            toast.success("Command Center Access Granted", { id: adminToast });
            navigate("/admin/dashboard");
        } catch (err: any) {
            const message = err?.response?.data?.message || "Authentication Failed. Access Denied.";
            toast.error(message, { id: adminToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060813] flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Tech Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-lg relative z-10 transition-all duration-1000">
                {/* Security Badge */}
                <div className="flex flex-col items-center mb-12">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[35px] flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6 border border-white/10 rotate-3 animate-pulse">
                        <ShieldAlert className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic text-center">
                        Root <span className="text-blue-500">Access</span>
                    </h1>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] mt-2 flex items-center gap-2">
                        <Terminal className="h-3 w-3 text-blue-500" /> Authorized Nodes Only
                    </p>
                </div>

                {/* Login Terminal */}
                <div className="bg-[#0A0C1B] border border-white/5 rounded-[45px] p-10 shadow-3xl backdrop-blur-3xl">
                    <div className="space-y-8">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            </div>
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Sys_Login.exe</span>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2 italic">Admin Identifier</label>
                                <div className="relative">
                                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@internal.system"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between mb-3 ml-2 italic">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Pass-Key Protocol</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-12 text-white text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                                <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold text-slate-400 italic leading-relaxed">
                                    SECURITY WARNING: Any unauthorised access to this terminal will be traced back to the source IP and logged in the master audit file.
                                </p>
                            </div>

                            <button
                                onClick={handleAdminLogin}
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[25px] font-black uppercase tracking-widest italic text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Activity className="h-4 w-4 animate-spin" />
                                        Bypassing Firewall...
                                    </>
                                ) : (
                                    <>
                                        Initiate Terminal Session
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    login("mock-admin-token", { _id: "65cf0e1d5a2d6a001b8e8b03", name: "Super Admin", email: "admin@system.ia", role: "admin" });
                                    toast.success("DEBUG: Mock Admin Access Granted");
                                    navigate("/admin/dashboard");
                                }}
                                className="w-full py-4 border border-blue-500/20 text-blue-500/60 hover:text-blue-400 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all"
                            >
                                Initiate Debug Session (Bypass Auth)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Telemetry */}
                <div className="mt-12 flex justify-between px-10 text-[8px] font-black text-slate-700 uppercase tracking-widest italic">
                    <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-emerald-500" /> Server Global_Node_01</span>
                    <div className="flex gap-10">
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/admin-portal/register")}>Provision New Node</span>
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/login")}>Standard Entry</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
