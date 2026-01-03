"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, children, className }: PageHeaderProps) => {
  return (
    <header className={cn("flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-[#E5E5E5] dark:border-[#2C2C2E] pb-6 mb-8", className)}>
      <div className="space-y-1.5">
        <h1 className="text-[30px] sm:text-[38px] font-medium tracking-[-0.02em] text-[#1D1D1F] dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <div className="text-[#8E8E93] text-[14px] font-normal">
            {subtitle}
          </div>
        )}
      </div>
      {children && (
        <div className="flex gap-2 flex-wrap">
          {children}
        </div>
      )}
    </header>
  );
};
