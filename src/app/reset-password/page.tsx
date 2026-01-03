"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="w-full max-w-[380px] space-y-8"
        >
          {/* Branding & Header */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-10 h-10">
              <Logo />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Reset password
              </h1>
              <p className="text-[15px] text-[#8E8E93] font-normal">
                We'll email you a secure reset link.
              </p>
            </div>
          </div>

          {/* Auth Island */}
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.02)] space-y-8">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                    onClick={() => email && setIsSent(true)}
                  >
                    Send reset link
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                      <CheckCircle2 size={28} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-[#1D1D1F]">Check your email</h2>
                    <p className="text-[13px] text-[#8E8E93] font-normal">
                      We sent a reset link to <span className="text-[#1D1D1F] font-medium">{email}</span>
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 rounded-full border-[#EBEBEB] text-[14px] font-medium"
                    onClick={() => setIsSent(false)}
                  >
                    Use a different email
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/login" className="text-[13px] font-medium text-[#8E8E93] hover:text-[#1D1D1F] transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
