"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResponseById, saveResponseToHistory } from "@/lib/storage";
import {
  ArrowLeft,
  Building,
  Heart,
  FileText,
  CheckCircle2,
  Rocket,
  Linkedin,
  Zap,
  Brain,
  Loader2,
  Frown,
  FilePlus,
  RefreshCw,
  Copy,
  HelpCircle,
} from "lucide-react";
import { GeneratedContentType, HistoryItemType } from "@/lib/types";
import ResponseSection from "@/components/ResponseSection"; // Assuming this component handles its own animations or accepts variants
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react"; // Import motion and AnimatePresence

type ApplicationMaterialKey =
  keyof GeneratedContentType["applicationMaterials"];

// --- Animation Variants ---
const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ResponsePage() {
  const params = useParams();
  const router = useRouter();
  const [responseData, setResponseData] = useState<HistoryItemType | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] =
    useState<ApplicationMaterialKey | null>(null);
  const [applicationMaterials, setApplicationMaterials] = useState<
    GeneratedContentType["applicationMaterials"] | null
  >(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);

  // Fetch data and set initial state (no changes to logic)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Add delay for loading viz
      if (params.id) {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = getResponseById(id);
        if (data) {
          setResponseData(data);
          setApplicationMaterials(data.data.applicationMaterials);
          setInterviewQuestions(data.data.interviewPrep?.questions || []);
        } else {
          setResponseData(null);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setResponseData(null);
      }
    }, 300); // 300ms delay
    return () => clearTimeout(timer);
  }, [params.id]);

  // Load parsed resume (no changes to logic)
  const [parsedResume, setParsedResume] = useState<string>("");
  useEffect(() => {
    const storedResume = localStorage.getItem("parsedResume");
    if (storedResume) {
      setParsedResume(storedResume);
    } else {
      console.warn("Parsed resume not found...");
    }
  }, []);

  // Regeneration Logic (no changes to logic)
  const handleRegenerate = async (field: ApplicationMaterialKey) => {
    if (!responseData || !parsedResume || isRegenerating) return;
    setIsRegenerating(field);
    toast.loading(`Regenerating ${field}...`);
    try {
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          data: {
            jobTitle: responseData.jobTitle,
            company: responseData.company,
          },
          parsedResume,
        }),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `Regen failed (${response.status})` }));
        throw new Error(errorData.message || "Network error");
      }
      const result = await response.json();
      const updatedText = result.output;
      if (updatedText && applicationMaterials) {
        const newMaterials = { ...applicationMaterials, [field]: updatedText };
        setApplicationMaterials(newMaterials);
        toast.success(`${field} regenerated!`);
      } else {
        throw new Error("Invalid API response.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Regen failed: ${message}`);
    } finally {
      toast.dismiss();
      setIsRegenerating(null);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div // Fade in loading indicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 text-slate-300"
        >
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          <p className="text-lg font-medium">Loading your AI responses...</p>
        </motion.div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!responseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div // Scale/fade in not found card
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 text-center backdrop-blur-sm">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 border border-red-700/50 mb-4"
              >
                <Frown className="h-6 w-6 text-red-400" />
              </motion.div>
              <CardTitle className="text-2xl font-semibold text-slate-100">
                Response Not Found
              </CardTitle>
              <CardDescription className="text-slate-400 pt-1">
                We couldn't find this application response. It might be deleted
                or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4">
              {" "}
              {/* Adjusted gap/pt */}
              <Link href="/history" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-slate-800 h-10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to History
                </Button>
              </Link>
              <Link href="/create" className="w-full">
                {" "}
                {/* Link to /create */}
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10">
                  <FilePlus className="mr-2 h-4 w-4" /> Create New Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- Main Content ---
  const formattedDate = responseData.date
    ? new Date(responseData.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const applicationSections: {
    key: ApplicationMaterialKey;
    title: string;
    icon: React.ReactNode;
    gradient: string[];
  }[] = [
    {
      key: "interestInCompany",
      title: "Interest in Company",
      icon: <Heart className="w-4 h-4" />,
      gradient: ["from-pink-500", "to-red-500"],
    },
    {
      key: "coverLetter",
      title: "Cover Letter Snippet",
      icon: <FileText className="w-4 h-4" />,
      gradient: ["from-blue-500", "to-cyan-500"],
    },
    {
      key: "whyFit",
      title: "Why You're a Good Fit",
      icon: <CheckCircle2 className="w-4 h-4" />,
      gradient: ["from-green-500", "to-emerald-500"],
    },
    {
      key: "valueAdd",
      title: "Value You Bring",
      icon: <Rocket className="w-4 h-4" />,
      gradient: ["from-orange-500", "to-amber-500"],
    },
    {
      key: "linkedinSummary",
      title: "LinkedIn Outreach Snippet",
      icon: <Linkedin className="w-4 h-4" />,
      gradient: ["from-sky-600", "to-indigo-600"],
    },
    {
      key: "shortAnswer",
      title: "Quick Form Answer",
      icon: <Zap className="w-4 h-4" />,
      gradient: ["from-violet-500", "to-purple-500"],
    },
  ];

  return (
    // Animate the entire page container for smooth transitions
    <motion.main
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 px-4 py-8 md:py-12"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] opacity-50"></div>
        <div className="absolute top-1/3 -left-60 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Page Header Buttons */}
        <motion.div // Stagger buttons in
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
        >
          <motion.div variants={itemFadeIn}>
            <Link href="/history">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 hover:text-white w-full sm:w-auto h-9 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" /> Back to History
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={itemFadeIn}>
            <Link href="/create">
              {" "}
              {/* Link to /create */}
              <Button
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full sm:w-auto h-9 rounded-md"
              >
                <FilePlus className="w-4 h-4" /> Create New Application
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Application Header Card */}
        <motion.div // Fade in header card
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <Card className="mb-8 bg-slate-900/70 border-slate-700/80 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 pb-1">
                    {responseData.jobTitle}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span className="text-base md:text-lg">
                      {responseData.company}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 pt-1 sm:text-right flex-shrink-0">
                  Generated on: {formattedDate}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Tabs for Content */}
        <motion.div // Fade in Tabs component
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Tabs defaultValue="application" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700 h-11 px-1 rounded-lg">
              <TabsTrigger
                value="application"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 hover:data-[state=inactive]:bg-slate-700/50 transition-all rounded-md"
              >
                Application Materials
              </TabsTrigger>
              <TabsTrigger
                value="interview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 hover:data-[state=inactive]:bg-slate-700/50 transition-all rounded-md"
              >
                Interview Prep
              </TabsTrigger>
            </TabsList>

            {/* AnimatePresence around TabsContent to animate content switches */}
            <AnimatePresence mode="wait">
              {/* Application Materials Tab Content */}
              <motion.div
                key="application-content" // Unique key for AnimatePresence
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TabsContent value="application" className="mt-6 space-y-5">
                  {/* Stagger children ResponseSections */}
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {applicationMaterials &&
                      applicationSections.map((section) => (
                        <motion.div key={section.key} variants={itemFadeIn}>
                          <ResponseSection
                            icon={section.icon}
                            title={section.title}
                            content={
                              applicationMaterials[section.key] ||
                              "Not generated."
                            }
                            gradientFrom={section.gradient[0]}
                            gradientTo={section.gradient[1]}
                            onRegenerate={
                              parsedResume
                                ? () => handleRegenerate(section.key)
                                : undefined
                            }
                            isRegenerating={isRegenerating === section.key}
                          />
                        </motion.div>
                      ))}
                    {!applicationMaterials && (
                      <p className="text-center text-slate-500 py-8">
                        Application materials data is missing.
                      </p>
                    )}
                  </motion.div>
                </TabsContent>
              </motion.div>

              {/* Interview Prep Tab Content */}
              <motion.div
                key="interview-content" // Unique key
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TabsContent value="interview" className="mt-6 space-y-5">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {interviewQuestions.length > 0 ? (
                      interviewQuestions.map((question, index) => (
                        <motion.div key={index} variants={itemFadeIn}>
                          <ResponseSection
                            icon={<Brain className="w-4 h-4" />}
                            title={`Potential Question ${index + 1}`}
                            content={question}
                            gradientFrom="from-teal-500"
                            gradientTo="to-cyan-600"
                          />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div variants={itemFadeIn}>
                        {" "}
                        {/* Animate fallback card too */}
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                          <CardContent className="pt-6 text-center text-slate-400">
                            No interview preparation questions were generated
                            for this application.
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.div // Fade in footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-slate-600 text-xs mt-12 mb-4"
        >
          <p>AI Application Assistant | Review generated content carefully.</p>
        </motion.div>
      </div>
    </motion.main>
  );
}
