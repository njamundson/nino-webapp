"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FilterTab {
  value: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  showIcons?: boolean;
}

const FilterTabs = ({
  tabs,
  value,
  onChange,
  className,
  showIcons = false,
}: FilterTabsProps) => {
  const activeIndex = tabs.findIndex(tab => tab.value === value);

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] p-1",
        className
      )}
    >
      {/* Sliding Background - Smooth Apple-like animation */}
      <motion.div
        className="absolute inset-y-1 rounded-lg bg-white dark:bg-[#3A3A3C] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
        initial={false}
        animate={{
          left: `calc(${(activeIndex / tabs.length) * 100}% + 4px)`,
          width: `calc(${100 / tabs.length}% - 8px)`,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          mass: 0.8
        }}
      />

      {/* Tabs */}
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-150",
              isActive
                ? "text-[#1D1D1F] dark:text-white"
                : "text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white"
            )}
          >
            {showIcons && Icon && <Icon size={14} strokeWidth={1.5} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1 text-[11px]",
                isActive ? "text-[#8E8E93]" : "text-[#C7C7C7]"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export { FilterTabs };

