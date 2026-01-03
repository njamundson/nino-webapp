"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

interface DragDropContextType {
  // State
  isDragging: boolean;
  draggedIds: string[];
  dropTargetId: string | null;
  
  // Actions
  startDrag: (ids: string[]) => void;
  endDrag: () => void;
  setDropTarget: (id: string | null) => void;
  
  // Utilities
  isDraggedItem: (id: string) => boolean;
  isDropTarget: (id: string) => boolean;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedIds, setDraggedIds] = useState<string[]>([]);
  const [dropTargetId, setDropTargetIdState] = useState<string | null>(null);

  const isDragging = draggedIds.length > 0;

  const startDrag = useCallback((ids: string[]) => {
    setDraggedIds(ids);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedIds([]);
    setDropTargetIdState(null);
  }, []);

  const setDropTarget = useCallback((id: string | null) => {
    setDropTargetIdState(id);
  }, []);

  const isDraggedItem = useCallback((id: string) => draggedIds.includes(id), [draggedIds]);
  
  const isDropTarget = useCallback((id: string) => dropTargetId === id, [dropTargetId]);

  const value = useMemo(() => ({
    isDragging,
    draggedIds,
    dropTargetId,
    startDrag,
    endDrag,
    setDropTarget,
    isDraggedItem,
    isDropTarget,
  }), [
    isDragging,
    draggedIds,
    dropTargetId,
    startDrag,
    endDrag,
    setDropTarget,
    isDraggedItem,
    isDropTarget,
  ]);

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};

// Optional hook for components that can work without drag-drop
export const useDragDropOptional = () => {
  return useContext(DragDropContext);
};

// Custom MIME type for internal asset drags
export const NINO_DRAG_TYPE = "application/x-nino-assets";

/**
 * Hook to make an asset draggable
 */
export const useDraggableAsset = (
  assetId: string,
  selectedIds: Set<string>,
  options?: {
    disabled?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
  }
) => {
  const dragDrop = useDragDropOptional();
  const { disabled = false, onDragStart, onDragEnd } = options || {};

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Determine which items to drag
    const idsToMove = selectedIds.has(assetId) && selectedIds.size > 0
      ? Array.from(selectedIds)
      : [assetId];

    // Set drag data - this is critical for the drop to work
    e.dataTransfer.setData(NINO_DRAG_TYPE, JSON.stringify(idsToMove));
    e.dataTransfer.effectAllowed = "move";

    // Create custom drag preview
    const dragPreview = document.createElement("div");
    dragPreview.style.cssText = `
      position: fixed; top: -1000px; left: 0; z-index: 9999;
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; border-radius: 16px;
      background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    dragPreview.innerHTML = `
      <div style="width: 24px; height: 24px; border-radius: 50%; background: #1D1D1F; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">${idsToMove.length}</div>
      <span style="font-size: 13px; font-weight: 600; color: #1D1D1F;">${idsToMove.length === 1 ? "Moving item" : `Moving ${idsToMove.length} items`}</span>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 50, 22);
    
    // Remove the preview element after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);

    // Update context state if available
    dragDrop?.startDrag(idsToMove);
    onDragStart?.();
  }, [assetId, selectedIds, disabled, dragDrop, onDragStart]);

  const handleDragEnd = useCallback(() => {
    dragDrop?.endDrag();
    onDragEnd?.();
  }, [dragDrop, onDragEnd]);

  return {
    isDragging: dragDrop?.isDraggedItem(assetId) ?? false,
    dragProps: disabled ? {} : {
      draggable: true,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    },
  };
};

/**
 * Hook to make a folder a valid drop target for internal asset drags
 */
export const useDroppableFolder = (
  folderId: string,
  onDrop: (assetIds: string[], targetFolderId: string) => void,
  options?: {
    disabled?: boolean;
    onExternalDrop?: (files: FileList, targetFolderId: string) => void;
  }
) => {
  const dragDrop = useDragDropOptional();
  const { disabled = false, onExternalDrop } = options || {};

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    
    const hasInternalDrag = e.dataTransfer.types.includes(NINO_DRAG_TYPE);
    const hasExternalFiles = e.dataTransfer.types.includes("Files");
    
    // Accept internal asset drags or external file drags
    if (hasInternalDrag || hasExternalFiles) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = hasInternalDrag ? "move" : "copy";
      dragDrop?.setDropTarget(folderId);
    }
  }, [folderId, disabled, dragDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Only clear if we're actually leaving the folder element
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest(`[data-folder-id="${folderId}"]`)) {
      dragDrop?.setDropTarget(null);
    }
  }, [folderId, disabled, dragDrop]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Handle internal asset drag
    const data = e.dataTransfer.getData(NINO_DRAG_TYPE);
    if (data) {
      try {
        const assetIds: string[] = JSON.parse(data);
        if (assetIds && assetIds.length > 0) {
          onDrop(assetIds, folderId);
        }
      } catch (err) {
        console.error("Drop error:", err);
      }
    } 
    // Handle external file drop
    else if (e.dataTransfer.files.length > 0 && onExternalDrop) {
      onExternalDrop(e.dataTransfer.files, folderId);
    }

    dragDrop?.endDrag();
  }, [folderId, disabled, dragDrop, onDrop, onExternalDrop]);

  return {
    isDropTarget: dragDrop?.isDropTarget(folderId) ?? false,
    dropProps: disabled ? {} : {
      "data-folder-id": folderId,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
};

