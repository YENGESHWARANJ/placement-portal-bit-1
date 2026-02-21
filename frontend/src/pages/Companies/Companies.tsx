import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Building2, MapPin, Globe, Users, Star, Briefcase,
    TrendingUp, ExternalLink, ChevronRight, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Companies() {
    const [searchTerm, setSearchTerm] = useState("");
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get<{ companies: any[] }>('/jobs/companies');
                setCompanies(res.data.companies);
            } catch (err) {
                console.error("Failed to fetch companies", err);
                toast.error("Could not sync partner directory");
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-10 italic">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic">Partner Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Elite Organizations Hiring from our pool</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Identify talent partners..."
                            className="w-full pl-12 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[25px] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 text-xs font-black uppercase tracking-widest transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-40 animate-pulse text-slate-400 font-black uppercase tracking-[0.4em]">Synchronizing Partner Data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredCompanies.map((company, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[50px] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-700 overflow-hidden group">
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex gap-8">
                                        <div className="h-20 w-20 bg-slate-900 text-white rounded-[30px] flex items-center justify-center text-3xl font-black shadow-xl group-hover:bg-blue-600 transition-all duration-700">
                                            {company.logo}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3 italic">
                                                {company.name}
                                                <ShieldCheck className="h-6 w-6 text-blue-500" />
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                <span>{company.industry || "Technology"}</span>
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
                                                <div className="flex items-center gap-2 text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="text-slate-700 dark:text-slate-300">{company.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100 italic">
                                        {company.hiringStatus}
                                    </div>
                                </div>

                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 font-bold italic line-clamp-2 opacity-80">
                                    {company.description || "Organization mission details are undergoing verification for this talent partner."}
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 transition-all">
                                            <MapPin className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tight italic">{company.location || "Global"}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 transition-all">
                                            <Users className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tight italic">Fortune 500</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white italic">{company.jobs}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Open Intelligence Rounds</span>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="bg-slate-900 text-white px-8 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 dark:shadow-none italic"
                                    >
                                        Extract Jobs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
