// ============================================
// Mock Data Service - Single source for demo data
// ============================================

import { Asset, AssetType, AssetStatus, TeamOption, PendingUpload, DEMO_NOW_MS } from "./types";

// Shared Unsplash image IDs for consistent thumbnails
export const UNSPLASH_IMAGES = [
  "photo-1506744038136-46273834b3fb",
  "photo-1571896349842-33c89424de2d",
  "photo-1501785888041-af3ef285b470",
  "photo-1518837695005-2083093ee35b",
  "photo-1470770841072-f978cf4d019e",
  "photo-1540541338287-41700207dee6",
  "photo-1566073771259-6a8506099945",
  "photo-1582719508461-905c673771fd",
  "photo-1618773928121-c32242e63f39",
  "photo-1507525428034-b723cf961d3e",
  "photo-1520250497591-112f2f40a3f4",
  "photo-1551882547-ff40c63fe5fa",
  "photo-1571003123894-1f0594d2b5d9",
  "photo-1542314831-068cd1dbfeeb",
  "photo-1564501049412-61c2a3083791",
  "photo-1455587734955-081b22074882",
  "photo-1496417263034-38ec4f0b665a",
  "photo-1584132967334-10e028bd69f7",
  "photo-1578683010236-d716f9a3f461",
  "photo-1582610116397-edb318620f90",
  "photo-1445019980597-93fa8acb246c",
  "photo-1590490360182-c33d57733427",
  "photo-1611892440504-42a792e24d32",
  "photo-1568495248636-6432b97bd949",
  "photo-1600596542815-ffad4c1539a9",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600573472592-401b489a3cdc",
  "photo-1602002418816-5c0aeef426aa",
  "photo-1517840901100-8179e982acb7",
  "photo-1551016275-11e0f38b9a3c",
  "photo-1549294413-26f195200c16",
  "photo-1530541930197-ff16ac917b0e",
  "photo-1519046904884-53103b34b206",
  "photo-1505142468610-359e7d316be0",
  "photo-1473116763249-2faaef81ccda",
  "photo-1502680390469-be75c86b636f",
  "photo-1520483601560-389dff434fdf",
];

// Asset name templates
export const ASSET_NAMES = [
  "Beach_Sunset", "Pool_Aerial", "Lobby_Interior", "Suite_Hero", "Spa_Entrance",
  "Ocean_View", "Mountain_Vista", "Garden_Path", "Restaurant_Evening", "Bar_Atmosphere",
  "Cabana_Setup", "Balcony_View", "Infinity_Pool", "Private_Beach", "Rooftop_Sunset",
  "Jungle_Villa", "Overwater_Suite", "Tennis_Courts", "Golf_Course", "Kids_Area",
  "Wine_Cellar", "Kitchen_Tour", "Penthouse", "Master_Bath", "Outdoor_Shower",
];

// Brand library friendly titles
export const ASSET_TITLES = [
  "Infinity Pool Sunset", "Ocean View Suite", "Beach Cabana Morning", "Spa Entrance", "Lobby Grand View",
  "Mountain Panorama", "Sunset Drone Shot", "Pool Aerial View", "Garden Pathway", "Restaurant Interior",
  "Beach Lounge Setup", "Suite Balcony View", "Wellness Center", "Private Beach", "Rooftop Bar",
  "Jungle Villa", "Overwater Bungalow", "Tennis Courts", "Golf Course Vista", "Kids Club Area",
  "Wine Cellar Tour", "Chef's Kitchen", "Penthouse Suite", "Master Bathroom", "Outdoor Shower",
  "Beachfront Dining", "Sunset Cocktails", "Morning Yoga", "Couples Massage", "Afternoon Tea",
  "Pool Service", "Beach Butler", "Private Dining", "Helicopter View", "Yacht Charter",
  "Snorkeling Trip", "Scuba Diving", "Jet Ski Fun", "Paddleboard", "Kayak Sunset",
];

// Standard file sizes
export const FILE_SIZES = [8, 12, 15, 18, 22, 24, 28, 32, 36, 42];
export const VIDEO_SIZES = [89, 120, 156, 175, 180, 210, 245, 280, 320, 380];
export const DOWNLOAD_COUNTS = [45, 47, 78, 89, 92, 124, 134, 156, 167, 203];

// Teams
export const TEAMS = ["corporate", "oahu", "maui", "bali", "paris", "whistler", "nevis"];

// Team dropdown options
export const TEAM_OPTIONS: TeamOption[] = [
  { value: "all", label: "All Teams", assetCount: 0, initials: "FS" },
  { value: "corporate", label: "Corporate", assetCount: 156, initials: "CO" },
  { value: "oahu", label: "Oahu", assetCount: 89, initials: "OA" },
  { value: "maui", label: "Maui", assetCount: 124, initials: "MA" },
  { value: "bali", label: "Bali", assetCount: 67, initials: "BA" },
  { value: "paris", label: "Paris", assetCount: 93, initials: "PA" },
  { value: "whistler", label: "Whistler", assetCount: 45, initials: "WH" },
  { value: "nevis", label: "Nevis", assetCount: 38, initials: "NE" },
];

