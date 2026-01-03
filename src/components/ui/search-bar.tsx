"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <div className="absolute left-3.5 text-[#8E8E93]">
          <Search size={16} strokeWidth={1.75} />
        </div>
        <input
          {...props}
          ref={ref}
          value={value}
          className="w-full bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-full h-10 pl-10 pr-10 text-[14px] font-normal placeholder:text-[#A0A0A0] border border-transparent outline-none focus:border-[#D0D0D0] focus:bg-[#F0F0F2] transition-all duration-200"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 h-5 w-5 rounded-full bg-[#C7C7C7] flex items-center justify-center text-white hover:bg-[#A0A0A0] transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        )}
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
