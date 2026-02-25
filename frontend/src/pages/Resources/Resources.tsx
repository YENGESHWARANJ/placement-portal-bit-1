import React, { useState, useMemo, useEffect } from "react";
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
    TrendingUp,
    Sparkles,
    Layers,
    Cpu,
    Target,
    BookOpen,
    FileText,
    ArrowUpRight,
    Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";
import { getResources, getCategories } from "../../services/resource.service";

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

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
        toast.success(`Accessing ${title}...`, {
            style: {
                borderRadius: "16px",
                background: "#fff",
                color: "#1d1d1f",
                border: "1px solid #f5f5f7",
                fontSize: "13px",
                fontWeight: "600",
            }
        });
        setTimeout(() => window.open(url, "_blank"), 1000);
    };

    const handleDownload = (title: string) => {
        toast.success(`Download started for ${title}`, {
            style: {
                borderRadius: "16px",
                background: "#fff",
                color: "#1d1d1f",
                border: "1px solid #f5f5f7",
                fontSize: "13px",
                fontWeight: "600",
            }
        });
    };

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="text-[11px] font-bold text-apple-blue uppercase tracking-[0.2em] mb-2 block">Knowledge</span>
                    <h1 className="text-4xl font-bold text-apple-gray-900 tracking-tight">Learning Resources</h1>
                    <p className="text-apple-gray-400 mt-2 font-medium">Curated content to sharpen your professional edge.</p>
                </div>
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search articles, videos, guides..."
                        className="w-full pl-11 pr-5 py-3.5 bg-white border border-apple-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue/50 transition-all shadow-sm"
                    />
                </div>
            </motion.div>

            {/* Featured Section */}
            <motion.div variants={stagger.item} className="apple-card p-10 bg-apple-blue relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                            <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Skill Mastery</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight leading-tight mb-4">
                            Optimize your <span className="underline decoration-white/30 underline-offset-8">career trajectory</span> with targetted intelligence.
                        </h2>
                        <p className="text-white/70 font-medium">Access the latest interview strategies and technical playbooks designed for high-growth companies.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 text-center min-w-[120px]">
                            <p className="text-3xl font-bold text-white leading-none mb-1">{resources.length}</p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Nodes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 text-center min-w-[120px]">
                            <p className="text-3xl font-bold text-white leading-none mb-1">{categories.length}</p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Sectors</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div variants={stagger.item} className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                        !selectedCategory
                            ? "bg-apple-gray-900 text-white shadow-lg shadow-apple-gray-900/10"
                            : "bg-white text-apple-gray-400 border border-apple-gray-100 hover:bg-apple-gray-50"
                    )}
                >
                    All Sectors
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                            selectedCategory === cat
                                ? "bg-apple-blue text-white shadow-lg shadow-apple-blue/20"
                                : "bg-white text-apple-gray-400 border border-apple-gray-100 hover:bg-apple-gray-50"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="apple-card p-8 h-[320px] bg-white animate-pulse">
                                <div className="h-12 w-12 bg-apple-gray-50 rounded-2xl mb-6" />
                                <div className="h-6 w-3/4 bg-apple-gray-50 rounded-lg mb-4" />
                                <div className="h-4 w-full bg-apple-gray-50 rounded-lg mb-2" />
                                <div className="h-4 w-5/6 bg-apple-gray-50 rounded-lg mb-8" />
                                <div className="h-10 w-full bg-apple-gray-50 rounded-xl mt-auto" />
                            </div>
                        ))
                    ) : filteredResources.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 text-center apple-card bg-white"
                        >
                            <Target className="h-12 w-12 text-apple-gray-200 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight">No resources found</h3>
                            <p className="text-apple-gray-400 mt-2 font-medium">Try adjusting your search terms or category filter.</p>
                        </motion.div>
                    ) : (
                        filteredResources.map((res, i) => (
                            <motion.div
                                key={res.id || i}
                                variants={stagger.item}
                                layout
                                className="apple-card p-8 group hover:shadow-apple-hover transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-apple-gray-50 text-apple-gray-400 group-hover:bg-apple-blue group-hover:text-white flex items-center justify-center transition-all duration-500">
                                        {res.category?.toLowerCase().includes("video") ? <Video className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                                    </div>
                                    {res.rating && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-bold text-amber-700">{res.rating}</span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-apple-gray-900 tracking-tight mb-3 group-hover:text-apple-blue transition-colors leading-tight">
                                    {res.title}
                                </h3>

                                <p className="text-[13px] font-medium text-apple-gray-400 leading-relaxed mb-6 line-clamp-2">
                                    {res.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                    {res.tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="text-[9px] font-bold text-apple-gray-400 bg-apple-gray-50 px-3 py-1.5 rounded-lg border border-apple-gray-100 uppercase tracking-widest whitespace-nowrap">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-apple-gray-50">
                                    <button
                                        onClick={() => handleAccess(res.title, res.url)}
                                        className="flex-1 apple-btn-secondary py-3 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                    >
                                        Access <ArrowUpRight className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(res.title)}
                                        className="h-10 w-10 rounded-xl bg-apple-gray-50 border border-apple-gray-100 flex items-center justify-center text-apple-gray-400 hover:bg-apple-blue hover:text-white hover:border-apple-blue transition-all"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
