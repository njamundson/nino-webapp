"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Toggle = ({ checked, onCheckedChange, className, disabled }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative h-[31px] w-[51px] cursor-pointer rounded-full transition-colors duration-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-[#34C759]" : "bg-[#E5E5EA] dark:bg-[#3A3A3C]",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ 
          x: checked ? 21 : 2,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 30,
          mass: 0.8
        }}
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)]"
      />
    </button>
  );
};

export { Toggle };
