import { NextRequest, NextResponse } from "next/server";
import { generateObject, NoObjectGeneratedError } from "ai";
import { groq } from "@ai-sdk/groq";
import { regenerateSchema } from "@/lib/schema";

let prompt = "";

export async function POST(req: NextRequest) {
  try {
    const { field, data, parsedResume } = await req.json();
    if (!field || !data) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    console.log("regenerate", field, data);

    // System prompt for all regeneration requests
    const systemPrompt = `You are a professional job application content specialist who creates highly tailored application materials for job seekers. You excel at:

1. Analyzing resume details to identify relevant skills and experiences
2. Creating compelling, concise application content that highlights candidate strengths
3. Adapting writing style to match industry expectations and company culture
4. Producing content that is specific, evidence-based, and free of generic statements
5. Maintaining an authentic voice that resonates with hiring managers

Your responses must be provided as structured JSON following the exact schema specification. Each regenerated field should be polished, focused, and ready for immediate use in a job application.`;

    if (field == "interestInCompany") {
      prompt = `
Generate a compelling paragraph (2-4 sentences) expressing genuine interest in ${data.company}.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}

Your response should:
1. Reference specific aspects of the company (mission, products, culture, or innovations)
2. Connect the applicant's background to the company's values or direction
3. Convey authentic enthusiasm without using generic phrases
4. Be concise yet impactful

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else if (field == "coverLetter") {
      prompt = `
Create a professional cover letter (300-400 words) for a ${data.jobTitle} position at ${data.company}.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}
- Job Description: ${data.description || "Not provided"}

Your cover letter should:
1. Open with a strong introduction that mentions the specific position
2. Highlight 2-3 key qualifications from the resume that directly align with the job requirements
3. Demonstrate knowledge of the company and why the applicant is interested
4. Close with a clear call to action
5. Maintain a professional yet personable tone throughout

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else if (field == "whyFit") {
      prompt = `
Create a concise explanation (100-150 words) of why the applicant is an excellent match for the ${data.jobTitle} role at ${data.company}.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}
- Job Description: ${data.description || "Not provided"}

Your response should:
1. Identify 2-3 specific qualifications from the resume that directly address key job requirements
2. Provide concrete examples or achievements that demonstrate these qualifications
3. Connect the applicant's background to the company's needs or challenges
4. Be confident without being arrogant

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else if (field == "valueAdd") {
      prompt = `
Write a compelling paragraph (100-150 words) on the unique value the applicant brings to ${data.company} as a ${data.jobTitle}.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}
- Job Description: ${data.description || "Not provided"}

Your response should:
1. Focus on 1-2 distinctive strengths or experiences that set the applicant apart
2. Emphasize tangible benefits the company would gain by hiring the applicant
3. Connect these unique qualities to specific company needs or industry challenges
4. Include quantifiable achievements or results when possible
5. Be specific rather than generic

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else if (field == "linkedinSummary") {
      prompt = `
Create a professional LinkedIn message (100-150 words) to connect with a hiring manager or recruiter at ${data.company} regarding the ${data.jobTitle} position.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}

Your LinkedIn message should:
1. Open with a professional greeting and brief introduction
2. Clearly state interest in the specific position
3. Highlight 1-2 key qualifications relevant to the role
4. Show knowledge of the company to demonstrate genuine interest
5. Close with a clear invitation to connect or discuss further
6. Be concise, professional, and personable

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else if (field == "shortAnswer") {
      prompt = `
Create a concise response (1-2 sentences, maximum 50 words) explaining why the applicant is interested in the ${data.jobTitle} position at ${data.company}.

RESUME:
${parsedResume}

JOB DETAILS:
- Job Title: ${data.jobTitle}
- Company: ${data.company}
- Company Description: ${data.companyDetails || "Not provided"}
- Tech Stack: ${data.techStack || "Not provided"}

Your response should:
1. Be direct and focused on one key motivator
2. Connect the applicant's background or career goals to this specific opportunity
3. Reference something specific about the company or role
4. Avoid generic statements that could apply to any company

Return only a JSON object with the structure: { "content": "your generated text here" }
`;
    } else {
      return NextResponse.json(
        { error: "Invalid field provided" },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: regenerateSchema,
      system: systemPrompt,
      prompt,
    });

    console.log(object);

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
