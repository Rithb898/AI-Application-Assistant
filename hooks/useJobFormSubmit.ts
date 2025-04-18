// --- Imports ---
// React/Next.js hooks
import { useCallback } from "react";
import { useRouter } from "next/navigation";
// Notification library
import toast from "react-hot-toast";
// Validation library
import * as z from "zod";
// Utility functions and types
import { saveResponseToHistory } from "@/lib/storage";
import { generateRandomId } from "@/lib/utils";
// AppState type for state updates
import { AppState } from "./useAppState"; // Import AppState type

// --- Form Schema Definition ---
// Defines the expected structure of the form data using Zod.
// Kept separate from JobForm's schema for decoupling, though structure matches.
// Define the expected shape of form values based on JobForm's schema
// We could import the schema itself, but defining it here keeps the hook decoupled
const formSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  techStack: z.string(),
  description: z.string(),
  companyDetails: z.string().optional(),
});
// --- Form Values Type ---
// Infers the TypeScript type from the Zod schema.
type FormValues = z.infer<typeof formSchema>;

// --- Hook Props Type ---
// Defines the types for the props expected by the useJobFormSubmit hook.
// Requires a function to update the global app state and the parsed resume text.
type UseJobFormSubmitProps = {
  updateState: (updates: Partial<AppState>) => void;
  parsedResume: string; // Pass the parsed resume string
};

// --- useJobFormSubmit Hook ---
// Custom hook encapsulating the logic for handling the job form submission.
export function useJobFormSubmit({
  updateState,
  parsedResume,
}: UseJobFormSubmitProps) {
  // --- Hook Initialization ---
  // Get the Next.js router instance.
  const router = useRouter();

  // --- handleSubmit Function ---
  // The core function triggered when the form is submitted.
  // Uses useCallback for memoization, depends on parsedResume, updateState, and router.
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      // --- Pre-submission Check ---
      // Ensures the resume has been parsed before proceeding.
      if (!parsedResume) {
        toast.error("Please upload and parse your resume first.");
        // No need to update state here, the button should be disabled anyway
        return;
      }

      // --- Update State: Generating Start ---
      // Sets the app status to 'generating' and updates progress/stage.
      updateState({
        status: "generating",
        progress: 60,
        stage: "Preparing data...",
      });

      // --- API Call Logic (try block) ---
      try {
        // Prepares form data for the API request.
        const formData = new FormData();
        // Appends all necessary fields, including the parsed resume.
        formData.append("jobTitle", values.jobTitle);
        formData.append("company", values.company);
        formData.append("techStack", values.techStack);
        formData.append("description", values.description);
        formData.append("companyDetails", values.companyDetails || "");
        formData.append("parsedResume", parsedResume);

        // --- Update State: Generating Progress ---
        // Updates progress and stage message before making the API call.
        updateState({
          progress: 70,
          stage: "Generating AI responses (this may take a moment)...",
        });

        // --- Fetch Request ---
        // Sends a POST request to the '/api/generate' endpoint with the form data.
        const response = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });

        // --- Response Handling ---
        // Checks if the API response is successful.
        if (!response.ok) {
          // Parses error messages if the response is not ok.
          const errorData = await response
            .json()
            .catch(() => ({ message: "Response generation failed" }));
          throw new Error(errorData.message || "Network response was not ok");
        }

        // --- Success Handling ---
        // Parses the successful JSON response from the API.
        const data = await response.json();
        // Updates state to indicate saving is in progress.
        updateState({ progress: 90, stage: "Saving response..." });

        // Generates a unique ID for the response history entry.
        const responseId = generateRandomId();
        // Safely parses the resume JSON string (handles potential errors).
        // Ensure parsedResume is valid JSON before parsing
        let resumeData = {};
        try {
          resumeData = JSON.parse(parsedResume);
        } catch (parseError) {
          console.error("Error parsing resume JSON for history:", parseError);
          // Decide how to handle this - maybe save without resume data or throw?
          // For now, let's save with an empty object
        }

        // Saves the job details, generated response, ID, and resume data to history (local storage).
        saveResponseToHistory(
          values.company,
          values.jobTitle,
          data,
          responseId,
          resumeData,
        );

        // Updates state to 'complete' and shows a success toast.
        updateState({
          status: "complete",
          progress: 100,
          stage: "Responses generated successfully!",
        });
        toast.success("Responses generated! Redirecting...");

        // Redirects the user to the response page using the generated ID.
        router.push(`/response/${responseId}`);
      } catch (error) {
        // --- Error Handling (catch block) ---
        // Logs the error to the console.
        console.error("Form submission error", error);
        // Extracts a user-friendly error message.
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        // Shows an error toast notification.
        toast.error(`Failed to generate responses: ${errorMessage}`);
        // Updates the app state to 'error' with the relevant message.
        updateState({
          status: "error",
          stage: "Error generating responses",
          error: errorMessage,
          progress: 0,
        });
      }
    },
    [parsedResume, updateState, router],
  );

  // --- Return Value ---
  // Exposes the handleSubmit function to be used by the form component.
  return { handleSubmit };
}
