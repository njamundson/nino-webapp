"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { AssetPreview } from "@/components/ui/asset-preview";
import { PillButton } from "@/components/ui/pill-button";
import { SubmissionsModal } from "@/components/ui/submissions-modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { LibraryToolbar } from "@/components/ui/library-toolbar";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  ChevronDown,
  Play,
  Image as ImageIcon,
  Share2,
  Download,
  Edit3,
  Trash2,
  MoreHorizontal,
  Check,
  History,
  X,
  Link2,
  LayoutGrid,
  List,
  Grid3X3,
  CheckCircle
} from "lucide-react";
import { FadeInCard } from "@/components/ui/fade-in";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Import shared types and mock data
import type { Asset, AssetType, AssetStatus, FilterType, ViewType, TeamFilter, TeamOption } from "@/lib/types";
import { DEMO_NOW_MS, getTeamName } from "@/lib/types";
import { generateBrandLibraryAssets, generateMockSubmissions, TEAM_OPTIONS } from "@/lib/mock-data";

interface LocalTeamOption {
  value: TeamFilter;
  label: string;
  assetCount: number;
  avatar?: string;
  initials: string;
}

const teamOptions: TeamOption[] = [
  { value: "all", label: "All Teams", assetCount: 0, initials: "FS" },
  { value: "corporate", label: "Corporate", assetCount: 156, initials: "CO" },
  { value: "oahu", label: "Oahu", assetCount: 89, initials: "OA" },
  { value: "maui", label: "Maui", assetCount: 124, initials: "MA" },
  { value: "bali", label: "Bali", assetCount: 67, initials: "BA" },
  { value: "paris", label: "Paris", assetCount: 93, initials: "PA" },
  { value: "whistler", label: "Whistler", assetCount: 45, initials: "WH" },
  { value: "nevis", label: "Nevis", assetCount: 38, initials: "NE" },
];

