"use client";

import React, { useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useUpload } from "@/contexts/upload-context";
import { PillButton } from "@/components/ui/pill-button";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  FolderUp,
  Sparkles,
  CheckCircle2,
  Clock,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePage() {
  const { addFiles, files, isUploading } = useUpload();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  // Stats
  const completedCount = files.filter(f => f.status === "complete").length;
  const processingCount = files.filter(f => ["uploading", "processing", "analyzing"].includes(f.status)).length;
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
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

      <PageHeader 
        title="Upload" 
        subtitle="Add files to your library"
      />

      {/* Stats Row */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FadeIn index={0}>
            <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#34C759] mb-1.5">
                <CheckCircle2 size={16} />
                <span className="text-[12px] font-medium">Completed</span>
              </div>
              <p className="text-[22px] font-semibold text-[#1D1D1F]">{completedCount}</p>
            </div>
          </FadeIn>
          <FadeIn index={1}>
            <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#007AFF] mb-1.5">
                <Clock size={16} />
                <span className="text-[12px] font-medium">Processing</span>
              </div>
              <p className="text-[22px] font-semibold text-[#1D1D1F]">{processingCount}</p>
            </div>
          </FadeIn>
          <FadeIn index={2}>
            <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#AF52DE] mb-1.5">
                <Sparkles size={16} />
                <span className="text-[12px] font-medium">AI Tagged</span>
              </div>
              <p className="text-[22px] font-semibold text-[#1D1D1F]">{completedCount}</p>
            </div>
          </FadeIn>
          <FadeIn index={3}>
            <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[#8E8E93] mb-1.5">
                <HardDrive size={16} />
                <span className="text-[12px] font-medium">Total Size</span>
              </div>
              <p className="text-[22px] font-semibold text-[#1D1D1F]">{formatSize(totalSize)}</p>
            </div>
          </FadeIn>
        </div>
      )}

      {/* Main Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-[22px] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-[#1D1D1F] bg-[#F5F5F7]" 
            : "border-[#E5E5E5] hover:border-[#C7C7C7] hover:bg-[#FAFAFA]"
        )}
      >
        <div className={cn(
          "w-20 h-20 rounded-[22px] flex items-center justify-center mb-5 transition-all duration-300",
          isDragging ? "bg-[#1D1D1F] text-white scale-110" : "bg-[#F5F5F7] text-[#8E8E93]"
        )}>
          <UploadCloud size={36} />
        </div>
        <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-1">
          {isDragging ? "Drop to upload" : "Drag files here"}
        </h3>
        <p className="text-[14px] text-[#8E8E93] mb-4">
          or click to browse from your computer
        </p>
        <div className="flex items-center gap-3 text-[12px] text-[#C7C7C7]">
          <span>MP4</span>
          <span>•</span>
          <span>MOV</span>
          <span>•</span>
          <span>JPG</span>
          <span>•</span>
          <span>PNG</span>
          <span>•</span>
          <span>RAW</span>
          <span>•</span>
          <span>ZIP</span>
        </div>
        <p className="text-[11px] text-[#D4D4D4] mt-2">Max 10GB per file • Unlimited uploads</p>
        
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileSelect}
          accept="image/*,video/*,.zip,.rar"
        />
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group"
        >
          <ImageIcon size={24} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Images</span>
          <span className="text-[11px] text-[#C7C7C7]">JPG, PNG, RAW</span>
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group"
        >
          <Video size={24} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Videos</span>
          <span className="text-[11px] text-[#C7C7C7]">MP4, MOV, MKV</span>
        </button>
        <button 
          onClick={() => folderInputRef.current?.click()}
          className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group"
        >
          <FolderUp size={24} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Folder</span>
          <span className="text-[11px] text-[#C7C7C7]">Preserves structure</span>
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2.5 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 group"
        >
          <FileText size={24} className="text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors" />
          <span className="text-[13px] font-medium text-[#1D1D1F]">Documents</span>
          <span className="text-[11px] text-[#C7C7C7]">PDF, DOCX</span>
        </button>
        
        <input 
          ref={folderInputRef}
          type="file" 
          multiple
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden" 
          onChange={handleFileSelect}
        />
      </div>

      {/* AI Processing Info */}
      <div className="p-5 rounded-[22px] bg-gradient-to-r from-[#AF52DE]/5 to-[#007AFF]/5 border border-[#AF52DE]/10">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#AF52DE]/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-[#AF52DE]" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">AI-Powered Processing</h4>
            <p className="text-[13px] text-[#8E8E93] leading-relaxed">
              Every upload is automatically analyzed by AI. We detect scenes, objects, colors, and quality 
              to generate searchable tags. Your assets become instantly discoverable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
