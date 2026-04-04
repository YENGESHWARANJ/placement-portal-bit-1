import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Building2, MapPin, Globe, Users, Star, Briefcase,
    TrendingUp, ExternalLink, ChevronRight, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

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
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10 pb-10"
        >
            {/* Header / Search */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <span className="text-sm font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Network</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Partner Directory</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Elite organizations hiring from our talent pool.</p>
                </div>

                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-300" />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        className="w-full pl-11 pr-5 py-3.5 bg-white border border-apple-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue/50 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-72 bg-white rounded-[32px] animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCompanies.map((company, i) => (
                        <motion.div key={i} variants={stagger.item} className="apple-card p-10 group hover:shadow-apple-hover transition-all duration-500 overflow-hidden relative">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex gap-6">
                                    <div className="h-20 w-20 bg-white text-slate-900 rounded-[24px] flex items-center justify-center text-3xl font-bold shadow-lg group-hover:bg-apple-blue transition-all duration-700">
                                        {company.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-apple-gray-900 mb-1 flex items-center gap-2">
                                            {company.name}
                                            <ShieldCheck className="h-5 w-5 text-apple-blue" />
                                        </h3>
                                        <div className="flex items-center gap-3 text-lg text-apple-gray-400 font-semibold uppercase tracking-wider">
                                            <span>{company.industry || "Technology"}</span>
                                            <span className="h-1 w-1 rounded-full bg-apple-gray-200"></span>
                                            <div className="flex items-center gap-1.5 text-amber-500">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                <span className="text-apple-gray-700">{company.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 rounded-full text-base font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    {company.hiringStatus}
                                </div>
                            </div>

                            <p className="text-apple-gray-400 text-sm leading-relaxed mb-8 font-medium line-clamp-2">
                                {company.description || "Organization mission details are undergoing verification for this talent partner."}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-3.5 text-apple-gray-600">
                                    <div className="p-2.5 bg-apple-gray-50 rounded-xl group-hover:bg-apple-blue/5 transition-all">
                                        <MapPin className="h-4 w-4 text-apple-blue" />
                                    </div>
                                    <span className="text-xs font-bold text-apple-gray-500">{company.location || "Global"}</span>
                                </div>
                                <div className="flex items-center gap-3.5 text-apple-gray-600">
                                    <div className="p-2.5 bg-apple-gray-50 rounded-xl group-hover:bg-apple-blue/5 transition-all">
                                        <Users className="h-4 w-4 text-apple-blue" />
                                    </div>
                                    <span className="text-xs font-bold text-apple-gray-500">Fortune 500</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-apple-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-apple-gray-900 tracking-tight">{company.jobs}</span>
                                    <span className="text-base font-bold uppercase tracking-widest text-apple-gray-400">Open Roles</span>
                                </div>
                                <Link
                                    to="/job-recommendations"
                                    className="apple-btn-primary px-8 py-3.5 text-sm"
                                >
                                    View Jobs
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
