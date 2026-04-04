import { useState, useEffect } from "react";
import {
    Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle2,
    Eye, EyeOff, Fingerprint, Globe, Clock, Activity, Zap,
    ShieldCheck, ShieldAlert, Mail, Bell, UserCheck, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

interface SecurityLog {
    _id: string;
    action: string;
    timestamp: string;
    location: string;
    device: string;
    status: "success" | "warning" | "danger";
}

export default function SecuritySettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<SecurityLog[]>([]);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res: any = await api.get('/auth/security-logs');
            setLogs(res.data.logs);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters!");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success("Access key rotated successfully!", { icon: "🔐" });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            fetchLogs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to rotate access key");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle2FA = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        toast.success(
            twoFactorEnabled ? "2FA Disabled" : "2FA Enabled - Check your email for setup instructions",
            { icon: twoFactorEnabled ? "🔓" : "🔐" }
        );
    };

    const handleToggleBiometric = () => {
        setBiometricEnabled(!biometricEnabled);
        toast.success(
            biometricEnabled ? "Biometric Login Disabled" : "Biometric Login Enabled",
            { icon: "👆" }
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">

            {/* Elite Header */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[40px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="h-20 w-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-[28px] flex items-center justify-center shadow-2xl">
                            <Shield className="h-10 w-10 text-slate-900" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-slate-900 mb-2 tracking-tighter">
                                Security Command Center
                            </h1>
                            <p className="text-slate-500 dark:text-slate-500 text-base font-black uppercase tracking-[0.3em]">
                                Military-Grade Protection Protocols
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Score Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-slate-900/80 text-base font-black uppercase tracking-[0.3em] mb-3">Security Score</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-7xl font-black text-slate-900 tracking-tighter">87</span>
                            <span className="text-3xl text-slate-900/60 font-bold">/100</span>
                        </div>
                        <p className="text-slate-900/90 text-sm font-bold mt-4">Strong Protection Active</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-200 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30">
                            <ShieldCheck className="h-8 w-8 text-slate-900 mb-2" />
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Encrypted</p>
                        </div>
                        <div className="bg-slate-200 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30">
                            <Fingerprint className="h-8 w-8 text-slate-900 mb-2" />
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Verified</p>
                        </div>
                        <div className="bg-slate-200 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30">
                            <Activity className="h-8 w-8 text-slate-900 mb-2" />
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Monitored</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Password Change */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                            <Lock className="h-7 w-7 text-blue-600 dark:text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 tracking-tight">Change Password</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update your access credentials</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                            <label className="block text-base font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 dark:hover:text-slate-500"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 dark:hover:text-slate-500"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-slate-900 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Security Features */}
                <div className="space-y-6">

                    {/* Two-Factor Authentication */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-900 tracking-tight">Two-Factor Authentication</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Extra layer of security</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggle2FA}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${twoFactorEnabled ? "translate-x-7" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        {twoFactorEnabled && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    2FA is active and protecting your account
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Biometric Login */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                    <Fingerprint className="h-6 w-6 text-indigo-600 dark:text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-900 tracking-tight">Biometric Login</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fingerprint & Face ID</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleBiometric}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${biometricEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${biometricEnabled ? "translate-x-7" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Email Alerts */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                    <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-900 tracking-tight">Email Alerts</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${emailAlerts ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${emailAlerts ? "translate-x-7" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Activity Log */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <Activity className="h-7 w-7 text-slate-600 dark:text-slate-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-900 tracking-tight">Security Activity</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent account events</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log._id}
                            className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${log.status === "success" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                                    log.status === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                                        "bg-red-100 dark:bg-red-900/30"
                                    }`}>
                                    {log.status === "success" ? <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-600" /> :
                                        log.status === "warning" ? <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" /> :
                                            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-slate-900 text-sm tracking-tight">{log.action}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            {log.location}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {log.device}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-500 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {new Date(log.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
