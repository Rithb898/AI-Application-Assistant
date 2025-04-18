import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import { saveResponseToHistory } from "@/lib/storage";
import { generateRandomId } from "@/lib/utils";
import { AppState } from "./useAppState"; // Import AppState type

// Define the expected shape of form values based on JobForm's schema
// We could import the schema itself, but defining it here keeps the hook decoupled
const formSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  techStack: z.string(),
  description: z.string(),
  companyDetails: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

type UseJobFormSubmitProps = {
  updateState: (updates: Partial<AppState>) => void;
  parsedResume: string; // Pass the parsed resume string
};

export function useJobFormSubmit({
  updateState,
  parsedResume,
}: UseJobFormSubmitProps) {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!parsedResume) {
        toast.error("Please upload and parse your resume first.");
        // No need to update state here, the button should be disabled anyway
        return;
      }

      updateState({
        status: "generating",
        progress: 60,
        stage: "Preparing data...",
      });

      try {
        const formData = new FormData();
        formData.append("jobTitle", values.jobTitle);
        formData.append("company", values.company);
        formData.append("techStack", values.techStack);
        formData.append("description", values.description);
        formData.append("companyDetails", values.companyDetails || "");
        formData.append("parsedResume", parsedResume);

        updateState({
          progress: 70,
          stage: "Generating AI responses (this may take a moment)...",
        });

        const response = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Response generation failed" }));
          throw new Error(errorData.message || "Network response was not ok");
        }

        const data = await response.json();
        updateState({ progress: 90, stage: "Saving response..." });

        const responseId = generateRandomId();
        // Ensure parsedResume is valid JSON before parsing
        let resumeData = {};
        try {
          resumeData = JSON.parse(parsedResume);
        } catch (parseError) {
          console.error("Error parsing resume JSON for history:", parseError);
          // Decide how to handle this - maybe save without resume data or throw?
          // For now, let's save with an empty object
        }

        saveResponseToHistory(
          values.company,
          values.jobTitle,
          data,
          responseId,
          resumeData,
        );

        updateState({
          status: "complete",
          progress: 100,
          stage: "Responses generated successfully!",
        });
        toast.success("Responses generated! Redirecting...");

        router.push(`/response/${responseId}`);
      } catch (error) {
        console.error("Form submission error", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to generate responses: ${errorMessage}`);
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

  return { handleSubmit };
}
