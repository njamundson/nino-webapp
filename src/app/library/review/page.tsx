"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { PillButton } from "@/components/ui/pill-button";
import { useRole } from "@/contexts/role-context";
import { 
  Check, 
  X, 
  Clock, 
  Image as ImageIcon, 
  Video, 
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Play,
  LayoutGrid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PendingUpload {
  id: string;
  fileName: string;
  type: "image" | "video";
  url: string;
  size: string;
  vendor: { name: string; company: string; };
  team: string;
  teamId: string;
  uploadedAt: string;
}

export default function ReviewPage() {
  const { isCorporate, isTeam, user } = useRole();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUpload, setSelectedUpload] = React.useState<PendingUpload | null>(null);
  const [viewType, setViewType] = React.useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = React.useState("all");

  const allPendingUploads: PendingUpload[] = [
    { id: "p1", fileName: "Beach_Sunset_4K.mp4", type: "video", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", size: "245MB", vendor: { name: "Alex Rivera", company: "Beach Photography Co." }, team: "Four Seasons Maui", teamId: "maui", uploadedAt: "2 hours ago" },
    { id: "p2", fileName: "Pool_Aerial_01.jpg", type: "image", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", size: "24MB", vendor: { name: "Sarah Kim", company: "Drone Visuals" }, team: "Four Seasons Maui", teamId: "maui", uploadedAt: "4 hours ago" },
    { id: "p3", fileName: "Suite_Tour_Final.mp4", type: "video", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800", size: "1.2GB", vendor: { name: "Marcus Chen", company: "Luxury Creative Agency" }, team: "Four Seasons Oahu", teamId: "oahu", uploadedAt: "1 day ago" },
    { id: "p4", fileName: "Lobby_Evening.jpg", type: "image", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", size: "18MB", vendor: { name: "Marcus Chen", company: "Luxury Creative Agency" }, team: "Four Seasons Oahu", teamId: "oahu", uploadedAt: "1 day ago" },
    // Use a known-good Unsplash image id (avoids broken thumbnail)
    { id: "p5", fileName: "Spa_Interior.jpg", type: "image", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800", size: "32MB", vendor: { name: "James Park", company: "Resort Media Group" }, team: "Corporate", teamId: "corporate", uploadedAt: "3 hours ago" },
  ];

  const pendingUploads = allPendingUploads.filter(u => {
    if (isCorporate) return true;
    if (isTeam) return u.teamId === user.teamId;
    return false;
  });

  const filteredUploads = pendingUploads.filter(u => {
    const matchesSearch = u.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.vendor.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || (typeFilter === "photos" && u.type === "image") || (typeFilter === "videos" && u.type === "video");
    return matchesSearch && matchesType;
  });

  const handleApprove = (upload: PendingUpload) => {
    console.log("Approved:", upload.id);
    setSelectedUpload(null);
  };

  const handleReject = (upload: PendingUpload) => {
    console.log("Rejected:", upload.id);
    setSelectedUpload(null);
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "photos", label: "Photos" },
    { value: "videos", label: "Videos" },
  ];

  // Fade in animation
  const FadeIn = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 30}ms` }}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
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
        title="Review Queue" 
        subtitle={
          <div className="flex items-center gap-2 text-[14px]">
            <Clock size={14} className="text-[#FF9500]" />
            <span className="text-[#8E8E93]">{filteredUploads.length} pending review</span>
          </div>
        }
      >
        <PillButton icon={Check} variant="primary" className="bg-[#34C759] hover:bg-[#2DB14E]">
          Approve All
        </PillButton>
      </PageHeader>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="w-72">
            <SearchBar 
              placeholder="Search uploads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Filter Toggle - Modern pill style */}
          <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTypeFilter(option.value)}
                className={cn(
                  "relative h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-200",
                  typeFilter === option.value 
                    ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" 
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1">
          <button onClick={() => setViewType("grid")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "grid" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><LayoutGrid size={15} /></button>
          <button onClick={() => setViewType("list")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "list" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><List size={15} /></button>
        </div>
      </div>

      {filteredUploads.length > 0 ? (
        <div className="flex gap-6">
          {/* Upload List/Grid */}
          <div className={cn("flex-1", selectedUpload && "hidden lg:block lg:w-1/2")}>
            {viewType === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredUploads.map((upload, i) => (
                  <FadeIn key={upload.id} index={i}>
                    <button
                      onClick={() => setSelectedUpload(upload)}
                      className={cn(
                        "group relative aspect-square rounded-[22px] overflow-hidden border-2 transition-all duration-300",
                        selectedUpload?.id === upload.id 
                          ? "border-[#007AFF] shadow-[0_8px_30px_rgba(0,122,255,0.2)]" 
                          : "border-transparent hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                      )}
                    >
                      <img 
                        src={upload.url} 
                        alt={upload.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {upload.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <Play size={16} className="text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <p className="text-[12px] font-medium text-white truncate">{upload.fileName}</p>
                        <p className="text-[10px] text-white/70">{upload.vendor.name}</p>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#FF9500] text-white text-[9px] font-semibold">
                          PENDING
                        </span>
                      </div>
                    </button>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[22px] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#F0F0F0] overflow-hidden">
                {filteredUploads.map((upload, i) => (
                  <FadeIn key={upload.id} index={i}>
                    <button
                      onClick={() => setSelectedUpload(upload)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-[#FAFAFA] transition-colors",
                        selectedUpload?.id === upload.id && "bg-[#F5F5F7]"
                      )}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F5F7] shrink-0 relative">
                        <img src={upload.url} alt={upload.fileName} className="w-full h-full object-cover" />
                        {upload.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play size={14} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[#1D1D1F] truncate">{upload.fileName}</p>
                        <p className="text-[12px] text-[#8E8E93]">{upload.vendor.name} • {upload.size}</p>
                      </div>

                      {isCorporate && (
                        <span className="hidden sm:block text-[12px] text-[#8E8E93]">{upload.team}</span>
                      )}

                      <span className="text-[12px] text-[#C7C7C7]">{upload.uploadedAt}</span>
                      
                      <ChevronRight size={16} className="text-[#C7C7C7] shrink-0" />
                    </button>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <AnimatePresence>
            {selectedUpload && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 lg:static lg:w-1/2 bg-white lg:bg-transparent z-40 lg:z-auto flex flex-col"
              >
                <div className="flex items-center gap-3 p-4 border-b border-[#E5E5E5] lg:hidden">
                  <button onClick={() => setSelectedUpload(null)} className="h-9 w-9 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-[14px] font-medium">Review Upload</span>
                </div>

                <div className="flex-1 lg:rounded-[22px] lg:border lg:border-black/[0.08] lg:shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
                  <div className="relative aspect-video bg-[#1D1D1F] flex items-center justify-center">
                    <img src={selectedUpload.url} alt={selectedUpload.fileName} className="max-w-full max-h-full object-contain" />
                    {selectedUpload.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Play size={28} className="text-white fill-white ml-1" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 overflow-y-auto">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1">{selectedUpload.fileName}</h3>
                        <div className="flex items-center gap-2 text-[12px] text-[#8E8E93]">
                          {selectedUpload.type === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
                          <span className="capitalize">{selectedUpload.type}</span>
                          <span>•</span>
                          <span>{selectedUpload.size}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"><Download size={16} /></button>
                        <button className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"><ExternalLink size={16} /></button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F8F8]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-semibold text-white">
                            {selectedUpload.vendor.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1D1D1F]">{selectedUpload.vendor.name}</p>
                          <p className="text-[12px] text-[#8E8E93]">{selectedUpload.vendor.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[13px]">
                        <Building2 size={16} className="text-[#8E8E93]" />
                        <span className="text-[#1D1D1F]">{selectedUpload.team}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[13px]">
                        <Clock size={16} className="text-[#8E8E93]" />
                        <span className="text-[#1D1D1F]">Uploaded {selectedUpload.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#F0F0F0] flex gap-3">
                    <PillButton 
                      icon={X}
                      variant="outline"
                      className="flex-1 h-11 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/5"
                      onClick={() => handleReject(selectedUpload)}
                    >
                      Reject
                    </PillButton>
                    <PillButton 
                      icon={Check}
                      variant="primary"
                      className="flex-1 h-11 bg-[#34C759] hover:bg-[#2DB14E]"
                      onClick={() => handleApprove(selectedUpload)}
                    >
                      Approve
                    </PillButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-[22px] bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-center mb-4">
            <Check size={28} className="text-[#34C759]" />
          </div>
          <p className="text-[17px] font-medium text-[#1D1D1F] mb-1">All caught up!</p>
          <p className="text-[14px] text-[#8E8E93]">No pending uploads to review</p>
        </div>
      )}
    </div>
  );
}
