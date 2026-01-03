"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SelectionCheckboxProps {
  isSelected: boolean;
  isVisible?: boolean; // Show checkbox even when not selected (e.g., when other items are selected)
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const SelectionCheckbox = ({ 
  isSelected, 
  isVisible = false, 
  onClick,
  className 
}: SelectionCheckboxProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      className={cn(
        "absolute top-3 left-3 z-20 transition-opacity duration-200",
        isSelected || isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className
      )}
    >
      <motion.div 
        initial={false}
        animate={{ 
          scale: isSelected ? 1 : 0.95,
          backgroundColor: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-sm backdrop-blur-md",
          isSelected 
            ? "border border-white/60" 
            : "border border-white/40 hover:bg-white/90"
        )}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={14} strokeWidth={2.5} className="text-[#1D1D1F]" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

