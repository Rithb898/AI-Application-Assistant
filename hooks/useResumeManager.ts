// --- Imports ---
// React hooks
import { useState, useEffect, useCallback } from "react";
// Notification library
import toast from "react-hot-toast";
// Storage utility functions (for MongoDB interaction)
import { saveResumeToDB, getResumeFromDB } from "@/lib/storage";
// AppState type for state updates
import { AppState } from "./useAppState"; // Import AppState type

// --- Hook Props Type ---
// Defines the types for the props expected by the useResumeManager hook.
// Requires a function to update the global app state.
type UseResumeManagerProps = {
  updateState: (updates: Partial<AppState>) => void;
};

// --- useResumeManager Hook ---
// Custom hook to manage resume state, including loading, parsing, saving, and clearing.
export function useResumeManager({ updateState }: UseResumeManagerProps) {
  // --- State Variables ---
  // resume: Holds the File object of the uploaded resume (or a placeholder for saved resume).
  // parsedResume: Holds the JSON string of the parsed resume data.
  const [resume, setResume] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<string>("");

  // --- Effect: Load Initial Resume ---
  // Runs once on component mount to check for and load a previously saved resume from the database.
  // Updates the app state during loading and based on success/failure.
  // Creates a placeholder File object if a saved resume is found.
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

  // --- parseResume Function ---
  // Handles the process of parsing a newly uploaded resume file.
  // Uses useCallback for memoization, depends on updateState.
  // Sets the File object in state.
  // Updates app state to 'parsing' and tracks progress.
  // Creates FormData and sends the file to the '/api/parse-resume' endpoint.
  // Handles API response (success or error).
  // On success:
  //   - Stringifies the parsed JSON data.
  //   - Sets the parsed data in state.
  //   - Saves the parsed data to the database.
  //   - Updates app state to 'idle' and shows success toast.
  // On error:
  //   - Logs error, shows error toast.
  //   - Updates app state to 'error'.
  //   - Clears resume and parsedResume state.
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

  // --- clearResume Function ---
  // Handles clearing the current resume data from state and the database.
  // Uses useCallback for memoization, depends on updateState.
  // Updates app state.
  // Saves an empty object to the database to effectively clear it.
  // Resets resume and parsedResume state.
  // Updates app state back to 'idle' and shows a notification.
  // Handles potential errors during clearing.
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

  // --- Return Value ---
  // Exposes the resume state (File object and parsed string),
  // functions to parse a new resume and clear the current one,
  // and setters (potentially needed by child components like ResumeUploader).
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
