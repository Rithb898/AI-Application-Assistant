"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
  }>;
  skills: string[];
}

interface ResumeStore {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;
  clearResumeData: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: null,
      setResumeData: (data) => set({ resumeData: data }),
      clearResumeData: () => set({ resumeData: null }),
    }),
    {
      name: "resume-storage",
    },
  ),
);
