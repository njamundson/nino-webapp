"use client";

import * as React from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssetStatus } from "@/lib/types";

// Centralized badge configuration - Apple-inspired design
const badgeConfig: Record<AssetStatus, {
  icon: React.ElementType;
  label: string;
  bg: string;
  text: string;
  iconColor: string;
}> = {
  draft: {
    icon: Clock,
    label: "Add",
    bg: "bg-[#E8E8EA]",
    text: "text-[#6E6E73]",
    iconColor: "text-[#8E8E93]",
  },
  pending: {
    icon: Clock,
    label: "Waiting",
    bg: "bg-[#FF9500]/10",
    text: "text-[#FF9500]",
    iconColor: "text-[#FF9500]",
  },
  approved: {
    icon: CheckCircle,
    label: "Accepted",
    bg: "bg-[#34C759]/10",
    text: "text-[#34C759]",
    iconColor: "text-[#34C759]",
  },
  rejected: {
    icon: AlertCircle,
    label: "Declined",
    bg: "bg-[#FF3B30]/10",
    text: "text-[#FF3B30]",
    iconColor: "text-[#FF3B30]",
  },
};

interface StatusBadgeProps {
  status: AssetStatus;
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}

export const StatusBadge = ({ status, size = "md", onClick, className }: StatusBadgeProps) => {
  const badge = badgeConfig[status];
  if (!badge) return null;

  const Icon = badge.icon;
  const sizeClasses = size === "sm"
    ? "gap-1 px-2 py-0.5 text-[10px]"
    : "gap-1.5 px-3 py-1.5 text-[12px]";
  const iconSize = size === "sm" ? 10 : 14;

  const handleClick = onClick
    ? (e: React.MouseEvent) => { e.stopPropagation(); onClick(); }
    : undefined;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all",
        sizeClasses,
        badge.bg,
        badge.text,
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
    >
      <Icon size={iconSize} strokeWidth={2.5} className={badge.iconColor} />
      <span>{badge.label}</span>
    </button>
  );
};

// Special "Added" badge with solid blue background
interface AddedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export const AddedBadge = ({ size = "md", className }: AddedBadgeProps) => {
  const sizeClasses = size === "sm"
    ? "gap-1 px-2 py-0.5 text-[10px]"
    : "gap-1.5 px-3 py-1.5 text-[12px]";
  const iconSize = size === "sm" ? 10 : 14;

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold bg-[#007AFF] text-white",
      sizeClasses,
      className
    )}>
      <CheckCircle size={iconSize} strokeWidth={2.5} />
      <span>Added</span>
    </div>
  );
};

// Export config for external use if needed
export { badgeConfig };

