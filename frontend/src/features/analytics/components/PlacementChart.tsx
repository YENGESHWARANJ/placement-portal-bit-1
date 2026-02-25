import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const data = [
    { month: "Jan", placed: 65, offers: 80 },
    { month: "Feb", placed: 59, offers: 90 },
    { month: "Mar", placed: 80, offers: 110 },
    { month: "Apr", placed: 81, offers: 100 },
    { month: "May", placed: 56, offers: 85 },
    { month: "Jun", placed: 55, offers: 80 },
    { month: "Jul", placed: 40, offers: 60 },
];

export default function PlacementChart() {
    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Placement Trends</h3>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={100}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--muted-foreground)" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "var(--foreground)" }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="placed"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="offers"
                            stroke="#82ca9d"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
