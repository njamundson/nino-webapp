"use client";

import React from "react";
import { Clock, Check, X, Eye, Video, Image as ImageIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock vendor's uploads
const mockUploads = [
  { id: "1", title: "Sunset_Drone_Maui_001.mp4", type: "video", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400", uploadedAt: "2 hours ago", status: "pending", size: "1.2 GB" },
  { id: "2", title: "Pool_Aerial_004.mp4", type: "video", thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400", uploadedAt: "3 hours ago", status: "pending", size: "890 MB" },
  { id: "3", title: "Lobby_Interior_Final.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=400", uploadedAt: "5 hours ago", status: "pending", size: "24 MB" },
  { id: "4", title: "Beach_Morning_001.mp4", type: "video", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400", uploadedAt: "Yesterday", status: "approved", size: "2.1 GB" },
  { id: "5", title: "Suite_Walkthrough.mp4", type: "video", thumbnail: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400", uploadedAt: "2 days ago", status: "approved", size: "1.8 GB" },
  { id: "6", title: "Restaurant_Ambiance.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400", uploadedAt: "3 days ago", status: "rejected", size: "18 MB" },
];

const statusConfig = {
  pending: { label: "Pending Review", color: "text-[#FF9500]", bg: "bg-[#FF9500]/10", icon: Clock },
  approved: { label: "Approved", color: "text-[#34C759]", bg: "bg-[#34C759]/10", icon: Check },
  rejected: { label: "Rejected", color: "text-[#FF3B30]", bg: "bg-[#FF3B30]/10", icon: X },
};

export default function VendorUploadsPage() {
  const [filter, setFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredUploads = mockUploads.filter(u => filter === "all" || u.status === filter);

  const counts = {
    all: mockUploads.length,
    pending: mockUploads.filter(u => u.status === "pending").length,
    approved: mockUploads.filter(u => u.status === "approved").length,
    rejected: mockUploads.filter(u => u.status === "rejected").length,
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ] as const;

  // Fade in animation wrapper
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

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-[24px] font-semibold text-[#1D1D1F]">My Uploads</h1>
        <p className="text-[15px] text-[#8E8E93]">
          Track the status of your uploads. Approved assets will appear in the brand library.
        </p>
      </div>

      {/* Filter Toggle - Modern pill style */}
      <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1 w-fit">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "relative h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-200",
              filter === option.value 
                ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" 
                : "text-[#6E6E73] hover:text-[#1D1D1F]"
            )}
          >
            {option.label} ({counts[option.value]})
          </button>
        ))}
      </div>

      {/* Uploads Grid */}
      {filteredUploads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUploads.map((upload, i) => {
            const StatusIcon = statusConfig[upload.status as keyof typeof statusConfig].icon;
            return (
              <FadeIn key={upload.id} index={i}>
                <div className="rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] overflow-hidden transition-all duration-300 group cursor-pointer">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-[#F5F5F7] relative overflow-hidden">
                    <img src={upload.thumbnail} alt={upload.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity h-11 w-11 rounded-full bg-white/90 flex items-center justify-center text-[#1D1D1F] shadow-sm">
                        <Eye size={18} />
                      </button>
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <div className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                        {upload.type === "video" ? <Play size={11} className="fill-white ml-0.5" /> : <ImageIcon size={12} />}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-2">
                    <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{upload.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#8E8E93]">{upload.uploadedAt}</span>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full",
                        statusConfig[upload.status as keyof typeof statusConfig].bg
                      )}>
                        <StatusIcon size={10} className={statusConfig[upload.status as keyof typeof statusConfig].color} />
                        <span className={cn(
                          "text-[10px] font-semibold",
                          statusConfig[upload.status as keyof typeof statusConfig].color
                        )}>
                          {statusConfig[upload.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-[22px] bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-center mb-4">
            <ImageIcon size={28} className="text-[#C0C0C0]" />
          </div>
          <p className="text-[17px] font-medium text-[#1D1D1F] mb-1">No uploads found</p>
          <p className="text-[14px] text-[#8E8E93]">Try adjusting your filter</p>
        </div>
      )}
    </div>
  );
}
