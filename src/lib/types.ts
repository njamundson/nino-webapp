// ============================================
// Shared Types - Single source of truth
// ============================================

export type AssetType = "folder" | "image" | "video" | "document";
export type AssetStatus = "draft" | "pending" | "approved" | "rejected";
export type FilterType = "all" | "folder" | "image" | "video";
export type ViewType = "grid" | "list";
export type SortType = "newest" | "oldest" | "a-z" | "z-a" | "size";
export type TeamFilter = "all" | "corporate" | "oahu" | "maui" | "bali" | "paris" | "whistler" | "nevis";

export interface Asset {
  id: string;
  title: string;
  type: AssetType;
  url?: string;
  details: string;
  parentId?: string | null;
  date?: string;
  approvedDate?: string;
  location?: string;
  tags?: string[];
  status?: AssetStatus;
  rejectionReason?: string;
  submittedAt?: string;
  expiresAt?: string;
  downloads?: number;
  campaign?: string;
  team?: string;
}

export interface Folder extends Asset {
  type: "folder";
  itemCount?: number;
}

export interface TeamOption {
  value: TeamFilter;
  label: string;
  assetCount: number;
  avatar?: string;
  initials: string;
}

export interface PendingUpload {
  id: string;
  fileName: string;
  type: "image" | "video";
  url: string;
  size: string;
  vendor: { name: string; company: string };
  team: string;
  teamId: string;
  uploadedAt: string;
}

// Deterministic demo timestamp to avoid hydration mismatches
export const DEMO_NOW_MS = new Date("2026-01-02T00:00:00.000Z").getTime();

// Team mapping
export const TEAM_NAMES: Record<string, string> = {
  corporate: "Four Seasons Corporate",
  oahu: "Four Seasons Oahu",
  nevis: "Four Seasons Nevis",
  nashville: "Four Seasons Nashville",
  maui: "Four Seasons Maui",
  bali: "Four Seasons Bali",
  whistler: "Four Seasons Whistler",
  paris: "Four Seasons Paris",
};

export const getTeamName = (id: string): string => TEAM_NAMES[id] || "Four Seasons Corporate";

