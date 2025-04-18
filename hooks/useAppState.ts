// --- Imports ---
import { useState } from "react";

// --- Type Definition ---
// Defines the structure for the application's global state,
// tracking status, progress, current stage, and potential errors.
// Define a type for our application state
export type AppState = {
  status: "idle" | "parsing" | "generating" | "complete" | "error";
  progress: number;
  stage: string;
  error?: string;
};

// --- Initial State ---
// Defines the default state values when the application starts or resets.
const initialState: AppState = {
  status: "idle",
  progress: 0,
  stage: "",
};

// --- useAppState Hook ---
// Custom hook to manage the application's global state.
// Accepts optional initial state overrides.
export function useAppState(initial: Partial<AppState> = {}) {
  // --- State Variable ---
  // Uses useState to hold the current application state.
  const [appState, setAppState] = useState<AppState>({
    ...initialState,
    ...initial,
  });

  // --- updateState Function ---
  // Merges partial updates into the current state.
  // Allows updating specific state properties without replacing the whole object.
  const updateState = (updates: Partial<AppState>) => {
    setAppState((current) => ({ ...current, ...updates }));
  };

  // --- resetState Function ---
  // Resets the application state back to its initial values.
  const resetState = () => {
    setAppState(initialState);
  };

  // --- Return Value ---
  // Exposes the current state (appState) and functions to update (updateState)
  // or reset (resetState) the state.
  return {
    appState,
    updateState,
    resetState,
  };
}
