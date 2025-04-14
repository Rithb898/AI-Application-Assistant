// components/ui/progress.tsx
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils"; // Make sure you have this utility function

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      // Default background styling for the track/root element
      "relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50 dark:bg-slate-800", // Adjusted background for dark theme
      className, // Allows overriding root styles via className prop
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        // Default styling for the indicator (the filled part)
        "h-full w-full flex-1 bg-primary transition-all", // Uses 'bg-primary' by default
        // You were overriding --primary in your JobForm's style prop
        // to change this color dynamically.
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
