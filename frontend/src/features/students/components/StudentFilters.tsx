import React from "react";
import { Search } from "lucide-react";

interface StudentFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    branchFilter: string;
    setBranchFilter: (branch: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export default function StudentFilters({
    searchQuery,
    setSearchQuery,
    branchFilter,
    setBranchFilter,
    statusFilter,
    setStatusFilter,
}: StudentFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name or USN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
            <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ISE">ISE</option>
                <option value="ME">ME</option>
            </select>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="All">All Status</option>
                <option value="Placed">Placed</option>
                <option value="Unplaced">Unplaced</option>
                <option value="Offers Received">Offers Received</option>
            </select>
        </div>
    );
}
