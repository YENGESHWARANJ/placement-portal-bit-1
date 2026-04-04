import React, { useState, useEffect } from "react";
import {
    Briefcase, Globe, MapPin, Plus, Edit, Trash2,
    Search, Filter, ExternalLink, ShieldCheck, X,
    Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import useCompanyStore from "../../store/company.store";

export default function CompanyManager() {
    const { 
        companies, 
        loading, 
        fetchCompanies, 
        addCompany, 
        toggleCompanyStatus, 
        deleteCompany 
    } = useCompanyStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        industry: "Information Technology",
        description: "",
        location: "",
        website: ""
    });

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addCompany(form);
            toast.success("Partner Registered Successfully!");
            setIsAdding(false);
            setForm({ name: "", industry: "Information Technology", description: "", location: "", website: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register partner");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: 'active' | 'inactive') => {
        try {
            await toggleCompanyStatus(id, currentStatus);
            toast.success("Identity status successfully transitioned");
        } catch (error) {
            toast.error("Failed to transition status");
        }
    };

    const handleRemove = async (id: string) => {
        if (!window.confirm("CRITICAL: Are you sure you want to purge this partner node from the registry? This action is irreversible.")) return;
        try {
            await deleteCompany(id);
            toast.success("Partner Node Purged Successfully");
        } catch (error) {
            toast.error("Purge Operation Failed");
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && companies.length === 0) return (
        <div className="h-screen flex flex-col items-center justify-center gap-6">
            <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
            <h1 className="text-xl font-black italic uppercase tracking-[0.5em] text-slate-500 animate-pulse">Syncing Corporate Integrity...</h1>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[50px] shadow-apple-soft border border-apple-gray-50">
                <div className="flex items-center gap-8">
                    <div className="h-24 w-24 bg-emerald-50 rounded-[35px] flex items-center justify-center border border-emerald-100/50 shadow-inner group">
                        <Globe className="h-12 w-12 text-emerald-500 group-hover:rotate-180 transition-transform duration-1000" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-apple-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
                            Partner <span className="text-emerald-600">Ecosystem</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-black uppercase tracking-[0.5em] mt-2 flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authorized Institutional Registry
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Identify organization..."
                            className="bg-apple-gray-50 border border-apple-gray-100 px-16 py-4 rounded-[25px] text-sm font-black text-apple-gray-900 placeholder:text-slate-300 w-[350px] focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all shadow-inner"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="px-10 py-5 bg-slate-900 text-white rounded-[25px] text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4"
                    >
                        <Plus className="h-5 w-5" /> Add Partner
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filtered.map((company) => (
                    <motion.div
                        layout
                        key={company._id}
                        className="bg-white border border-apple-gray-50 p-10 rounded-[50px] shadow-apple-soft relative group hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Globe className="h-48 w-48" />
                        </div>

                        <div className="flex justify-between items-start mb-8 relative">
                            <div className="h-20 w-20 bg-emerald-50 rounded-[30px] flex items-center justify-center text-emerald-600 border border-emerald-100/50 shadow-sm group-hover:bg-white group-hover:shadow-apple-soft transition-all">
                                <Briefcase className="h-10 w-10" />
                            </div>
                            <span className={cn(
                                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                company.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-rose-50 text-rose-600 border-rose-100/50"
                            )}>
                                {company.status === 'active' ? 'Operational' : 'Restricted'}
                            </span>
                        </div>

                        <h3 className="text-3xl font-black text-apple-gray-900 italic tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors uppercase leading-none">{company.name}</h3>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mb-8">{company.industry} // PHY-L6</p>

                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-10 flex-1 line-clamp-3">
                            {company.description}
                        </p>

                        <div className="space-y-4 mb-10 bg-slate-50/50 p-6 rounded-[35px] border border-apple-gray-50">
                            <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                                <MapPin className="h-5 w-5 text-rose-500" />
                                <span className="text-apple-gray-900">{company.location}</span>
                            </div>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 transition-colors group/link">
                                    <Globe className="h-5 w-5 text-emerald-500 group-hover/link:rotate-90 transition-transform" />
                                    Corporate Realm <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>

                        <div className="flex gap-4 relative">
                            <button
                                onClick={() => handleToggle(company._id, company.status)}
                                className={cn(
                                    "flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border",
                                    company.status === 'active' ? "bg-apple-gray-50 text-slate-500 border-apple-gray-100 hover:bg-apple-gray-100" : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                                )}
                            >
                                {company.status === 'active' ? "Restrict Access" : "Restore Access"}
                            </button>
                            <button
                                onClick={() => handleRemove(company._id)}
                                className="p-5 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100/50 hover:bg-rose-100 transition-all"
                                title="Purge Partner"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full py-40 bg-slate-50/50 rounded-[60px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12"
                    >
                        <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center text-slate-300 mb-8 shadow-apple-soft border border-apple-gray-50">
                            <Briefcase className="h-16 w-16" />
                        </div>
                        <h3 className="text-3xl font-black text-apple-gray-900 uppercase italic tracking-tighter">Search Protocol Null</h3>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4 max-w-md leading-relaxed">NO DATA MATCHED THE SEARCH PROTOCOL. ADJUST FILTERS OR REGISTER NEW PARTNER ORGANIZATION.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-10 text-emerald-600 font-black uppercase text-xs tracking-widest hover:text-emerald-700 transition-all flex items-center gap-3"
                        >
                            + Synchronize New Partner Entity
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl bg-white rounded-[60px] shadow-2xl p-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                            <button
                                onClick={() => setIsAdding(false)}
                                className="absolute right-10 top-10 text-slate-400 hover:text-slate-900 transition-all h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="mb-12">
                                <h2 className="text-4xl font-black text-apple-gray-900 uppercase italic tracking-tighter">Partner Provisioning</h2>
                                <p className="text-emerald-600 font-black uppercase text-xs tracking-[0.4em] mt-2">Initialize new institutional link</p>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Organization Identity</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-apple-gray-50 border border-apple-gray-100 rounded-[25px] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                            placeholder="Nexus Global Corp"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Industry Sector</label>
                                        <select
                                            value={form.industry}
                                            onChange={e => setForm({ ...form, industry: e.target.value })}
                                            className="w-full bg-apple-gray-50 border border-apple-gray-100 rounded-[25px] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none"
                                        >
                                            <option>Information Technology</option>
                                            <option>Finance & Fintech</option>
                                            <option>Manufacturing</option>
                                            <option>Automotive</option>
                                            <option>Core Engineering</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Geographic Node</label>
                                        <input
                                            required
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            className="w-full bg-apple-gray-50 border border-apple-gray-100 rounded-[25px] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                            placeholder="Bangalore, India"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Digital Domain</label>
                                        <input
                                            value={form.website}
                                            onChange={e => setForm({ ...form, website: e.target.value })}
                                            className="w-full bg-apple-gray-50 border border-apple-gray-100 rounded-[25px] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                            placeholder="https://nexus.corp"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Operational Synthesis</label>
                                    <textarea
                                        required
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-apple-gray-50 border border-apple-gray-100 rounded-[25px] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none h-32 transition-all resize-none"
                                        placeholder="Brief brief of the organization mission and scale..."
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black uppercase text-base tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-6 w-6" />
                                            Activate Partner Account
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

