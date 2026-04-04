import React from "react";
import { Student } from "../data/mockStudents";
import { cn } from "../../../utils/cn";
import { MoreHorizontal } from "lucide-react";

interface StudentTableProps {
    students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">USN</th>
                            <th className="px-6 py-4">Branch</th>
                            <th className="px-6 py-4">CGPA</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <div>{student.name}</div>
                                        <div className="text-xs text-muted-foreground">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{student.usn}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                                            {student.branch}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{student.cgpa}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                student.status === "Placed" &&
                                                "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
                                                student.status === "Unplaced" &&
                                                "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
                                                student.status === "Offers Received" &&
                                                "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-600 dark:border-blue-800"
                                            )}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {student.company || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-muted rounded-full">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                    No students found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
