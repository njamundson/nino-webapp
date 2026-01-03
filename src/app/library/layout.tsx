"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SideNav } from "@/components/ui/side-nav";
import { PageTransition } from "@/components/ui/page-transition";
import { UploadProvider } from "@/contexts/upload-context";
import { RoleProvider, useRole } from "@/contexts/role-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { SelectionProvider } from "@/contexts/selection-context";
import { DragDropProvider } from "@/contexts/drag-drop-context";
import { UploadQueue } from "@/components/ui/upload-queue";
import { GlobalDropZone } from "@/components/ui/global-drop-zone";
// Role switcher is now integrated in sidebar
import { 
  Layout,
  User,
  Upload,
  Users,
  ClipboardCheck,
  Building2,
  FolderOpen,
  PenLine,
  Film,
  Palette
} from "lucide-react";

// Inner layout that has access to role context
function LibraryLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, isCorporate, isTeam, isVendor, can } = useRole();
  const activeTeam = searchParams.get("team") || (isTeam ? user.teamId : "corporate");

  const handleTeamClick = (teamId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("team", teamId);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { 
        icon: User, 
        label: "My Library", 
        href: "/library/my", 
        active: pathname === "/library/my" || pathname.startsWith("/library/my/")
      },
    ];

    if (isCorporate || isTeam) {
      baseItems.push({ 
        icon: Layout, 
        label: "Brand Library", 
        href: "/library/brand", 
        active: pathname === "/library/brand"
      });
    }

    baseItems.push({ 
      icon: Upload, 
      label: "Upload", 
      href: "/library/create", 
      active: pathname === "/library/create"
    });

    if (can("canManageVendors")) {
      baseItems.push({ 
        icon: Users, 
        label: "Vendors", 
        href: "/library/vendors", 
        active: pathname === "/library/vendors"
      });
    }

    if (can("canApproveContent")) {
      baseItems.push({ 
        icon: ClipboardCheck, 
        label: "Review", 
        href: "/library/review", 
        active: pathname === "/library/review"
      });
    }

    return baseItems;
  };
  
  // Create section items with proper active state
  const getCreateItems = () => [
    { 
      icon: PenLine, 
      label: "Create Image", 
      href: "/library/create/image", 
      active: pathname === "/library/create/image"
    },
    { 
      icon: Film, 
      label: "Image to Video", 
      href: "/library/create/video", 
      active: pathname === "/library/create/video"
    },
    { 
      icon: Palette, 
      label: "Edit Image", 
      href: "/library/create/edit", 
      active: pathname === "/library/create/edit"
    },
  ];

  // Teams based on role
  const getTeams = () => {
    if (isCorporate) {
      return [
        { id: "corporate", label: "Corporate" },
        { id: "oahu", label: "Four Seasons Oahu" },
        { id: "nevis", label: "Four Seasons Nevis" },
        { id: "nashville", label: "Four Seasons Nashville" },
        { id: "maui", label: "Four Seasons Maui" },
        { id: "bali", label: "Four Seasons Bali" },
        { id: "whistler", label: "Four Seasons Whistler" },
        { id: "paris", label: "Four Seasons Paris" },
      ];
    }
    
    if (isTeam) {
      return [
        { id: user.teamId || "maui", label: user.teamName || "Four Seasons Maui" },
      ];
    }

    // Vendors don't see teams
    return [];
  };

  const navItems = getNavItems();
  const createItems = getCreateItems();
  const teams = getTeams();

  return (
    <GlobalDropZone>
      <div className="min-h-screen bg-white dark:bg-black font-sans antialiased">
        <SideNav 
          items={navItems} 
          createItems={createItems}
          teams={teams.map(team => ({ ...team, active: activeTeam === team.id }))}
          onTeamClick={handleTeamClick}
          bottomLabel="Settings"
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          }}
          showRoleSwitcher={true}
        />
        
        <main className="lg:ml-[270px] p-6 pt-20 lg:pt-8 lg:p-10 min-h-screen">
          <PageTransition key={pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
      <UploadQueue />
    </GlobalDropZone>
  );
}

// Outer layout with providers
export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        <UploadProvider>
          <SelectionProvider>
            <DragDropProvider>
              <React.Suspense fallback={
                <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                  <div className="animate-pulse text-[#8E8E93]">Loading...</div>
                </div>
              }>
                <LibraryLayoutInner>{children}</LibraryLayoutInner>
              </React.Suspense>
            </DragDropProvider>
          </SelectionProvider>
        </UploadProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
