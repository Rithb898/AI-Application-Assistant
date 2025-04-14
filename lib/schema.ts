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
