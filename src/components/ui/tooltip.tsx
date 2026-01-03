"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const Tooltip = ({ children, content, side = "top", className }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    
    let x = rect.left + rect.width / 2;
    let y = rect.top;
    
    switch (side) {
      case "bottom":
        y = rect.bottom + 8;
        break;
      case "left":
        x = rect.left - 8;
        y = rect.top + rect.height / 2;
        break;
      case "right":
        x = rect.right + 8;
        y = rect.top + rect.height / 2;
        break;
      default: // top
        y = rect.top - 8;
    }
    
    setPosition({ x, y });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const sideStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            "absolute z-[200] px-2.5 py-1.5 text-[12px] font-medium text-white bg-[#1D1D1F] rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
            sideStyles[side],
            className
          )}
        >
          {content}
          <div 
            className={cn(
              "absolute w-2 h-2 bg-[#1D1D1F] rotate-45",
              side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              side === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              side === "right" && "left-[-4px] top-1/2 -translate-y-1/2",
            )}
          />
        </div>
      )}
    </div>
  );
};

