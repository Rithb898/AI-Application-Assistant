import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { parsedResumePrompt, parseResumeSystemPrompt } from "@/lib/prompt";
import { resumeSchema } from "@/lib/schema";

const models = {
  primary: process.env.GROQ_PRIMARY_MODEL || "llama-3.1-8b-instant",
  fallback: process.env.GROQ_FALLBACK_MODEL || "llama-3.3-70b-versatile",
};

// 👇 Ensure this route runs in Node.js runtime (not edge)
export const config = {
  runtime: "nodejs",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

async function tryGenerateResumeObject(modelName: string, parsedText: string) {
  try {
    console.log(`Attempting AI parsing with model: ${modelName}`);
    const { object } = await generateObject({
      model: groq(modelName),
      schema: resumeSchema,
      system: parseResumeSystemPrompt,
      prompt: parsedResumePrompt(parsedText),
    });
    console.log(
      `Successfully generated structured resume data with model: ${modelName}`,
    );
    return object;
  } catch (error: any) {
    throw error; // Re-throw to be caught by the caller
  }
}

export async function POST(req: NextRequest) {
  // 🧾 Step 1: Get uploaded file from incoming formData
  const formData = await req.formData();
  const file = formData.get("resume") as File;

  // ❌ If no file is uploaded, return error response
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // ✅ Validate file type
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Invalid file type. Please upload a PDF." },
      { status: 400 },
    );
  }

  // ✅ Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
      { status: 413 },
    );
  }

  // 📦 Step 2: Convert the file to a Node.js buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // 📄 Step 3: Use pdf-parse to extract text content from PDF
    const parsed = await pdfParse(buffer);
    console.log(`Successfully parsed PDF, text length: ${parsed.text.length}`);

    try {
      // 🤖 Step 5: Use AI to parse the extracted text into a structured JSON format
      const object = await tryGenerateResumeObject(models.primary, parsed.text);
      return NextResponse.json(object);
    } catch (primaryError: any) {
      if (primaryError.response?.status === 429) {
        console.log(
          `Rate limited on primary model, trying fallback model: ${models.fallback}`,
        );
        try {
          // 🤖 Step 5: Use AI to parse the extracted text into a structured JSON format
          const object = await tryGenerateResumeObject(
            models.fallback,
            parsed.text,
          );
          return NextResponse.json(object);
        } catch (fallbackError: any) {
          console.error("Fallback model failed:", fallbackError);
          return NextResponse.json(
            { error: "Fallback AI model failed to parse resume." },
            { status: 500 },
          );
        }
      }
      console.error("Primary model failed:", primaryError);
      return NextResponse.json(
        { error: "Primary AI model failed to parse resume." },
        { status: 500 },
      );
    }
  } catch (pdfErr) {
    // 🚨 Step 10: Handle any errors that occur during the process
    console.error("PDF parsing failed:", pdfErr);
    return NextResponse.json(
      { error: "Failed to extract text from PDF." },
      { status: 500 },
    );
  }
}
