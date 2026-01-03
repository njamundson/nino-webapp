"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, CheckCircle2, AlertCircle, Image as ImageIcon, Play, Send, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SubmissionStatus = "pending" | "approved" | "rejected";
export type SubmissionType = "image" | "video";

export interface SubmissionItem {
  id: string;
  title: string;
  submittedAt?: string;
  status?: SubmissionStatus;
  type?: SubmissionType;
  url?: string;
  details?: string;
  rejectionReason?: string;
}

interface SubmissionsModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  counts: { pending: number; approved: number; rejected: number };
  items: SubmissionItem[];
  emptyTitle?: string;
  emptySubtitle?: string;
  onItemClick?: (item: SubmissionItem) => void;
  onRejectedClick?: (item: SubmissionItem) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

// Minimal status indicator - just a subtle dot or icon
const StatusIndicator = ({ status }: { status: SubmissionStatus }) => {
  const config = {
    pending: { icon: Clock, color: "text-[#8E8E93]", bg: "bg-[#F5F5F7]" },
    approved: { icon: CheckCircle2, color: "text-[#34C759]", bg: "bg-[#34C759]/10" },
    rejected: { icon: AlertCircle, color: "text-[#FF3B30]", bg: "bg-[#FF3B30]/10" },
  };

  const { icon: Icon, color, bg } = config[status];

  return (
    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", bg)}>
      <Icon size={13} strokeWidth={2} className={color} />
    </div>
  );
};

// Status label for tooltip/detail
const getStatusLabel = (status: SubmissionStatus) => {
  switch (status) {
    case "pending": return "Pending review";
    case "approved": return "Approved";
    case "rejected": return "Needs revision";
  }
};

export function SubmissionsModal({
  open,
  onClose,
  title = "My Submissions",
  subtitle,
  counts,
  items,
  emptyTitle = "No submissions yet",
  emptySubtitle = "Submit assets to see them here",
  onItemClick,
  onRejectedClick,
}: SubmissionsModalProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | SubmissionStatus>("all");

  // Lock background scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Filter items by active tab
  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter(item => item.status === activeTab);

  const tabs = [
    { id: "all" as const, label: "All", count: items.length },
    { id: "pending" as const, label: "Pending", count: counts.pending },
    { id: "approved" as const, label: "Approved", count: counts.approved },
    { id: "rejected" as const, label: "Declined", count: counts.rejected },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md max-h-[75vh] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.2)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Clean and minimal */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-[#1D1D1F]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="h-7 w-7 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8E8] flex items-center justify-center text-[#8E8E93] transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
              {subtitle && (
                <p className="text-[13px] text-[#8E8E93] mt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Tab Filter - Minimal segmented control */}
            <div className="px-5 pb-3">
              <div className="flex gap-1 p-1 bg-[#F5F5F7] rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded-lg text-[12px] font-medium transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-white text-[#1D1D1F] shadow-sm"
                        : "text-[#8E8E93] hover:text-[#6E6E73]"
                    )}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn(
                        "ml-1.5 text-[11px]",
                        activeTab === tab.id ? "text-[#8E8E93]" : "text-[#AEAEB2]"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F0F0F0]" />

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-3">
                    <Send size={18} className="text-[#C7C7C7]" />
                  </div>
                  <p className="text-[14px] font-medium text-[#1D1D1F]">{emptyTitle}</p>
                  <p className="text-[12px] text-[#8E8E93] mt-0.5">{emptySubtitle}</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.status === "rejected" && onRejectedClick) {
                          onRejectedClick(item);
                        } else {
                          onItemClick?.(item);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3 cursor-pointer",
                        "hover:bg-[#F8F8F8] active:bg-[#F0F0F0] transition-colors"
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] border border-black/[0.04] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.url ? (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        ) : item.type === "video" ? (
                          <Play size={14} className="text-[#C7C7C7]" />
                        ) : (
                          <ImageIcon size={14} className="text-[#C7C7C7]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#1D1D1F] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#8E8E93] mt-0.5">
                          {formatDate(item.submittedAt)}
                          {item.status && (
                            <span className="ml-2 opacity-60">
                              · {getStatusLabel(item.status)}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Status Icon */}
                      {item.status && <StatusIndicator status={item.status} />}

                      {/* Arrow for rejected items (actionable) */}
                      {item.status === "rejected" && onRejectedClick && (
                        <ChevronRight size={14} className="text-[#C7C7C7]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
