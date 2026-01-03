"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Check, Sparkles, Globe, Users, ShieldCheck, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const steps = [
  { id: "welcome", title: "Welcome to Nino", desc: "Let's get your workspace set up.", icon: Sparkles },
  { id: "property", title: "Your property", desc: "Which hotel are we setting up?", icon: Globe },
  { id: "team", title: "Invite your team", desc: "Add teammates now or skip for later.", icon: Users },
  { id: "complete", title: "You're all set", desc: "Your workspace is ready.", icon: ShieldCheck }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [propertyName, setPropertyName] = React.useState("");

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <header className="p-6 flex flex-col items-center gap-6">
        <div className="w-10 h-10">
          <Logo />
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === currentStep ? "w-8 bg-[#1D1D1F]" : i < currentStep ? "w-2 bg-[#1D1D1F]" : "w-2 bg-[#E5E5E5]"
              )} 
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-2"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                {steps[currentStep].title}
              </h1>
              <p className="text-[15px] text-[#8E8E93] font-normal">
                {steps[currentStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Content Card */}
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.02)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[140px] flex flex-col justify-center"
              >
                {currentStep === 0 && (
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                      <StepIcon size={28} strokeWidth={1.5} />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#1D1D1F] ml-1">Property name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Four Seasons Maui"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="w-full h-11 px-4 rounded-[14px] bg-[#F5F5F7] border-none text-[15px] font-normal placeholder:text-[#8E8E93]/60 outline-none"
                      autoFocus
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white">
                          <Check size={14} />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1D1D1F]">You (Admin)</p>
                          <p className="text-[11px] text-[#8E8E93]">Full access</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]">
                        <Plus size={14} />
                      </div>
                      <span className="text-[13px] font-medium text-[#8E8E93]">Invite teammate</span>
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                        <ShieldCheck size={28} strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#34C759]">Setup complete</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2 mt-8">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="h-11 w-11 rounded-full border-[#EBEBEB] p-0"
                >
                  <ArrowLeft size={16} />
                </Button>
              )}
              {currentStep === steps.length - 1 ? (
                <Link href="/library" className="flex-1">
                  <Button variant="primary" className="w-full h-11 rounded-full text-[14px] font-medium">
                    Go to library
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  className="flex-1 h-11 rounded-full text-[14px] font-medium"
                >
                  {currentStep === 0 ? "Get started" : "Continue"}
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-xs font-medium text-[#8E8E93]">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </main>
    </div>
  );
}
