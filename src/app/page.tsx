"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center space-y-12"
      >
        <div className="w-24 h-24 flex items-center justify-center text-[#1D1D1F] mx-auto">
          <Logo className="w-full h-full" />
        </div>
        <div className="space-y-4">
          <h1 className="text-8xl font-medium tracking-tighter leading-[0.9]">
            Nino <br />
            <span className="text-[#8E8E93]/30 text-6xl">Studio Suite</span>
          </h1>
          <p className="text-2xl text-[#8E8E93] max-w-xl mx-auto font-medium">
            AI-powered media management for the world's most elite hotel brands.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary" className="h-16 px-12 rounded-full text-base shadow-2xl">
              Enter Studio <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
