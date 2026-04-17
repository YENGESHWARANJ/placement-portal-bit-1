import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function PlacedShowcase() {
    const [placedStudents, setPlacedStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPlaced = async () => {
            try {
                const { data } = await api.get<{ success: boolean; data: any[] }>('/students/placed-showcase');
                if (data.success) {
                    // Clone and fill array for more demo banners if needed
                    const results = data.data;
                    setPlacedStudents(results.length > 0 ? results : []);
                }
            } catch (err) {
                console.error("Failed to fetch placed showcase", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaced();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -width : width, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (placedStudents.length === 0) return;
        const intervalId = setInterval(() => {
            if (scrollRef.current) {
                const el = scrollRef.current;
                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (el.scrollLeft >= maxScrollLeft - 10) {
                    el.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    el.scrollBy({ left: el.offsetWidth, behavior: 'smooth' });
                }
            }
        }, 4000); // Auto scroll every 4 seconds
        return () => clearInterval(intervalId);
    }, [placedStudents]);

    if (loading || placedStudents.length === 0) return null;

    return (
        <div className="space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Recent <span className="text-indigo-600">Successes</span></h2>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Recently Placed Alumni</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => scroll('left')} className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => scroll('right')} className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory pt-2 w-full"
            >
                {placedStudents.map((placed, i) => {
                    // Mock data generator for the banner
                    const mockPackages = ["18.0", "24.5", "14.5", "32.0", "12.0", "44.0"];
                    const lpa = placed.package || mockPackages[i % mockPackages.length];
                    const comp = (placed.company || "ShopUp").toUpperCase();
                    const compHalf1 = comp.substring(0, Math.ceil(comp.length / 2));
                    const compHalf2 = comp.substring(Math.ceil(comp.length / 2));

                    return (
                        <div
                            key={placed._id || i}
                            className="min-w-full snap-center flex-shrink-0"
                        >
                            <div className="w-full h-[400px] sm:h-[450px] relative overflow-hidden bg-white border border-slate-100 shadow-2xl rounded-[10px]">
                                
                                {/* Right Side Solid White Base */}
                                <div className="absolute inset-0 w-full h-full bg-white z-0" />
                                
                                {/* Decorative Light Teal Accent (Diagonal) on the far right */}
                                <div className="absolute top-0 bottom-0 right-0 w-[40%] bg-[#24908a]" style={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 75% 100%)' }} />

                                {/* Left Side Layering - Complex Diagonal Cuts */}
                                {/* Layer 1: Lightest Teal */}
                                <div className="absolute top-0 bottom-0 left-0 w-[65%] sm:w-[55%] bg-[#24908a] z-[1]" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }} />
                                
                                {/* Layer 2: Mid Dark Teal */}
                                <div className="absolute top-0 bottom-0 left-0 w-[55%] sm:w-[48%] bg-[#1a4448] z-[2]" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }} />
                                
                                {/* Layer 3: Darkest Background Base for Hexagon */}
                                <div className="absolute top-0 bottom-0 left-0 w-[45%] sm:w-[40%] bg-[#1c2f2f] z-[3]" style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)' }} />

                                {/* Content Z-Layer Container */}
                                <div className="absolute inset-0 z-10 flex flex-col md:flex-row h-full">
                                    
                                    {/* Left Content (Student Portrait & Name) */}
                                    <div className="w-full md:w-[45%] h-full flex flex-col items-center justify-center pt-8 md:pt-0 relative z-20">
                                        <div className="relative w-48 h-[220px] sm:w-[260px] sm:h-[280px] flex items-center justify-center">
                                            {/* Hexagon White Border */}
                                            <div 
                                                className="absolute inset-0 bg-white" 
                                                style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }} 
                                            />
                                            {/* Hexagon Inner Image Background */}
                                            <div 
                                                className="absolute inset-[4px] bg-[#1a4448] flex items-center justify-center overflow-hidden"
                                                style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
                                            >
                                                {placed.profilePicture ? (
                                                    <img 
                                                        src={placed.profilePicture} 
                                                        alt={placed.name} 
                                                        className="w-full h-full object-cover scale-110 object-top hover:scale-125 transition-transform duration-700"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${placed.name.replace(' ', '+')}&background=1a4448&color=fff&size=512`;
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-6xl font-black text-white">{placed.name.charAt(0)}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name & Branch Label */}
                                        <div className="mt-[-20px] bg-[#1c2f2f]/90 backdrop-blur-sm px-8 py-3 z-30 shadow-2xl text-center min-w-[200px]">
                                            <p className="text-xl sm:text-2xl font-bold text-white leading-tight truncate">{placed.name}</p>
                                            <p className="text-sm sm:text-base font-bold text-[#b4d2d1] tracking-widest uppercase">{placed.branch}</p>
                                        </div>
                                    </div>

                                    {/* Right Content (Company & Salary) */}
                                    <div className="w-full md:w-[55%] h-full flex flex-col justify-center items-end pr-8 sm:pr-20 pb-10 md:pb-0 relative z-10 scale-90 sm:scale-100 origin-right">
                                        <h1 className="text-6xl sm:text-[90px] font-black mb-0 sm:mb-2 leading-none flex tracking-tighter">
                                            <span className="text-[#24908a]">{compHalf1}</span>
                                            <span className="text-amber-400">{compHalf2}</span>
                                        </h1>
                                        <p className="text-2xl sm:text-4xl font-medium text-amber-400 mb-0 sm:mb-2 tracking-wide font-sans">
                                            Salary Package
                                        </p>
                                        <div className="flex items-baseline text-[#24908a]">
                                            <span className="text-6xl sm:text-8xl font-medium tracking-tighter mr-2">₹</span>
                                            <span className="text-8xl sm:text-[150px] font-black leading-none tracking-tighter" style={{ textShadow: '4px 4px 0px rgba(36, 144, 138, 0.1)' }}>
                                                {lpa}
                                            </span>
                                            <span className="text-4xl sm:text-6xl font-black ml-3 uppercase tracking-tighter">LPA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
