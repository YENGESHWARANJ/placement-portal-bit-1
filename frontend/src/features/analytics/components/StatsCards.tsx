import React from "react";
import { Users, Briefcase, Award, TrendingUp } from "lucide-react";
import { cn } from "../../../utils/cn";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
    return (
        <div className={cn("bg-card p-6 rounded-xl border border-border shadow-sm", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className={cn("font-medium", trendUp ? "text-green-500" : "text-red-500")}>
                        {trend}
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                </div>
            )}
        </div>
    );
}

export default function StatsCards() {
    const stats = [
        { title: "Total Students", value: "1,234", icon: Users, trend: "+12%", trendUp: true },
        { title: "Placed Students", value: "856", icon: Award, trend: "+5%", trendUp: true },
        { title: "Active Jobs", value: "45", icon: Briefcase, trend: "-2%", trendUp: false },
        { title: "Avg. Package", value: "₹ 8.5 LPA", icon: TrendingUp, trend: "+8%", trendUp: true },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </div>
    );
}
