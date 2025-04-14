// route.ts - API route to parse uploaded PDF resumes

import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { parsedResumePrompt, parseResumeSystemPrompt } from "@/lib/prompt";
import { resumeSchema } from "@/lib/schema";


// 👇 Ensure this route runs in Node.js runtime (not edge)
export const config = {
  runtime: "nodejs",
};

export async function POST(req: NextRequest) {
  // 🧾 Step 1: Get uploaded file from incoming formData
  const formData = await req.formData();
  const file = formData.get("resume") as File;

  // ❌ If no file is uploaded, return error response
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // 📦 Step 2: Convert the file to a Node.js buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // 📄 Step 3: Use pdf-parse to extract text content from PDF
    const parsed = await pdfParse(buffer);

    // 🤖 Step 5: Use AI to parse the extracted text into a structured JSON format
    const { object, usage } = await generateObject({
      model: groq("llama-3.1-8b-instant"),
      schema: resumeSchema,
      system: parseResumeSystemPrompt,
      prompt: parsedResumePrompt(parsed),
    });

    return NextResponse.json(object);
  } catch (err) {
    // 🚨 Step 10: Handle any errors that occur during the process
    console.error("PDF parsing failed:", err);
    return NextResponse.json({ error: "PDF parsing failed" }, { status: 500 });
  }
}
