"use client";

import React from "react";
import { PillButton } from "@/components/ui/pill-button";
import { UploadCloud, Image, Video, FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorUploadPage() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<{name: string, size: string, status: "uploading" | "complete" | "error"}[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate file upload
    const mockFile = { name: "Beach_Sunset_4K.mp4", size: "1.2 GB", status: "uploading" as const };
    setUploadedFiles(prev => [...prev, mockFile]);
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.name === mockFile.name ? {...f, status: "complete"} : f));
    }, 2000);
  };

  // Fade in animation wrapper
  const FadeIn = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-[24px] font-semibold text-[#1D1D1F]">Upload Assets</h1>
        <p className="text-[15px] text-[#8E8E93]">
          Upload videos and images for <span className="text-[#1D1D1F] font-medium">Four Seasons Maui</span>. 
          Your uploads will be reviewed before being added to the library.
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-[22px] p-14 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer",
          isDragging 
            ? "border-[#1D1D1F] bg-[#F5F5F7]" 
            : "border-[#E5E5E5] hover:border-[#C7C7C7] hover:bg-[#FAFAFA]"
        )}
      >
        <div className={cn(
          "w-18 h-18 rounded-[22px] flex items-center justify-center mb-5 transition-all duration-300",
          isDragging ? "bg-[#1D1D1F] text-white scale-110" : "bg-[#F5F5F7] text-[#8E8E93]"
        )}>
          <UploadCloud size={32} />
        </div>
        <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-1">
          {isDragging ? "Drop files here" : "Drag files here"}
        </h3>
        <p className="text-[14px] text-[#8E8E93] mb-5">or click to browse from your computer</p>
        <PillButton variant="primary">
          Select Files
        </PillButton>
        <p className="text-[12px] text-[#C7C7C7] mt-4">
          Supports: MP4, MOV, JPG, PNG, RAW • Max 5GB per file
        </p>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          className="hidden" 
          accept="image/*,video/*"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-3 gap-3">
        <button className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group">
          <Image size={22} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Images Only</span>
        </button>
        <button className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group">
          <Video size={22} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Videos Only</span>
        </button>
        <button className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group">
          <FileText size={22} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Documents</span>
        </button>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[14px] font-semibold text-[#1D1D1F]">Uploading</h3>
          {uploadedFiles.map((file, i) => (
            <FadeIn key={i} index={i}>
              <div className="flex items-center gap-4 p-4 rounded-[18px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center",
                  file.status === "complete" ? "bg-[#34C759]/10 text-[#34C759]" : 
                  file.status === "error" ? "bg-[#FF3B30]/10 text-[#FF3B30]" : 
                  "bg-[#F5F5F7] text-[#8E8E93]"
                )}>
                  {file.status === "complete" && <Check size={20} />}
                  {file.status === "error" && <AlertCircle size={20} />}
                  {file.status === "uploading" && (
                    <div className="w-5 h-5 border-2 border-[#8E8E93] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1D1D1F] truncate">{file.name}</p>
                  <p className="text-[12px] text-[#8E8E93]">{file.size}</p>
                </div>
                <span className={cn(
                  "text-[11px] font-semibold uppercase",
                  file.status === "complete" ? "text-[#34C759]" : 
                  file.status === "error" ? "text-[#FF3B30]" : 
                  "text-[#8E8E93]"
                )}>
                  {file.status === "complete" ? "Uploaded" : file.status === "error" ? "Failed" : "Uploading..."}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="p-5 rounded-[22px] bg-[#007AFF]/5 border border-[#007AFF]/10">
        <p className="text-[13px] text-[#007AFF] leading-relaxed">
          <strong>Note:</strong> All uploads are reviewed by the team before being added to the brand library. 
          You'll receive a notification once your uploads are approved.
        </p>
      </div>
    </div>
  );
}
