"use server";

import { connect } from "@/lib/db";
import Response from "@/lib/models/response.model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { HistoryItemType } from "@/lib/types";

// Save a response to MongoDB
export async function saveResponse(
  responseData: Omit<HistoryItemType, "userId">,
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    await connect();

    const responseToCreate = await Response.create({
      ...responseData,
      userId,
    });

    const response = await Response.create(responseToCreate);

    revalidatePath("/history");
    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.error("Error saving response:", error);
    // Provide more specific error feedback if possible (e.g., duplicate key)
    if (error.code === 11000) {
      // MongoDB duplicate key error
      console.error("Duplicate Key Error Details:", error.keyValue);
      throw new Error(
        `Failed to save: Response with ID ${error.keyValue?.id} might already exist.`,
      );
    }
    // Rethrow a generic error or the specific one
    throw new Error(`Failed to save response to database: ${error.message}`);
  }
}

// Get all responses for the current user
export async function getUserResponses() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    await connect();

    const responses = await Response.find({ userId })
      .sort({ date: -1 })
      .limit(20);

    return JSON.parse(JSON.stringify(responses));
  } catch (error) {
    console.error("Error fetching responses:", error);
    return [];
  }
}

// Get a specific response by ID
export async function getResponseById(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connect();

    const response = await Response.findOne({ id, userId });
    if (!response) return null;

    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
}

// Delete a response
export async function deleteResponse(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    await connect();

    await Response.findOneAndDelete({ id, userId });

    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Error deleting response:", error);
    throw error;
  }
}
