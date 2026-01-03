"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Palette, Lock } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export default function EditImagePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Image" 
        subtitle="AI-powered image editing tools"
      />

      {/* Coming Soon State */}
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F5F5F7] to-[#E8E8E8] border border-black/[0.06] flex items-center justify-center mb-6">
          <Palette size={40} className="text-[#C0C0C0]" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-[12px] font-semibold mb-4">
          <Lock size={12} />
          Coming Soon
        </div>
        
        <h2 className="text-xl font-semibold text-[#1D1D1F] mb-2">
          AI Image Editor
        </h2>
        
        <p className="text-[15px] text-[#8E8E93] max-w-md mb-8">
          Professional editing powered by AI. Remove objects, enhance colors, 
          expand images, and more—all with simple text prompts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl w-full mb-8">
          {[
            { title: "Remove", desc: "Object removal" },
            { title: "Enhance", desc: "Auto-improve" },
            { title: "Recolor", desc: "Smart palette" },
            { title: "Expand", desc: "AI outpainting" },
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
