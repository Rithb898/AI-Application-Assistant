import { useState } from "react";

// Define a type for our application state
export type AppState = {
  status: "idle" | "parsing" | "generating" | "complete" | "error";
  progress: number;
  stage: string;
  error?: string;
};

const initialState: AppState = {
  status: "idle",
  progress: 0,
  stage: "",
};

export function useAppState(initial: Partial<AppState> = {}) {
  const [appState, setAppState] = useState<AppState>({
    ...initialState,
    ...initial,
  });

  const updateState = (updates: Partial<AppState>) => {
    setAppState((current) => ({ ...current, ...updates }));
  };

  const resetState = () => {
    setAppState(initialState);
  };

  return {
    appState,
    updateState,
    resetState,
  };
}
