"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Film, Lock } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export default function ImageToVideoPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Image to Video" 
        subtitle="Transform still images into cinematic motion"
      />

      {/* Coming Soon State */}
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F5F5F7] to-[#E8E8E8] border border-black/[0.06] flex items-center justify-center mb-6">
          <Film size={40} className="text-[#C0C0C0]" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-[12px] font-semibold mb-4">
          <Lock size={12} />
          Coming Soon
        </div>
        
        <h2 className="text-xl font-semibold text-[#1D1D1F] mb-2">
          AI Video Generation
        </h2>
        
        <p className="text-[15px] text-[#8E8E93] max-w-md mb-8">
          Bring your photos to life with AI-powered motion. 
          Create stunning video content from a single image.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
          {[
            { title: "4K Output", desc: "Cinema-quality videos" },
            { title: "Smart Motion", desc: "Natural camera movements" },
            { title: "10s Clips", desc: "Perfect for social media" },
          ].map((feature) => (
            <div 
              key={feature.title}
              className="p-4 rounded-2xl bg-[#F8F8F8] border border-black/[0.04]"
            >
              <p className="text-[14px] font-medium text-[#1D1D1F]">{feature.title}</p>
              <p className="text-[12px] text-[#8E8E93]">{feature.desc}</p>
            </div>
          ))}
        </div>

        <PillButton variant="outline" disabled>
          Join Waitlist
        </PillButton>
      </div>
    </div>
  );
}
