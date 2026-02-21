import React, { useState, useMemo, useEffect } from 'react';
import {
    Book,
    Video,
    FileCode,
    ExternalLink,
    Star,
    Download,
    Search,
    Filter,
    PlayCircle,
    CheckCircle2,
    Zap,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { getResources, getCategories } from '../../services/resource.service';



export default function Resources() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resourcesData, categoriesData] = await Promise.all([
                getResources(),
                getCategories()
            ]);
            setResources(resourcesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch resources", error);
            toast.error("Unable to load resources");
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const matchesSearch =
                res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = !selectedCategory || res.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, resources]);

    const handleAccess = (title: string, url: string) => {
        toast.success(`Redirecting to ${title}...`, {
            icon: '🚀',
            style: {
                borderRadius: '15px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }
        });
        setTimeout(() => window.open(url, '_blank'), 1000);
    };

    const handleDownload = (title: string) => {
        toast.loading(`Preparing secure download for ${title}...`, {
            duration: 2000,
            style: {
                borderRadius: '15px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
            }
        });
        setTimeout(() => {
            toast.dismiss();
            toast.success("Download link synchronized!", { icon: "✅" });
        }, 2000);
    };

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-10 italic">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic">Career Intelligence</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Curated high-caliber materials for elite placement prep</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search intelligence cache..."
                            className="w-full pl-12 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[25px] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 text-xs font-black uppercase tracking-widest transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all",
                            selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Resource Grid */}
            <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6 mb-10">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white italic">Synchronized Resources</h2>
                    </div>
                    <div className="flex gap-2">
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="px-5 py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100 dark:border-rose-800 animate-in slide-in-from-right-4"
                            >
                                Clear Filter
                            </button>
                        )}
                        <span className="px-5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                            Found {filteredResources.length} Entities
                        </span>
                    </div>
                </div>

                {filteredResources.length === 0 ? (
                    <div className="py-40 text-center">
                        <Zap className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em] italic">Intelligence Mismatch</h3>
                        <p className="text-slate-300 mt-2 font-black uppercase tracking-widest text-[10px]">No resources correlate with your current query.</p>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                            className="mt-8 text-blue-500 font-black uppercase tracking-widest text-[10px] hover:underline"
                        >
                            Reset Search Protocols
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredResources.map((res, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[45px] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden italic">
                                <div className="absolute top-0 right-0 p-32 bg-slate-50 dark:bg-slate-800/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/5 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-3">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                                                {res.category}
                                            </span>
                                            {res.featured && (
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                                    High Density
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300">{res.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-4 tracking-tighter">
                                        {res.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 font-bold leading-relaxed opacity-80">
                                        {res.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-10">
                                        {res.tags?.map((tag: string) => (
                                            <span key={tag} className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700 uppercase tracking-widest">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50">
                                        <button
                                            onClick={() => handleAccess(res.title, res.url)}
                                            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 hover:translate-x-1 transition-all"
                                        >
                                            Access Node <ExternalLink className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(res.title)}
                                            className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-[20px] text-slate-400 transition-all shadow-sm hover:shadow-xl hover:scale-110 active:scale-90"
                                        >
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
