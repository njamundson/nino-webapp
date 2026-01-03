"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  active?: boolean;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, icon: Icon, active, variant = "default", size = "md", loading = false, children, ...props }, ref) => {
    const sizes = {
      sm: { height: "h-8", text: "text-[12px]", padding: "px-3.5", iconSize: 14, gap: "gap-1.5" },
      md: { height: "h-10", text: "text-[13px]", padding: "px-4", iconSize: 15, gap: "gap-2" },
      lg: { height: "h-11", text: "text-[14px]", padding: "px-5", iconSize: 16, gap: "gap-2" },
    };

    const variants = {
      default: cn(
        "bg-white text-[#1D1D1F] border border-[#E0E0E0]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        "hover:bg-[#FAFAFA] hover:border-[#D0D0D0] hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)]",
        "active:bg-[#F5F5F5] active:shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        "dark:bg-[#2C2C2E] dark:border-[#3A3A3C] dark:text-white dark:hover:bg-[#3A3A3C]"
      ),
      primary: cn(
        "bg-[#1D1D1F] text-white border border-[#1D1D1F]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        "hover:bg-[#2C2C2E] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
        "active:bg-[#3A3A3C] active:shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
        "dark:bg-white dark:border-white dark:text-[#1D1D1F] dark:hover:bg-[#F5F5F7]"
      ),
      outline: cn(
        "bg-transparent text-[#1D1D1F] border border-[#E0E0E0]",
        "hover:bg-[#F5F5F7] hover:border-[#D0D0D0]",
        "active:bg-[#EBEBEB]",
        "dark:border-[#3A3A3C] dark:text-white dark:hover:bg-[#2C2C2E]"
      ),
    };

    const s = sizes[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150",
          s.height,
          s.text,
          s.padding,
          s.gap,
          variants[variant],
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={s.iconSize} strokeWidth={1.75} className="animate-spin" />
        ) : Icon ? (
          <Icon size={s.iconSize} strokeWidth={1.75} />
        ) : null}
        {children}
      </button>
    );
  }
);

PillButton.displayName = "PillButton";

export { PillButton };
