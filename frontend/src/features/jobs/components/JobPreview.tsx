import React from "react";
import { Building2, MapPin, IndianRupee, Clock } from "lucide-react";

interface JobPreviewProps {
    data: any;
}

export default function JobPreview({ data }: JobPreviewProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Live Preview</h3>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
                <div className="h-24 bg-gradient-to-r from-primary to-blue-600"></div>
                <div className="p-6 pt-0">
                    <div className="flex justify-between items-start">
                        <div className="-mt-10 mb-4 bg-background p-2 rounded-xl border border-border shadow-sm inline-block">
                            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
                                {data.type || "Full-time"}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-1">{data.title || "Job Title"}</h2>
                    <p className="text-muted-foreground mb-6">{data.company || "Company Name"}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{data.location || "Location"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <IndianRupee className="h-4 w-4" />
                            <span>{data.ctc ? `${data.ctc} LPA` : "CTC"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{data.deadline ? new Date(data.deadline).toLocaleDateString() : "Apply By"}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {data.description || "Job description will appear here..."}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Requirements</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {data.requirements || "Requirements will appear here..."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
