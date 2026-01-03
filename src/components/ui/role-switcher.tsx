"use client";

import React from "react";
import { useRole, UserRole } from "@/contexts/role-context";
import { Building2, Hotel, Camera, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const roles: { value: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { value: "corporate", label: "Corporate", icon: Building2, description: "Full access to all teams" },
  { value: "team", label: "Team Admin", icon: Hotel, description: "Four Seasons Maui" },
  { value: "vendor", label: "Vendor", icon: Camera, description: "Beach Photography Co." },
];

export const RoleSwitcher = () => {
  const { role, switchRole, user } = useRole();
  const [isOpen, setIsOpen] = React.useState(false);
  const currentRole = roles.find(r => r.value === role)!;
  const Icon = currentRole.icon;

  return (
    <div className="fixed bottom-20 right-6 z-[200]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1D1D1F] hover:bg-[#2C2C2E] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all text-left ring-2 ring-white/20"
      >
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <Icon size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white">{currentRole.label}</p>
          <p className="text-[11px] text-white/60 truncate">{user.name}</p>
        </div>
        <ChevronDown size={16} className={cn(
          "text-white/60 transition-transform ml-1",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl border border-[#E5E5E5] shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="px-2 py-1 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                  Demo: Switch Role
                </p>
                {roles.map((r) => {
                  const RoleIcon = r.icon;
                  const isActive = role === r.value;
                  
                  return (
                    <button
                      key={r.value}
                      onClick={() => {
                        switchRole(r.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors",
                        isActive 
                          ? "bg-[#F5F5F7]" 
                          : "hover:bg-[#F5F5F7]"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        isActive ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#8E8E93]"
                      )}>
                        <RoleIcon size={18} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#1D1D1F]">{r.label}</p>
                        <p className="text-[11px] text-[#8E8E93] truncate">{r.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[#34C759]" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-2 bg-[#FAFAFA] border-t border-[#F0F0F0]">
                <p className="text-[10px] text-[#8E8E93] text-center">
                  This is for demo purposes only
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

