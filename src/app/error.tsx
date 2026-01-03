"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center max-w-md"
      >
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#FF3B30]/10 to-[#FF3B30]/5 border border-[#FF3B30]/20 flex items-center justify-center">
          <AlertTriangle size={40} className="text-[#FF3B30]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
          Something went wrong
        </h1>
        
        {/* Description */}
        <p className="text-[15px] text-[#8E8E93] mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E5E5] text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/library/my"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-[14px] font-medium hover:bg-[#3A3A3C] transition-colors"
          >
            <Home size={16} />
            Go to Library
          </Link>
        </div>

        {/* Error details for debugging */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="text-[12px] text-[#8E8E93] cursor-pointer hover:text-[#6E6E73]">
              Error details (dev only)
            </summary>
            <pre className="mt-2 p-4 bg-[#F5F5F7] rounded-xl text-[11px] text-[#6E6E73] overflow-auto max-h-40">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  );
}

