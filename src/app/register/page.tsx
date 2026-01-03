"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [stage, setStage] = React.useState<"property" | "identity">("property");
  const [hotelName, setHotelName] = React.useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
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
                Create an account
              </h1>
              <p className="text-[15px] text-[#8E8E93] font-normal">
                Set up your workspace in minutes.
              </p>
            </div>
          </div>

          {/* Floated Auth Island */}
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.02)] space-y-8">
            <AnimatePresence mode="wait">
              {stage === "property" ? (
                <motion.div
                  key="property"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#1D1D1F] ml-1">Workspace</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]/60 group-focus-within:text-[#1D1D1F] transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder="Company or property name"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full h-11 rounded-full text-[14px] font-medium shadow-sm"
                    onClick={() => hotelName && setStage("identity")}
                  >
                    Continue
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-medium text-[#1D1D1F]">Work email</label>
                        <button onClick={() => setStage("property")} className="text-xs font-medium text-[#0066CC] hover:text-[#004499] transition-colors">Edit</button>
                      </div>
                      <input 
                        type="email" 
                        placeholder="name@company.com"
                        autoFocus
                        className="w-full h-11 px-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[#1D1D1F] ml-1">Password</label>
                      <input 
                        type="password" 
                        placeholder="Create a password"
                        className="w-full h-11 px-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
                      />
                    </div>
                  </div>
                  <Button variant="primary" className="w-full h-11 rounded-full text-[14px] font-medium shadow-sm">
                    Create account
                  </Button>
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
          <div className="text-center space-y-6">
            <p className="text-[13px] font-medium text-[#8E8E93]">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline underline-offset-4">Sign in</Link>
            </p>

            <p className="text-[11px] font-normal text-[#8E8E93]/80 leading-relaxed max-w-[280px] mx-auto">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-[#1D1D1F] hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="#" className="text-[#1D1D1F] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
