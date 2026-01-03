"use client";

import * as React from "react";
import { Mail, Users, Link as LinkIcon, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const InvitePopup = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-10 px-5 rounded-full text-sm font-medium bg-[#F5F5F7] border-none text-[#1D1D1F]">
          <Users size={16} className="mr-2" /> Invite Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] rounded-[32px] p-8 bg-white border-[#EBEBEB] shadow-[0_32px_64px_rgba(0,0,0,0.08)]">
        <DialogHeader className="mb-10">
          <DialogTitle className="text-2xl font-medium tracking-tight text-center">Collaborate</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] text-center">Direct Invite</h3>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] group-focus-within:text-[#1D1D1F] transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="marketing@fourseasons.com" 
                className="w-full h-12 pl-12 pr-4 rounded-full bg-[#F5F5F7] border-none text-sm font-medium outline-none focus:ring-1 focus:ring-[#1D1D1F]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between px-6 py-4 rounded-full bg-white border border-[#EBEBEB] hover:bg-[#F5F5F7] transition-all group">
                <div className="flex items-center gap-3">
                  <LinkIcon size={18} className="text-[#8E8E93] group-hover:text-[#1D1D1F]" />
                  <span className="text-sm font-medium">Copy Invite Link</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">Anyone</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1 h-12 rounded-full text-[13px] font-semibold bg-[#F5F5F7] border-none text-[#1D1D1F]">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 h-12 rounded-full text-[13px] font-semibold shadow-sm">
              <Send size={14} className="mr-2" /> Send Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

