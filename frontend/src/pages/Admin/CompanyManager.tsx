import React, { useState, useEffect } from "react";
import {
    Briefcase, Globe, MapPin, Plus, Edit, Trash2,
    Search, Filter, ExternalLink, ShieldCheck
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Company {
    _id: string;
    name: string;
    description: string;
    industry: string;
    website?: string;
    location: string;
    status: 'active' | 'inactive';
}

export default function CompanyManager() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data } = await api.get<{ companies: Company[] }>('/companies');
            setCompanies(data.companies || []);
        } catch (error) {
            toast.error("Failed to load corporate registry");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            const status = currentStatus === 'active' ? 'inactive' : 'active';
            await api.put(`/companies/${id}`, { status });
            setCompanies(prev => prev.map(c => c._id === id ? { ...c, status } : c));
            toast.success("Identity status toggled");
        } catch (error) {
            toast.error("Failed to transition status");
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-black italic uppercase tracking-[0.5em]">Syncing Global Partnerships...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header section with specific Portal aesthetic */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                        <Globe className="h-8 w-8 text-blue-500 animate-spin-slow" />
                        Partner <span className="text-blue-600">Ecosystem</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> Authorized Institutional Partners Registry
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search organizations..."
                            className="bg-white/5 border border-white/5 px-12 py-3.5 rounded-2xl text-[11px] font-black text-white placeholder:text-slate-600 w-[300px] focus:bg-white/10 outline-none transition-all"
                        />
                    </div>
                    <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Plus className="h-4 w-4" /> Add Partner
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((company) => (
                    <div key={company._id} className="bg-[#0F1121] border border-white/5 p-8 rounded-[45px] relative group hover:border-blue-500/30 transition-all overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Globe className="h-32 w-32" />
                        </div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${company.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                }`}>
                                {company.status === 'active' ? 'Operational' : 'Restricted'}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2 group-hover:text-blue-400 transition-colors">{company.name}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{company.industry}</p>

                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 flex-1">
                            {company.description.length > 120 ? company.description.slice(0, 120) + '...' : company.description}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                <MapPin className="h-4 w-4 text-rose-500" />
                                {company.location}
                            </div>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-widest hover:underline">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    Corporate Domain <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-300 font-black text-[10px] uppercase tracking-widest transition-all">
                                Adjust Intel
                            </button>
                            <button
                                onClick={() => toggleStatus(company._id, company.status)}
                                className={`p-4 rounded-2xl transition-all ${company.status === 'active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                    }`}
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 bg-white/5 rounded-[50px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-slate-600 mb-6">
                            <Briefcase className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest italic">No data matched the search protocol</h3>
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2">Adjust filters or register new partner organization</p>
                    </div>
                )}
            </div>
        </div>
    );
}
