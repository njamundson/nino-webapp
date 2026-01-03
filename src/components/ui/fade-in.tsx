"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  className?: string;
}

/**
 * Reusable FadeIn animation wrapper
 * Use index for staggered lists, or delay for custom timing
 */
export const FadeIn = ({ children, index = 0, delay, className }: FadeInProps) => {
  const animationDelay = delay ?? index * 30;
  
  return (
    <div
      className={cn("animate-fadeIn", className)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * FadeIn for grid items with slightly longer stagger
 */
export const FadeInCard = ({ children, index = 0, className }: FadeInProps) => {
  return (
    <div
      className={cn("animate-fadeIn", className)}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {children}
    </div>
  );
};

