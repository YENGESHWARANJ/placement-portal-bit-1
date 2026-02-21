import React, { useCallback, useState } from "react";
import { Upload, FileText, X, Shield, FileSearch, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "../../../utils/cn";

interface DropZoneProps {
    onFileSelect: (file: File) => void;
}

export default function DropZone({ onFileSelect }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            const isImage = file.type.startsWith("image/");

            if (validTypes.includes(file.type) || isImage) {
                setSelectedFile(file);
                onFileSelect(file);
                toast.success(`Node Identified: ${file.name}`, { icon: '🧬' });
            } else {
                toast.error("Invalid File Signature. Use PDF, DOCX, or Image.");
            }
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
    };

    return (
        <div
            className={cn(
                "relative min-h-[400px] flex flex-col items-center justify-center p-12 transition-all duration-700 text-center cursor-pointer overflow-hidden group/dz",
                isDragging
                    ? "bg-blue-600/5 scale-[0.99]"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
        >
            <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleChange}
            />

            {selectedFile ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-500 relative z-10">
                    <div className="h-24 w-24 bg-blue-600 dark:bg-blue-500 rounded-[30px] flex items-center justify-center mb-8 shadow-2xl rotate-3">
                        <FileText className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-2">{selectedFile.name}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" /> Secure</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    <button
                        onClick={clearFile}
                        className="mt-10 px-8 py-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-800 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                        Eject File
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center relative z-10">
                    <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-[35px] flex items-center justify-center mb-8 group-hover/dz:scale-110 group-hover/dz:-rotate-6 transition-all duration-500 shadow-inner">
                        <Upload className="h-10 w-10 text-slate-400 group-hover/dz:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-3">Initialize Upload</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Deploy your resume for neural analysis</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <FileSearch className="h-4 w-4 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">PDF / DOCX</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fast OCR</span>
                        </div>
                    </div>

                    <button className="mt-12 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-blue-600/20 hover:border-blue-600 transition-all pb-1 leading-none">
                        Or Browse Local Storage
                    </button>
                </div>
            )}

            {/* Visual Flair */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover/dz:via-blue-500/50 transition-all duration-500"></div>
        </div>
    );
}
