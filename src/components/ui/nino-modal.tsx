"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NinoModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClassName?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function NinoModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClassName = "max-w-[560px]",
  className,
  showCloseButton = true,
}: NinoModalProps) {
  // Lock background scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onMouseDown={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.9 }}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] flex flex-col",
              maxWidthClassName,
              className
            )}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {(title || subtitle || showCloseButton) && (
              <div className="px-5 pt-5 pb-4 border-b border-black/[0.06]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {title && (
                      <div className="text-[17px] font-semibold text-[#1D1D1F] truncate">
                        {title}
                      </div>
                    )}
                    {subtitle && (
                      <div className="text-[13px] text-[#8E8E93] mt-0.5">
                        {subtitle}
                      </div>
                    )}
                  </div>

                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="h-7 w-7 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8E8] flex items-center justify-center text-[#8E8E93] transition-colors shrink-0"
                      aria-label="Close"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 min-h-0">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


