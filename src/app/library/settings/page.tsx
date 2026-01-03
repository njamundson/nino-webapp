"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Toggle } from "@/components/ui/toggle";
import { PillButton } from "@/components/ui/pill-button";
import { useRole } from "@/contexts/role-context";
import { useTheme } from "@/contexts/theme-context";
import { 
  User, 
  Building2, 
  Users, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Mail,
  Palette,
  HardDrive,
  Globe,
  Key,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  { icon: User, label: "Profile", desc: "Your personal information", href: "#" },
  { icon: Building2, label: "Workspace", desc: "Manage workspace settings", href: "#" },
  { icon: Users, label: "Team", desc: "Invite and manage members", href: "#" },
  { icon: Bell, label: "Notifications", desc: "Email and push preferences", href: "#" },
  { icon: Shield, label: "Security", desc: "Password and 2FA", href: "#" },
  { icon: CreditCard, label: "Billing", desc: "Plan and payment", href: "#" },
];

const quickSettings = [
  { icon: Mail, label: "Email notifications", desc: "Receive updates about uploads", key: "email" },
  { icon: Globe, label: "Public profile", desc: "Allow others to find you", key: "public" },
];

export default function SettingsPage() {
  const { user } = useRole();
  const { theme, toggleTheme, isDark } = useTheme();
  const [toggles, setToggles] = React.useState({
    email: true,
    public: true,
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  // Fade in animation wrapper
  const FadeIn = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 40}ms` }}>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <PageHeader 
        title="Settings" 
        subtitle="Manage your workspace and preferences"
      />

      {/* User Card */}
      <FadeIn index={0}>
        <div className="flex items-center gap-4 p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center shrink-0">
            <span className="text-[17px] font-semibold text-white">
              {user.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-semibold text-[#1D1D1F]">{user.name}</p>
            <p className="text-[14px] text-[#8E8E93]">{user.email}</p>
          </div>
          <button className="text-[14px] font-medium text-[#007AFF] hover:underline">
            Edit
          </button>
        </div>
      </FadeIn>

      {/* Settings Grid */}
      <div className="space-y-2">
        {settingsSections.map((section, i) => {
          const Icon = section.icon;
          return (
            <FadeIn key={section.label} index={i + 1}>
              <button
                className="w-full flex items-center gap-4 p-4 rounded-[18px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93] group-hover:text-[#1D1D1F] transition-colors">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1D1D1F]">{section.label}</p>
                  <p className="text-[12px] text-[#8E8E93]">{section.desc}</p>
                </div>
                <ChevronRight size={16} className="text-[#C7C7C7] group-hover:text-[#8E8E93] transition-colors" />
              </button>
            </FadeIn>
          );
        })}
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-medium text-[#8E8E93] dark:text-[#8E8E93] px-1">Appearance</h3>
        <FadeIn index={settingsSections.length + 1}>
          <div className="p-5 rounded-[22px] bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={18} className="text-[#007AFF]" /> : <Sun size={18} className="text-[#FF9500]" />}
                <div>
                  <p className="text-[14px] font-medium text-[#1D1D1F] dark:text-white">Theme</p>
                  <p className="text-[12px] text-[#8E8E93]">{isDark ? "Dark mode enabled" : "Light mode enabled"}</p>
                </div>
              </div>
              <Toggle 
                checked={isDark} 
                onCheckedChange={toggleTheme} 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => !isDark && toggleTheme()}
                className={cn(
                  "relative p-3 rounded-xl border-2 transition-all",
                  !isDark 
                    ? "border-[#007AFF] bg-[#007AFF]/5" 
                    : "border-transparent bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:border-black/10 dark:hover:border-white/10"
                )}
              >
                <div className="aspect-[4/3] rounded-lg bg-white dark:bg-[#F5F5F7] mb-2 border border-black/10" />
                <p className="text-[12px] font-medium text-[#1D1D1F] dark:text-white">Light</p>
              </button>
              <button 
                onClick={() => isDark && toggleTheme()}
                className={cn(
                  "relative p-3 rounded-xl border-2 transition-all",
                  isDark 
                    ? "border-[#007AFF] bg-[#007AFF]/5" 
                    : "border-transparent bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:border-black/10 dark:hover:border-white/10"
                )}
              >
                <div className="aspect-[4/3] rounded-lg bg-[#1C1C1E] mb-2 border border-white/10" />
                <p className="text-[12px] font-medium text-[#1D1D1F] dark:text-white">Dark</p>
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Quick Settings */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-medium text-[#8E8E93] px-1">Quick Settings</h3>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[22px] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#F0F0F0] dark:divide-[#2C2C2E] overflow-hidden">
          {quickSettings.map((setting, i) => {
            const Icon = setting.icon;
            return (
              <FadeIn key={setting.key} index={settingsSections.length + i + 2}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#8E8E93]" />
                    <div>
                      <p className="text-[14px] font-medium text-[#1D1D1F] dark:text-white">{setting.label}</p>
                      <p className="text-[12px] text-[#8E8E93]">{setting.desc}</p>
                    </div>
                  </div>
                  <Toggle 
                    checked={toggles[setting.key as keyof typeof toggles]} 
                    onCheckedChange={() => handleToggle(setting.key)} 
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Storage */}
      <FadeIn index={settingsSections.length + quickSettings.length + 1}>
        <div className="p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive size={18} className="text-[#8E8E93]" />
            <span className="text-[14px] font-medium text-[#1D1D1F]">Storage</span>
          </div>
          <div className="h-2 rounded-full bg-[#F0F0F0] overflow-hidden mb-2">
            <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#007AFF] to-[#5AC8FA]" />
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#8E8E93]">35 GB of 100 GB used</span>
            <button className="font-medium text-[#007AFF] hover:underline">Upgrade</button>
          </div>
        </div>
      </FadeIn>

      {/* Sign Out */}
      <FadeIn index={settingsSections.length + quickSettings.length + 2}>
        <PillButton 
          icon={LogOut}
          variant="outline" 
          className="w-full h-12 border-[#FF3B30]/20 text-[#FF3B30] hover:bg-[#FF3B30]/5 hover:border-[#FF3B30]/30"
        >
          Sign out
        </PillButton>
      </FadeIn>
    </div>
  );
}
