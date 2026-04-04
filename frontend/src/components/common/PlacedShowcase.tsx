import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.1 } } },
    item: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
    }
};

export default function PlacedShowcase() {
    const [placedStudents, setPlacedStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaced = async () => {
            try {
                const { data } = await api.get<{ success: boolean; data: any[] }>('/students/placed-showcase');
                if (data.success) {
                    setPlacedStudents(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch placed showcase", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaced();
    }, []);

    if (loading || placedStudents.length === 0) return null;

    return (
        <motion.div initial="initial" animate="animate" variants={stagger.container} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Success <span className="text-indigo-600">Showcase</span></h2>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Our Elite Placed Candidates</p>
                </div>
                <Link to="/alumni" className="h-10 px-4 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-slate-100">
                    View Alumni Network
                    <ChevronRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
                {placedStudents.map((placed, i) => (
                    <motion.div
                        key={placed._id || i}
                        variants={stagger.item}
                        className="min-w-[300px] md:min-w-[340px] snap-center"
                    >
                        <Link 
                            to={`/students/${placed._id}`}
                            className="block bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                        >
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500" />
                            
                            <div className="flex flex-col items-center text-center mb-8 relative z-10">
                                <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    <div className="h-full w-full rounded-[29px] bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                                        {placed.profilePicture ? (
                                            <img 
                                                src={placed.profilePicture} 
                                                alt={placed.name} 
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${placed.name.replace(' ', '+')}&background=random`;
                                                }}
                                            />
                                        ) : (
                                            <span className="text-3xl font-black text-indigo-600">{placed.name.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                    {placed.name}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {placed.branch} · {placed.year} Batch
                                </p>
                            </div>

                            <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-between group-hover:bg-indigo-50 transition-all duration-500 border border-slate-100 group-hover:border-indigo-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Elite Placement</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-base font-black text-indigo-600 tracking-tight">@{placed.company || "Elite Corp"}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:rotate-12 transition-transform">
                                    <Trophy className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
