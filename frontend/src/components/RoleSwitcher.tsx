import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Shield, User, Briefcase, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

export function RoleSwitcher() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Dev-only helper to switch roles instantly
    const switchRole = (role: 'student' | 'recruiter' | 'admin') => {
        if (!user) return;

        // Mock a role change by updating the auth context
        setUser({
            ...user,
            role: role
        });

        // Redirect to appropriate dashboard
        if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/dashboard');
    };

    if (process.env.NODE_ENV === 'production' && !user?.role?.includes('admin')) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 group">
            <div className="flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto">
                <button
                    onClick={() => switchRole('admin')}
                    className="p-4 bg-[#0F1121] text-cyan-400 rounded-2xl border border-white/5 shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-black italic uppercase text-[10px] tracking-widest"
                >
                    <Shield className="h-4 w-4" /> Admin
                </button>
                <button
                    onClick={() => switchRole('recruiter')}
                    className="p-4 bg-white text-indigo-600 rounded-2xl border border-slate-100 shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-black italic uppercase text-[10px] tracking-widest"
                >
                    <Briefcase className="h-4 w-4" /> Recruiter
                </button>
                <button
                    onClick={() => switchRole('student')}
                    className="p-4 bg-white text-orange-500 rounded-2xl border border-slate-100 shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-black italic uppercase text-[10px] tracking-widest"
                >
                    <User className="h-4 w-4" /> Student
                </button>
            </div>

            <div className="h-14 w-14 bg-slate-900 rounded-[22px] shadow-2xl border border-white/10 flex items-center justify-center text-white cursor-pointer hover:rotate-12 transition-all">
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
        </div>
    );
}
