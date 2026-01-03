"use client";

import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FolderUp } from "lucide-react";
import { useUpload } from "@/contexts/upload-context";

interface GlobalDropZoneProps {
  children: React.ReactNode;
  currentFolderId?: string | null;
}

export const GlobalDropZone = ({ children, currentFolderId = null }: GlobalDropZoneProps) => {
  const { addFiles, isDragging, setIsDragging } = useUpload();
  const dragCounter = React.useRef(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    
    if (e.dataTransfer?.types.includes("Files")) {
      setIsDragging(true);
    }
  }, [setIsDragging]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, [setIsDragging]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      addFiles(files, currentFolderId);
    }
  }, [addFiles, currentFolderId, setIsDragging]);

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <>
      {children}
      
      {/* Full-screen drop overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-12"
            >
              <div className="w-24 h-24 rounded-3xl bg-[#F5F5F7] border-2 border-dashed border-[#1D1D1F] flex items-center justify-center">
                <Upload size={40} className="text-[#1D1D1F]" />
              </div>
              <div className="text-center">
                <p className="text-[20px] font-semibold text-[#1D1D1F] mb-1">Drop files to upload</p>
                <p className="text-[14px] text-[#8E8E93]">
                  Release to add files to your library
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-[12px] text-[#8E8E93]">
                  <Upload size={14} />
                  <span>Files</span>
                </div>
                <div className="w-px h-4 bg-[#E5E5E5]" />
                <div className="flex items-center gap-2 text-[12px] text-[#8E8E93]">
                  <FolderUp size={14} />
                  <span>Folders</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

