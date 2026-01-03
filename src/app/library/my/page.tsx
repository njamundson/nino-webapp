"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { AssetPreview } from "@/components/ui/asset-preview";
import { PillButton } from "@/components/ui/pill-button";
import { SubmissionsModal } from "@/components/ui/submissions-modal";
import { StatusBadge, AddedBadge } from "@/components/ui/status-badge";
import { LibraryToolbar } from "@/components/ui/library-toolbar";
import { Tooltip } from "@/components/ui/tooltip";
import { useRole } from "@/contexts/role-context";
import { useUpload } from "@/contexts/upload-context";
import { useSelection } from "@/contexts/selection-context";
import { useDragDrop, useDroppableFolder, NINO_DRAG_TYPE } from "@/contexts/drag-drop-context";
import { SelectionCheckbox } from "@/components/ui/selection-checkbox";
import { SelectionToolbar } from "@/components/ui/selection-toolbar";
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  Image as ImageIcon,
  X,
  Play,
  Upload,
  FolderPlus,
  Link2,
  Share2,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  Edit3,
  Lock,
  ArrowLeft,
  Send,
  History,
  CheckCircle,
  LayoutGrid,
  List,
  ArrowUpDown,
  Check,
  Grid3X3,
  UserPlus,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Import shared types and mock data
import type { Asset, AssetType, AssetStatus, FilterType, ViewType, SortType } from "@/lib/types";
import { DEMO_NOW_MS } from "@/lib/types";
import { generateMyLibraryAssets, UNSPLASH_IMAGES, ASSET_NAMES, FILE_SIZES, VIDEO_SIZES, DOWNLOAD_COUNTS } from "@/lib/mock-data";

