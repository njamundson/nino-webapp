"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center max-w-md"
      >
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#F5F5F7] to-[#E8E8E8] border border-black/[0.06] flex items-center justify-center">
          <span className="text-4xl font-semibold text-[#C0C0C0]">404</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
          Page not found
        </h1>
        
        {/* Description */}
        <p className="text-[15px] text-[#8E8E93] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E5E5] text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link
            href="/library/my"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-[14px] font-medium hover:bg-[#3A3A3C] transition-colors"
          >
            <Home size={16} />
            Go to Library
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

