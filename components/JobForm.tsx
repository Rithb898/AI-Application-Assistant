"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CloudUpload,
  FileText,
  Briefcase,
  Building,
  Code,
  Info,
  Loader2,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Progress } from "./ui/progress";
import ApplicationAnswers from "./ApplicationAnswers";
import { saveResponseToHistory } from "@/lib/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  techStack: z.string().min(1),
  description: z.string(),
  companyDetails: z.string(),
});

// Define a type for our application state
type AppState = {
  status: "idle" | "parsing" | "generating" | "complete" | "error";
  progress: number;
  stage: string;
  error?: string;
};

export default function JobForm() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<string>("");
  const [generatedAnswers, setGeneratedAnswers] = useState(null);

  const generateRandomId = (length: number = 12): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  // Unified state management
  const [appState, setAppState] = useState<AppState>({
    status: "idle",
    progress: 0,
    stage: "",
  });

  // Helper functions to update state
  const updateState = (updates: Partial<AppState>) => {
    setAppState((current) => ({ ...current, ...updates }));
  };

  const resetState = () => {
    setAppState({
      status: "idle",
      progress: 0,
      stage: "",
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setResume(file);
      toast.success("Resume uploaded!");

      // Parse the resume immediately after upload
      await parseResume(file);
    },
  });

  const parseResume = async (file: File) => {
    try {
      // Update state to parsing
      updateState({
        status: "parsing",
        progress: 20,
        stage: "Parsing resume...",
      });

      const resumeFormData = new FormData();
      resumeFormData.append("resume", file);

      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: resumeFormData,
      });

      if (!parseResponse.ok) {
        throw new Error("Resume parsing failed");
      }

      const parsedData = await parseResponse.json();
      setParsedResume(JSON.stringify(parsedData));

      // Update state to ready for generation
      updateState({
        status: "idle",
        progress: 50,
        stage: "Resume parsed successfully",
      });

      toast.success("Resume parsed successfully!");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("Failed to parse resume. Please try again.");

      // Update state to error
      updateState({
        status: "error",
        stage: "Error parsing resume",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      techStack: "",
      description: "",
      companyDetails: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update state to generating
      updateState({
        status: "generating",
        progress: 70,
        stage: "Generating responses...",
      });

      const formData = new FormData();
      formData.append("jobTitle", values.jobTitle);
      formData.append("company", values.company);
      formData.append("techStack", values.techStack);
      formData.append("description", values.description);
      formData.append("companyDetails", values.companyDetails);
      formData.append("parsedResume", parsedResume);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Save response to history and get the response ID
      const responseId = generateRandomId();
      saveResponseToHistory(values.company, values.jobTitle, data, responseId);

      // Update state to complete
      updateState({
        status: "complete",
        progress: 100,
        stage: "Responses generated successfully",
      });

      toast.success("Responses generated successfully!");

      // Redirect to the response page using the ID
      router.push(`/response/${responseId}`);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to generate responses. Please try again.");

      // Update state to error
      updateState({
        status: "error",
        stage: "Error generating responses",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const isFormDisabled =
    appState.status === "parsing" || appState.status === "generating";
  const isSubmitDisabled = isFormDisabled || !parsedResume;

  const getStatusColor = () => {
    switch (appState.status) {
      case "complete":
        return "bg-green-400";
      case "error":
        return "bg-red-400";
      case "generating":
      case "parsing":
        return "bg-blue-400";
      default:
        return "bg-neutral-300";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              AI Application Assistant
            </h1>
            <p className="text-neutral-400 mt-2 text-lg">
              Craft perfect job application responses with AI
            </p>
          </div>
          <Link href="/history">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
            >
              <History className="h-4 w-4" />
              Application History
            </Button>
          </Link>
        </div>

        <div className="bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 overflow-hidden">
          <div className="p-6 border-b border-neutral-700 bg-neutral-800/50">
            <h2 className="text-xl font-semibold">Application Details</h2>
            <p className="text-neutral-400 text-sm">
              Fill in the job details and upload your resume
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Frontend Developer"
                          type="text"
                          {...field}
                          disabled={isFormDisabled}
                          className="bg-neutral-900 border-neutral-700 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-400" />
                        Company
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Google"
                          type="text"
                          {...field}
                          disabled={isFormDisabled}
                          className="bg-neutral-900 border-neutral-700 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                      <Code className="w-4 h-4 text-purple-400" />
                      Tech Stack
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., React, TailwindCSS, Next.js"
                        type="text"
                        {...field}
                        disabled={isFormDisabled}
                        className="bg-neutral-900 border-neutral-700 focus:border-purple-500 text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the job description here..."
                          className="resize-none min-h-32 bg-neutral-900 border-neutral-700 focus:border-purple-500 text-white"
                          {...field}
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyDetails"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                        <Info className="w-4 h-4 text-purple-400" />
                        Company Details
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write or paste what you know about the company..."
                          className="resize-none min-h-24 bg-neutral-900 border-neutral-700 focus:border-purple-500 text-white"
                          {...field}
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <h3 className="font-medium text-sm text-neutral-300 flex items-center gap-2">
                  <CloudUpload className="w-4 h-4 text-purple-400" />
                  Resume Upload
                </h3>

                <div
                  {...getRootProps()}
                  className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragActive
                      ? "bg-purple-500/10 border-purple-400"
                      : "bg-neutral-900/50 hover:bg-neutral-800/50"
                  } ${
                    isFormDisabled
                      ? "opacity-50 pointer-events-none"
                      : "border-neutral-700"
                  } ${resume ? "border-purple-500/30 bg-purple-500/5" : ""}`}
                >
                  <input {...getInputProps()} disabled={isFormDisabled} />
                  {resume ? (
                    <div className="text-neutral-300 font-medium flex flex-col justify-center items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <FileText className="text-purple-400 h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{resume.name}</p>
                        <p className="text-neutral-400 text-sm">
                          {(resume.size / 1024 / 1024).toFixed(2)} MB • PDF
                        </p>
                      </div>
                      {appState.status === "parsing" && (
                        <p className="text-sm text-blue-400 flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Parsing...
                        </p>
                      )}
                      {parsedResume && appState.status !== "parsing" && (
                        <p className="text-sm text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready
                        </p>
                      )}
                    </div>
                  ) : isDragActive ? (
                    <div className="text-purple-400 flex flex-col items-center">
                      <CloudUpload className="h-8 w-8 mb-2" />
                      <p>Drop your resume here...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-neutral-400">
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
                        <CloudUpload className="h-5 w-5 text-neutral-300" />
                      </div>
                      <p className="text-sm font-medium text-neutral-300">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        PDF resume only • Max 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {appState.progress > 0 && (
                <div className="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      {appState.status === "error" ? (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      ) : appState.status === "complete" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      )}
                      <span
                        className={`
                        ${
                          appState.status === "error"
                            ? "text-red-400"
                            : appState.status === "complete"
                              ? "text-green-400"
                              : "text-blue-400"
                        }
                      `}
                      >
                        {appState.stage}
                      </span>
                    </span>
                    <span className="text-sm text-neutral-400">
                      {appState.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor()} transition-all duration-500`}
                      style={{ width: `${appState.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full py-6 text-lg font-medium rounded-lg transition-all ${
                  isSubmitDisabled
                    ? "bg-neutral-800 text-neutral-400"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
                }`}
                disabled={isSubmitDisabled}
              >
                {appState.status === "generating" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating AI Responses...
                  </span>
                ) : appState.status === "parsing" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Parsing Resume...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    {parsedResume
                      ? "Generate AI Responses"
                      : "Upload Resume to Continue"}
                    {parsedResume && <span className="ml-1">✨</span>}
                  </span>
                )}
              </Button>

              {appState.status === "error" && (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      {appState.error ||
                        "An error occurred. Please try again or contact support if the problem persists."}
                    </span>
                  </p>
                </div>
              )}
            </form>
          </Form>
        </div>

        {generatedAnswers && (
          <div className="mt-10 w-full">
            <ApplicationAnswers data={generatedAnswers} />
          </div>
        )}
      </div>
    </main>
  );
}
