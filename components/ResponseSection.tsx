"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy, Loader2, RefreshCw, HelpCircle } from "lucide-react"; // Added HelpCircle
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

// Define props interface separately for better readability
interface ResponseSectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  gradientFrom?: string;
  gradientTo?: string;
  onRegenerate?: () => void; // Keep optional
  isRegenerating?: boolean; // Keep optional
  regenerationDisabled?: boolean; // <<< ADDED: Explicitly disable regeneration (e.g., missing data)
  regenerationTooltip?: string; // <<< ADDED: Tooltip message for why it's disabled
  // Optional: Add onCopy prop if you want to track copies
  // onCopy?: (content: string) => void;
}

export default function ResponseSection({
  icon,
  title,
  content,
  gradientFrom = "from-purple-500",
  gradientTo = "to-blue-500",
  onRegenerate,
  isRegenerating = false,
  regenerationDisabled = false, // <<< ADDED: Default to false
  regenerationTooltip, // <<< ADDED
}: ResponseSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine the actual disabled state for the button
  const isButtonDisabled = isRegenerating || regenerationDisabled;
  // Determine if the tooltip should be shown (only when disabled due to missing data, not during active regeneration)
  const showTooltip =
    regenerationDisabled && !isRegenerating && regenerationTooltip;

  const RegenerateButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={onRegenerate}
      disabled={isButtonDisabled} // Use combined disabled state
      className={cn(
        "gap-1.5 h-8 px-3 rounded-md text-xs", // Adjusted size/padding/rounding
        "bg-slate-800/60 border-slate-700 text-purple-300", // Default style
        "hover:bg-purple-900/50 hover:border-purple-700/70 hover:text-purple-200", // Hover style
        "disabled:opacity-60 disabled:cursor-not-allowed", // Disabled style
      )}
    >
      {isRegenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
          {/* Optionally show a help icon if regeneration is *specifically* disabled */}
          {regenerationDisabled && (
            <HelpCircle className="w-3.5 h-3.5 ml-1 text-slate-500" />
          )}
        </>
      )}
    </Button>
  );

  return (
    <div className="mb-5 bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/60 shadow-lg backdrop-blur-sm">
      {" "}
      {/* Adjusted spacing */}
      <div
        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}
      >
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          {" "}
          {/* Adjusted size/shape */}
          {icon}
        </div>
        <h2 className="text-base md:text-lg font-semibold line-clamp-1">
          {title}
        </h2>{" "}
        {/* Adjusted text size */}
      </div>
      <div className="p-4 md:p-5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {" "}
        {/* Adjusted padding/size */}
        {content}
      </div>
      <div className="flex justify-end p-3 gap-2 border-t border-slate-700/40 bg-slate-900/40">
        {/* Copy Button */}
        <Button
          variant="ghost" // Changed variant
          size="sm"
          onClick={copyToClipboard}
          className={cn(
            "gap-1.5 h-8 px-3 rounded-md text-xs", // Adjusted size/padding/rounding
            copied
              ? "bg-green-900/30 text-green-400 border-green-800/0 hover:bg-green-900/40" // Adjusted success style
              : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-slate-100", // Adjusted default style
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </Button>

        {/* Regenerate Button (conditionally wrapped with Tooltip) */}
        {onRegenerate &&
          (showTooltip ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>{RegenerateButton}</TooltipTrigger>
                <TooltipContent className="bg-slate-950 border-slate-700 text-slate-200 text-xs">
                  <p>{regenerationTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            // Render button directly if tooltip isn't needed
            RegenerateButton
          ))}
      </div>
    </div>
  );
}
