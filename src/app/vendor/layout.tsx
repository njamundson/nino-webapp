"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Upload, FolderOpen, Bell, LogOut, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { icon: Upload, label: "Upload", href: "/vendor" },
    { icon: FolderOpen, label: "My Uploads", href: "/vendor/uploads" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5E5E5] z-40 px-6 flex items-center justify-between">
        {/* Left - Brand */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8">
            <Logo />
          </div>
          <div className="h-6 w-px bg-[#E5E5E5]" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1D1D1F]">Four Seasons Maui</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[10px] font-semibold text-[#8E8E93] uppercase">Vendor</span>
          </div>
        </div>

        {/* Center - Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors",
                  isActive 
                    ? "bg-[#1D1D1F] text-white" 
                    : "text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right - User */}
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF3B30] text-white text-[9px] font-bold flex items-center justify-center">2</span>
          </button>
          <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-[#F5F5F7] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white text-xs font-semibold">
              JS
            </div>
            <ChevronDown size={14} className="text-[#8E8E93]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 sm:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

