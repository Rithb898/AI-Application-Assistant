"use client";

import { create } from "zustand";

export interface GeneratedContent {
  coverLetter?: string;
  linkedInMessage?: string;
  followUp?: string;
}

interface ContentStore {
  generatedContent: GeneratedContent | null;
  setGeneratedContent: (content: GeneratedContent) => void;
  clearGeneratedContent: () => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  generatedContent: null,
  setGeneratedContent: (content) => set({ generatedContent: content }),
  clearGeneratedContent: () => set({ generatedContent: null }),
}));
