"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/ui/side-nav";
import { AssetThumbnail } from "@/components/ui/asset-thumbnail";
import { AssetPreview } from "@/components/ui/asset-preview";
import { FilterPopup } from "@/components/ui/filter-popup";
import { InvitePopup } from "@/components/ui/invite-popup";
import { UploadPopup } from "@/components/ui/upload-popup";
import { PulsingBadge } from "@/components/ui/pulsing-badge";
import { 
  FileEdit,
  Home,
  Users,
  Grid,
  Search,
  Sparkles,
  ShieldCheck,
  Globe,
  Monitor,
  Smartphone,
  Zap,
  Camera,
  Play,
  Video,
  Heart,
  Share,
  Download,
  Info as InfoIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Folder,
  Layers,
  ChevronRight,
  MoreVertical,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Demo assets defined outside component for type reference
const demoAssets = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    title: "Maui Beach Drone",
    type: "video" as const,
    aspectRatio: "portrait" as const,
    details: "4K MP4 • 12MB",
    date: "Oct 24, 2025",
    location: "Four Seasons Maui",
    tags: ["Drone", "Beach", "Sunset"]
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    title: "Alpine Retreat",
    type: "image" as const,
    aspectRatio: "wide" as const,
    details: "8K RAW • 24MB",
    date: "Nov 12, 2025",
    location: "Four Seasons Whistler",
    tags: ["Mountains", "Snow"]
  },
  {
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200",
    title: "Infinity Pool",
    type: "image" as const,
    aspectRatio: "square" as const,
    details: "4K JPG • 8MB",
    date: "Dec 05, 2025",
    location: "Four Seasons Bali",
    tags: ["Pool", "Luxury"]
  },
  {
    title: "Summer Campaign 2026",
    type: "collection" as const,
    aspectRatio: "portrait" as const,
    details: "48 Assets • 1.2GB",
    date: "Ongoing",
    location: "Corporate HQ",
    tags: ["Marketing", "Campaign"]
  }
];

type DemoAsset = typeof demoAssets[number];

