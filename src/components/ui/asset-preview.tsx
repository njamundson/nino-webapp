"use client";

import * as React from "react";
import { 
  Download, 
  Share2, 
  Calendar, 
  FileType, 
  Play, 
  Plus,
  MapPin,
  X,
  Sparkles,
  Link2,
  Copy,
  Check,
  Lock,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";

interface AssetPreviewProps {
  asset: {
    url: string;
    title: string;
    type: "image" | "video";
    details: string;
    date: string;
    location: string;
    tags: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export const AssetPreview = ({ asset, isOpen, onClose, onDelete }: AssetPreviewProps) => {
  const [showSharePanel, setShowSharePanel] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [canDownload, setCanDownload] = React.useState(false);
  const [requirePassword, setRequirePassword] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Reset zoom when closing or changing asset
  React.useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [asset.url, isOpen]);

  const shareLink = `https://nino.app/share/${encodeURIComponent(asset.title.replace(/\s+/g, "-").toLowerCase())}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // For Unsplash images, we need to fetch the image and create a blob
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(asset.url, '_blank');
    }
    setIsDownloading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const resetZoom = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  // Double click to zoom
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      resetZoom();
    }
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoom(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  // Check if this is a video (but using image URL - demo mode)
  const isVideoWithImageUrl = asset.type === "video" && asset.url.includes("unsplash.com");

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative max-w-[90vw] w-full h-[85vh] overflow-hidden border border-[#E5E5E5] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] rounded-[28px] shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/90 dark:bg-[#2C2C2E]/90 backdrop-blur-sm border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center text-[#8E8E93] hover:bg-white dark:hover:bg-[#3A3A3C] hover:text-[#1D1D1F] dark:hover:text-white transition-all shadow-sm"
            >
              <X size={18} />
            </button>

            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Main Visual Area */}
              <div 
                className="flex-1 relative bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-8 overflow-hidden"
                onWheel={handleWheel}
              >
                {/* Zoom Controls */}
                {asset.type === "image" && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-[#2C2C2E]/90 backdrop-blur-sm rounded-full border border-black/[0.06] dark:border-white/[0.06] shadow-lg">
                    <button 
                      onClick={zoomOut}
                      disabled={zoom <= 0.5}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="w-12 text-center text-[12px] font-medium text-[#1D1D1F] dark:text-white">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button 
                      onClick={zoomIn}
                      disabled={zoom >= 4}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                      <ZoomIn size={14} />
                    </button>
                    {zoom !== 1 && (
                      <button 
                        onClick={resetZoom}
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                )}

                <div 
                  className={cn(
                    "relative w-full h-full flex items-center justify-center",
                    zoom > 1 && "cursor-grab",
                    isDragging && "cursor-grabbing"
                  )}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onDoubleClick={handleDoubleClick}
                >
                  {asset.type === "video" && !isVideoWithImageUrl ? (
                    <video 
                      src={asset.url} 
                      className="max-w-full max-h-full rounded-xl shadow-lg object-contain"
                      controls
                      poster={asset.url}
                    />
                  ) : isVideoWithImageUrl ? (
                    // Video with demo image URL - show image with play overlay
                    <div className="relative">
                      <img 
                        src={asset.url} 
                        className="max-w-full max-h-full rounded-xl shadow-lg object-contain"
                        alt={asset.title}
                        style={{
                          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                          transition: isDragging ? "none" : "transform 0.2s ease-out",
                        }}
                        draggable={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-6 py-4 bg-black/60 backdrop-blur-md rounded-2xl text-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                            <Play size={24} className="text-white ml-1" />
                          </div>
                          <p className="text-[14px] font-medium text-white">Video Preview</p>
                          <p className="text-[12px] text-white/70 mt-1">Download to play</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      ref={imageRef}
                      src={asset.url} 
                      className="max-w-full max-h-full rounded-xl shadow-lg object-contain select-none"
                      alt={asset.title}
                      style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transition: isDragging ? "none" : "transform 0.2s ease-out",
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              </div>

              {/* Details Sidebar */}
              <div className="w-full md:w-[360px] border-l border-[#E5E5E5] dark:border-[#2C2C2E] flex flex-col bg-white dark:bg-[#1C1C1E]">
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[10px] font-semibold uppercase tracking-wide text-[#8E8E93]">
                        {asset.type === "video" ? "Video" : "Image"}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">{asset.title}</h2>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex-1 h-10 rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#3A3A3C] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-70"
                    >
                      {isDownloading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} />
                      )} 
                      {isDownloading ? "Downloading..." : "Download"}
                    </button>
                    <button 
                      onClick={() => setShowSharePanel(!showSharePanel)}
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                        showSharePanel 
                          ? "bg-[#007AFF] text-white" 
                          : "bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white hover:bg-[#EBEBEB] dark:hover:bg-[#3A3A3C]"
                      )}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>

                  {/* Share Panel */}
                  <AnimatePresence>
                    {showSharePanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-[#F8F8FA] dark:bg-[#2C2C2E] border border-black/[0.06] dark:border-white/[0.06] space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Link2 size={14} className="text-[#8E8E93]" />
                                <span className="text-[13px] font-medium text-[#1D1D1F] dark:text-white">Shareable Link</span>
                              </div>
                              <button 
                                onClick={copyLink}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-[#007AFF] hover:text-[#0056b3] transition-colors"
                              >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? "Copied!" : "Copy"}
                              </button>
                            </div>
                            <p className="text-[11px] text-[#8E8E93] font-mono truncate bg-white dark:bg-[#1C1C1E] px-3 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06]">
                              {shareLink}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[12px] font-medium text-[#6E6E73] uppercase tracking-wide">Permissions</p>
                            <div className="flex items-center justify-between py-2.5">
                              <div className="flex items-center gap-2.5">
                                <Download size={15} className="text-[#8E8E93]" />
                                <span className="text-[13px] text-[#1D1D1F] dark:text-white">Allow download</span>
                              </div>
                              <Toggle checked={canDownload} onCheckedChange={setCanDownload} />
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                              <div className="flex items-center gap-2.5">
                                <Lock size={15} className="text-[#8E8E93]" />
                                <span className="text-[13px] text-[#1D1D1F] dark:text-white">Require password</span>
                              </div>
                              <Toggle checked={requirePassword} onCheckedChange={setRequirePassword} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="h-px bg-[#E5E5E5] dark:bg-[#2C2C2E]" />

                  {/* Metadata */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#8E8E93]">Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center">
                          <Calendar size={14} className="text-[#8E8E93]" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#8E8E93]">Created</p>
                          <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-white">{asset.date || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center">
                          <MapPin size={14} className="text-[#8E8E93]" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#8E8E93]">Location</p>
                          <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-white">{asset.location || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center">
                          <FileType size={14} className="text-[#8E8E93]" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#8E8E93]">Format</p>
                          <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-white">{asset.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#E5E5E5] dark:bg-[#2C2C2E]" />

                  {/* AI Tags */}
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-[#8E8E93]" />
                        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#8E8E93]">AI Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {asset.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1D1D1F] dark:text-white">
                            {tag}
                          </span>
                        ))}
                        <button className="h-8 w-8 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#8E8E93] hover:bg-[#EBEBEB] dark:hover:bg-[#3A3A3C] transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Button at Bottom */}
                {onDelete && (
                  <div className="p-6 pt-0">
                    <button 
                      onClick={onDelete}
                      className="w-full h-10 rounded-full border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#FF3B30]/5 transition-colors"
                    >
                      <Trash2 size={15} /> Delete Asset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
