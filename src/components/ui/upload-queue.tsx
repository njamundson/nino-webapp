"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  ChevronUp, 
  ChevronDown,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Video,
  FileText,
  File
} from "lucide-react";
import { useUpload, UploadFile, UploadStatus } from "@/contexts/upload-context";
import { cn } from "@/lib/utils";

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.includes("pdf") || type.includes("document")) return FileText;
  return File;
};

const getStatusIcon = (status: UploadStatus) => {
  switch (status) {
    case "queued":
      return <div className="w-4 h-4 rounded-full border-2 border-[#D0D0D0]" />;
    case "uploading":
      return <Loader2 size={16} className="animate-spin text-[#1D1D1F]" />;
    case "complete":
      return <Check size={16} className="text-[#34C759]" />;
    case "error":
      return <AlertCircle size={16} className="text-[#FF3B30]" />;
  }
};

const getStatusText = (status: UploadStatus) => {
  switch (status) {
    case "queued": return "Waiting";
    case "uploading": return "Uploading";
    case "complete": return "Complete";
    case "error": return "Failed";
  }
};

const FileRow = ({ file }: { file: UploadFile }) => {
  const { removeFile, retryFile } = useUpload();
  const FileIcon = getFileIcon(file.type);
  
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-black/[0.02] rounded-xl transition-colors group">
      {/* Thumbnail or Icon */}
      <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center shrink-0 overflow-hidden">
        {file.thumbnailUrl ? (
          <img src={file.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <FileIcon size={18} className="text-[#8E8E93]" />
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[#8E8E93]">{formatSize(file.size)}</span>
          <span className="text-[11px] text-[#D0D0D0]">•</span>
          <span className={cn(
            "text-[11px] font-medium",
            file.status === "complete" ? "text-[#34C759]" :
            file.status === "error" ? "text-[#FF3B30]" :
            "text-[#1D1D1F]"
          )}>
            {getStatusText(file.status)}
            {file.status === "uploading" && ` ${file.progress}%`}
          </span>
        </div>
        
        {/* Progress bar - black/neutral */}
        {file.status === "uploading" && (
          <div className="mt-1.5 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1D1D1F] rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Status Icon */}
      <div className="shrink-0">
        {getStatusIcon(file.status)}
      </div>

      {/* Actions */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.status === "error" ? (
          <button 
            onClick={() => retryFile(file.id)}
            className="h-7 w-7 rounded-lg hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"
          >
            <RotateCcw size={14} />
          </button>
        ) : file.status === "complete" ? (
          <button 
            onClick={() => removeFile(file.id)}
            className="h-7 w-7 rounded-lg hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const UploadQueue = () => {
  const { files, showQueue, setShowQueue, clearCompleted, isUploading } = useUpload();
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (files.length === 0) return null;

  const completedCount = files.filter(f => f.status === "complete").length;
  const activeCount = files.filter(f => f.status !== "complete" && f.status !== "error").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const totalCount = files.length;

  return (
    <AnimatePresence>
      {showQueue && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-4 right-4 w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04]">
            <div className="flex items-center gap-2.5">
              {isUploading ? (
                <Loader2 size={15} className="animate-spin text-[#1D1D1F]" />
              ) : (
                <Check size={15} className="text-[#34C759]" />
              )}
              <span className="text-[13px] font-medium text-[#1D1D1F]">
                {isUploading 
                  ? `Uploading ${activeCount}/${totalCount}`
                  : `${completedCount} complete`
                }
              </span>
              {errorCount > 0 && (
                <span className="text-[11px] text-[#FF3B30] font-medium">
                  {errorCount} failed
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {completedCount > 0 && !isUploading && (
                <button 
                  onClick={clearCompleted}
                  className="h-7 px-2.5 rounded-lg hover:bg-black/[0.04] text-[11px] font-medium text-[#8E8E93] transition-colors"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 w-7 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-[#8E8E93] transition-colors"
              >
                {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
              <button 
                onClick={() => setShowQueue(false)}
                className="h-7 w-7 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-[#8E8E93] transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* File List */}
          {isExpanded && (
            <div className="max-h-[280px] overflow-y-auto p-1.5">
              {files.map(file => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

