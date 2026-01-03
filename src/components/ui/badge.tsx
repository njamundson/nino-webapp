"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const Badge = ({ icon: Icon, children, variant = "default", className }: BadgeProps) => {
  const variants = {
    default: "bg-[#F2F2F7] text-[#8E8E93] dark:bg-[#1C1C1E] dark:text-[#8E8E93]",
    success: "bg-[#EBF9F1] text-[#34C759] dark:bg-[#152B1E] dark:text-[#32D74B]",
    warning: "bg-[#FFF4E5] text-[#FF9500] dark:bg-[#2D2010] dark:text-[#FF9F0A]",
    error: "bg-[#FFEBEB] text-[#FF3B30] dark:bg-[#2C1515] dark:text-[#FF453A]",
    info: "bg-[#E5F1FF] text-[#0071E3] dark:bg-[#102030] dark:text-[#0A84FF]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </div>
  );
};

export { Badge };

