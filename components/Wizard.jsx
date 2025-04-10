"use client";

import React, { useState } from "react";
import MultiStep from "react-multistep";

// Step Components
const UploadResumeStep = ({ setResumeText }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
      <input type="file" accept="application/pdf" />
      {/* TODO: Add pdf-parse logic and call setResumeText */}
    </div>
  );
};

const JobInfoStep = ({
  jobDetails = { title: "", description: "", company: "" },
  setJobDetails,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Enter Job & Company Info</h2>
      <input
        placeholder="Job Title"
        value={jobDetails.title}
        onChange={(e) =>
          setJobDetails({ ...jobDetails, title: e.target.value })
        }
        className="w-full mb-2 p-2 border"
      />
      <textarea
        placeholder="Job Description"
        value={jobDetails.description}
        onChange={(e) =>
          setJobDetails({ ...jobDetails, description: e.target.value })
        }
        className="w-full h-32 p-2 border"
      />
    </div>
  );
};

const ResumeReviewStep = ({ resumeText, setResumeText }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review Parsed Resume</h2>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        className="w-full h-60 border p-2"
      />
    </div>
  );
};

const GenerateResponsesStep = ({ resumeText, jobDetails }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI-Generated Responses</h2>
      <p>Generating content based on your resume and job info...</p>
      {/* TODO: Hook up AI call and display responses */}
    </div>
  );
};

const ExportStep = ({ responses }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Export Your Responses</h2>
      {/* TODO: Add copy and export options */}
    </div>
  );
};

const Wizard = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    company: "",
  });
  const [responses, setResponses] = useState({});

  const steps = [
    {
      name: "Upload",
      component: <UploadResumeStep setResumeText={setResumeText} />,
    },
    {
      name: "Job Info",
      component: (
        <JobInfoStep jobDetails={jobDetails} setJobDetails={setJobDetails} />
      ),
    },
    {
      name: "Review Resume",
      component: (
        <ResumeReviewStep
          resumeText={resumeText}
          setResumeText={setResumeText}
        />
      ),
    },
    {
      name: "Generate",
      component: (
        <GenerateResponsesStep
          resumeText={resumeText}
          jobDetails={jobDetails}
        />
      ),
    },
    { name: "Export", component: <ExportStep responses={responses} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <MultiStep steps={steps} prevStyle={{}} nextStyle={{}} />
    </div>
  );
};

export default Wizard;
