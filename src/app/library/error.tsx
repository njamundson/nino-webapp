"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function LibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Library error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-md"
      >
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#FF3B30]/10 to-[#FF3B30]/5 border border-[#FF3B30]/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-[#FF3B30]" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-[#1D1D1F] mb-2">
          Something went wrong
        </h1>
        
        {/* Description */}
        <p className="text-[14px] text-[#8E8E93] mb-6">
          We couldn't load this page. Please try again.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E5E5] text-[13px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
          <Link
            href="/library/my"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-[13px] font-medium hover:bg-[#3A3A3C] transition-colors"
          >
            <Home size={14} />
            My Library
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

