// Local storage utility for response history

import {
  GeneratedContentType,
  HistoryItemType,
  regenerateDataType,
} from "./types";

// Save a response to history
export function saveResponseToHistory(
  company: string,
  jobTitle: string,
  data: GeneratedContentType,
  id: string,
  resume: object,
): void {
  // Get existing history or initialize empty array
  const history: HistoryItemType[] = JSON.parse(
    localStorage.getItem("responseHistory") || "[]",
  );

  // Create new history item
  const newItem: HistoryItemType = {
    id,
    company,
    jobTitle,
    date: new Date().toISOString(),
    data,
    resume,
  };

  // Add to history (most recent first)
  history.unshift(newItem);

  // Limit history to 10 items
  const limitedHistory = history.slice(0, 10);

  // Save back to localStorage
  localStorage.setItem("responseHistory", JSON.stringify(limitedHistory));
}

// Get all history items
export function getResponseHistory(): HistoryItemType[] {
  return JSON.parse(localStorage.getItem("responseHistory") || "[]");
}

// Get a specific history item by ID
export function getResponseById(id: string): HistoryItemType | null {
  const history = getResponseHistory();
  return history.find((item) => item.id === id) || null;
}

// Delete a history item
export function deleteResponseFromHistory(id: string): void {
  const history = getResponseHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  localStorage.setItem("responseHistory", JSON.stringify(updatedHistory));
}
