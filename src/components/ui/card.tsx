"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "rounded-[32px] bg-white border border-[#EBEBEB] p-8 dark:bg-[#1C1C1E] dark:border-[#3A3A3C]",
          hover && "hover:shadow-[0_24px_48px_rgba(0,0,0,0.04)]",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
