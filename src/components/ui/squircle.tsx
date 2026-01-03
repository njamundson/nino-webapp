"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cornerRadius?: number;
  className?: string;
}

/**
 * Apple-style squircle container with continuous curvature (superellipse)
 * Uses CSS mask with SVG for true iOS app icon-style corners
 */
const Squircle = React.forwardRef<HTMLDivElement, SquircleProps>(
  ({ children, cornerRadius = 22, className, style, ...props }, ref) => {
    // Generate squircle path using superellipse formula
    // Apple uses approximately n=5 for their superellipse
    const generateSquirclePath = (size: number, radius: number) => {
      const n = 5; // Superellipse exponent (Apple-style)
      const r = Math.min(radius, size / 2);
      const points: string[] = [];
      const steps = 100;
      
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Superellipse formula
        const x = (size / 2) + (size / 2 - r) * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n) + r * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
        const y = (size / 2) + (size / 2 - r) * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n) + r * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);
        
        points.push(`${x},${y}`);
      }
      
      return `M ${points.join(' L ')} Z`;
    };

    // Use CSS custom property approach for the mask
    const squircleStyle: React.CSSProperties = {
      ...style,
      // Fallback border-radius for browsers that don't support mask
      borderRadius: `${cornerRadius}px`,
      // Use smooth corners via CSS (Webkit optimization)
      WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='black' d='${encodeURIComponent(generateSquircleSVGPath(100, cornerRadius * 100 / 200))}'/%3E%3C/svg%3E")`,
      WebkitMaskSize: '100% 100%',
      maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='black' d='${encodeURIComponent(generateSquircleSVGPath(100, cornerRadius * 100 / 200))}'/%3E%3C/svg%3E")`,
      maskSize: '100% 100%',
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        style={squircleStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Squircle.displayName = "Squircle";

/**
 * Generate SVG path for a squircle (superellipse with n≈5)
 * This creates the continuous curvature Apple uses for iOS icons
 */
function generateSquircleSVGPath(size: number, cornerRadius: number): string {
  const r = Math.min(cornerRadius, size / 2);
  const n = 4.5; // Slightly softer than pure superellipse for smoother curves
  
  // Generate path using quadratic bezier curves that approximate superellipse
  // This approach gives smoother results than point-by-point superellipse
  const smoothing = 0.22; // 22% corner smoothing (iOS style)
  const offset = r * smoothing;
  
  return `
    M ${r} 0
    L ${size - r} 0
    C ${size - r + offset} 0, ${size} ${r - offset}, ${size} ${r}
    L ${size} ${size - r}
    C ${size} ${size - r + offset}, ${size - r + offset} ${size}, ${size - r} ${size}
    L ${r} ${size}
    C ${r - offset} ${size}, 0 ${size - r + offset}, 0 ${size - r}
    L 0 ${r}
    C 0 ${r - offset}, ${r - offset} 0, ${r} 0
    Z
  `.replace(/\s+/g, ' ').trim();
}

export { Squircle };

