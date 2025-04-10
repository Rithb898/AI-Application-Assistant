"use client";

import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import toast from "react-hot-toast";

type ApplicationAnswersProps = {
  data: {
    interestInCompany: string;
    coverLetter: string;
    whyFit: string;
    valueAdd: string;
    linkedinSummary: string;
    shortAnswer: string;
  };
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">{children}</h2>
);

const Box = ({
  children,
  textToCopy,
}: {
  children: React.ReactNode;
  textToCopy: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group bg-white rounded-2xl shadow p-4 border border-gray-200 whitespace-pre-wrap">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Clipboard className="w-4 h-4 text-gray-500 group-hover:text-black transition" />
        )}
      </button>
      {children}
    </div>
  );
};

const ApplicationAnswers: React.FC<ApplicationAnswersProps> = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4 px-4 py-6">
      <Label>🤔 What interests you about working for this company?</Label>
      <Box textToCopy={data.interestInCompany}>
        <span className="text-black">{data.interestInCompany}</span>
      </Box>

      <Label>📄 Cover Letter</Label>
      <Box textToCopy={data.coverLetter}>
        {" "}
        <span className="text-black">{data.coverLetter}</span>
      </Box>

      <Label>✅ Why are you a good fit?</Label>
      <Box textToCopy={data.whyFit}>
        <span className="text-black">{data.whyFit}</span>
      </Box>

      <Label>🚀 What value will you bring?</Label>
      <Box textToCopy={data.valueAdd}>
        <span className="text-black">{data.valueAdd}</span>
      </Box>

      <Label>💬 LinkedIn Summary Message</Label>
      <Box textToCopy={data.linkedinSummary}>
        <span className="text-black">{data.linkedinSummary}</span>
      </Box>

      <Label>⚡ Quick Form Answer</Label>
      <Box textToCopy={data.shortAnswer}>
        <span className="text-black">{data.shortAnswer}</span>
      </Box>
    </div>
  );
};

export default ApplicationAnswers;
