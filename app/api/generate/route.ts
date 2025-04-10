import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jobTitle = formData.get("jobTitle") as string;
    const company = formData.get("company") as string;
    const techStack = formData.get("techStack") as string;
    const description = formData.get("description") as string;
    const companyDetails = formData.get("companyDetails") as string;
    const parsedResume = formData.get("parsedResume") as string;

    // Use the already parsed resume data from the client
    const resumeText = parsedResume || "";

    //     const prompt = `You're an expert AI career assistant helping a candidate apply for a job.

    // Below is the candidate's resume in structured JSON format, along with the job details. Use this to generate thoughtful and customized job application content.

    // ---

    // 📄 Candidate Resume:
    // ${resumeText}

    // 📌 Job Title:
    // ${jobTitle}

    // 🏢 Company Name:
    // ${company}

    // 🧰 Tech Stack Required:
    // ${techStack}

    // 📝 Job Description:
    // ${description}

    // 🏛 Company Details:
    // ${companyDetails}

    // ---

    // ✍️ Generate the following:

    // 1. **What interests the candidate about working at this company?**
    // - Reference company mission, values, and projects where applicable.
    // - Connect with candidate’s background and strengths.

    // 2. **A short, compelling cover letter (max 200 words)**
    // - Professional tone, personalized, with strong alignment to the role.
    // - Mention key experiences, tech skills, and enthusiasm for the company.
    // - End with a call to action (e.g., open to interview, thanks, etc).

    // Return only the plain text, no markdown or code block formatting.
    // `;

    const prompt = `Generate job application answers in structured JSON format. Here's all the information:

📌 Job Details:
- Job Title: ${jobTitle}
- Company: ${company}
- Tech Stack: ${techStack}
- Description: ${description}

🏢 Company Info:
${companyDetails}

📄 Candidate Resume:
${resumeText}

---

🎯 Output format (strict JSON only):
{
  "interestInCompany": "What interests you about working for this company?",
  "coverLetter": "A short and personalized cover letter for this role.",
  "whyFit": "Why the candidate is a good fit for this position.",
  "valueAdd": "What value the candidate brings to this company.",
  "linkedinSummary": "A 2-3 sentence version suitable to send as a message on LinkedIn.",
  "shortAnswer": "A super concise version (1-2 lines) for quick form answers."
}

Only return a valid JSON object without any markdown code block.
`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are a helpful assistant that specializes in writing job application responses. Your task is to generate clear, structured, and professional answers tailored for platforms like LinkedIn or direct applications. Respond only with well-formatted JSON, no extra explanation.",
      prompt,
    });

    // 🧹 Clean if AI wraps JSON in code blocks
    const cleaned = text
      .replace(/```json\n?/, "")
      .replace(/```/, "")
      .trim();

    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating job response:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
