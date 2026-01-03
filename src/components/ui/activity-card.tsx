"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Bell, LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

interface ActivityCardProps {
  title: string;
  count: number;
  items: ActivityItem[];
  className?: string;
}

const ActivityCard = ({
  title,
  count,
  items,
  className,
}: ActivityCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5E5] dark:border-[#3A3A3C] overflow-hidden transition-shadow",
        isExpanded && "shadow-lg",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-[#FAFAFA] dark:hover:bg-[#2C2C2E] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center">
          <Bell size={18} className="text-[#8E8E93]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[14px] font-medium text-[#1D1D1F] dark:text-white">
            {count} {title}
          </p>
          <p className="text-[12px] text-[#8E8E93]">
            What's happening around you
          </p>
        </div>
        <div className={cn(
          "w-8 h-8 rounded-full border border-[#E5E5E5] dark:border-[#3A3A3C] flex items-center justify-center transition-transform",
          isExpanded && "rotate-180"
        )}>
          <ChevronDown size={16} className="text-[#8E8E93]" />
        </div>
      </button>

      {/* Expanded Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#F5F5F7] dark:border-[#2C2C2E]">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] dark:hover:bg-[#2C2C2E] transition-colors cursor-pointer",
                      index !== items.length - 1 && "border-b border-[#F5F5F7] dark:border-[#2C2C2E]"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#E5E5E5] dark:border-[#3A3A3C] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#8E8E93]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#8E8E93] truncate">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#C7C7C7] shrink-0">
                      {item.time}
                    </span>
                    {item.unread && (
                      <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ActivityCard };

