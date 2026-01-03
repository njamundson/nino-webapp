"use client";

import { Skeleton, VendorCardSkeleton } from "@/components/ui/skeleton";

export default function VendorsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex items-end justify-between border-b border-[#E5E5E5] pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Skeleton className="h-11 w-64 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Vendor list skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

