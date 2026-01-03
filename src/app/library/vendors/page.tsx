"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { PillButton } from "@/components/ui/pill-button";
import { useRole } from "@/contexts/role-context";
import { 
  UserPlus, 
  Users, 
  Upload, 
  Clock, 
  Mail,
  Building2,
  Camera,
  Video,
  X,
  ChevronRight,
  LayoutGrid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Vendor {
  id: string;
  name: string;
  email: string;
  company: string;
  type: "photographer" | "videographer" | "agency";
  team: string;
  teamId: string;
  status: "active" | "invited" | "inactive";
  uploads: number;
  pendingReview: number;
  lastActive?: string;
}

export default function VendorsPage() {
  const { isCorporate, isTeam, user } = useRole();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [viewType, setViewType] = React.useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const allVendors: Vendor[] = [
    { id: "v1", name: "Alex Rivera", email: "alex@beachphoto.com", company: "Beach Photography Co.", type: "photographer", team: "Four Seasons Maui", teamId: "maui", status: "active", uploads: 48, pendingReview: 3, lastActive: "2 hours ago" },
    { id: "v2", name: "Sarah Kim", email: "sarah@dronevisuals.com", company: "Drone Visuals", type: "videographer", team: "Four Seasons Maui", teamId: "maui", status: "active", uploads: 24, pendingReview: 1, lastActive: "1 day ago" },
    { id: "v3", name: "Marcus Chen", email: "marcus@luxurycreative.com", company: "Luxury Creative Agency", type: "agency", team: "Four Seasons Oahu", teamId: "oahu", status: "active", uploads: 156, pendingReview: 8, lastActive: "3 hours ago" },
    { id: "v4", name: "Emma Wilson", email: "emma@tropicalshots.com", company: "Tropical Shots", type: "photographer", team: "Four Seasons Bali", teamId: "bali", status: "invited", uploads: 0, pendingReview: 0 },
    { id: "v5", name: "James Park", email: "james@resortmedia.com", company: "Resort Media Group", type: "agency", team: "Corporate", teamId: "corporate", status: "active", uploads: 312, pendingReview: 12, lastActive: "Just now" },
  ];

  const vendors = allVendors.filter(v => {
    if (isCorporate) return true;
    if (isTeam) return v.teamId === user.teamId;
    return false;
  });

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: vendors.filter(v => v.status === "active").length,
    invited: vendors.filter(v => v.status === "invited").length,
    totalUploads: vendors.reduce((acc, v) => acc + v.uploads, 0),
    pendingReview: vendors.reduce((acc, v) => acc + v.pendingReview, 0),
  };

  const getTypeIcon = (type: Vendor["type"]) => {
    switch (type) {
      case "photographer": return Camera;
      case "videographer": return Video;
      case "agency": return Building2;
    }
  };

  const getStatusBadge = (status: Vendor["status"]) => {
    const styles = {
      active: "bg-[#34C759]/10 text-[#34C759]",
      invited: "bg-[#FF9500]/10 text-[#FF9500]",
      inactive: "bg-[#8E8E93]/10 text-[#8E8E93]",
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", styles[status])}>
        {status}
      </span>
    );
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "invited", label: "Invited" },
  ];

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

      <PageHeader 
        title="Vendors" 
        subtitle={isCorporate ? "Manage vendors across all teams" : `Vendors for ${user.teamName}`}
      >
        <PillButton icon={UserPlus} variant="primary" onClick={() => setShowInviteModal(true)}>
          Invite Vendor
        </PillButton>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <FadeIn index={0}>
          <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#34C759] mb-1.5">
              <Users size={16} />
              <span className="text-[12px] font-medium">Active</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1D1D1F]">{stats.active}</p>
          </div>
        </FadeIn>
        <FadeIn index={1}>
          <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#FF9500] mb-1.5">
              <Mail size={16} />
              <span className="text-[12px] font-medium">Pending Invites</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1D1D1F]">{stats.invited}</p>
          </div>
        </FadeIn>
        <FadeIn index={2}>
          <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#007AFF] mb-1.5">
              <Upload size={16} />
              <span className="text-[12px] font-medium">Total Uploads</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1D1D1F]">{stats.totalUploads}</p>
          </div>
        </FadeIn>
        <FadeIn index={3}>
          <div className="p-4 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#AF52DE] mb-1.5">
              <Clock size={16} />
              <span className="text-[12px] font-medium">Pending Review</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1D1D1F]">{stats.pendingReview}</p>
          </div>
        </FadeIn>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="w-72">
            <SearchBar 
              placeholder="Search vendors..."
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
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  "relative h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-200",
                  statusFilter === option.value 
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
          <button onClick={() => setViewType("list")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "list" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><List size={15} /></button>
          <button onClick={() => setViewType("grid")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "grid" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><LayoutGrid size={15} /></button>
        </div>
      </div>

      {/* Vendors Display */}
      {filteredVendors.length > 0 ? (
        viewType === "list" ? (
          <div className="bg-white rounded-[22px] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#F0F0F0] overflow-hidden">
            {filteredVendors.map((vendor, i) => {
              const TypeIcon = getTypeIcon(vendor.type);
              return (
                <FadeIn key={vendor.id} index={i}>
                  <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#FAFAFA] transition-colors group cursor-pointer">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-semibold text-white">
                        {vendor.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-[#1D1D1F]">{vendor.name}</p>
                        {getStatusBadge(vendor.status)}
                      </div>
                      <p className="text-[12px] text-[#8E8E93]">{vendor.company}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7]">
                      <TypeIcon size={12} className="text-[#8E8E93]" />
                      <span className="text-[11px] font-medium text-[#8E8E93] capitalize">{vendor.type}</span>
                    </div>

                    {isCorporate && (
                      <div className="hidden md:block text-[12px] text-[#8E8E93] w-32 text-right truncate">
                        {vendor.team}
                      </div>
                    )}

                    <div className="hidden lg:flex items-center gap-4 text-[12px]">
                      <div className="text-center">
                        <p className="font-semibold text-[#1D1D1F]">{vendor.uploads}</p>
                        <p className="text-[#C7C7C7]">uploads</p>
                      </div>
                      {vendor.pendingReview > 0 && (
                        <div className="text-center">
                          <p className="font-semibold text-[#FF9500]">{vendor.pendingReview}</p>
                          <p className="text-[#C7C7C7]">pending</p>
                        </div>
                      )}
                    </div>

                    <ChevronRight size={16} className="text-[#C7C7C7] group-hover:text-[#8E8E93] transition-colors shrink-0" />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor, i) => {
              const TypeIcon = getTypeIcon(vendor.type);
              return (
                <FadeIn key={vendor.id} index={i}>
                  <div className="p-5 rounded-[22px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.12] transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center">
                        <span className="text-[14px] font-semibold text-white">
                          {vendor.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      {getStatusBadge(vendor.status)}
                    </div>
                    
                    <h3 className="text-[15px] font-medium text-[#1D1D1F] mb-0.5">{vendor.name}</h3>
                    <p className="text-[13px] text-[#8E8E93] mb-3">{vendor.company}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7]">
                        <TypeIcon size={12} className="text-[#8E8E93]" />
                        <span className="text-[11px] font-medium text-[#8E8E93] capitalize">{vendor.type}</span>
                      </div>
                      {isCorporate && (
                        <span className="text-[11px] text-[#C7C7C7] truncate">{vendor.team}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                      <div className="flex items-center gap-3 text-[12px]">
                        <div>
                          <span className="font-semibold text-[#1D1D1F]">{vendor.uploads}</span>
                          <span className="text-[#8E8E93] ml-1">uploads</span>
                        </div>
                        {vendor.pendingReview > 0 && (
                          <div>
                            <span className="font-semibold text-[#FF9500]">{vendor.pendingReview}</span>
                            <span className="text-[#8E8E93] ml-1">pending</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={14} className="text-[#C7C7C7] group-hover:text-[#8E8E93]" />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-[22px] bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-center mb-4">
            <Users size={28} className="text-[#C0C0C0]" />
          </div>
          <p className="text-[17px] font-medium text-[#1D1D1F] mb-1">
            {searchQuery ? "No vendors found" : "No vendors yet"}
          </p>
          <p className="text-[14px] text-[#8E8E93] mb-4">
            {searchQuery ? "Try a different search" : "Invite vendors to start receiving uploads"}
          </p>
          <PillButton icon={UserPlus} variant="primary" onClick={() => setShowInviteModal(true)}>
            Invite Vendor
          </PillButton>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInviteModal(false)}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.2)]" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold text-[#1D1D1F]">Invite Vendor</h2>
                <button onClick={() => setShowInviteModal(false)} className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#1D1D1F]">Email</label>
                  <input 
                    type="email"
                    placeholder="vendor@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-[#F5F5F7] border-none text-[15px] placeholder:text-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#1D1D1F]">Vendor Type</label>
                  <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1">
                    {[{ value: "photographer", label: "Photo" }, { value: "videographer", label: "Video" }, { value: "agency", label: "Agency" }].map((opt) => (
                      <button key={opt.value} className="flex-1 h-8 rounded-full text-[13px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">{opt.label}</button>
                    ))}
                  </div>
                </div>

                {isCorporate && (
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#1D1D1F]">Assign to Team</label>
                    <select className="w-full h-12 px-4 rounded-xl bg-[#F5F5F7] border-none text-[15px] text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#007AFF]/20">
                      <option value="maui">Four Seasons Maui</option>
                      <option value="oahu">Four Seasons Oahu</option>
                      <option value="bali">Four Seasons Bali</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <PillButton variant="outline" className="flex-1 h-11" onClick={() => setShowInviteModal(false)}>Cancel</PillButton>
                  <PillButton icon={Mail} variant="primary" className="flex-1 h-11">Send Invite</PillButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
