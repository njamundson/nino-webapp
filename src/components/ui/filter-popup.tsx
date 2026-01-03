"use client";

import * as React from "react";
import { SlidersHorizontal, MapPin, Grid, Camera, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";

export const FilterPopup = () => {
  const [assetType, setAssetType] = React.useState("All");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(["Approved"]);

  const toggleCategory = (label: string) => {
    setSelectedCategories(prev => 
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 px-5 rounded-full gap-2 text-sm font-medium border-[#EBEBEB] bg-white hover:bg-[#F5F5F7]">
          <SlidersHorizontal size={16} /> Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] rounded-[32px] p-8 bg-white border-[#EBEBEB] shadow-[0_32px_64px_rgba(0,0,0,0.08)]">
        <DialogHeader className="mb-10">
          <DialogTitle className="text-2xl font-medium tracking-tight text-center">Library Filters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-12">
          {/* Asset Type */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] text-center">Asset Type</h3>
            <div className="flex justify-center">
              <SegmentedControl 
                options={[
                  { value: "All", label: "All" },
                  { value: "Images", label: "Images" },
                  { value: "Videos", label: "Videos" }
                ]} 
                value={assetType} 
                onChange={setAssetType} 
                className="w-full max-w-[320px] bg-[#F5F5F7] p-1"
              />
            </div>
          </div>

          {/* Smart Categories */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] text-center">Smart Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: "Maui" },
                { icon: Camera, label: "Drone" },
                { icon: Grid, label: "Pool" },
                { icon: CheckCircle2, label: "Approved" },
              ].map((filter, i) => {
                const isActive = selectedCategories.includes(filter.label);
                return (
                  <button 
                    key={i}
                    onClick={() => toggleCategory(filter.label)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 group",
                      isActive 
                        ? "bg-[#1D1D1F] border-[#1D1D1F] text-white shadow-md" 
                        : "bg-white border-[#EBEBEB] text-[#1D1D1F] hover:bg-[#F5F5F7]"
                    )}
                  >
                    <filter.icon size={16} className={cn("transition-colors", isActive ? "text-white" : "text-[#8E8E93] group-hover:text-[#1D1D1F]")} />
                    <span className="font-medium text-[13px]">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1 h-12 rounded-full text-[13px] font-semibold bg-[#F5F5F7] hover:bg-[#EBEBEB] text-[#1D1D1F] border-none"
              onClick={() => setSelectedCategories([])}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 h-12 rounded-full text-[13px] font-semibold shadow-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
