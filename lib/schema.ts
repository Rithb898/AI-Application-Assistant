import { z } from "zod";

export const jobApplicationSchema = z.object({
  applicationMaterials: z.object({
    interestInCompany: z.string(),
    coverLetter: z.string(),
    whyFit: z.string(),
    valueAdd: z.string(),
    linkedinSummary: z.string(),
    shortAnswer: z.string(),
  }),
  interviewPrep: z.object({
    questions: z.array(z.string()),
  }),
});

export const regenerateSchema = z.object({
  field: z.enum([
    "interestInCompany",
    "coverLetter",
    "whyFit",
    "valueAdd",
    "linkedinSummary",
    "shortAnswer",
  ]),
  output: z.string(),
});

export const resumeSchema = z.object({
  fullName: z.string(),
  contactInformation: z.object({
    email: z.string(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    portfolioUrl: z.string().optional(),
  }),
  summary: z.string().optional(),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
    }),
  ),
  workExperience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    }),
  ),
  skills: z.object({
    technicalSkills: z.array(z.string()),
    softSkills: z.array(z.string()),
  }),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    }),
  ),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  achievements: z.array(z.string()),
});
