"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SegmentedControl = ({
  options,
  value,
  onChange,
  className,
  size = "md",
}: SegmentedControlProps) => {
  const activeIndex = options.findIndex(opt => opt.value === value);

  const sizes = {
    sm: { container: "h-8 p-0.5", text: "text-[12px]", padding: "px-3" },
    md: { container: "h-10 p-1", text: "text-[13px]", padding: "px-4" },
    lg: { container: "h-12 p-1.5", text: "text-[14px]", padding: "px-5" },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        "relative inline-flex rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E]",
        s.container,
        className
      )}
    >
      {/* Sliding Pill Background - Smooth Apple-like animation */}
      <motion.div
        className="absolute rounded-lg bg-white dark:bg-[#3A3A3C] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
        initial={false}
        animate={{
          left: `calc(${(activeIndex / options.length) * 100}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          mass: 0.8
        }}
        style={{
          top: size === "sm" ? 2 : size === "md" ? 4 : 6,
          bottom: size === "sm" ? 2 : size === "md" ? 4 : 6,
        }}
      />

      {/* Options */}
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center font-medium transition-colors duration-150",
            s.text,
            s.padding,
            value === option.value
              ? "text-[#1D1D1F] dark:text-white"
              : "text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export { SegmentedControl };
