import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    TrendingUp, Users, Target, Award,
    PieChart as PieIcon, BarChart2, Calendar,
    Filter, Download, ChevronRight, Briefcase
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const placementData = [
    { name: '2021', placed: 85, ctc: 6.5 },
    { name: '2022', placed: 92, ctc: 8.2 },
    { name: '2023', placed: 88, ctc: 10.5 },
    { name: '2024', placed: 95, ctc: 12.8 },
    { name: '2025', placed: 78, ctc: 15.2 }, // Ongoing
];

const branchData = [
    { name: 'CSE', value: 320, color: '#3b82f6' },
    { name: 'ECE', value: 240, color: '#8b5cf6' },
    { name: 'ME', value: 150, color: '#10b981' },
    { name: 'EE', value: 180, color: '#f59e0b' },
];

const companyData = [
    { name: 'Google', offers: 12, salary: '45L' },
    { name: 'Microsoft', offers: 18, salary: '42L' },
    { name: 'Amazon', offers: 25, salary: '38L' },
    { name: 'TCS', offers: 120, salary: '7L' },
    { name: 'Infosys', offers: 95, salary: '6L' },
];

export default function PlacementAnalyticsView() {
    const [filterOpen, setFilterOpen] = useState(false);

    const handleExportReport = () => {
        const csvHeaders = 'Metric,Value\n';
        const rows = [
            'Overall Placed,88%',
            'Highest Package,45.2 LPA',
            'Avg. Package,12.4 LPA',
            'Active Recruiters,142',
            ...placementData.map(d => `${d.name},${d.placed} placed, ${d.ctc} LPA`)
        ].join('\n');
        const blob = new Blob([csvHeaders + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `placement-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported successfully');
    };

    return (
        <div className="animate-in fade-in zoom-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Placement Analytics</h1>
                    <p className="text-slate-500 mt-1">Institutional performance overview for the current academic cycle.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setFilterOpen(prev => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${filterOpen ? 'bg-slate-900 text-slate-900' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Filter className="h-4 w-4" /> Filter By
                    </button>
                    <button
                        type="button"
                        onClick={handleExportReport}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                </div>
            </div>

            {filterOpen && (
                <div className="mb-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
                    <span className="text-sm font-bold text-slate-600">Filter by:</span>
                    {['All Years', '2024', '2025'].map((y) => (
                        <button
                            key={y}
                            type="button"
                            onClick={() => setFilterOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            {y}
                        </button>
                    ))}
                    {branchData.map((b) => (
                        <button
                            key={b.name}
                            type="button"
                            onClick={() => setFilterOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            {b.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Overall Placed', value: '88%', sub: '+4.2% from LY', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Highest Package', value: '45.2 LPA', sub: 'Google India', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Avg. Package', value: '12.4 LPA', sub: 'Top 10% get 24L+', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Active Recruiters', value: '142', sub: '24 New this month', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="text-base font-black uppercase tracking-wider text-slate-500">Real-time</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                        <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" /> {stat.sub}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-blue-500" /> Performance Trends
                        </h3>
                        <div className="h-80 min-h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                                <AreaChart data={placementData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="placed" stroke="#3b82f6" fill="#3b82f610" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
