"use server";

import { GeneratedContentType, HistoryItemType } from "./types";
import {
  saveResponse as saveResponseAction,
  getUserResponses,
  getResponseById as getResponseByIdFromDB,
  deleteResponse as deleteResponseFromDB,
} from "./actions/response.action";
import { saveResume as saveResumeAction, getUserResume } from "./actions/resume.action";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Save a resume to MongoDB
export async function saveResumeToDB(resumeData: object): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User must be authenticated to save resume.");
    }
    
    await saveResumeAction(resumeData);
    console.log(`Resume saved to MongoDB for user ${userId}`);
  } catch (error) {
    console.error(`Failed to save resume to MongoDB:`, error);
    throw error;
  }
}

// Get the user's resume from MongoDB
export async function getResumeFromDB(): Promise<object | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("User not authenticated. Cannot fetch resume.");
      return null;
    }
    
    const resume = await getUserResume();
    return resume;
  } catch (error) {
    console.error("Failed to fetch resume from MongoDB:", error);
    throw error;
  }
}

// Save a response to history (MongoDB only)
export async function saveResponseToHistory(
  company: string,
  jobTitle: string,
  data: GeneratedContentType,
  id: string,
  resumeData: object
): Promise<void> {
  // Create new history item structure
  const newItem: HistoryItemType = {
    id,
    company,
    jobTitle,
    date: new Date().toISOString(),
    data,
    resume: resumeData,
  };

  try {
    const { userId } = await auth();
    if (userId) {
      // Call the server action with the complete data
      await saveResponseAction(newItem);
      console.log(`Response ${id} saved to MongoDB for user ${userId}`);
    } else {
      console.log("User not authenticated. Response not saved to history.");
      throw new Error("User must be authenticated to save history.");
    }
  } catch (error) {
    console.error(`Failed to save response ${id} to MongoDB:`, error);
    throw error;
  }
}

// Get all history items (from MongoDB if authenticated)
export async function getResponseHistory(): Promise<HistoryItemType[]> {
  try {
    const { userId } = await auth();
    if (userId) {
      // User is authenticated, get from MongoDB
      console.log(`Fetching response history from MongoDB for user ${userId}`);
      const dbResponses = await getUserResponses();
      // Ensure an array is always returned, even if null/undefined from DB action
      return dbResponses || [];
    } else {
      // User is not authenticated, return empty history
      console.log("User not authenticated. Returning empty history.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch response history from MongoDB:", error);
    // Return empty array or throw error depending on desired UI behavior on failure
    return [];
    // Or: throw new Error(`Failed to retrieve history: ${error.message}`);
  }
}

// Get a specific history item by ID (from MongoDB if authenticated)
export async function getResponseById(
  id: string
): Promise<HistoryItemType | null> {
  try {
    const { userId } = await auth();
    if (userId) {
      // User is authenticated, try to get from MongoDB
      console.log(`Fetching response ${id} from MongoDB for user ${userId}`);
      const dbResponse = await getResponseByIdFromDB(id);
      return dbResponse; // Returns the response or null if not found
    } else {
      // User is not authenticated, cannot retrieve specific history item
      console.log(`User not authenticated. Cannot fetch response ${id}.`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch response ${id} from MongoDB:`, error);
    // Return null or throw error
    return null;
    // Or: throw new Error(`Failed to retrieve response by ID: ${error.message}`);
  }
}

// Delete a history item (from MongoDB if authenticated)
export async function deleteResponseFromHistory(id: string): Promise<void> {
  try {
    const { userId } = await auth();
    if (userId) {
      // User is authenticated, delete from MongoDB
      console.log(`Deleting response ${id} from MongoDB for user ${userId}`);
      await deleteResponseFromDB(id);
      console.log(`Response ${id} deleted from MongoDB.`);
    } else {
      // User is not authenticated, cannot delete history item
      console.log(`User not authenticated. Cannot delete response ${id}.`);
      // Optionally throw an error
      // throw new Error("User must be authenticated to delete history.");
    }
  } catch (error: any) {
    console.error(`Failed to delete response ${id} from MongoDB:`, error);
    // Re-throw the error or handle it
    throw new Error(`Failed to delete response from history: ${error.message}`);
  }
}

