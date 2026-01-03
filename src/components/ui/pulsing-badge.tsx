"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const PulsingBadge = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#D1D1D6]/10 dark:border-white/5 w-fit">
      <div className="relative flex h-2 w-2">
        <motion.span 
          animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
      </div>
      <span className="text-sm font-medium text-[#1D1D1F] dark:text-white/90 uppercase tracking-wider">{label}</span>
    </div>
  );
};

