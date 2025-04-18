"use client";

import React from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  UploadCloud,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "motion/react"; // Corrected import path
import { AppState } from "@/hooks/useAppState"; // Assuming AppState type is exported or moved

interface ResumeUploaderProps {
  resume: File | null;
  setResume: (file: File | null) => void;
  parsedResume: string;
  setParsedResume: (data: string) => void;
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  clearResume: () => Promise<void>;
  parseResume: (file: File) => Promise<void>;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resume,
  setResume,
  parsedResume,
  // setParsedResume, // Not directly setting parsedResume here, it's set by parseResume
  appState,
  // updateState, // updateState is used within parseResume/clearResume, passed down
  clearResume,
  parseResume,
}) => {
  const isProcessing =
    appState.status === "parsing" || appState.status === "generating";
  const isResumeReady = !!parsedResume && appState.status !== "parsing";

  const {getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] } as Accept, // Ensure correct type for accept
    maxFiles: 1,
    noClick: !!parsedResume, // Don't open file dialog if parsed
    noKeyboard: !!parsedResume,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setResume(file);
        toast.dismiss(); // Dismiss any previous toasts
        toast.loading("Parsing resume...");
        await parseResume(file); // Call the parsing function passed from parent
        toast.dismiss(); // Dismiss loading toast
      }
    },
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200
          ${isProcessing ? "opacity-60 pointer-events-none" : ""}
          ${isDragActive ? "border-purple-400 bg-purple-900/20" : "border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/60"}
          ${isResumeReady ? "border-green-500/50 bg-green-900/10 hover:border-green-500/70" : ""}
          ${!parsedResume && !isProcessing ? "cursor-pointer" : "cursor-default"}
        `}
    >
      <input
        {...getInputProps()}
        disabled={isProcessing || !!parsedResume}
      />
      {isResumeReady ? (
        <div className="text-center">
          <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-3" />
          <p className="font-medium text-slate-100">
            {resume?.name || "Resume Ready"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            AI processing complete. Resume is ready.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 h-auto px-2 py-1"
            onClick={(e) => {
              e.stopPropagation(); // Prevent dropzone activation
              clearResume(); // Call clear function from parent
            }}
            disabled={isProcessing}
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Change Resume
          </Button>
        </div>
      ) : appState.status === "parsing" ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-400 mx-auto mb-3 animate-spin" />
          <p className="font-medium text-slate-200">
            Parsing Resume...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {resume?.name}
          </p>
        </div>
      ) : isDragActive ? (
        <div className="text-center pointer-events-none">
          <UploadCloud className="h-10 w-10 text-purple-400 mx-auto mb-3" />
          <p className="font-medium text-purple-300">
            Drop the PDF file here
          </p>
        </div>
      ) : (
        <div className="text-center">
          <UploadCloud className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <p className="font-medium text-slate-300">
            Drag & drop resume here
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-3">or</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={open} // useDropzone's open function
            disabled={isProcessing}
          >
            Click to Upload PDF
          </Button>
          <p className="text-xs text-slate-600 mt-3">Max 10MB</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
