"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

interface SelectionContextType {
  // State
  selectedIds: Set<string>;
  isSelecting: boolean;
  lastSelectedId: string | null;
  
  // Actions
  select: (id: string) => void;
  deselect: (id: string) => void;
  toggle: (id: string) => void;
  selectRange: (fromId: string, toId: string, allIds: string[]) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Multi-select with modifiers
  handleSelect: (id: string, event: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean }, allIds: string[]) => void;
  
  // Utilities
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedIds: () => string[];
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const isSelecting = selectedIds.size > 0;

  const select = useCallback((id: string) => {
    setSelectedIds(prev => new Set([...prev, id]));
    setLastSelectedId(id);
  }, []);

  const deselect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setLastSelectedId(id);
      }
      return next;
    });
  }, []);

  const selectRange = useCallback((fromId: string, toId: string, allIds: string[]) => {
    const fromIndex = allIds.indexOf(fromId);
    const toIndex = allIds.indexOf(toId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    
    const rangeIds = allIds.slice(start, end + 1);
    setSelectedIds(prev => new Set([...prev, ...rangeIds]));
    setLastSelectedId(toId);
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
    if (ids.length > 0) {
      setLastSelectedId(ids[ids.length - 1]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  const handleSelect = useCallback((
    id: string, 
    event: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean },
    allIds: string[]
  ) => {
    const { metaKey, ctrlKey, shiftKey } = event;
    
    if (shiftKey && lastSelectedId) {
      // Range selection
      selectRange(lastSelectedId, id, allIds);
    } else if (metaKey || ctrlKey) {
      // Toggle selection (add/remove from selection)
      toggle(id);
    } else {
      // Single selection (replace selection)
      if (selectedIds.has(id) && selectedIds.size === 1) {
        // If clicking the only selected item, deselect it
        clearSelection();
      } else {
        setSelectedIds(new Set([id]));
        setLastSelectedId(id);
      }
    }
  }, [lastSelectedId, selectedIds, selectRange, toggle, clearSelection]);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);
  
  const getSelectedCount = useCallback(() => selectedIds.size, [selectedIds]);
  
  const getSelectedIds = useCallback(() => Array.from(selectedIds), [selectedIds]);

  const value = useMemo(() => ({
    selectedIds,
    isSelecting,
    lastSelectedId,
    select,
    deselect,
    toggle,
    selectRange,
    selectAll,
    clearSelection,
    handleSelect,
    isSelected,
    getSelectedCount,
    getSelectedIds,
  }), [
    selectedIds,
    isSelecting,
    lastSelectedId,
    select,
    deselect,
    toggle,
    selectRange,
    selectAll,
    clearSelection,
    handleSelect,
    isSelected,
    getSelectedCount,
    getSelectedIds,
  ]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

// Optional hook that returns null if not in provider (for components that can work with or without selection)
export const useSelectionOptional = () => {
  return useContext(SelectionContext);
};

