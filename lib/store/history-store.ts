// This file can be removed as we're now using MongoDB exclusively
// If you need to keep it for other reasons, you can leave it empty or with minimal functionality
"use client";

import { create } from "zustand";
import { HistoryItemType } from "@/lib/types";

interface HistoryStore {
  // Keep the interface but we won't use local storage anymore
  history: HistoryItemType[];
  addToHistory: (item: HistoryItemType) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  addToHistory: () => {}, // No-op as we use MongoDB
  removeFromHistory: () => {}, // No-op as we use MongoDB
  clearHistory: () => {}, // No-op as we use MongoDB
}));

