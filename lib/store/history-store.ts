"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratedContent } from "./content-store";

export interface HistoryItem {
  id: string;
  timestamp: string;
  jobTitle: string;
  company: string;
  content: GeneratedContent;
}

interface HistoryStore {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 20), // Keep only the 20 most recent items
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "history-storage",
    },
  ),
);
