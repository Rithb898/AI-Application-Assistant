import { google } from "@ai-sdk/google";
import { generateObject, NoObjectGeneratedError } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { jobApplicationSchema } from "@/lib/schema";
import { generatePrompt, generateSystemPrompt } from "@/lib/prompt";

// Define primary and fallback models
const models = {
  primary: process.env.PRIMARY_MODEL || "gemini-2.5-flash-preview-05-20",
  fallback: process.env.FALLBACK_MODEL || "gemini-2.0-flash-lite-001",
};

// Common configuration for model generation
const getModelConfig = (
  jobTitle: string,
  company: string,
  techStack: string,
  description: string,
  companyDetails: string,
  resumeText: string,
  modelName: string,
) => ({
  model: google(modelName),
  schema: jobApplicationSchema,
  system: generateSystemPrompt,
  prompt: generatePrompt(
    jobTitle,
    company,
    techStack,
    description,
    companyDetails,
    resumeText,
  ),
  temperature: 0.7,
  timeout: 30000, // 30 second timeout
});

async function tryGenerateObjectWithConfig(config: any) {
  try {
    const { object } = await generateObject(config);
    return object;
  } catch (error: any) {
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse form data
    const formData = await req.formData();

    // Extract fields
    const jobTitle = formData.get("jobTitle") as string;
    const company = formData.get("company") as string;
    const techStack = formData.get("techStack") as string;
    const description = formData.get("description") as string;
    const companyDetails = formData.get("companyDetails") as string;
    const parsedResume = formData.get("parsedResume") as string;

    // Validate required fields
    if (!jobTitle || !company || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ✅ Validate parsedResume is valid JSON
    try {
      JSON.parse(parsedResume || ""); // Attempt to parse, empty string defaults to valid empty object
    } catch (jsonError) {
      console.error("Invalid parsedResume JSON:", jsonError);
      return NextResponse.json(
        { error: "Invalid resume data. Please upload a valid resume." },
        { status: 400 },
      );
    }

    // Use the already parsed resume data from the client
    const resumeText = parsedResume || "";

    // Log request start
    console.log({
      event: "job_application_generation_started",
      model: models.primary,
      jobTitle,
      company,
      timestamp: new Date().toISOString(),
    });

    try {
      // Try with primary model first
      const object = await tryGenerateObjectWithConfig(
        getModelConfig(
          jobTitle.trim(),
          company.trim(),
          techStack?.trim() || "",
          description.trim(),
          companyDetails?.trim() || "",
          resumeText.trim(),
          models.primary,
        ),
      );

      // Log successful completion
      console.log({
        event: "job_application_generation_completed",
        model: models.primary,
        jobTitle,
        company,
        processingTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(object);
    } catch (primaryError: any) {
      // If we hit rate limits (429) or service unavailable (503), try the fallback model
      if (
        primaryError.response?.status === 429 ||
        primaryError.response?.status === 503
      ) {
        console.log({
          event: "fallback_model_triggered",
          primaryError: primaryError.message,
          primaryStatus: primaryError.response?.status,
          fallbackModel: models.fallback,
          timestamp: new Date().toISOString(),
        });

        const object = await tryGenerateObjectWithConfig(
          getModelConfig(
            jobTitle.trim(),
            company.trim(),
            techStack?.trim() || "",
            description.trim(),
            companyDetails?.trim() || "",
            resumeText.trim(),
            models.fallback,
          ),
        );

        // Log successful completion with fallback
        console.log({
          event: "job_application_generation_completed",
          model: models.fallback,
          jobTitle,
          company,
          processingTimeMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json(object);
      }

      // Re-throw if it's not a rate limit error
      throw primaryError;
    }
  } catch (error: any) {
    // Log detailed error information
    console.error({
      event: "job_application_generation_failed",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
    });

    // Handle specific error types
    if (NoObjectGeneratedError.isInstance(error)) {
      console.log({
        errorType: "NoObjectGeneratedError",
        cause: error.cause,
        text: error.text?.substring(0, 200), // Log just part of the text to avoid huge logs
        usage: error.usage,
      });

      return NextResponse.json(
        {
          error: "Could not generate a valid application response",
          details:
            "The AI was unable to generate content that matches the required format.",
        },
        { status: 422 },
      );
    }

    // Network or timeout errors
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Connection error. Please try again later." },
        { status: 503 },
      );
    }

    // If both models have rate limiting issues
    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          error:
            "Service temporarily unavailable due to high demand. Please try again later.",
        },
        { status: 429 },
      );
    }

    // Generic error fallback
    return NextResponse.json(
      {
        error: "Failed to generate job application response",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
