"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

// Simplified upload states - no AI analysis stage
export type UploadStatus = "queued" | "uploading" | "complete" | "error";

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  folderId?: string | null;
  thumbnailUrl?: string;
}

interface UploadContextType {
  files: UploadFile[];
  isUploading: boolean;
  isDragging: boolean;
  showQueue: boolean;
  setShowQueue: (show: boolean) => void;
  addFiles: (files: FileList | File[], folderId?: string | null) => void;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  clearCompleted: () => void;
  setIsDragging: (dragging: boolean) => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) throw new Error("useUpload must be used within UploadProvider");
  return context;
};

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const fileIdCounter = useRef(0);

  const isUploading = files.some(f => f.status === "uploading");

  // Simplified upload - fewer state updates
  const processFile = useCallback(async (uploadFile: UploadFile) => {
    try {
      // Start uploading
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: "uploading" as UploadStatus, progress: 0 } : f
      ));
      
      // Simulate upload with fewer progress updates (5 steps instead of 20)
      const totalTime = 800 + Math.min(uploadFile.size / 1024 / 1024, 5) * 200;
      const steps = 5;
      
      for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, totalTime / steps));
        const progress = Math.round((i / steps) * 100);
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }

      // Generate thumbnail for images
      let thumbnailUrl: string | undefined;
      if (uploadFile.file.type.startsWith("image/")) {
        thumbnailUrl = URL.createObjectURL(uploadFile.file);
      }
      
      // Complete!
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: "complete" as UploadStatus, progress: 100, thumbnailUrl } : f
      ));

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: "error" as UploadStatus, 
          error: error instanceof Error ? error.message : "Upload failed" 
        } : f
      ));
    }
  }, []);

  // Add files to queue
  const addFiles = useCallback((fileList: FileList | File[], folderId?: string | null) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const newFiles: UploadFile[] = filesArray.map(file => {
      fileIdCounter.current += 1;
      return {
        id: `upload-${fileIdCounter.current}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "queued" as UploadStatus,
        folderId: folderId ?? null,
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setShowQueue(true);

    // Process files sequentially to reduce chaos
    const processSequentially = async () => {
      for (const file of newFiles) {
        await processFile(file);
      }
    };
    processSequentially();
  }, [processFile]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const retryFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file && file.status === "error") {
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: "queued" as UploadStatus, progress: 0, error: undefined } : f
      ));
      processFile({ ...file, status: "queued", progress: 0, error: undefined });
    }
  }, [files, processFile]);

  const clearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(f => f.status !== "complete"));
  }, []);

  return (
    <UploadContext.Provider value={{
      files,
      isUploading,
      isDragging,
      showQueue,
      setShowQueue,
      addFiles,
      removeFile,
      retryFile,
      clearCompleted,
      setIsDragging,
    }}>
      {children}
    </UploadContext.Provider>
  );
};

