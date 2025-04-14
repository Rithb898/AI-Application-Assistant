"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy, Loader2, RefreshCcw, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Define props interface separately for better readability
interface ResponseSectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  gradientFrom?: string;
  gradientTo?: string;
  onRegenerate?: () => void; // Keep optional
  isRegenerating?: boolean; // Add the missing prop, make it optional
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
}: ResponseSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mb-8 bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 shadow-lg">
      <div
        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="p-5 text-neutral-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      <div className="flex justify-end p-3 gap-2 border-t border-neutral-700 bg-neutral-900/50">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className={`gap-2 transition-all ${
            copied
              ? "bg-green-900/20 text-green-400 border-green-800"
              : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>

        {/* Regenerate Button */}
        {onRegenerate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating} // Disable button when regenerating
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
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
