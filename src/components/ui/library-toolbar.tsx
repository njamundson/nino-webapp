"use client";

import * as React from "react";
import { LayoutGrid, List, ChevronDown, ArrowUpDown, Check } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Tooltip } from "./tooltip";
import { cn } from "@/lib/utils";
import type { ViewType, FilterType, SortType } from "@/lib/types";

interface FilterOption {
  value: string;
  label: string;
}

interface LibraryToolbarProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  
  // Item count
  itemCount?: number;
  
  // Filter tabs
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  
  // Sort
  sortType?: SortType;
  onSortChange?: (value: SortType) => void;
  sortOptions?: { value: SortType; label: string }[];
  
  // View type
  viewType: ViewType;
  onViewTypeChange: (value: ViewType) => void;
  
  // Custom content
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  
  className?: string;
}

const defaultSortOptions: { value: SortType; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "a-z", label: "Name (A-Z)" },
  { value: "z-a", label: "Name (Z-A)" },
  { value: "size", label: "Size" },
];

export const LibraryToolbar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search assets... (⌘K)",
  searchInputRef,
  itemCount,
  filterOptions,
  activeFilter,
  onFilterChange,
  sortType = "newest",
  onSortChange,
  sortOptions = defaultSortOptions,
  viewType,
  onViewTypeChange,
  leftContent,
  rightContent,
  className,
}: LibraryToolbarProps) => {
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);
  
  // Close sort menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    if (showSortMenu) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showSortMenu]);
  
  const currentSort = sortOptions.find(s => s.value === sortType) || sortOptions[0];

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-4", className)}>
      {/* Search */}
      <div className="flex-1 min-w-0 max-w-xl">
        <SearchBar
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange("")}
          placeholder={searchPlaceholder}
          ref={searchInputRef}
          className="w-full"
        />
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {leftContent}
        
        {/* Item count */}
        {itemCount !== undefined && (
          <span className="text-[13px] text-[#8E8E93] whitespace-nowrap">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
        
        {/* Filter tabs */}
        {filterOptions && filterOptions.length > 0 && onFilterChange && (
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[#F5F5F7]">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200",
                  activeFilter === option.value
                    ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-[#8E8E93] hover:text-[#6E6E73]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Sort dropdown */}
        {onSortChange && (
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#6E6E73] hover:bg-[#F5F5F7] transition-colors"
            >
              <ArrowUpDown size={14} className="text-[#8E8E93]" />
              <span>{currentSort.label}</span>
              <ChevronDown size={12} className={cn("text-[#8E8E93] transition-transform", showSortMenu && "rotate-180")} />
            </button>
            
            {showSortMenu && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl border border-[#E5E5E5] shadow-lg z-50 py-1 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { onSortChange(option.value); setShowSortMenu(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-[13px] hover:bg-[#F5F5F7] transition-colors",
                      sortType === option.value ? "text-[#1D1D1F] font-medium" : "text-[#6E6E73]"
                    )}
                  >
                    {option.label}
                    {sortType === option.value && <Check size={14} className="text-[#007AFF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* View type toggle */}
        <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[#F5F5F7]">
          <Tooltip content="Grid view">
            <button
              onClick={() => onViewTypeChange("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewType === "grid"
                  ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-[#8E8E93] hover:text-[#6E6E73]"
              )}
            >
              <LayoutGrid size={16} />
            </button>
          </Tooltip>
          <Tooltip content="List view">
            <button
              onClick={() => onViewTypeChange("list")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewType === "list"
                  ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-[#8E8E93] hover:text-[#6E6E73]"
              )}
            >
              <List size={16} />
            </button>
          </Tooltip>
        </div>
        
        {rightContent}
      </div>
    </div>
  );
};

