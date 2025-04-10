// Local storage utility for response history

type ResponseData = {
  interestInCompany: string;
  coverLetter: string;
  whyFit: string;
  valueAdd: string;
  linkedinSummary: string;
  shortAnswer: string;
};

type HistoryItem = {
  id: string;
  company: string;
  jobTitle: string;
  date: string;
  data: ResponseData;
};

// Save a response to history
export function saveResponseToHistory(
  company: string,
  jobTitle: string,
  data: ResponseData,
  id: string,
): void {
  // Get existing history or initialize empty array
  const history: HistoryItem[] = JSON.parse(
    localStorage.getItem("responseHistory") || "[]",
  );

  // Create new history item
  const newItem: HistoryItem = {
    id,
    company,
    jobTitle,
    date: new Date().toISOString(),
    data,
  };

  // Add to history (most recent first)
  history.unshift(newItem);

  // Limit history to 10 items
  const limitedHistory = history.slice(0, 10);

  // Save back to localStorage
  localStorage.setItem("responseHistory", JSON.stringify(limitedHistory));
}

// Get all history items
export function getResponseHistory(): HistoryItem[] {
  return JSON.parse(localStorage.getItem("responseHistory") || "[]");
}

// Get a specific history item by ID
export function getResponseById(id: string): HistoryItem | null {
  const history = getResponseHistory();
  return history.find((item) => item.id === id) || null;
}

// Delete a history item
export function deleteResponseFromHistory(id: string): void {
  const history = getResponseHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  localStorage.setItem("responseHistory", JSON.stringify(updatedHistory));
}
