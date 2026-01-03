"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Share2, Send, Download, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionToolbarProps {
  selectedCount: number;
  onMove?: () => void;
  onShare?: () => void;
  onSubmit?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onClear: () => void;
  className?: string;
}

export const SelectionToolbar = ({
  selectedCount,
  onMove,
  onShare,
  onSubmit,
  onDownload,
  onDelete,
  onClear,
  className,
}: SelectionToolbarProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[150]",
            "flex items-center gap-0.5 px-1.5 py-1.5",
            "bg-white/85 backdrop-blur-xl rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
            "border border-white/60",
            className
          )}
        >
          {/* Selection count */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1D1D1F] flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">{selectedCount}</span>
            </div>
            <span className="text-[13px] font-medium text-[#1D1D1F]">selected</span>
          </div>

          <div className="w-px h-5 bg-black/10 mx-1" />

          {/* Move to folder */}
          {onMove && (
            <ToolbarButton onClick={onMove} icon={FolderPlus} label="Move" />
          )}

          {/* Share */}
          {onShare && (
            <ToolbarButton onClick={onShare} icon={Share2} label="Share" />
          )}

          {/* Submit to brand */}
          {onSubmit && (
            <ToolbarButton onClick={onSubmit} icon={Send} label="Submit" />
          )}

          {/* Download */}
          {onDownload && (
            <ToolbarButton onClick={onDownload} icon={Download} label="Download" />
          )}

          {(onMove || onShare || onSubmit || onDownload) && onDelete && (
            <div className="w-px h-5 bg-black/10 mx-1" />
          )}

          {/* Delete */}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#FF3B30] hover:bg-[#FF3B30]/8 active:bg-[#FF3B30]/15 transition-colors"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClear}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#8E8E93] hover:bg-black/5 hover:text-[#1D1D1F] transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const ToolbarButton = ({ onClick, icon: Icon, label }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#1D1D1F] hover:bg-black/5 active:bg-black/10 transition-colors"
  >
    <Icon size={15} strokeWidth={1.5} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

