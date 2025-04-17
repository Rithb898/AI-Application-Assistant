import { groq } from "@ai-sdk/groq";
import { generateObject, NoObjectGeneratedError } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { jobApplicationSchema } from "@/lib/schema";
import { generatePrompt, generateSystemPrompt } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jobTitle = formData.get("jobTitle") as string;
    const company = formData.get("company") as string;
    const techStack = formData.get("techStack") as string;
    const description = formData.get("description") as string;
    const companyDetails = formData.get("companyDetails") as string;
    const parsedResume = formData.get("parsedResume") as string;

    console.log(formData);

    // Use the already parsed resume data from the client
    const resumeText = parsedResume || "";

    //     const prompt = `Generate job application answers in structured JSON format. Here's all the information:

    // 📌 Job Details:
    // - Job Title: ${jobTitle}
    // - Company: ${company}
    // - Tech Stack: ${techStack}
    // - Description: ${description}

    // 🏢 Company Info:
    // ${companyDetails}

    // 📄 Candidate Resume:
    // ${resumeText}

    // ---

    // 🎯 Output format (strict JSON only):
    // {
    //   "applicationMaterials": {
    //     "interestInCompany": "",
    //     "coverLetter": "",
    //     "whyFit": "",
    //     "valueAdd": "",
    //     "linkedinSummary": "",
    //     "shortAnswer": ""
    //   },
    //   "interviewPrep": {
    //     "questions": []
    //   }
    // }

    // Only return a valid JSON object without any markdown code block.
    // `;

    const { object, usage } = await generateObject({
      model: groq("deepseek-r1-distill-llama-70b"),
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
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("Error generating job response:", error.message);
    if (NoObjectGeneratedError.isInstance(error)) {
      console.log("NoObjectGeneratedError");
      console.log("Cause:", error.cause);
      console.log("Text:", error.text);
      console.log("Response:", error.response);
      console.log("Usage:", error.usage);
    }
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
