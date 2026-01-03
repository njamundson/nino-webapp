"use client";

import * as React from "react";
import { MoreHorizontal, Download, Share2, Trash2, Edit2, Folder, Layers, Play, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";

export type AssetAspectRatio = "vertical" | "wide" | "square" | "portrait";

interface AssetThumbnailProps {
  url?: string;
  title: string;
  details: string;
  type: "image" | "video" | "collection" | "series";
  aspectRatio?: AssetAspectRatio;
  className?: string;
}

const AssetThumbnail = ({ 
  url, 
  title, 
  details, 
  type, 
  aspectRatio = "portrait", 
  className 
}: AssetThumbnailProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const ratioClasses = {
    vertical: "aspect-[9/16]",
    wide: "aspect-[16/9]",
    square: "aspect-square",
    portrait: "aspect-[4/5]",
  };

  const isCollection = type === "collection" || type === "series";
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMenuOpen) setIsHovered(false);
      }}
      className={cn(
        "group relative overflow-hidden bg-[#F5F5F7] dark:bg-[#1C1C1E] cursor-pointer rounded-[20px] transition-all duration-300",
        ratioClasses[aspectRatio],
        isHovered ? "shadow-[0_20px_40px_rgba(0,0,0,0.12)] scale-[1.02]" : "shadow-sm",
        className
      )}
    >
      {/* Folder Stacking Effect for Collections */}
      {isCollection && (
        <>
          <div className="absolute inset-0 bg-black/[0.03] dark:bg-white/5 translate-x-1.5 -translate-y-1.5 rounded-[20px] -z-10" />
          <div className="absolute inset-0 bg-black/[0.06] dark:bg-white/10 translate-x-3 -translate-y-3 rounded-[20px] -z-20" />
        </>
      )}

      {/* Background Content */}
      {url ? (
        <img
          src={url}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out",
            isHovered && "scale-105"
          )}
          alt={title}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F7] dark:bg-white/5">
          {type === "collection" ? <Folder size={40} className="text-[#8E8E93]/30" /> : <Layers size={40} className="text-[#8E8E93]/30" />}
        </div>
      )}

      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />

      {/* Type Badge - Always Visible */}
      <div className="absolute top-3 left-3 z-10">
        <div className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300",
          isHovered 
            ? "bg-white/90 text-black shadow-sm" 
            : "bg-black/30 backdrop-blur-sm text-white/90"
        )}>
          {type === "video" && <Play size={12} fill="currentColor" />}
          {type === "image" && <ImageIcon size={12} />}
          {type === "series" && <Layers size={12} />}
          {type === "collection" && <Folder size={12} />}
        </div>
      </div>

      {/* Details - Bottom */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 p-4 transition-all duration-300",
        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        <h3 className="text-[15px] font-semibold text-white truncate">{title}</h3>
        <p className="text-white/60 text-xs font-medium mt-0.5">{details}</p>
      </div>

      {/* Menu Trigger */}
      <div className={cn(
        "absolute bottom-3 right-3 z-30 transition-all duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <DropdownMenu open={isMenuOpen} onOpenChange={(open) => {
          setIsMenuOpen(open);
          if (!open) setIsHovered(false);
        }}>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 outline-none",
                isMenuOpen 
                  ? "bg-white text-black shadow-md" 
                  : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
              )}
            >
              <MoreHorizontal size={16} strokeWidth={2} />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-44">
            <DropdownMenuItem><Edit2 size={14} className="mr-2.5 opacity-50" /> Rename</DropdownMenuItem>
            <DropdownMenuItem><Download size={14} className="mr-2.5 opacity-50" /> Download</DropdownMenuItem>
            <DropdownMenuItem><Share2 size={14} className="mr-2.5 opacity-50" /> Share</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive><Trash2 size={14} className="mr-2.5" /> Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { AssetThumbnail };
