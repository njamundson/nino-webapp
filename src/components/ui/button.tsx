"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
      secondary: "bg-[#E5E5EA] text-[#1D1D1F] dark:bg-[#2C2C2E] dark:text-white",
      outline: "border border-[#D1D1D6] bg-transparent text-[#1D1D1F] dark:border-[#3A3A3C] dark:text-white",
      ghost: "hover:bg-[#E5E5EA]/50 text-[#1D1D1F] dark:text-white dark:hover:bg-[#2C2C2E]/50",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs font-medium",
      md: "h-10 px-6 text-sm font-medium",
      lg: "h-12 px-8 text-base font-medium",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={ref}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeInOut" }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1, ease: "easeInOut" }
          }}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
