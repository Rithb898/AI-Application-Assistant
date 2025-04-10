// route.ts - API route to parse uploaded PDF resumes

import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

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

    // 🤖 Step 4: Use AI to parse the extracted text into a structured JSON format
    const prompt = `
You're an AI resume parser.

Here's the extracted plain text from a resume:
"""
${parsed.text}
"""

Convert this into the following structured JSON:
{
  "Full Name": "",
  "Contact Information": {
    "Email": "",
    "Phone": "",
    "LinkedIn": "",
    "Portfolio URL": ""
  },
  "Summary or Objective": "",
  "Education": [...],
  "Work Experience": [...],
  "Skills": {
    "Technical Skills": [...],
    "Soft Skills": [...]
  },
  "Projects": [...],
  "Certifications": [...],
  "Languages": [...],
  "Achievements": [...]
}

Return ONLY the JSON.
`;

    // 🤖 Step 5: Use AI to parse the extracted text into a structured JSON format
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    // 🧹 Step 6: Clean up the AI response to ensure it's valid JSON
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```/g, "")
      .trim();

    let JSONResume;

    try {
      // 📦 Step 7: Parse the cleaned text into a JSON object
      JSONResume = JSON.parse(cleanedText);
    } catch (error: any) {
      // 🚨 Step 8: If parsing fails, return the raw text
      console.error(
        "Failed to parse resume JSON, returning raw text.",
        error.message,
      );
      return NextResponse.json({ raw: text });
    }

    // 🎉 Step 9: Return the structured JSON as the response
    return NextResponse.json({ JSON: JSONResume });
  } catch (err) {
    // 🚨 Step 10: Handle any errors that occur during the process
    console.error("PDF parsing failed:", err);
    return NextResponse.json({ error: "PDF parsing failed" }, { status: 500 });
  }
}
