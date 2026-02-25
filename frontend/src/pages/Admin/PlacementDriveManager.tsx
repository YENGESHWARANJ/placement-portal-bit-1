import React, { useState, useEffect } from "react";
import {
    Calendar, MapPin, Users, Plus, Edit, Trash2, CheckCircle
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface Drive {
    _id: string;
    company: string;
    date: string;
    venue: string;
    criterias: { cgpa: number; branches: string[] };
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export default function PlacementDriveManager() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const { data } = await api.get<{ drives: Drive[] }>('/placement-drives');
            setDrives(data.drives || []);
        } catch (error) {
            toast.error("Failed to fetch placement drives");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this drive?")) return;
        try {
            await api.delete(`/placement-drives/${id}`);
            setDrives(prev => prev.filter(d => d._id !== id));
            toast.success("Drive deleted");
        } catch (error) {
            toast.error("Failed to delete drive");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Placement Drives</h1>
                    <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Schedule • Manage • Execute</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                    <Plus className="h-4 w-4" /> Schedule Drive
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map(drive => (
                    <div key={drive._id} className="bg-[#0F1121] p-6 rounded-[30px] border border-white/5 relative group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-white italic">{drive.company}</h3>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{drive.status}</span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                {new Date(drive.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                <MapPin className="h-4 w-4 text-rose-500" />
                                {drive.venue}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                <Users className="h-4 w-4 text-blue-500" />
                                Eligible: {drive.criterias.branches.join(', ')} (CGPA {drive.criterias.cgpa}+)
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 font-black text-[10px] uppercase tracking-widest transition-all">Details</button>
                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(drive._id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
