"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LucideIcon, ChevronDown, Menu, X, PenLine, Film, Palette, Building2, Hotel, Camera } from "lucide-react";
import { useRole, UserRole } from "@/contexts/role-context";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

interface Team {
  label: string;
  id: string;
  active?: boolean;
}

interface CreateItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

interface SideNavProps {
  items: NavItem[];
  teams?: Team[];
  createItems?: CreateItem[];
  className?: string;
  bottomLabel?: string;
  onTeamClick?: (teamId: string) => void;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  showRoleSwitcher?: boolean; // Set to true only when inside RoleProvider
}

// Default create items for AI tools
const defaultCreateItems: CreateItem[] = [
  { icon: PenLine, label: "Create Image", href: "/library/create/image", active: false },
  { icon: Film, label: "Image to Video", href: "/library/create/video", active: false },
  { icon: Palette, label: "Edit Image", href: "/library/create/edit", active: false },
];

// Role options for demo switcher
const roleOptions: { value: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "corporate", label: "Corporate", icon: Building2, desc: "Full access" },
  { value: "team", label: "Team Admin", icon: Hotel, desc: "Maui" },
  { value: "vendor", label: "Vendor", icon: Camera, desc: "Photography" },
];

// Inline Role Switcher Component
const RoleSwitcherInline = () => {
  const { role, switchRole } = useRole();
  const [isOpen, setIsOpen] = React.useState(false);
  const current = roleOptions.find(r => r.value === role)!;
  const Icon = current.icon;

  return (
    <div className="mt-4 pt-3 border-t border-[#EBEBEB]">
      <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">
        Demo Mode
      </p>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-[#1D1D1F] hover:bg-[#2C2C2E] transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-white">{current.label}</p>
          <p className="text-[9px] text-white/50">{current.desc}</p>
        </div>
        <ChevronDown 
          size={12} 
          className={cn("text-white/50 transition-transform", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5">
              {roleOptions.map((r) => {
                const RoleIcon = r.icon;
                const isActive = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => {
                      switchRole(r.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left",
                      isActive ? "bg-[#F5F5F7]" : "hover:bg-black/[0.03]"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center",
                      isActive ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#8E8E93]"
                    )}>
                      <RoleIcon size={12} />
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium",
                      isActive ? "text-[#1D1D1F]" : "text-[#6E6E73]"
                    )}>
                      {r.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SideNav = ({ 
  items, 
  teams = [], 
  createItems = defaultCreateItems,
  className, 
  bottomLabel, 
  onTeamClick,
  user = { name: "Noah Amundson", email: "noah@fourseasons.com" },
  showRoleSwitcher = false
}: SideNavProps) => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(true);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const mobileNavRef = React.useRef<HTMLDivElement>(null);

  // Get initials from name
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  // Close mobile nav on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);

  // Lock body scroll when mobile nav is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Focus trap for mobile nav
  React.useEffect(() => {
    if (isMobileOpen && mobileNavRef.current) {
      const firstFocusable = mobileNavRef.current.querySelector<HTMLElement>('a, button');
      firstFocusable?.focus();
    }
  }, [isMobileOpen]);

  const createActiveKey = React.useMemo(
    () => createItems.map((i) => (i.active ? "1" : "0")).join("|"),
    [createItems]
  );

  // Auto-open Create section when a create page is active
  React.useEffect(() => {
    if (createItems.some((i) => i.active)) setIsCreateOpen(true);
  }, [createActiveKey, createItems]);

  const NavContent = () => (
    <>
      {/* User Profile Header - Condensed */}
      <div className="mb-4 px-2 py-1.5 flex items-center gap-2">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt=""
            aria-hidden="true"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-[10px] font-semibold text-white">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{user.name}</p>
          <p className="text-[11px] text-[#8E8E93] truncate">Workspace</p>
        </div>
      </div>

      <LayoutGroup>
        {/* Nav Items - with buttery smooth sliding selector */}
        <nav aria-label="Main navigation">
          <ul className="space-y-0.5 relative" role="list">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.href} className="relative">
                  {/* Sliding selector - Apple-level smoothness */}
                  {item.active && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute inset-0 bg-white border border-[#E5E5E5] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)] rounded-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 1,
                      }}
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 z-10",
                      !item.active && "hover:bg-black/[0.03] transition-colors duration-150"
                    )}
                  >
                    <Icon 
                      size={17} 
                      strokeWidth={1.5} 
                      aria-hidden="true"
                      className={cn(
                        "shrink-0",
                        item.active ? "text-[#1D1D1F]" : "text-[#8E8E93]"
                      )} 
                    />
                    <span 
                      className={cn(
                        "text-[13px] font-medium",
                        item.active ? "text-[#1D1D1F]" : "text-[#6E6E73]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Create Section */}
        <div className="mt-4">
        <button 
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          aria-expanded={isCreateOpen}
          aria-controls="create-menu"
          className="px-2.5 py-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#8E8E93] hover:text-[#6E6E73] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 rounded"
        >
          <span>Create</span>
          <ChevronDown 
            size={11} 
            aria-hidden="true"
            className={cn("transition-transform duration-200", !isCreateOpen && "-rotate-90")} 
          />
        </button>
        
        <AnimatePresence initial={false}>
          {isCreateOpen && (
            <motion.ul
              id="create-menu"
              role="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="space-y-0.5 overflow-hidden mt-1 relative"
            >
              {createItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    {item.active && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute inset-0 bg-white border border-[#E5E5E5] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)] rounded-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                          mass: 1,
                        }}
                      />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      aria-current={item.active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 z-10",
                        !item.active && "hover:bg-black/[0.03] transition-colors duration-150"
                      )}
                    >
                      <Icon 
                        size={17} 
                        strokeWidth={1.5} 
                        aria-hidden="true"
                        className={cn(
                          "shrink-0",
                          item.active ? "text-[#1D1D1F]" : "text-[#8E8E93]"
                        )} 
                      />
                      <span 
                        className={cn(
                          "text-[13px] font-medium",
                          item.active ? "text-[#1D1D1F]" : "text-[#6E6E73]"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* Role Switcher (Demo) - Only shown when inside RoleProvider */}
      {showRoleSwitcher && <RoleSwitcherInline />}

      {/* Settings */}
      <div className="mt-auto pt-2 border-t border-[#EBEBEB]">
        <Link 
          href="/library/settings"
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center gap-2 px-2 py-1.5 text-[#1D1D1F] hover:bg-black/[0.03] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2"
        >
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt=""
              aria-hidden="true"
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <div 
              className="w-7 h-7 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="text-[9px] font-semibold text-[#8E8E93]">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-medium text-[#1D1D1F] truncate">Settings</p>
            <p className="text-[10px] text-[#8E8E93] truncate">{user.email}</p>
          </div>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-nav"
        className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 rounded-xl bg-white/90 backdrop-blur-xl border border-black/[0.08] flex items-center justify-center text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-nav"
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] flex flex-col bg-[#FAFAFA] border-r border-[#E5E5E5] p-4 z-50 lg:hidden safe-area-inset"
          >
            {/* Close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/[0.05] flex items-center justify-center text-[#8E8E93] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        aria-label="Main sidebar"
        className={cn(
          "fixed left-3 top-3 bottom-3 w-[250px] hidden lg:flex flex-col bg-[#FAFAFA] border border-[#E5E5E5] p-3 z-40 rounded-2xl",
          className
        )}
      >
        <NavContent />
      </aside>
    </>
  );
};

export { SideNav };
