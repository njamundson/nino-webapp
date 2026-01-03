"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  const sources = React.useMemo(
    () => ["/branding/logo.png", "/branding/logo@2x.png", "/branding/logo.svg"],
    []
  );
  const [srcIndex, setSrcIndex] = React.useState(0);
  const src = sources[srcIndex] ?? "";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {src ? (
        <img
          src={src}
          alt="Nino"
          className="w-full h-full object-contain"
          onError={() => setSrcIndex((i) => i + 1)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-[#F5F5F7] border border-[#EBEBEB] flex items-center justify-center text-[#8E8E93] text-[10px] font-semibold">
          Nino
        </div>
      )}
    </div>
  );
};
