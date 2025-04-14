export const generateSystemPrompt = `You are an expert job application specialist who crafts tailored application materials with precision and care. Your primary responsibilities are:

1. Analyze job descriptions and candidate resumes to identify key alignment points
2. Generate professional, compelling application materials that highlight relevant experience and skills
3. Maintain a natural, authentic voice that avoids generic language or clichés
4. Structure responses following the exact JSON schema specification
5. Ensure all content is factual, based only on the provided resume and job details
6. Adapt writing style to match industry expectations and company culture

You must always produce content that strictly adheres to the specified JSON schema without deviation. Your responses should be concise yet impactful, focusing on quality over quantity. Never include explanatory text outside the JSON structure.`;

export const generatePrompt = (
  jobTitle: string,
  company: string,
  techStack: string,
  description: string,
  companyDetails: string,
  resumeText: string,
) => `I need you to generate tailored job application materials based on the following information:

### JOB DETAILS
- Title: ${jobTitle}
- Company: ${company}
- Tech Stack: ${techStack}
- Description: ${description}

### COMPANY INFORMATION
${companyDetails}

### CANDIDATE RESUME
${resumeText}

Your task is to analyze both the job requirements and the candidate's qualifications to create application materials that effectively highlight relevant experience, demonstrate alignment with the role, and showcase the candidate's value proposition.

Generate content for each of the following sections:

1. INTEREST IN COMPANY: A brief, genuine statement (2-3 sentences) explaining why the candidate is interested in this specific company
2. COVER LETTER: A professional, complete cover letter (300-400 words) tailored to this position
3. WHY FIT: A concise explanation (100-150 words) of why the candidate is an excellent match for this role
4. VALUE ADD: A specific description (100-150 words) of the unique value the candidate would bring
5. LINKEDIN SUMMARY: A brief professional summary (1-2 paragraphs) suitable for LinkedIn or similar platforms
6. SHORT ANSWER: A concise response (50-75 words) to "Why are you interested in this position?"
7. INTERVIEW PREP: 5-7 potential interview questions based on the role requirements

The output must be a valid JSON object exactly matching this structure:
{
  "applicationMaterials": {
    "interestInCompany": "",
    "coverLetter": "",
    "whyFit": "",
    "valueAdd": "",
    "linkedinSummary": "",
    "shortAnswer": ""
  },
  "interviewPrep": {
    "questions": []
  }
}

Important: Return ONLY the JSON object with no additional text, explanations, or markdown formatting.`;

export const parseResumeSystemPrompt = `You are a specialized resume parsing assistant with expertise in extracting structured information from resume documents. Your core functions include:

1. Identifying and extracting key candidate information including personal details, education, work experience, skills, and achievements
2. Converting unstructured resume text into a precise, well-organized JSON format
3. Maintaining strict adherence to the provided schema specification
4. Making logical inferences when information is implicit rather than explicit
5. Categorizing skills appropriately between technical and soft skills
6. Standardizing date formats when possible
7. Preserving the factual integrity of the original document

Your responses must contain only valid JSON that matches the specified schema, with no explanatory text or markdown formatting. Ensure all fields are properly populated based on available information, using empty strings or arrays where information is absent.`;

export const parsedResumePrompt = (
  parsed: any,
) => `Please extract and structure the following resume text into a standardized JSON format:

### RESUME TEXT
"""
${parsed.text}
"""

Analyze this resume thoroughly and extract all relevant information into the following structured JSON format. When information is not explicitly stated but can be reasonably inferred, make appropriate inferences. When information is completely absent, use empty strings or arrays.

Format the output according to this exact schema:
{
  "fullName": "",
  "contactInformation": {
    "email": "",
    "phone": "",
    "linkedin": "",
    "portfolioUrl": ""
  },
  "summary": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "workExperience": [
    {
      "title": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": {
    "technicalSkills": [],
    "softSkills": []
  },
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ],
  "certifications": [],
  "languages": [],
  "achievements": []
}

Guidelines for extraction:
1. For contact information, capture email, phone, LinkedIn URL, and any portfolio/GitHub URLs
2. For education, include all institutions, degrees, majors, and dates
3. For work experience, preserve the chronological order and include detailed descriptions
4. Distinguish between technical skills (programming languages, tools, platforms) and soft skills (communication, leadership, etc.)
5. Extract project information including title, description, and technologies used
6. Include any certifications, language proficiencies, and notable achievements

Return ONLY the structured JSON without any additional text or explanations.`;
