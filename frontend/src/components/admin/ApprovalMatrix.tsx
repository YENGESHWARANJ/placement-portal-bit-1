import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, XCircle, Building2, Briefcase, Calendar, 
    GraduationCap, MapPin, Search, ShieldCheck, Zap, 
    Filter
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface ApprovalProps {
    onUpdate?: () => void;
}

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }
};

export default function ApprovalMatrix({ onUpdate }: ApprovalProps) {
    const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
    const [pendingDrives, setPendingDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'companies' | 'drives'>('companies');

    const fetchApprovals = async () => {
        try {
            const { data } = await api.get<{ pendingCompanies: any[], pendingDrives: any[] }>('/admin/approvals/pending');
            setPendingCompanies(data.pendingCompanies || []);
            setPendingDrives(data.pendingDrives || []);
        } catch (err) {
            console.error("Failed to fetch approvals", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleApproveDrive = async (id: string, name: string) => {
        try {
            await api.put(`/admin/approvals/drive/${id}`, { status: 'Open' });
            toast.success(`Drive ${name} is now LIVE`);
            fetchApprovals();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    const handleRejectDrive = async (id: string, name: string) => {
        try {
            await api.put(`/admin/approvals/drive/${id}`, { status: 'Cancelled' });
            toast.error(`Drive ${name} Rejected`);
            fetchApprovals();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error("Rejection failed");
        }
    };

    const handleApproveCompany = async (id: string, name: string) => {
        try {
            await api.put(`/admin/approvals/company/${id}`, { status: 'active' });
            toast.success(`${name} registered as exclusive partner`);
            fetchApprovals();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error("Process failed");
        }
    };

    const handleRejectCompany = async (id: string, name: string) => {
        try {
            await api.put(`/admin/approvals/company/${id}`, { status: 'rejected' });
            toast.error(`${name} vetted as non-compliant`);
            fetchApprovals();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error("Rejection failed");
        }
    };

    if (loading && pendingCompanies.length === 0 && pendingDrives.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="h-10 w-10 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Secure Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-700">
            {/* Header / Tab System */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-2 rounded-[30px] border border-slate-100 shadow-sm">
                <div className="flex gap-2 w-full sm:w-auto p-1 bg-slate-50 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab('companies')}
                        className={cn(
                            "flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            activeTab === 'companies' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Building2 className="h-3.5 w-3.5" />
                        Partnerships
                        <span className="bg-indigo-50 px-2 py-0.5 rounded-lg ml-1">{pendingCompanies.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('drives')}
                        className={cn(
                            "flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            activeTab === 'drives' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Campaigns
                        <span className="bg-indigo-50 px-2 py-0.5 rounded-lg ml-1">{pendingDrives.length}</span>
                    </button>
                </div>
                <div className="flex items-center gap-4 px-6 text-slate-400">
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Vetting Pending</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {activeTab === 'companies' ? (
                        <div className="col-span-full">
                            <div className="bg-amber-400 p-5 rounded-[22px] mb-8 flex items-center gap-3 shadow-lg shadow-amber-500/10">
                                <Building2 className="h-5 w-5 text-slate-900" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Pending Partnership Vetting ({pendingCompanies.length})</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingCompanies.length === 0 ? (
                                    <div className="col-span-full py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 text-center">
                                        <ShieldCheck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest">Master Ledger Verified • No Pending Partners</p>
                                    </div>
                                ) : (
                                    pendingCompanies.map((company) => (
                                        <ApprovalCard 
                                            key={company._id}
                                            title={company.name}
                                            sub={company.industry}
                                            location={company.location}
                                            icon={Building2}
                                            accentColor="bg-amber-400"
                                            onApprove={() => handleApproveCompany(company._id, company.name)}
                                            onReject={() => handleRejectCompany(company._id, company.name)}
                                            details={[
                                                { label: 'Intelligence Domain', value: company.industry },
                                                { label: 'Operational Base', value: company.location }
                                            ]}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-cyan-500 p-5 rounded-[22px] mb-8 flex items-center gap-3 shadow-lg shadow-cyan-500/10">
                                <Zap className="h-5 w-5 text-white" />
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Pending Campaign Authorization ({pendingDrives.length})</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingDrives.length === 0 ? (
                                    <div className="col-span-full py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 text-center">
                                        <Zap className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest">Campaign Matrix Synchronized • All Drives Verified</p>
                                    </div>
                                ) : (
                                    pendingDrives.map((drive) => (
                                        <ApprovalCard 
                                            key={drive._id}
                                            title={drive.jobRole}
                                            sub={drive.company}
                                            location={drive.location || "Remote"}
                                            icon={Briefcase}
                                            accentColor="bg-cyan-500"
                                            onApprove={() => handleApproveDrive(drive._id, drive.jobRole)}
                                            onReject={() => handleRejectDrive(drive._id, drive.jobRole)}
                                            details={[
                                                { label: 'Min Eligibility', value: `${drive.criterias?.cgpa || '7.0'} CGPA` },
                                                { label: 'Deadline Sink', value: new Date(drive.deadline).toLocaleDateString() }
                                            ]}
                                            isPriority={drive.salary?.includes('LPA') && parseFloat(drive.salary) > 20}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function ApprovalCard({ title, sub, location, icon: Icon, onApprove, onReject, details, isPriority, accentColor }: any) {
    return (
        <motion.div 
            variants={stagger.item}
            className="group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
        >
            <div className={cn("h-2 w-full", accentColor)} />
            <div className="p-8 sm:p-10">
                {isPriority && (
                    <div className="absolute top-0 right-0 p-12 bg-indigo-600/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-all" />
                )}
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className={cn(
                        "h-14 w-14 rounded-[22px] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                        isPriority ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-slate-900 text-white"
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                    {isPriority && (
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-100 animate-pulse">
                            High Yield
                        </div>
                    )}
                </div>

                <div className="mb-8 relative z-10">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors uppercase italic">{title}</h4>
                    <div className="flex items-center gap-2 text-slate-400">
                        <p className="text-xs font-black uppercase tracking-widest">{sub}</p>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <p className="text-xs font-bold flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {location}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                    {details.map((d: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 group-hover:border-indigo-50/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.label}</span>
                            <span className="text-sm font-bold text-slate-700">{d.value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 relative z-10">
                    <button 
                        onClick={onReject}
                        className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all"
                    >
                        Block Node
                    </button>
                    <button 
                        onClick={onApprove}
                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="h-4 w-4" /> Verify & Sync
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