export default function DesignKit() {
  const [activeNav, setActiveNav] = React.useState("Home");
  const [activeTeam, setActiveTeam] = React.useState("corporate");
  const [selectedAsset, setSelectedAsset] = React.useState<DemoAsset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleAssetClick = (asset: DemoAsset) => {
    if (asset.type !== "collection") {
      setSelectedAsset(asset);
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setSelectedAsset(null), 300);
  };

  const navItems = [
    { icon: FileEdit, label: "New Project", href: "#", onClick: () => setActiveNav("New Project") },
    { icon: Home, label: "Home", href: "#", onClick: () => setActiveNav("Home") },
    { icon: Users, label: "Audience", href: "#", onClick: () => setActiveNav("Audience") },
    { icon: Grid, label: "Knowledge", href: "#", onClick: () => setActiveNav("Knowledge") },
    { icon: Search, label: "Search", href: "#", onClick: () => setActiveNav("Search") },
  ];

  const teams = [
    { id: "corporate", label: "Four Seasons Corporate" },
    { id: "oahu", label: "Four Seasons Oahu" },
    { id: "nevis", label: "Four Seasons Nevis" },
    { id: "nashville", label: "Four Seasons Nashville" },
    { id: "maui", label: "Four Seasons Maui" },
    { id: "bali", label: "Four Seasons Bali" },
    { id: "whistler", label: "Four Seasons Whistler" },
    { id: "paris", label: "Four Seasons Paris" },
  ];

  const roadmapItems = [
    {
      icon: Sparkles,
      title: "Semantic Search",
      desc: "Find assets by mood or vibe using AI vector embeddings.",
      status: "Design"
    },
    {
      icon: ShieldCheck,
      title: "Rights Guard",
      desc: "Automated contract expiration tracking for every video.",
      status: "Planned"
    },
    {
      icon: Globe,
      title: "Regional Portals",
      desc: "Localized asset tagging for global hotel teams.",
      status: "Planned"
    },
    {
      icon: Monitor,
      title: "Review Rooms",
      desc: "High-fidelity feedback portals for external directors.",
      status: "Planned"
    },
    {
      icon: Smartphone,
      title: "Social Sync",
      desc: "Direct push to social platforms from the approved library.",
      status: "In Progress"
    },
    {
      icon: Zap,
      title: "AI Highlighter",
      desc: "Automatically extracts the best 15s from raw footage.",
      status: "Beta"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SideNav 
        items={navItems.map(item => ({ ...item, active: activeNav === item.label }))} 
        teams={teams.map(team => ({ ...team, active: activeTeam === team.id }))}
        onTeamClick={setActiveTeam}
        bottomLabel="Settings"
      />

      <main className="ml-72 p-24 max-w-7xl mx-auto space-y-40 pb-40">
        {/* Header */}
        <header className="space-y-6 flex justify-between items-end border-b border-[#EBEBEB] pb-12">
          <div className="space-y-6">
            <h1 className="text-8xl font-medium tracking-tighter text-[#1D1D1F] dark:text-white leading-[0.9]">
              Nino <br /> 
              <span className="text-[#8E8E93]/30">Studio Kit</span>
            </h1>
            <p className="text-2xl text-[#8E8E93] max-w-xl leading-relaxed font-medium">
              A cohesive, high-fidelity ecosystem built for luxury brands.
            </p>
          </div>
          <div className="flex gap-3">
            <UploadPopup />
            <InvitePopup />
            <FilterPopup />
          </div>
        </header>

        <div className="space-y-40">
          
          {/* Status Section */}
          <section className="space-y-12">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]/60">System Health</h2>
            <div className="flex flex-wrap gap-4">
              <PulsingBadge label="AI Tagging Maui Batch..." />
              <PulsingBadge label="Optimizing 4K Video..." />
              <PulsingBadge label="Syncing Global Library..." />
            </div>
          </section>

          {/* Library Section */}
          <section className="space-y-16">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-medium tracking-tight">Approved Library</h2>
                <p className="text-[#8E8E93] font-medium mt-1">Four Seasons • Global Assets</p>
              </div>
              <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-widest">348 Assets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {demoAssets.map((asset, i) => (
                <div 
                  key={i} 
                  onClick={() => handleAssetClick(asset)}
                  className={asset.type !== "collection" ? "cursor-pointer" : ""}
                >
                  <AssetThumbnail 
                    url={asset.type !== "collection" ? asset.url : undefined}
                    title={asset.title}
                    details={asset.details}
                    type={asset.type}
                    aspectRatio={asset.aspectRatio}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Feature Roadmap Section */}
          <section className="space-y-16">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]/60 text-center">Nino Intelligence Roadmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roadmapItems.map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -4 }}
                  className="group p-10 rounded-[40px] bg-white dark:bg-[#0A0A0A] border border-[#EBEBEB] dark:border-white/5 transition-all hover:border-[#1D1D1F]/10 hover:shadow-[0_24px_48px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="h-12 w-12 rounded-[18px] bg-[#1D1D1F] text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110">
                      <item.icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F5F5F7] dark:bg-white/5 px-3 py-1.5 rounded-full text-[#8E8E93]">
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-medium tracking-tight">{item.title}</h4>
                    <p className="text-[#8E8E93] font-medium text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Elements Section */}
          <section className="space-y-16">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]/60 text-center">Symbol Library</h2>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-8 justify-items-center">
              {[Camera, Play, Video, Heart, Share, Download, InfoIcon, CheckCircle, AlertCircle, Clock].map((Icon, i) => (
                <div key={i} className="h-12 w-12 rounded-[18px] bg-white dark:bg-[#1C1C1E] border border-[#EBEBEB] dark:border-white/5 flex items-center justify-center text-[#1D1D1F] dark:text-white shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <Icon size={20} strokeWidth={2} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Asset Preview Modal */}
      {selectedAsset && selectedAsset.type !== "collection" && (
        <AssetPreview 
          asset={{
            url: selectedAsset.url!,
            title: selectedAsset.title,
            type: selectedAsset.type as "image" | "video",
            details: selectedAsset.details,
            date: selectedAsset.date,
            location: selectedAsset.location,
            tags: selectedAsset.tags
          }}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
}
