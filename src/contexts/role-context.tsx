"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// Role Types
export type UserRole = "corporate" | "team" | "vendor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  teamId?: string; // For team users
  teamName?: string;
  vendorId?: string; // For vendor users
  permissions: {
    canViewAllTeams: boolean;
    canManageVendors: boolean;
    canApproveContent: boolean;
    canAccessBilling: boolean;
    canInviteUsers: boolean;
    canUpload: boolean;
  };
}

// Mock users for demo
const DEMO_USERS: Record<UserRole, UserProfile> = {
  corporate: {
    id: "corp-1",
    name: "Sarah Chen",
    email: "sarah@fourseasons.com",
    role: "corporate",
    permissions: {
      canViewAllTeams: true,
      canManageVendors: true,
      canApproveContent: true,
      canAccessBilling: true,
      canInviteUsers: true,
      canUpload: true,
    },
  },
  team: {
    id: "team-1",
    name: "Mike Johnson",
    email: "mike@fourseasons-maui.com",
    role: "team",
    teamId: "maui",
    teamName: "Four Seasons Maui",
    permissions: {
      canViewAllTeams: false,
      canManageVendors: true,
      canApproveContent: true,
      canAccessBilling: false,
      canInviteUsers: true,
      canUpload: true,
    },
  },
  vendor: {
    id: "vendor-1",
    name: "Alex Rivera",
    email: "alex@beachphotography.com",
    role: "vendor",
    teamId: "maui",
    teamName: "Four Seasons Maui",
    vendorId: "vendor-beach-photo",
    permissions: {
      canViewAllTeams: false,
      canManageVendors: false,
      canApproveContent: false,
      canAccessBilling: false,
      canInviteUsers: false,
      canUpload: true,
    },
  },
};

interface RoleContextType {
  user: UserProfile;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  can: (permission: keyof UserProfile["permissions"]) => boolean;
  isCorporate: boolean;
  isTeam: boolean;
  isVendor: boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
};

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole>("corporate");
  const user = DEMO_USERS[role];

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
  }, []);

  const can = useCallback((permission: keyof UserProfile["permissions"]) => {
    return user.permissions[permission];
  }, [user]);

  return (
    <RoleContext.Provider value={{
      user,
      role,
      switchRole,
      can,
      isCorporate: role === "corporate",
      isTeam: role === "team",
      isVendor: role === "vendor",
    }}>
      {children}
    </RoleContext.Provider>
  );
};

