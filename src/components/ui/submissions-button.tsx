"use client";

import * as React from "react";
import { History } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { SubmissionsModal, type SubmissionItem } from "@/components/ui/submissions-modal";

export function SubmissionsButton({
  title = "My Submissions",
  subtitle,
  counts,
  items,
  emptyTitle,
  emptySubtitle,
  onItemClick,
  onRejectedClick,
  className,
}: {
  title?: string;
  subtitle?: string;
  counts: { pending: number; approved: number; rejected: number };
  items: SubmissionItem[];
  emptyTitle?: string;
  emptySubtitle?: string;
  onItemClick?: (item: SubmissionItem) => void;
  onRejectedClick?: (item: SubmissionItem) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const pendingCount = counts.pending ?? 0;

  if (items.length === 0) return null;

  return (
    <>
      <PillButton
        variant="outline"
        icon={History}
        onClick={() => setOpen(true)}
        className={className}
      >
        Submissions{" "}
        {pendingCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#E5E5E5] text-[#6E6E73] text-[10px] font-medium">
            {pendingCount}
          </span>
        )}
      </PillButton>

      <SubmissionsModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        counts={counts}
        items={items}
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
        onItemClick={onItemClick}
        onRejectedClick={onRejectedClick}
      />
    </>
  );
}


