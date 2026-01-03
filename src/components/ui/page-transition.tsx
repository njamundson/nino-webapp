"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.22,
        ease: [0.2, 0.9, 0.2, 1],
      }}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
  );
}