export default function BrandLibraryPage() {
  const searchParams = useSearchParams();
  const currentTeam = searchParams.get("team") || "corporate";
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewType, setViewType] = React.useState<ViewType>("grid");
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("all");
  const [teamFilter, setTeamFilter] = React.useState<TeamFilter>("all");
  const [showTeamDropdown, setShowTeamDropdown] = React.useState(false);
  const [assetMenu, setAssetMenu] = React.useState<{ asset: Asset; x: number; y: number } | null>(null);
  const [renameModal, setRenameModal] = React.useState<Asset | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Asset | null>(null);
  const [showSubmissionHistory, setShowSubmissionHistory] = React.useState(false);
  const [rejectionModal, setRejectionModal] = React.useState<Asset | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Selection state (NO drag-and-drop in Brand Library - read only)
  const [selectedAssets, setSelectedAssets] = React.useState<Set<string>>(new Set());
  const [isMarqueeSelecting, setIsMarqueeSelecting] = React.useState(false);
  const [marqueeStart, setMarqueeStart] = React.useState<{ x: number; y: number } | null>(null);
  const [marqueeEnd, setMarqueeEnd] = React.useState<{ x: number; y: number } | null>(null);

  // Selection handlers (for batch download/share only)
  const handleAssetSelect = (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation();
    
    if (e.metaKey || e.ctrlKey) {
      const newSelected = new Set(selectedAssets);
      if (newSelected.has(asset.id)) newSelected.delete(asset.id);
      else newSelected.add(asset.id);
      setSelectedAssets(newSelected);
    } else if (e.shiftKey && selectedAssets.size > 0) {
      const currentAssets = allAssets;
      const firstSelectedIdx = currentAssets.findIndex(a => selectedAssets.has(a.id));
      const clickedIdx = currentAssets.findIndex(a => a.id === asset.id);
      if (firstSelectedIdx !== -1 && clickedIdx !== -1) {
        const start = Math.min(firstSelectedIdx, clickedIdx);
        const end = Math.max(firstSelectedIdx, clickedIdx);
        const newSelected = new Set(selectedAssets);
        for (let i = start; i <= end; i++) newSelected.add(currentAssets[i].id);
        setSelectedAssets(newSelected);
      }
    } else {
      if (selectedAssets.has(asset.id) && selectedAssets.size === 1) setSelectedAssets(new Set());
      else setSelectedAssets(new Set([asset.id]));
    }
  };

  const clearSelection = () => setSelectedAssets(new Set());

  // Marquee handlers (for selection only, no drag)
  const handleMarqueeStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-asset]')) return;
    if ((e.target as HTMLElement).closest('[data-toolbar]')) return;
    if ((e.target as HTMLElement).closest('[data-menu-trigger]')) return;
    if (e.button !== 0) return;
    
    setIsMarqueeSelecting(true);
    setMarqueeStart({ x: e.clientX, y: e.clientY });
    setMarqueeEnd({ x: e.clientX, y: e.clientY });
    if (!e.shiftKey && !e.metaKey && !e.ctrlKey) setSelectedAssets(new Set());
  };

  const handleMarqueeMove = (e: React.MouseEvent) => {
    if (!isMarqueeSelecting || !marqueeStart) return;
    setMarqueeEnd({ x: e.clientX, y: e.clientY });
    
    const left = Math.min(marqueeStart.x, e.clientX);
    const right = Math.max(marqueeStart.x, e.clientX);
    const top = Math.min(marqueeStart.y, e.clientY);
    const bottom = Math.max(marqueeStart.y, e.clientY);
    
    const newSelection = new Set<string>(e.shiftKey || e.metaKey || e.ctrlKey ? selectedAssets : []);
    const assetCards = document.querySelectorAll('[data-asset-id]');
    assetCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
        const id = card.getAttribute('data-asset-id');
        if (id) newSelection.add(id);
      }
    });
    setSelectedAssets(newSelection);
  };

  const handleMarqueeEnd = () => {
    setIsMarqueeSelecting(false);
    setMarqueeStart(null);
    setMarqueeEnd(null);
  };

  // Prevent background scrolling while submissions modal is open (fixes trackpad scroll feeling "broken")
  React.useEffect(() => {
    if (!showSubmissionHistory) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSubmissionHistory]);
  
  // Use shared mock submissions
  const mockSubmissions = generateMockSubmissions();
  
  const pendingCount = mockSubmissions.filter(a => a.status === "pending").length;
  const approvedCount = mockSubmissions.filter(a => a.status === "approved").length;
  const rejectedCount = mockSubmissions.filter(a => a.status === "rejected").length;

  // Use shared mock data service
  const demoAssets = generateBrandLibraryAssets();

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "image", label: "Photos" },
    { value: "video", label: "Videos" },
  ];

  const filteredAssets = demoAssets.filter(asset => {
    if (searchQuery && !asset.title.toLowerCase().includes(searchQuery.toLowerCase()) && !asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (activeFilter !== "all" && asset.type !== activeFilter) return false;
    if (teamFilter !== "all" && asset.team !== teamFilter) return false;
    return true;
  });

  // All assets sorted newest to oldest
  const allAssets = filteredAssets.sort((a, b) => {
    const dateA = a.approvedDate ? new Date(a.approvedDate).getTime() : 0;
    const dateB = b.approvedDate ? new Date(b.approvedDate).getTime() : 0;
    return dateB - dateA;
  });

  // Get selected team info
  const selectedTeam = teamOptions.find(t => t.value === teamFilter) || teamOptions[0];
  
  // Handle team selection
  const handleTeamSelect = (team: TeamFilter) => {
    setTeamFilter(team);
    setShowTeamDropdown(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTeamDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssetRightClick = (e: React.MouseEvent, asset: Asset) => { e.preventDefault(); e.stopPropagation(); setAssetMenu({ asset, x: e.clientX, y: e.clientY }); };
  // NO file upload in Brand Library - it's a read-only curated library
  // Users submit assets through My Library → approval process → appears in Brand Library

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const copyShareLink = (asset: Asset) => { 
    navigator.clipboard.writeText(`https://nino.app/share/${asset.id}`); 
    showToast("Link copied to clipboard");
  };

  const handleRename = (asset: Asset) => {
    setRenameValue(asset.title);
    setRenameModal(asset);
  };

  const handleDelete = (asset: Asset) => {
    // In a real app, this would delete from the database
    showToast("Deleted from library");
    setDeleteConfirm(null);
  };

  const handleDownload = (asset: Asset) => {
    if (asset.url) {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = asset.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Download started");
    } else {
      showToast("No file to download");
    }
  };

  const totalAssetCount = allAssets.length;
  
  const subtitle = teamFilter !== "all" 
    ? `Showing ${totalAssetCount} approved assets from ${selectedTeam.label}`
    : `${totalAssetCount} approved assets from all properties`;

  // Simple fade-in card wrapper
  const FadeInCard = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 30}ms` }}>{children}</div>
  );


  const AssetCard = ({ asset }: { asset: Asset }) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const isSelected = selectedAssets.has(asset.id);

    const handleMenuClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowMenu(true);
    };

    const handleAction = (action: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setShowMenu(false);
      if (action === "rename") handleRename(asset);
      if (action === "download") handleDownload(asset);
      if (action === "share") copyShareLink(asset);
      if (action === "delete") setDeleteConfirm(asset);
    };

    const handleCardClick = (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        handleAssetSelect(e, asset);
        return;
      }
      if (selectedAssets.size > 0 && !isSelected) {
        clearSelection();
      }
      setPreviewAsset(asset);
    };

    // Brand Library is READ-ONLY: no drag-and-drop, no file uploads
    return (
      <div className="relative">
        <div 
          data-asset 
          data-asset-id={asset.id}
          onClick={handleCardClick}
          onContextMenu={(e) => handleAssetRightClick(e, asset)}
          className={cn(
            "group relative aspect-square rounded-[22px] overflow-hidden border transition-all duration-300 ease-out cursor-pointer bg-[#F8F8F8]",
            isSelected 
              ? "border-white/80 border-2 ring-2 ring-white/60 ring-offset-2 ring-offset-transparent shadow-[0_8px_24px_rgba(0,0,0,0.15)]" 
              : "border-black/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:border-black/[0.12]"
          )}
        >
          {/* Image */}
          <div className="w-full h-full">
            {asset.url ? (
              <img 
                src={asset.url} 
                alt={asset.title} 
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EFEFEF]">
                <div className="w-14 h-14 rounded-2xl bg-[#E5E5E5] flex items-center justify-center">
                  <ImageIcon size={24} className="text-[#B5B5B5]" />
                </div>
              </div>
            )}
          </div>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Selection checkbox - Top left */}
          <div 
            onClick={(e) => { e.stopPropagation(); handleAssetSelect(e, asset); }}
            className={cn(
              "absolute top-3 left-3 z-20 transition-all duration-200",
              isSelected || selectedAssets.size > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm",
              isSelected 
                ? "bg-white/95 backdrop-blur-md border border-white/60" 
                : "bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/90"
            )}>
              {isSelected && <CheckCircle size={14} className="text-[#1D1D1F]" />}
            </div>
          </div>

          {/* Video indicator - Bottom left, always visible for videos */}
          {asset.type === "video" && (
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/50">
                <Play size={11} className="text-[#1D1D1F] fill-[#1D1D1F] ml-0.5" />
              </div>
            </div>
          )}

          {/* Asset info - Only on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <p className="text-[14px] font-semibold text-white truncate pr-10">{asset.title}</p>
            <p className="text-[11px] text-white/60 mt-0.5">{asset.details}</p>
          </div>

          {/* 3-dot Menu Button */}
          <button
            onClick={handleMenuClick}
            className={cn(
              "absolute bottom-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20",
              showMenu 
                ? "bg-white text-[#1D1D1F] shadow-md opacity-100" 
                : "bg-white/25 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-white/40"
            )}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[100]" 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -8 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -8 }} 
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-0 right-0 z-[101] w-40 bg-white rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden p-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={(e) => handleAction("rename", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Edit3 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Rename
                </button>
                <button onClick={(e) => handleAction("download", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Download size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Download
                </button>
                <button onClick={(e) => handleAction("share", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Share2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Share
                </button>
                <div className="h-px bg-black/[0.06] mx-1 my-1" />
                <button onClick={(e) => handleAction("delete", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30]/5 active:bg-[#FF3B30]/10 transition-colors">
                  <Trash2 size={15} strokeWidth={1.5} />Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ListViewItem = ({ asset }: { asset: Asset }) => {
    return (
      <div 
        data-asset 
        onContextMenu={(e) => handleAssetRightClick(e, asset)} 
        onClick={() => setPreviewAsset(asset)}
        className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#F8F8FA] transition-colors group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] shrink-0">
          {asset.url ? (
            <div className="relative w-full h-full">
              <img src={asset.url} alt="" className="w-full h-full object-cover" />
              {asset.type === "video" && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play size={12} className="text-white fill-white" /></div>}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-[#C0C0C0]" /></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-[#1D1D1F] truncate">{asset.title}</p>
          <p className="text-[12px] text-[#8E8E93] mt-0.5">{asset.details}</p>
        </div>
        {asset.approvedDate && (
          <span className="hidden md:block text-[12px] text-[#B0B0B0]">
            {new Date(asset.approvedDate).toLocaleDateString("en-US", { timeZone: "UTC" })}
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); handleAssetRightClick(e, asset); }} className="h-8 w-8 rounded-full hover:bg-black/[0.06] flex items-center justify-center text-[#8E8E93] opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>
    );
  };

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
      
      <PageHeader title="Brand Library" subtitle={subtitle}>
        <div className="flex gap-2">
          <PillButton variant="outline" icon={History} onClick={() => setShowSubmissionHistory(true)}>
            Submissions {pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#E5E5E5] text-[#6E6E73] text-[10px] font-medium">{pendingCount}</span>}
          </PillButton>
        </div>
      </PageHeader>

      {/* Toolbar */}
      <div data-toolbar className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar placeholder="Search all approved assets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClear={() => setSearchQuery("")} />
        </div>
        
        {/* Right: Team Dropdown + Type Filter + View Toggle */}
        <div className="flex items-center gap-2">
          {/* Team Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              className={cn(
                "flex items-center gap-2 h-10 px-4 rounded-full border transition-all duration-200",
                showTeamDropdown 
                  ? "bg-white border-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.1)]" 
                  : "bg-[#F5F5F7] border-transparent hover:bg-[#EBEBEB]"
              )}
            >
              <span className="text-[13px] font-medium text-[#1D1D1F] whitespace-nowrap">{selectedTeam.label}</span>
              <ChevronDown size={14} className={cn("text-[#8E8E93] transition-transform duration-200", showTeamDropdown && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showTeamDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden z-50"
                >
                  <div className="p-1.5 max-h-[320px] overflow-y-auto">
                    {teamOptions.map((team) => (
                      <button
                        key={team.value}
                        onClick={() => handleTeamSelect(team.value)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                          teamFilter === team.value 
                            ? "bg-[#F5F5F7]" 
                            : "hover:bg-[#F5F5F7]"
                        )}
                      >
                        {/* Team Avatar */}
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold",
                          team.value === "all" 
                            ? "bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] text-white" 
                            : "bg-[#E8E8E8] text-[#6E6E73]"
                        )}>
                          {team.initials}
                        </div>
                        <span className="flex-1 text-left text-[13px] font-medium text-[#1D1D1F]">{team.label}</span>
                        {teamFilter === team.value && (
                          <Check size={15} className="text-[#007AFF]" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Type Filter */}
          <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1">
            {filterOptions.map((option) => (
              <button key={option.value} onClick={() => setActiveFilter(option.value)}
                className={cn("relative h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-200", activeFilter === option.value ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}>
                {option.label}
              </button>
            ))}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] p-1">
            <button onClick={() => setViewType("grid")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "grid" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><LayoutGrid size={15} /></button>
            <button onClick={() => setViewType("list")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "list" ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]")}><List size={15} /></button>
          </div>
        </div>
      </div>

      {/* Content Area with marquee selection (NO drag-drop in Brand Library) */}
      <div 
        ref={gridRef}
        onMouseDown={handleMarqueeStart}
        onMouseMove={handleMarqueeMove}
        onMouseUp={handleMarqueeEnd}
        onMouseLeave={handleMarqueeEnd}
        className={cn(
          "min-h-[300px] rounded-2xl transition-all relative select-none", 
          isMarqueeSelecting && "cursor-crosshair"
        )}
      >
        
        {allAssets.length > 0 ? (
          viewType === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {allAssets.map((asset, i) => (
                <FadeInCard key={asset.id} index={i}>
                  <AssetCard asset={asset} />
                </FadeInCard>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#F0F0F0] overflow-hidden">
              {allAssets.map((asset, i) => (
                <FadeInCard key={asset.id} index={i}><ListViewItem asset={asset} /></FadeInCard>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
            <div className="w-18 h-18 rounded-3xl bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-center mb-4">
              <Grid3X3 size={32} className="text-[#C0C0C0]" />
            </div>
            <p className="text-[17px] font-medium text-[#1D1D1F] mb-1">{searchQuery ? "No results" : "Empty"}</p>
            <p className="text-[14px] text-[#8E8E93]">{searchQuery ? "Try different keywords" : "No approved assets yet"}</p>
          </div>
        )}
      </div>

      {/* Selection Toolbar - White translucent, Frame.io style */}
      <AnimatePresence>
        {selectedAssets.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-0.5 px-1.5 py-1.5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/60"
          >
            {/* Selection count */}
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#1D1D1F] flex items-center justify-center">
                <span className="text-[11px] font-bold text-white">{selectedAssets.size}</span>
              </div>
              <span className="text-[13px] font-medium text-[#1D1D1F]">selected</span>
            </div>
            
            <div className="w-px h-5 bg-black/10 mx-1" />
            
            {/* Share */}
            <button 
              onClick={() => {
                const count = selectedAssets.size;
                navigator.clipboard.writeText(`https://nino.app/share/batch/${Date.now()}`);
                showToast(`Copied share link for ${count} items`);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#1D1D1F] hover:bg-black/5 active:bg-black/10 transition-colors"
            >
              <Share2 size={15} strokeWidth={1.5} />
              <span className="hidden sm:inline">Share</span>
            </button>
            
            {/* Download */}
            <button 
              onClick={() => {
                const selectedItems = demoAssets.filter(a => selectedAssets.has(a.id));
                selectedItems.forEach(asset => handleDownload(asset));
                showToast(`Downloading ${selectedItems.length} items`);
                clearSelection();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#1D1D1F] hover:bg-black/5 active:bg-black/10 transition-colors"
            >
              <Download size={15} strokeWidth={1.5} />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <div className="w-px h-5 bg-black/10 mx-1" />
            
            {/* Delete */}
            <button 
              onClick={() => {
                const selectedIds = Array.from(selectedAssets);
                // In a real app, this would delete from the database
                clearSelection();
                showToast(`Deleted ${selectedIds.length} items from view`);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#FF3B30] hover:bg-[#FF3B30]/8 active:bg-[#FF3B30]/15 transition-colors"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
            
            {/* Close */}
            <button 
              onClick={clearSelection}
              className="flex items-center justify-center w-8 h-8 rounded-xl text-[#8E8E93] hover:bg-black/5 hover:text-[#1D1D1F] transition-colors"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marquee Selection Box */}
      {isMarqueeSelecting && marqueeStart && marqueeEnd && (
        <div 
          className="fixed pointer-events-none z-[90] border border-[#1D1D1F]/20 bg-[#1D1D1F]/5 rounded-lg backdrop-blur-[1px]"
          style={{
            left: Math.min(marqueeStart.x, marqueeEnd.x),
            top: Math.min(marqueeStart.y, marqueeEnd.y),
            width: Math.abs(marqueeEnd.x - marqueeStart.x),
            height: Math.abs(marqueeEnd.y - marqueeStart.y),
          }}
        />
      )}


      {/* Asset Menu */}
      <AnimatePresence>
        {assetMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100]" 
              onClick={() => setAssetMenu(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ left: assetMenu.x, top: assetMenu.y }}
              className="fixed z-[101] w-44 bg-white rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden p-1"
            >
              <button 
                onClick={() => setAssetMenu(null)} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <Share2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Share
              </button>
              <button 
                onClick={() => setAssetMenu(null)} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <Link2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Copy Link
              </button>
              <div className="h-px bg-black/[0.06] mx-1 my-1" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                <Download size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Download
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                <Edit3 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Rename
              </button>
              <div className="h-px bg-black/[0.06] mx-1 my-1" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#FF3B30] rounded-lg hover:bg-[#FFF5F5] active:bg-[#FFEBEB] transition-colors">
                <Trash2 size={15} strokeWidth={1.5} />Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRenameModal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.2)]" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-semibold text-[#1D1D1F]">Rename</h2>
                <button onClick={() => setRenameModal(null)} className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={renameValue} 
                  onChange={(e) => setRenameValue(e.target.value)} 
                  placeholder="Enter new name" 
                  autoFocus 
                  className="w-full h-12 px-4 rounded-xl bg-[#F5F5F7] border border-transparent text-[15px] placeholder:text-[#A0A0A0] outline-none focus:border-[#D0D0D0] focus:bg-[#F0F0F2] transition-all" 
                />
                <div className="flex gap-3">
                  <button onClick={() => setRenameModal(null)} className="flex-1 h-11 rounded-full border border-black/[0.08] text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors">Cancel</button>
                  <button onClick={() => { setRenameModal(null); showToast("Renamed successfully"); }} disabled={!renameValue.trim()} className="flex-1 h-11 rounded-full bg-[#1D1D1F] text-white text-[14px] font-medium hover:bg-[#3A3A3C] transition-colors disabled:opacity-50">Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.2)]" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-[#FF3B30]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-1">Delete "{deleteConfirm.title}"?</h2>
                <p className="text-[14px] text-[#8E8E93]">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-full border border-black/[0.08] text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors">Cancel</button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)} 
                  className="flex-1 h-11 rounded-full bg-[#FF3B30] text-white text-[13px] font-medium hover:bg-[#E0342B] transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <AssetPreview 
          asset={{ 
            url: previewAsset.url || "", 
            title: previewAsset.title, 
            type: previewAsset.type as "image" | "video", 
            details: previewAsset.details, 
            date: previewAsset.approvedDate
              ? new Date(previewAsset.approvedDate).toLocaleDateString("en-US", { timeZone: "UTC" })
              : "", 
            location: previewAsset.location || "", 
            tags: previewAsset.tags || [] 
          }}
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          onDelete={() => { setPreviewAsset(null); setDeleteConfirm(previewAsset); }}
        />
      )}

      {/* Submission History Modal - Modern Minimal Design */}
      <SubmissionsModal
        open={showSubmissionHistory}
        onClose={() => setShowSubmissionHistory(false)}
        subtitle="Assets submitted to Brand Library"
        counts={{ pending: pendingCount, approved: approvedCount, rejected: rejectedCount }}
        items={mockSubmissions
          .filter((a) => a.status && a.status !== "draft") // Only show submitted items
          .map((a) => ({
            id: a.id,
            title: a.title,
            submittedAt: a.submittedAt,
            status: a.status as "pending" | "approved" | "rejected",
            type: a.type as "image" | "video",
            details: a.details,
            rejectionReason: a.rejectionReason,
          }))}
        emptySubtitle="Submit assets from My Library"
        onRejectedClick={(item) => {
          const found = mockSubmissions.find((a) => a.id === item.id);
          if (!found) return;
          setRejectionModal(found);
          setShowSubmissionHistory(false);
        }}
      />

      {/* Rejection Feedback Modal */}
      <AnimatePresence>
        {rejectionModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setRejectionModal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }} 
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-[28px] w-full max-w-md overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)]" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[20px] font-semibold text-[#1D1D1F] tracking-tight">Feedback</h2>
                  <button onClick={() => setRejectionModal(null)} className="h-8 w-8 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEB] flex items-center justify-center text-[#6E6E73] transition-colors">
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Asset Info */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F8F8]">
                  <div className="w-10 h-10 rounded-lg bg-[#E5E5E5] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {rejectionModal.type === "video" ? <Play size={14} className="text-[#8E8E93]" /> : <ImageIcon size={14} className="text-[#8E8E93]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{rejectionModal.title}</p>
                    <p className="text-[11px] text-[#8E8E93]">{rejectionModal.details}</p>
                  </div>
                  <StatusBadge status="rejected" size="sm" />
                </div>
              </div>

              {/* Feedback Content */}
              <div className="px-6 pb-6">
                <p className="text-[12px] font-medium text-[#8E8E93] uppercase tracking-wide mb-2">Brand Team Feedback</p>
                <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FF3B30]/10">
                  <p className="text-[14px] text-[#1D1D1F] leading-relaxed">
                    {rejectionModal.rejectionReason || "No feedback provided."}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <button onClick={() => setRejectionModal(null)} className="w-full h-11 rounded-full bg-[#1D1D1F] text-white text-[14px] font-medium hover:bg-[#3A3A3C] transition-colors">Got it</button>
                <p className="text-[12px] text-[#8E8E93] text-center mt-3">Go to My Library to re-submit</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 bg-[#1D1D1F] text-white text-[14px] font-medium rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
