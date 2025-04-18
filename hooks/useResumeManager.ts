import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { saveResumeToDB, getResumeFromDB } from "@/lib/storage";
import { AppState } from "./useAppState"; // Import AppState type

type UseResumeManagerProps = {
  updateState: (updates: Partial<AppState>) => void;
};

export function useResumeManager({ updateState }: UseResumeManagerProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<string>("");

  // Load initial resume
  useEffect(() => {
    const loadInitialResume = async () => {
      try {
        updateState({
          status: "parsing",
          progress: 10,
          stage: "Checking for saved resume...",
        });
        const storedResume = await getResumeFromDB();
        if (storedResume && Object.keys(storedResume).length > 0) {
          // Check if not empty object
          setParsedResume(JSON.stringify(storedResume));
          // Create a placeholder File object since we don't have the original file
          setResume({
            name: "Saved Resume",
            size: 0, // Placeholder size
            type: "application/pdf", // Assuming PDF, adjust if needed
            lastModified: Date.now(),
          } as File);
          updateState({ status: "idle", progress: 50, stage: "Resume ready!" });
          console.log("Saved resume loaded from MongoDB.");
        } else {
          updateState({ status: "idle", progress: 0, stage: "" });
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        toast.error("Failed to load saved resume.");
        updateState({ status: "idle", progress: 0, stage: "" });
      }
    };

    loadInitialResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Parse resume function
  const parseResume = useCallback(
    async (file: File) => {
      setResume(file); // Set the actual file object
      updateState({
        status: "parsing",
        progress: 10,
        stage: "Uploading resume...",
      });
      try {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", file);

        updateState({ progress: 20, stage: "Parsing resume with AI..." });
        const parseResponse = await fetch("/api/parse-resume", {
          method: "POST",
          body: resumeFormData,
        });

        if (!parseResponse.ok) {
          const errorData = await parseResponse
            .json()
            .catch(() => ({ message: "Resume parsing failed" }));
          throw new Error(errorData.message || "Resume parsing failed");
        }

        const parsedData = await parseResponse.json();
        const stringified = JSON.stringify(parsedData);
        setParsedResume(stringified);

        updateState({ progress: 40, stage: "Saving resume to database..." });
        await saveResumeToDB(parsedData);

        updateState({ status: "idle", progress: 50, stage: "Resume ready!" });
        toast.success("Resume parsed and saved successfully!");
      } catch (error) {
        console.error("Error parsing resume:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to parse resume: ${errorMessage}`);
        updateState({
          status: "error",
          stage: "Error parsing resume",
          error: errorMessage,
          progress: 0,
        });
        setResume(null);
        setParsedResume("");
      }
    },
    [updateState],
  );

  // Clear resume function
  const clearResume = useCallback(async () => {
    try {
      updateState({ progress: 0, stage: "Clearing resume..." });
      await saveResumeToDB({}); // Save an empty object
      setParsedResume("");
      setResume(null);
      updateState({ status: "idle", progress: 0, stage: "" });
      toast("Resume cleared. You can upload a new one.");
    } catch (error) {
      console.error("Error clearing resume:", error);
      toast.error("Failed to clear resume.");
      // Optionally reset state to idle if it was in error
      updateState({
        status: "idle",
        progress: 0,
        stage: "Error clearing resume",
      });
    }
  }, [updateState]);

  return {
    resume,
    setResume, // Still needed by ResumeUploader potentially
    parsedResume,
    setParsedResume, // Also potentially needed
    // loadInitialResume is handled by useEffect internally
    parseResume,
    clearResume,
  };
}
