"use server";

import { connect } from "@/lib/db";
import Resume from "@/lib/models/resume.model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Save resume to MongoDB
export async function saveResume(resumeData: object) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    await connect();

    // Check if user already has a resume
    const existingResume = await Resume.findOne({ userId });

    if (existingResume) {
      // Update existing resume
      existingResume.content = resumeData;
      existingResume.createdAt = new Date();
      await existingResume.save();
      revalidatePath("/");
      return JSON.parse(JSON.stringify(existingResume));
    } else {
      // Create new resume
      const resume = await Resume.create({
        userId,
        content: resumeData,
      });
      revalidatePath("/");
      return JSON.parse(JSON.stringify(resume));
    }
  } catch (error: any) {
    console.error("Error saving resume:", error);
    throw new Error(`Failed to save resume to database: ${error.message}`);
  }
}

// Get user's resume from MongoDB
export async function getUserResume() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connect();
    
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    
    return resume ? JSON.parse(JSON.stringify(resume.content)) : null;
  } catch (error: any) {
    console.error("Error fetching resume:", error);
    throw new Error(`Failed to fetch resume from database: ${error.message}`);
  }
}