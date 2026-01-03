"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, ChevronRight, Sparkles, Layout } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [stage, setStage] = React.useState<"email" | "password">("email");
  const [email, setEmail] = React.useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[380px] space-y-8"
        >
          {/* Branding & Header */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-10 h-10">
              <Logo />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Sign in
              </h1>
              <p className="text-[15px] text-[#8E8E93] font-normal">
                Use your work email to continue.
              </p>
            </div>
          </div>

          {/* Floated Auth Island */}
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.02)] space-y-8">
            <AnimatePresence mode="wait">
              {stage === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#1D1D1F] ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full h-11 rounded-full text-[14px] font-medium shadow-sm"
                    onClick={() => email && setStage("password")}
                  >
                    Continue
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-medium text-[#1D1D1F]">Password</label>
                      <button onClick={() => setStage("email")} className="text-xs font-medium text-[#0066CC] hover:text-[#004499] transition-colors">Change Email</button>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      autoFocus
                      className="w-full h-11 px-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <Button variant="primary" className="w-full h-11 rounded-full text-[14px] font-medium shadow-sm">
                      Sign in
                    </Button>
                    <div className="text-center">
                      <Link href="/reset-password" className="text-xs font-medium text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">Forgot password?</Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-x-0 h-px bg-[#EBEBEB]" />
              <span className="relative px-3 bg-white text-[11px] font-medium text-[#8E8E93]">or</span>
            </div>

            <Button variant="outline" className="w-full h-11 rounded-full border-[#EBEBEB] text-[14px] font-medium text-[#1D1D1F] gap-2 hover:bg-[#F5F5F7] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.54-1.42 2.43-3.5 2.43-5.44z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.66.77-2.64.77-2.03 0-3.75-1.37-4.36-3.22H2.02v2.06C3.82 21.56 7.62 23 12 23z" fill="#34A853"/>
                <path d="M7.64 15.88c-.15-.45-.24-.93-.24-1.43s.09-.98.24-1.43V10.96H2.02c-.5 1.01-.78 2.14-.78 3.32s.28 2.31.78 3.32l5.62-2.4z" fill="#FBBC05"/>
                <path d="M12 7.12c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.45 3.74 14.96 2.75 12 2.75 7.62 2.75 3.82 4.19 2.02 7.12l5.62 2.06c.61-1.85 2.33-3.22 4.36-3.22z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Bottom Actions */}
          <div className="text-center space-y-8">
            <p className="text-[13px] font-medium text-[#8E8E93]">
              New to Nino?{" "}
              <Link href="/register" className="text-black font-bold hover:underline underline-offset-4">Create an account</Link>
            </p>

            <div className="flex justify-center gap-6 opacity-30 hover:opacity-100 transition-opacity duration-700">
              <Link href="/onboarding" className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] hover:text-black transition-colors flex items-center gap-1.5">
                <Sparkles size={10} /> Onboarding
              </Link>
              <Link href="/library" className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] hover:text-black transition-colors flex items-center gap-1.5">
                <Layout size={10} /> Library
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