export default function MyLibraryPage() {
  const { role, isVendor, user } = useRole();
  const { addFiles } = useUpload();
  const selection = useSelection();
  const dragDrop = useDragDrop();
  
  const getMockAssets = (): Asset[] => {
    const unsplashImages = [
      "photo-1506744038136-46273834b3fb", "photo-1571896349842-33c89424de2d", "photo-1501785888041-af3ef285b470",
      "photo-1518837695005-2083093ee35b", "photo-1470770841072-f978cf4d019e", "photo-1540541338287-41700207dee6",
      "photo-1566073771259-6a8506099945", "photo-1582719508461-905c673771fd", "photo-1618773928121-c32242e63f39",
      "photo-1507525428034-b723cf961d3e", "photo-1520250497591-112f2f40a3f4", "photo-1551882547-ff40c63fe5fa",
      "photo-1571003123894-1f0594d2b5d9", "photo-1542314831-068cd1dbfeeb", "photo-1564501049412-61c2a3083791",
      "photo-1455587734955-081b22074882", "photo-1496417263034-38ec4f0b665a", "photo-1584132967334-10e028bd69f7",
      "photo-1578683010236-d716f9a3f461", "photo-1582610116397-edb318620f90", "photo-1445019980597-93fa8acb246c",
      "photo-1590490360182-c33d57733427", "photo-1611892440504-42a792e24d32", "photo-1568495248636-6432b97bd949",
    ];

    const assetNames = [
      "Beach_Sunset", "Pool_Aerial", "Lobby_Interior", "Suite_Hero", "Spa_Entrance",
      "Ocean_View", "Mountain_Vista", "Garden_Path", "Restaurant_Evening", "Bar_Atmosphere",
      "Cabana_Setup", "Balcony_View", "Infinity_Pool", "Private_Beach", "Rooftop_Sunset",
      "Jungle_Villa", "Overwater_Suite", "Tennis_Courts", "Golf_Course", "Kids_Area",
      "Wine_Cellar", "Kitchen_Tour", "Penthouse", "Master_Bath", "Outdoor_Shower",
    ];

    const fileSizes = [8, 12, 15, 18, 22, 24, 28, 32, 36, 42];
    const videoSizes = [120, 180, 245, 320, 480, 156, 210, 89, 175, 280];
    const downloadCounts = [47, 89, 124, 156, 78, 203, 45, 167, 92, 134];

    if (isVendor) {
      const statuses: AssetStatus[] = ["pending", "approved", "approved", "rejected", "pending", "approved"];
      return Array.from({ length: 20 }, (_, i) => ({
        id: `vendor-${i}`,
        title: `${assetNames[i % assetNames.length]}${i % 4 === 0 ? ".mp4" : ".jpg"}`,
        type: (i % 4 === 0 ? "video" : "image") as AssetType,
        url: `https://images.unsplash.com/${unsplashImages[i % unsplashImages.length]}?auto=format&fit=crop&q=80&w=800`,
        details: i % 4 === 0 ? `4K MP4 • ${videoSizes[i % videoSizes.length]}MB` : `4K JPG • ${fileSizes[i % fileSizes.length]}MB`,
        parentId: null,
        date: `Dec ${28 - (i % 20)}, 2025`,
        status: statuses[i % statuses.length],
        submittedAt: `2025-12-${String(28 - (i % 20)).padStart(2, "0")}`,
        downloads: statuses[i % statuses.length] === "approved" ? downloadCounts[i % downloadCounts.length] : undefined,
        rejectionReason: statuses[i % statuses.length] === "rejected" ? "Please re-export with higher resolution." : undefined,
        campaign: i % 3 === 0 ? "Summer 2026" : undefined,
      }));
    }

    // Team member library
    const folders = [
      { id: "folder-maui", title: "Maui Summer Shoot", details: "18 items • 1.2 GB", campaign: "Summer 2026" },
      { id: "folder-oahu", title: "Oahu Beach Campaign", details: "24 items • 2.4 GB" },
      { id: "folder-brand", title: "Brand Guidelines", details: "12 items • 380 MB" },
      { id: "folder-drone", title: "Drone Footage", details: "8 items • 4.8 GB" },
      { id: "folder-spa", title: "Spa & Wellness", details: "16 items • 890 MB" },
      { id: "folder-food", title: "Culinary Content", details: "22 items • 1.6 GB" },
    ];

    const statuses: (AssetStatus | undefined)[] = [undefined, "pending", "approved", "rejected", "approved", undefined, "pending", "approved"];

    const assets: Asset[] = [
      ...folders.map(f => ({ ...f, type: "folder" as AssetType, parentId: null })),
      // Root assets
      ...Array.from({ length: 36 }, (_, i) => ({
        id: `asset-${i}`,
        title: `${assetNames[i % assetNames.length]}${i % 5 === 0 ? ".mp4" : ".jpg"}`,
        type: (i % 5 === 0 ? "video" : "image") as AssetType,
        url: `https://images.unsplash.com/${unsplashImages[i % unsplashImages.length]}?auto=format&fit=crop&q=80&w=800`,
        details: i % 5 === 0 ? `4K MP4 • ${videoSizes[i % videoSizes.length]}MB` : `4K JPG • ${fileSizes[i % fileSizes.length]}MB`,
        parentId: null,
        date: `Dec ${28 - (i % 20)}, 2025`,
        location: "Four Seasons Oahu",
        tags: ["Resort", "Luxury"],
        status: statuses[i % statuses.length],
        submittedAt: statuses[i % statuses.length] ? `2025-12-${String(28 - (i % 20)).padStart(2, "0")}` : undefined,
        downloads: statuses[i % statuses.length] === "approved" ? downloadCounts[i % downloadCounts.length] : undefined,
        rejectionReason: statuses[i % statuses.length] === "rejected" ? "Image needs color correction." : undefined,
        campaign: i % 4 === 0 ? "Summer 2026" : undefined,
        expiresAt: i % 7 === 0 ? "2026-02-15" : undefined,
      })),
      // Folder contents
      ...folders.flatMap((folder, fi) => 
        Array.from({ length: 6 }, (_, i) => ({
          id: `folder-asset-${folder.id}-${i}`,
          title: `${folder.title.split(" ")[0]}_${assetNames[(fi * 6 + i) % assetNames.length]}${i % 4 === 0 ? ".mp4" : ".jpg"}`,
          type: (i % 4 === 0 ? "video" : "image") as AssetType,
          url: `https://images.unsplash.com/${unsplashImages[(fi * 6 + i + 5) % unsplashImages.length]}?auto=format&fit=crop&q=80&w=800`,
          details: i % 4 === 0 ? `4K MP4 • ${videoSizes[(fi + i) % videoSizes.length]}MB` : `4K JPG • ${fileSizes[(fi + i) % fileSizes.length]}MB`,
          parentId: folder.id,
          campaign: folder.campaign,
        }))
      ),
    ];

    return assets;
  };

  const [assets, setAssets] = React.useState<Asset[]>(getMockAssets());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("all");
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [viewType, setViewType] = React.useState<ViewType>("grid");
  const [sortType, setSortType] = React.useState<SortType>("newest");
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [shareModal, setShareModal] = React.useState<Asset | null>(null);
  const [assetMenu, setAssetMenu] = React.useState<{ asset: Asset; x: number; y: number } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [renameModal, setRenameModal] = React.useState<Asset | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [showSubmissionHistory, setShowSubmissionHistory] = React.useState(false);
  const [rejectionModal, setRejectionModal] = React.useState<Asset | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Asset | null>(null);
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Prevent background scrolling while submissions modal is open (fixes trackpad scroll feeling "broken")
  React.useEffect(() => {
    if (!showSubmissionHistory) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSubmissionHistory]);
  
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { setAssets(getMockAssets()); setCurrentFolderId(null); }, [role]);

  const filterOptions = isVendor ? [
    { value: "all" as FilterType, label: "All" },
    { value: "image" as FilterType, label: "Photos" },
    { value: "video" as FilterType, label: "Videos" },
  ] : [
    { value: "all" as FilterType, label: "All" },
    { value: "folder" as FilterType, label: "Folders" },
    { value: "image" as FilterType, label: "Photos" },
    { value: "video" as FilterType, label: "Videos" },
  ];

  const getFolderPreviews = (folderId: string) => assets.filter(a => a.parentId === folderId && a.url).slice(0, 4);
  const currentFolder = currentFolderId ? assets.find(a => a.id === currentFolderId) : null;

  const getBreadcrumbs = (): Asset[] => {
    const crumbs: Asset[] = [];
    let folderId = currentFolderId;
    while (folderId) { const folder = assets.find(a => a.id === folderId); if (folder) { crumbs.unshift(folder); folderId = folder.parentId || null; } else break; }
    return crumbs;
  };

  const filteredAssets = assets.filter(asset => {
    if (asset.parentId !== currentFolderId) return false;
    if (searchQuery && !asset.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter !== "all" && asset.type !== activeFilter) return false;
    return true;
  });

  const folders = filteredAssets.filter(a => a.type === "folder");
  const files = filteredAssets.filter(a => a.type !== "folder");
  
  // Sort files based on sortType
  const sortedFiles = [...files].sort((a, b) => {
    switch (sortType) {
      case "newest":
        return (b.date || "").localeCompare(a.date || "");
      case "oldest":
        return (a.date || "").localeCompare(b.date || "");
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      case "size":
        const getSize = (details: string) => {
          const match = details.match(/(\d+)MB/);
          return match ? parseInt(match[1]) : 0;
        };
        return getSize(b.details) - getSize(a.details);
      default:
        return 0;
    }
  });
  
  // Sort folders alphabetically, then combine with sorted files
  const sortedFolders = [...folders].sort((a, b) => a.title.localeCompare(b.title));
  const sortedAssets = [...sortedFolders, ...sortedFiles];
  
  // Get all selectable asset IDs (non-folders) - defined early for keyboard shortcuts
  const selectableAssetIds = sortedAssets.filter(a => a.type !== "folder").map(a => a.id);
  
  // Sort options for dropdown
  const sortOptions: { value: SortType; label: string }[] = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "a-z", label: "Name A-Z" },
    { value: "z-a", label: "Name Z-A" },
    { value: "size", label: "Size" },
  ];

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to close modals and clear selection
      if (e.key === "Escape") {
        if (previewAsset) setPreviewAsset(null);
        else if (shareModal) setShareModal(null);
        else if (renameModal) setRenameModal(null);
        else if (showNewFolderModal) setShowNewFolderModal(false);
        else if (showSubmissionHistory) setShowSubmissionHistory(false);
        else if (deleteConfirm) setDeleteConfirm(null);
        else if (showSortMenu) setShowSortMenu(false);
        else if (selection.isSelecting) selection.clearSelection();
      }
      
      // Cmd/Ctrl + A to select all (when not in input)
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          selection.selectAll(selectableAssetIds);
        }
      }
      
      // Delete/Backspace to delete selected assets
      if ((e.key === "Delete" || e.key === "Backspace") && selection.isSelecting) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          handleBatchDelete();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewAsset, shareModal, renameModal, showNewFolderModal, showSubmissionHistory, deleteConfirm, showSortMenu, selection, selectableAssetIds]);

  const navigateToFolder = (folderId: string) => { setCurrentFolderId(folderId); setSearchQuery(""); };
  const goBack = () => {
    if (currentFolder?.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    } else {
      setCurrentFolderId(null);
    }
  };
  const handleBreadcrumbClick = (folderId: string | null) => { setCurrentFolderId(folderId); };
  const handleCreateFolder = () => { if (!newFolderName.trim()) return; const newFolder: Asset = { id: `folder-${Date.now()}`, title: newFolderName.trim(), type: "folder", details: "0 items", parentId: currentFolderId }; setAssets([...assets, newFolder]); setNewFolderName(""); setShowNewFolderModal(false); };
  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); if (!(e.target as HTMLElement).closest('[data-asset]')) setContextMenu({ x: e.clientX, y: e.clientY }); };
  const handleAssetRightClick = (e: React.MouseEvent, asset: Asset) => { e.preventDefault(); e.stopPropagation(); setAssetMenu({ asset, x: e.clientX, y: e.clientY }); setContextMenu(null); };
  // External file drop handlers (upload from Finder/Explorer)
  const handleDragOver = (e: React.DragEvent) => { 
    e.preventDefault(); 
    // Only show upload UI for external files, not internal asset drags
    if (!e.dataTransfer.types.includes(NINO_DRAG_TYPE) && e.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  };
  const handleDragLeave = (e: React.DragEvent) => { 
    // Check if we're leaving the container entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !gridRef.current?.contains(relatedTarget)) {
      setIsDraggingOver(false); 
    }
  };
  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    setIsDraggingOver(false); 
    // Only handle external file drops, not internal asset moves
    if (!e.dataTransfer.types.includes(NINO_DRAG_TYPE) && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files, currentFolderId); 
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) addFiles(e.target.files, currentFolderId); };
  const copyShareLink = (asset: Asset) => { 
    navigator.clipboard.writeText(`https://nino.app/share/${asset.id}`); 
    showToast("Link copied to clipboard");
  };
  
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRename = (asset: Asset) => {
    setRenameValue(asset.title);
    setRenameModal(asset);
  };

  const submitRename = () => {
    if (!renameModal || !renameValue.trim()) return;
    setAssets(assets.map(a => a.id === renameModal.id ? { ...a, title: renameValue.trim() } : a));
    setRenameModal(null);
    setRenameValue("");
    showToast("Renamed successfully");
  };

  const handleDownload = async (asset: Asset) => {
    if (asset.url) {
      showToast("Downloading...");
      try {
        // Fetch the file and create a blob for proper download
        const response = await fetch(asset.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = asset.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast("Download complete");
      } catch {
        // Fallback: open in new tab
        window.open(asset.url, '_blank');
        showToast("Opened in new tab");
      }
    } else {
      showToast("No file to download");
    }
  };

  const handleSubmitToBrand = (asset: Asset) => {
    if (asset.status === "pending") {
      showToast("Already submitted for review");
      return;
    }
    if (asset.status === "approved") {
      showToast("Already in Brand Library");
      return;
    }
    setAssets(assets.map(a => a.id === asset.id ? { ...a, status: "pending" as AssetStatus, submittedAt: new Date().toISOString() } : a));
    showToast("Submitted for brand review");
  };

  const handleDelete = (asset: Asset) => {
    setAssets(assets.filter(a => a.id !== asset.id));
    setDeleteConfirm(null);
    showToast("Deleted");
  };

  // Handle moving assets to a folder (used by drag-drop)
  const handleMoveAssets = (assetIds: string[], targetFolderId: string) => {
    setAssets(prev => prev.map(asset => 
      assetIds.includes(asset.id) 
        ? { ...asset, parentId: targetFolderId }
        : asset
    ));
    selection.clearSelection();
    showToast(`Moved ${assetIds.length} ${assetIds.length === 1 ? "item" : "items"}`);
  };

  // Handle batch delete
  const handleBatchDelete = () => {
    const selectedIds = selection.getSelectedIds();
    setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
    selection.clearSelection();
    showToast(`Deleted ${selectedIds.length} ${selectedIds.length === 1 ? "item" : "items"}`);
  };

  // Handle batch download
  const handleBatchDownload = () => {
    const selectedIds = selection.getSelectedIds();
    const selectedItems = assets.filter(a => selectedIds.includes(a.id));
    selectedItems.forEach(asset => handleDownload(asset));
    showToast(`Downloading ${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"}`);
    selection.clearSelection();
  };

  // Handle batch share
  const handleBatchShare = () => {
    const count = selection.getSelectedCount();
    navigator.clipboard.writeText(`https://nino.app/share/batch/${Date.now()}`);
    showToast(`Copied share link for ${count} ${count === 1 ? "item" : "items"}`);
  };

  // Handle batch submit to brand
  const handleBatchSubmit = () => {
    const selectedIds = selection.getSelectedIds();
    const selectedItems = assets.filter(a => selectedIds.includes(a.id));
    let submitted = 0;
    selectedItems.forEach(asset => {
      if (!asset.status || asset.status === "draft" || asset.status === "rejected") {
        handleSubmitToBrand(asset);
        submitted++;
      }
    });
    selection.clearSelection();
    if (submitted > 0) showToast(`Submitted ${submitted} ${submitted === 1 ? "item" : "items"} for review`);
  };

  const submittedAssets = assets.filter(a => a.status === "pending" || a.status === "approved" || a.status === "rejected");
  const pendingCount = assets.filter(a => a.status === "pending").length;
  const approvedCount = assets.filter(a => a.status === "approved").length;
  const rejectedCount = assets.filter(a => a.status === "rejected").length;

  const breadcrumbs = getBreadcrumbs();
  const pageInfo = isVendor ? { title: "My Uploads", subtitle: `Uploads to ${user.teamName || "Four Seasons"}` } : { title: "My Library", subtitle: breadcrumbs.length > 0 ? null : "Your personal workspace" };

  // Simple fade-in card wrapper
  const FadeInCard = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 30}ms` }}>{children}</div>
  );


  const FolderCard = ({ folder }: { folder: Asset }) => {
    const previews = getFolderPreviews(folder.id);
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    
    // Droppable folder hook - supports both internal asset drags and external file drops
    const { isDropTarget, dropProps } = useDroppableFolder(folder.id, handleMoveAssets, {
      onExternalDrop: (files, targetFolderId) => {
        addFiles(files, targetFolderId);
      }
    });

    const handleMenuClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowMenu(true);
    };

    const handleAction = (action: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setShowMenu(false);
      if (action === "rename") handleRename(folder);
      if (action === "download") handleDownload(folder);
      if (action === "share") copyShareLink(folder);
      if (action === "submit") handleSubmitToBrand(folder);
    };

    return (
      <div className="relative">
        <div 
          data-asset
          data-asset-id={folder.id}
          {...dropProps}
          onContextMenu={(e) => handleAssetRightClick(e, folder)} 
          onClick={() => !showMenu && navigateToFolder(folder.id)}
          className={cn(
            "group relative aspect-square rounded-[22px] overflow-hidden border shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out cursor-pointer bg-[#F8F8F8]",
            isDropTarget 
              ? "border-[#007AFF] border-2 scale-[1.02] shadow-[0_0_0_4px_rgba(0,122,255,0.15)]" 
              : "border-black/[0.08] hover:border-black/[0.12]"
          )}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-black/[0.06] rounded-[22px] overflow-hidden">
            {previews.length > 0 ? (
              <>
                {previews.map((asset) => (
                  <div key={asset.id} className="relative bg-[#F8F8F8] overflow-hidden">
                    <img src={asset.url} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                  </div>
                ))}
                {Array.from({ length: 4 - previews.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-[#EFEFEF]" />
                ))}
              </>
            ) : (
              <div className="col-span-2 row-span-2 bg-[#EFEFEF] flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E5E5E5] flex items-center justify-center">
                  <Folder size={24} className="text-[#B5B5B5]" />
                </div>
              </div>
            )}
          </div>

          {/* Base gradient for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

          {/* Hover enhancement overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

          {/* Folder Name */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 z-10">
            <p className="text-[14px] font-semibold text-white truncate pr-10">{folder.title}</p>
            <p className="text-[11px] text-white/60 mt-0.5">{folder.details}</p>
          </div>

          {/* 3-dot Menu Button */}
          <button
            ref={buttonRef}
            data-menu-trigger
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

          {/* Drop indicator overlay */}
          {isDropTarget && (
            <div className="absolute inset-0 bg-[#007AFF]/15 backdrop-blur-[2px] flex items-center justify-center z-30 pointer-events-none rounded-[22px]">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,122,255,0.3)] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#007AFF] flex items-center justify-center">
                  <FolderPlus size={14} className="text-white" />
                </div>
                <span className="text-[14px] font-semibold text-[#1D1D1F]">
                  Move {dragDrop.draggedIds.length > 0 ? dragDrop.draggedIds.length : ""} here
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Menu - Rendered in same container for proper layering */}
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
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -8 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -8 }} 
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-0 right-0 z-[101] w-48 bg-white rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden p-1"
                onClick={(e) => e.stopPropagation()}
              >
                {folder.status !== "approved" && folder.status !== "pending" && (
                  <>
                    <button onClick={(e) => handleAction("submit", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#007AFF] rounded-lg hover:bg-[#007AFF]/5 active:bg-[#007AFF]/10 transition-colors font-medium">
                      <Send size={15} strokeWidth={1.5} />Submit to Brand
                    </button>
                    <div className="h-px bg-black/[0.06] mx-1 my-1" />
                  </>
                )}
                <button onClick={(e) => handleAction("rename", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Edit3 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Rename
                </button>
                <button onClick={(e) => handleAction("download", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Download size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Download
                </button>
                <button onClick={(e) => handleAction("share", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                  <Share2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Share
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const AssetCard = ({ asset }: { asset: Asset }) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [wasDragged, setWasDragged] = React.useState(false);
    const isExpiringSoon =
      !!asset.expiresAt &&
      new Date(asset.expiresAt).getTime() < (DEMO_NOW_MS + 30 * 24 * 60 * 60 * 1000);
    
    // Selection state
    const isSelected = selection.isSelected(asset.id);
    const isFolder = asset.type === "folder";

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
      if (action === "submit") handleSubmitToBrand(asset);
      if (action === "delete") setDeleteConfirm(asset);
    };

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't trigger click if we just finished dragging
      if (wasDragged) {
        setWasDragged(false);
        return;
      }
      
      // If holding modifier keys, handle selection instead of opening preview
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        e.preventDefault();
        selection.handleSelect(asset.id, e, selectableAssetIds);
        return;
      }
      
      // If there are selected items, clear them but don't open preview
      if (selection.isSelecting) {
        selection.clearSelection();
        return;
      }
      
      // Open preview (only if nothing is selected and no modifiers)
      if (!isFolder) {
        setPreviewAsset(asset);
      }
    };
    
    // Drag handlers - inline to avoid hook dependency issues
    const handleDragStart = (e: React.DragEvent) => {
      if (isFolder) {
        e.preventDefault();
        return;
      }
      
      // Determine which items to drag
      const idsToMove = selection.selectedIds.has(asset.id) && selection.selectedIds.size > 0
        ? Array.from(selection.selectedIds)
        : [asset.id];

      // Set drag data
      e.dataTransfer.setData(NINO_DRAG_TYPE, JSON.stringify(idsToMove));
      e.dataTransfer.effectAllowed = "move";

      // Create custom drag preview
      const dragPreview = document.createElement("div");
      dragPreview.style.cssText = `
        position: fixed; top: -1000px; left: 0; z-index: 9999;
        display: flex; align-items: center; gap: 8px;
        padding: 10px 16px; border-radius: 16px;
        background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      `;
      dragPreview.innerHTML = `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #1D1D1F; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">${idsToMove.length}</div>
        <span style="font-size: 13px; font-weight: 600; color: #1D1D1F;">${idsToMove.length === 1 ? "Moving item" : `Moving ${idsToMove.length} items`}</span>
      `;
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 50, 22);
      setTimeout(() => {
        if (document.body.contains(dragPreview)) {
          document.body.removeChild(dragPreview);
        }
      }, 0);

      // Update context state
      dragDrop.startDrag(idsToMove);
    };
    
    const handleDragEnd = () => {
      setWasDragged(true);
      dragDrop.endDrag();
    };

    return (
      <div className="relative">
        <div 
          data-asset 
          data-asset-id={asset.id}
          draggable={!isFolder}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleCardClick}
          onContextMenu={(e) => handleAssetRightClick(e, asset)}
          className={cn(
            "group relative aspect-square rounded-[22px] overflow-hidden border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out bg-[#F8F8F8]",
            !isFolder ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
            isSelected 
              ? "border-white/80 border-2 ring-2 ring-white/60 ring-offset-2 ring-offset-transparent shadow-[0_8px_24px_rgba(0,0,0,0.15)]" 
              : "border-black/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:border-black/[0.12]",
            dragDrop.isDraggedItem(asset.id) && "opacity-40 scale-[0.98]"
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

          {/* Selection checkbox */}
          <SelectionCheckbox
            isSelected={isSelected}
            isVisible={selection.isSelecting}
            onClick={() => selection.toggle(asset.id)}
          />

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
                className="absolute bottom-0 right-0 z-[101] w-48 bg-white rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden p-1"
                onClick={(e) => e.stopPropagation()}
              >
                {asset.type !== "folder" && asset.status !== "approved" && asset.status !== "pending" && (
                  <>
                    <button onClick={(e) => handleAction("submit", e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#007AFF] rounded-lg hover:bg-[#007AFF]/5 active:bg-[#007AFF]/10 transition-colors font-medium">
                      <Send size={15} strokeWidth={1.5} />Submit to Brand
                    </button>
                    <div className="h-px bg-black/[0.06] mx-1 my-1" />
                  </>
                )}
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
    const isFolder = asset.type === "folder";
    const previews = isFolder ? getFolderPreviews(asset.id) : [];
    return (
      <div 
        data-asset 
        onContextMenu={(e) => handleAssetRightClick(e, asset)} 
        className={cn("flex items-center gap-3.5 px-4 py-3 hover:bg-[#F8F8FA] transition-colors group", isFolder && "cursor-pointer")} 
        onClick={isFolder ? () => navigateToFolder(asset.id) : undefined}
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] shrink-0">
          {isFolder ? (
            previews.length > 0 ? (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px bg-black/[0.06]">
                {previews.slice(0, 4).map((a) => (<img key={a.id} src={a.url} alt="" className="w-full h-full object-cover" />))}
                {Array.from({ length: Math.max(0, 4 - previews.length) }).map((_, i) => (<div key={`e-${i}`} className="bg-[#EFEFEF]" />))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EFEFEF]">
                <Folder size={18} className="text-[#B0B0B0]" />
              </div>
            )
          ) : asset.url ? (
            <div className="relative w-full h-full">
              <img src={asset.url} alt="" className="w-full h-full object-cover" />
              {asset.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={12} className="text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={18} className="text-[#B0B0B0]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-[#1D1D1F] truncate">{asset.title}</p>
            {asset.status && asset.status !== "draft" && <StatusBadge status={asset.status} size="sm" />}
          </div>
          <p className="text-[12px] text-[#8E8E93] mt-0.5">{asset.details}</p>
        </div>
        {asset.date && <span className="hidden md:block text-[12px] text-[#B0B0B0]">{asset.date}</span>}
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
      
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />

      {/* Back Button + Header */}
      {currentFolderId && (
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[14px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#F5F5F7] group-hover:bg-[#EBEBEB] flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Back</span>
        </button>
      )}

      <PageHeader title={currentFolder?.title || pageInfo.title} subtitle={currentFolder ? (
        <div className="flex items-center gap-1.5 text-[13px]">
          <button onClick={() => handleBreadcrumbClick(null)} className="text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">{pageInfo.title}</button>
          {breadcrumbs.map((crumb) => (<React.Fragment key={crumb.id}><ChevronRight size={12} className="text-[#C7C7C7]" /><button onClick={() => handleBreadcrumbClick(crumb.id)} className={cn("transition-colors", crumb.id === currentFolderId ? "text-[#1D1D1F] font-medium" : "text-[#8E8E93] hover:text-[#1D1D1F]")}>{crumb.title}</button></React.Fragment>))}
        </div>
      ) : pageInfo.subtitle}>
        <div className="flex gap-2">
          {submittedAssets.length > 0 && (
            <PillButton variant="outline" icon={History} onClick={() => setShowSubmissionHistory(true)}>
              Submissions {pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#E5E5E5] text-[#6E6E73] text-[10px] font-medium">{pendingCount}</span>}
            </PillButton>
          )}
          <PillButton icon={Upload} onClick={() => fileInputRef.current?.click()}>Upload</PillButton>
          {!isVendor && <PillButton icon={FolderPlus} onClick={() => setShowNewFolderModal(true)}>New Folder</PillButton>}
        </div>
      </PageHeader>

      {isVendor && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#FF9500]/5 border border-[#FF9500]/15"><p className="text-[22px] font-semibold text-[#1D1D1F]">{assets.filter(a => a.status === "pending").length}</p><p className="text-[12px] text-[#8E8E93] mt-0.5">Pending</p></div>
          <div className="p-4 rounded-2xl bg-[#34C759]/5 border border-[#34C759]/15"><p className="text-[22px] font-semibold text-[#1D1D1F]">{assets.filter(a => a.status === "approved").length}</p><p className="text-[12px] text-[#8E8E93] mt-0.5">Approved</p></div>
          <div className="p-4 rounded-2xl bg-[#FF3B30]/5 border border-[#FF3B30]/15"><p className="text-[22px] font-semibold text-[#1D1D1F]">{assets.filter(a => a.status === "rejected").length}</p><p className="text-[12px] text-[#8E8E93] mt-0.5">Rejected</p></div>
        </div>
      )}

      {/* Toolbar */}
      <div data-toolbar className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search Bar - Left */}
        <div className="w-full sm:w-96 sm:max-w-md">
          <SearchBar 
            ref={searchInputRef}
            placeholder="Search assets... (⌘K)" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            onClear={() => setSearchQuery("")} 
          />
        </div>
        
        {/* Filters, Sort & View Toggle - Right */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Asset Count */}
          <span className="text-[13px] text-[#8E8E93] hidden sm:inline">
            {sortedAssets.length} {sortedAssets.length === 1 ? "item" : "items"}
          </span>
          
          {/* Filter Toggle */}
          <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] p-1">
            {filterOptions.map((option) => (
              <button key={option.value} onClick={() => setActiveFilter(option.value)}
                className={cn("relative h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-200", activeFilter === option.value ? "bg-white dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white")}>
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <Tooltip content="Sort by" side="bottom">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={cn(
                  "flex items-center gap-1.5 h-10 px-3 rounded-full text-[13px] font-medium transition-all duration-200",
                  showSortMenu 
                    ? "bg-[#1D1D1F] text-white" 
                    : "bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white"
                )}
              >
                <ArrowUpDown size={14} />
                <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortType)?.label}</span>
                <ChevronDown size={12} className={cn("transition-transform", showSortMenu && "rotate-180")} />
              </button>
            </Tooltip>
            
            <AnimatePresence>
              {showSortMenu && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100]" 
                    onClick={() => setShowSortMenu(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-[101] w-40 bg-white dark:bg-[#2C2C2E] rounded-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden p-1"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortType(option.value); setShowSortMenu(false); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors",
                          sortType === option.value 
                            ? "bg-[#007AFF]/10 text-[#007AFF] font-medium" 
                            : "text-[#1D1D1F] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-[#3A3A3C]"
                        )}
                      >
                        {option.label}
                        {sortType === option.value && <Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] p-1">
            <Tooltip content="Grid view" side="bottom">
              <button onClick={() => setViewType("grid")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "grid" ? "bg-white dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white")}><LayoutGrid size={15} /></button>
            </Tooltip>
            <Tooltip content="List view" side="bottom">
              <button onClick={() => setViewType("list")} className={cn("h-8 w-9 rounded-full flex items-center justify-center transition-all duration-200", viewType === "list" ? "bg-white dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white")}><List size={15} /></button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Asset Grid with drop zone support for file uploads */}
      <div 
        ref={gridRef}
        onContextMenu={handleContextMenu} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleDrop}
        className={cn(
          "min-h-[300px] rounded-2xl transition-all duration-200 relative", 
          isDraggingOver && "bg-[#007AFF]/5 ring-2 ring-[#007AFF] ring-inset"
        )}
      >
        {/* Upload drop zone overlay (only for external files) */}
        <AnimatePresence>
          {isDraggingOver && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-[#007AFF]/5 backdrop-blur-[2px] rounded-2xl"
            >
              <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-[0_16px_48px_rgba(0,122,255,0.2)]">
                <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-[#007AFF]" />
                </div>
                <p className="text-[17px] font-semibold text-[#1D1D1F]">Drop to upload</p>
                <p className="text-[13px] text-[#8E8E93] mt-1">Files will be added to this folder</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {sortedAssets.length > 0 ? (
          viewType === "grid" ? (
            <div key={`${activeFilter}-${currentFolderId}`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {sortedAssets.map((asset, i) => (
                <FadeInCard key={asset.id} index={i}>
                  {asset.type === "folder" ? <FolderCard folder={asset} /> : <AssetCard asset={asset} />}
                </FadeInCard>
              ))}
            </div>
          ) : (
            <div key={`list-${activeFilter}-${currentFolderId}`} className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-[#F0F0F0] overflow-hidden">
              {sortedAssets.map((asset, i) => (
                <FadeInCard key={asset.id} index={i}>
                  <ListViewItem asset={asset} />
                </FadeInCard>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
            <div className="w-18 h-18 rounded-3xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center mb-4">
              {currentFolderId ? (
                <Folder size={32} className="text-[#C0C0C0]" />
              ) : activeFilter === "folder" ? (
                <FolderPlus size={32} className="text-[#C0C0C0]" />
              ) : activeFilter === "video" ? (
                <Play size={32} className="text-[#C0C0C0]" />
              ) : activeFilter === "image" ? (
                <ImageIcon size={32} className="text-[#C0C0C0]" />
              ) : (
                <Grid3X3 size={32} className="text-[#C0C0C0]" />
              )}
            </div>
            <p className="text-[17px] font-medium text-[#1D1D1F] dark:text-white mb-1">
              {searchQuery 
                ? "No results found" 
                : currentFolderId 
                  ? "This folder is empty" 
                  : activeFilter !== "all"
                    ? `No ${activeFilter === "folder" ? "folders" : activeFilter === "video" ? "videos" : "photos"} yet`
                    : "No assets yet"}
            </p>
            <p className="text-[14px] text-[#8E8E93]">
              {searchQuery 
                ? "Try a different search term" 
                : currentFolderId
                  ? "Upload files or create subfolders"
                  : "Upload files or create folders to get started"}
            </p>
            {!searchQuery && (
              <div className="flex gap-2 mt-4">
                <PillButton 
                  icon={Upload} 
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload files
                </PillButton>
                {!isVendor && (
                  <PillButton 
                    icon={FolderPlus} 
                    variant="outline"
                    onClick={() => setShowNewFolderModal(true)}
                  >
                    New folder
                  </PillButton>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100]" 
              onClick={() => setContextMenu(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className="fixed z-[101] w-44 bg-white rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden p-1"
            >
              <button 
                onClick={() => { fileInputRef.current?.click(); setContextMenu(null); }} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <Upload size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Upload Assets
              </button>
              <button 
                onClick={() => { setShowNewFolderModal(true); setContextMenu(null); }} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <FolderPlus size={15} strokeWidth={1.5} className="text-[#8E8E93]" />New Folder
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                onClick={() => { setShareModal(assetMenu.asset); setAssetMenu(null); }} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <Share2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Share
              </button>
              <button 
                onClick={() => { copyShareLink(assetMenu.asset); setAssetMenu(null); }} 
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors"
              >
                <Link2 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Copy Link
              </button>
              <div className="h-px bg-black/[0.06] mx-1 my-1" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                <Edit3 size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Rename
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#1D1D1F] rounded-lg hover:bg-[#F5F5F7] active:bg-[#EBEBEB] transition-colors">
                <Download size={15} strokeWidth={1.5} className="text-[#8E8E93]" />Download
              </button>
              <div className="h-px bg-black/[0.06] mx-1 my-1" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#FF3B30] rounded-lg hover:bg-[#FFF5F5] active:bg-[#FFEBEB] transition-colors">
                <Trash2 size={15} strokeWidth={1.5} />Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <AnimatePresence>
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewFolderModal(false)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><h2 className="text-[18px] font-semibold text-[#1D1D1F]">New Folder</h2><button onClick={() => setShowNewFolderModal(false)} className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"><X size={18} /></button></div>
              <div className="space-y-4">
                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()} placeholder="Folder name" autoFocus className="w-full h-12 px-4 rounded-xl bg-[#F5F5F7] border border-transparent text-[15px] placeholder:text-[#A0A0A0] outline-none focus:border-[#D0D0D0] focus:bg-[#F0F0F2] transition-all" />
                <div className="flex gap-3"><PillButton variant="outline" className="flex-1 h-11" onClick={() => setShowNewFolderModal(false)}>Cancel</PillButton><PillButton variant="primary" className="flex-1 h-11" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create</PillButton></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShareModal(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><h2 className="text-[18px] font-semibold text-[#1D1D1F]">Share "{shareModal.title}"</h2><button onClick={() => setShareModal(null)} className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]"><X size={18} /></button></div>
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#F5F5F7]"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Link2 size={15} className="text-[#6E6E73]" /><span className="text-[14px] font-medium text-[#1D1D1F]">Shareable Link</span></div><button onClick={() => copyShareLink(shareModal)} className="text-[13px] text-[#007AFF] font-medium hover:underline">Copy</button></div><p className="text-[12px] text-[#8E8E93] font-mono truncate">https://nino.app/share/{shareModal.id}</p></div>
                <div><p className="text-[14px] font-medium text-[#1D1D1F] mb-3">Link permissions</p><div className="space-y-2"><label className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.06] hover:bg-[#FAFAFA] cursor-pointer transition-colors"><input type="radio" name="permission" defaultChecked className="accent-[#007AFF]" /><div className="flex-1"><Eye size={15} className="inline mr-2 text-[#6E6E73]" /><span className="text-[14px] text-[#1D1D1F]">View only</span></div></label><label className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.06] hover:bg-[#FAFAFA] cursor-pointer transition-colors"><input type="radio" name="permission" className="accent-[#007AFF]" /><div className="flex-1"><Download size={15} className="inline mr-2 text-[#6E6E73]" /><span className="text-[14px] text-[#1D1D1F]">View & Download</span></div></label></div></div>
                <div><p className="text-[14px] font-medium text-[#1D1D1F] mb-3">Invite people</p><div className="flex gap-2"><input type="email" placeholder="Email address" className="flex-1 h-11 px-4 rounded-xl bg-[#F5F5F7] border border-transparent text-[14px] placeholder:text-[#A0A0A0] outline-none focus:border-[#D0D0D0] focus:bg-[#F0F0F2] transition-all" /><PillButton icon={UserPlus} size="md">Invite</PillButton></div></div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F5F7]"><div className="flex items-center gap-2"><Lock size={15} className="text-[#6E6E73]" /><span className="text-[14px] text-[#1D1D1F]">Require password</span></div><button className="w-11 h-[26px] rounded-full bg-[#E0E0E0] relative transition-colors hover:bg-[#D5D5D5]"><div className="w-[22px] h-[22px] rounded-full bg-white shadow-sm absolute left-0.5 top-0.5 transition-transform" /></button></div>
              </div>
            </motion.div>
          </div>
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
                  onKeyDown={(e) => e.key === "Enter" && submitRename()} 
                  placeholder="Enter new name" 
                  autoFocus 
                  className="w-full h-12 px-4 rounded-xl bg-[#F5F5F7] border border-transparent text-[15px] placeholder:text-[#A0A0A0] outline-none focus:border-[#D0D0D0] focus:bg-[#F0F0F2] transition-all" 
                />
                <div className="flex gap-3">
                  <PillButton variant="outline" className="flex-1 h-11" onClick={() => setRenameModal(null)}>Cancel</PillButton>
                  <PillButton variant="primary" className="flex-1 h-11" onClick={submitRename} disabled={!renameValue.trim()}>Save</PillButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission History Modal - Modern Minimal Design */}
      <SubmissionsModal
        open={showSubmissionHistory}
        onClose={() => setShowSubmissionHistory(false)}
        subtitle="Track assets submitted to Brand Library"
        counts={{ pending: pendingCount, approved: approvedCount, rejected: rejectedCount }}
        items={submittedAssets
          .filter((a) => a.status && a.status !== "draft")
          .map((a) => ({
            id: a.id,
            title: a.title,
            submittedAt: a.submittedAt,
            status: a.status as "pending" | "approved" | "rejected",
            type: a.type === "video" ? "video" as const : "image" as const,
            url: a.url,
            details: a.details,
            rejectionReason: a.rejectionReason,
          }))}
        emptySubtitle="Submit assets to see them here"
        onItemClick={(item) => {
          const found = submittedAssets.find((a) => a.id === item.id);
          if (!found) return;
          setPreviewAsset(found);
          setShowSubmissionHistory(false);
        }}
        onRejectedClick={(item) => {
          const found = submittedAssets.find((a) => a.id === item.id);
          if (!found) return;
          setRejectionModal(found);
          setShowSubmissionHistory(false);
        }}
      />

      {/* Rejection Feedback Modal */}
      <AnimatePresence>
        {rejectionModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setRejectionModal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-3xl border border-black/[0.06] p-6 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.2)]" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                    <MessageSquare size={16} className="text-[#FF3B30]" />
                  </div>
                  <h2 className="text-[18px] font-semibold text-[#1D1D1F]">Feedback</h2>
                </div>
                <button onClick={() => setRejectionModal(null)} className="h-8 w-8 rounded-full hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93]">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F8F8]">
                  <div className="w-10 h-10 rounded-lg bg-[#E5E5E5] overflow-hidden flex-shrink-0">
                    {rejectionModal.url ? (
                      <img src={rejectionModal.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={14} className="text-[#8E8E93]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{rejectionModal.title}</p>
                    <p className="text-[11px] text-[#8E8E93]">{rejectionModal.details}</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[12px] font-medium text-[#8E8E93] uppercase tracking-wide mb-2">Brand Team Feedback</p>
                <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FF3B30]/10">
                  <p className="text-[14px] text-[#1D1D1F] leading-relaxed">
                    {rejectionModal.rejectionReason || "No feedback provided."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <PillButton variant="outline" className="flex-1 h-11" onClick={() => setRejectionModal(null)}>Close</PillButton>
                <PillButton variant="primary" className="flex-1 h-11" icon={Upload} onClick={() => { setRejectionModal(null); fileInputRef.current?.click(); }}>Re-upload</PillButton>
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
                <PillButton variant="outline" className="flex-1 h-11" onClick={() => setDeleteConfirm(null)}>Cancel</PillButton>
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
            date: previewAsset.date || "", 
            location: previewAsset.location || "", 
            tags: previewAsset.tags || [] 
          }}
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          onDelete={() => { setPreviewAsset(null); setDeleteConfirm(previewAsset); }}
        />
      )}

      {/* Selection Toolbar */}
      <SelectionToolbar
        selectedCount={selection.getSelectedCount()}
        onMove={() => showToast("Select a folder to move items")}
        onShare={handleBatchShare}
        onSubmit={handleBatchSubmit}
        onDownload={handleBatchDownload}
        onDelete={handleBatchDelete}
        onClear={selection.clearSelection}
      />

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