// Helper to build Unsplash URL
export const getUnsplashUrl = (id: string, width = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${width}`;

// Generate consistent date string
export const getDemoDate = (daysAgo: number): string => {
  const date = new Date(DEMO_NOW_MS - daysAgo * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

// Generate ISO date string
export const getDemoISODate = (daysAgo: number): string => {
  const date = new Date(DEMO_NOW_MS - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split("T")[0];
};

// Default folders for My Library
export const DEFAULT_FOLDERS: Asset[] = [
  { id: "folder-maui", title: "Maui Summer Shoot", details: "18 items", type: "folder", parentId: null, campaign: "Summer 2026" },
  { id: "folder-oahu", title: "Oahu Beach Campaign", details: "24 items", type: "folder", parentId: null },
  { id: "folder-brand", title: "Brand Guidelines", details: "12 items", type: "folder", parentId: null },
  { id: "folder-drone", title: "Drone Footage", details: "8 items", type: "folder", parentId: null },
  { id: "folder-spa", title: "Spa & Wellness", details: "16 items", type: "folder", parentId: null },
  { id: "folder-food", title: "Culinary Content", details: "22 items", type: "folder", parentId: null },
];

// Generate My Library assets
export function generateMyLibraryAssets(isVendor: boolean): Asset[] {
  const statuses: (AssetStatus | undefined)[] = [undefined, "pending", "approved", "rejected", "approved", undefined, "pending", "approved"];
  const vendorStatuses: AssetStatus[] = ["pending", "approved", "approved", "rejected", "pending", "approved"];
  
  if (isVendor) {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `vendor-${i}`,
      title: `${ASSET_NAMES[i % ASSET_NAMES.length]}${i % 4 === 0 ? ".mp4" : ".jpg"}`,
      type: i % 4 === 0 ? "video" as AssetType : "image" as AssetType,
      url: getUnsplashUrl(UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]),
      details: i % 4 === 0 ? `4K MP4 • ${VIDEO_SIZES[i % VIDEO_SIZES.length]}MB` : `4K JPG • ${FILE_SIZES[i % FILE_SIZES.length]}MB`,
      parentId: null,
      date: getDemoDate(i % 20),
      status: vendorStatuses[i % vendorStatuses.length],
      submittedAt: getDemoISODate(i % 20),
      downloads: vendorStatuses[i % vendorStatuses.length] === "approved" ? DOWNLOAD_COUNTS[i % DOWNLOAD_COUNTS.length] : undefined,
      rejectionReason: vendorStatuses[i % vendorStatuses.length] === "rejected" ? "Please re-export with higher resolution." : undefined,
      campaign: i % 3 === 0 ? "Summer 2026" : undefined,
    }));
  }

  return [
    ...DEFAULT_FOLDERS,
    // Root assets
    ...Array.from({ length: 36 }, (_, i) => ({
      id: `asset-${i}`,
      title: `${ASSET_NAMES[i % ASSET_NAMES.length]}${i % 5 === 0 ? ".mp4" : ".jpg"}`,
      type: i % 5 === 0 ? "video" as AssetType : "image" as AssetType,
      url: getUnsplashUrl(UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]),
      details: i % 5 === 0 ? `4K MP4 • ${VIDEO_SIZES[i % VIDEO_SIZES.length]}MB` : `4K JPG • ${FILE_SIZES[i % FILE_SIZES.length]}MB`,
      parentId: null,
      date: getDemoDate(i % 20),
      location: "Four Seasons Oahu",
      tags: ["Resort", "Luxury"],
      status: statuses[i % statuses.length],
      submittedAt: statuses[i % statuses.length] ? getDemoISODate(i % 20) : undefined,
      downloads: statuses[i % statuses.length] === "approved" ? DOWNLOAD_COUNTS[i % DOWNLOAD_COUNTS.length] : undefined,
      rejectionReason: statuses[i % statuses.length] === "rejected" ? "Image needs color correction." : undefined,
      campaign: i % 4 === 0 ? "Summer 2026" : undefined,
      expiresAt: i % 7 === 0 ? "2026-02-15" : undefined,
    })),
    // Folder contents
    ...DEFAULT_FOLDERS.flatMap((folder, fi) =>
      Array.from({ length: 6 }, (_, i) => ({
        id: `folder-asset-${folder.id}-${i}`,
        title: `${folder.title.split(" ")[0]}_${ASSET_NAMES[(fi * 6 + i) % ASSET_NAMES.length]}${i % 4 === 0 ? ".mp4" : ".jpg"}`,
        type: i % 4 === 0 ? "video" as AssetType : "image" as AssetType,
        url: getUnsplashUrl(UNSPLASH_IMAGES[(fi * 6 + i + 5) % UNSPLASH_IMAGES.length]),
        details: i % 4 === 0 ? `4K MP4 • ${VIDEO_SIZES[(fi + i) % VIDEO_SIZES.length]}MB` : `4K JPG • ${FILE_SIZES[(fi + i) % FILE_SIZES.length]}MB`,
        parentId: folder.id,
        campaign: folder.campaign,
      }))
    ),
  ];
}

// Generate Brand Library assets
export function generateBrandLibraryAssets(): Asset[] {
  const daysAgo = [0, 1, 2, 3, 5, 7, 10, 14, 21, 28, 35, 42, 4, 6, 8, 12, 16, 20, 25, 30];
  
  return Array.from({ length: 60 }, (_, i) => ({
    id: `asset-${i}`,
    url: getUnsplashUrl(UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]),
    title: ASSET_TITLES[i % ASSET_TITLES.length],
    type: i % 5 === 0 ? "video" as AssetType : "image" as AssetType,
    details: i % 5 === 0 ? `4K MP4 • ${VIDEO_SIZES[i % VIDEO_SIZES.length]}MB` : `4K JPG • ${FILE_SIZES[i % FILE_SIZES.length]}MB`,
    approvedDate: getDemoISODate(daysAgo[i % daysAgo.length] + i), // Unique per asset
    date: getDemoDate(daysAgo[i % daysAgo.length]),
    location: "Four Seasons",
    tags: ["Resort", "Luxury", "Premium"],
    team: TEAMS[i % TEAMS.length],
    parentId: null,
    status: "approved" as AssetStatus,
  }));
}

// Mock submissions data
export function generateMockSubmissions(): Asset[] {
  return [
    { id: "sub-1", title: "Beach_Sunset_Final.jpg", type: "image", details: "4K JPG • 18MB", status: "pending", submittedAt: "2025-12-30", team: "oahu" },
    { id: "sub-2", title: "Pool_Drone_Shot.mp4", type: "video", details: "4K MP4 • 245MB", status: "approved", submittedAt: "2025-12-28", team: "maui" },
    { id: "sub-3", title: "Lobby_Interior.jpg", type: "image", details: "4K JPG • 15MB", status: "approved", submittedAt: "2025-12-27", team: "paris" },
    { id: "sub-4", title: "Suite_Hero_v2.jpg", type: "image", details: "4K JPG • 22MB", status: "rejected", submittedAt: "2025-12-26", rejectionReason: "Image is slightly out of focus.", team: "bali" },
    { id: "sub-5", title: "Spa_Entrance.jpg", type: "image", details: "4K JPG • 12MB", status: "pending", submittedAt: "2025-12-25", team: "whistler" },
    { id: "sub-6", title: "Restaurant_Evening.mp4", type: "video", details: "4K MP4 • 180MB", status: "approved", submittedAt: "2025-12-24", team: "nevis" },
  ];
}

// Review queue pending uploads
export function generatePendingUploads(): PendingUpload[] {
  return [
    { id: "p1", fileName: "Beach_Sunset_4K.mp4", type: "video", url: getUnsplashUrl("photo-1507525428034-b723cf961d3e"), size: "245MB", vendor: { name: "Alex Rivera", company: "Beach Photography Co." }, team: "Four Seasons Maui", teamId: "maui", uploadedAt: "2 hours ago" },
    { id: "p2", fileName: "Pool_Aerial_01.jpg", type: "image", url: getUnsplashUrl("photo-1571896349842-33c89424de2d"), size: "24MB", vendor: { name: "Sarah Kim", company: "Drone Visuals" }, team: "Four Seasons Maui", teamId: "maui", uploadedAt: "4 hours ago" },
    { id: "p3", fileName: "Suite_Tour_Final.mp4", type: "video", url: getUnsplashUrl("photo-1618773928121-c32242e63f39"), size: "1.2GB", vendor: { name: "Marcus Chen", company: "Luxury Creative Agency" }, team: "Four Seasons Oahu", teamId: "oahu", uploadedAt: "1 day ago" },
    { id: "p4", fileName: "Lobby_Evening.jpg", type: "image", url: getUnsplashUrl("photo-1566073771259-6a8506099945"), size: "18MB", vendor: { name: "Marcus Chen", company: "Luxury Creative Agency" }, team: "Four Seasons Oahu", teamId: "oahu", uploadedAt: "1 day ago" },
    { id: "p5", fileName: "Spa_Interior.jpg", type: "image", url: getUnsplashUrl("photo-1582719508461-905c673771fd"), size: "32MB", vendor: { name: "James Park", company: "Resort Media Group" }, team: "Corporate", teamId: "corporate", uploadedAt: "3 hours ago" },
  ];
}

