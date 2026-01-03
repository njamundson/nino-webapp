"use client";

import * as React from "react";
import { Upload as UploadIcon, FileVideo, ImageIcon, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const UploadPopup = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="h-10 px-6 rounded-full text-sm font-medium shadow-sm">
          <Plus size={16} className="mr-2" /> New Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] rounded-[32px] p-8 bg-white border-[#EBEBEB] shadow-[0_32px_64px_rgba(0,0,0,0.08)]">
        <DialogHeader className="mb-10">
          <DialogTitle className="text-2xl font-medium tracking-tight text-center">Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-10">
          {/* Dropzone */}
          <div className="border-2 border-dashed border-[#EBEBEB] rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 hover:border-[#1D1D1F]/20 hover:bg-[#F5F5F7]/50 transition-all cursor-pointer group">
            <div className="h-14 w-14 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors">
              <UploadIcon size={24} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold">Drop files to upload</p>
              <p className="text-xs text-[#8E8E93] font-medium text-[11px]">RAW, MP4, MOV up to 2GB</p>
            </div>
          </div>

          {/* Uploading Progress Demo */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] text-center">Queue (2)</h3>
            <div className="space-y-2">
              {[
                { name: "Maui_Drone_01.mp4", size: "1.2GB", progress: 65, icon: FileVideo },
                { name: "Pool_Shot.raw", size: "45MB", progress: 100, icon: ImageIcon },
              ].map((file, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[20px] bg-[#F5F5F7]">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-[#8E8E93]">
                    <file.icon size={20} />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold truncate max-w-[150px]">{file.name}</span>
                      <span className="text-[10px] font-bold text-[#8E8E93]">{file.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1D1D1F] rounded-full transition-all duration-500" 
                        style={{ width: `${file.progress}%` }} 
                      />
                    </div>
                  </div>
                  <button className="h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1 h-12 rounded-full text-[13px] font-semibold bg-[#F5F5F7] border-none text-[#1D1D1F]">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 h-12 rounded-full text-[13px] font-semibold shadow-sm">
              Add to Library
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

