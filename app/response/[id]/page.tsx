"use client";

import React, { useEffect, useState, useCallback, Fragment } from "react"; // Added Fragment
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResponseById } from "@/lib/storage";
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
  Frown,
  FilePlus,
  AlertTriangle,
  Newspaper, // Added icon for section heading // Added icon for section heading
} from "lucide-react";
import { GeneratedContentType, HistoryItemType } from "@/lib/types";
import ResponseSection from "@/components/ResponseSection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Import Separator
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react"; // Ensure using framer-motion
import { Skeleton } from "@/components/ui/skeleton";

// --- Type definitions and Animation Variants (unchanged) ---
type ApplicationMaterialKey =
  keyof GeneratedContentType["applicationMaterials"];

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

// --- Skeleton Components (unchanged) ---
const SkeletonResponseSection = () => (
  <Card className='bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm overflow-hidden'>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 md:px-5 border-b border-slate-700/40 bg-gradient-to-r from-slate-800/70 to-slate-900/40'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-6 w-6 rounded-md' /> {/* Icon placeholder */}
        <Skeleton className='h-5 w-32 rounded-md' /> {/* Title placeholder */}
      </div>
      <Skeleton className='h-7 w-24 rounded-md' /> {/* Button placeholder */}
    </CardHeader>
    <CardContent className='p-4 md:p-5 text-sm space-y-2'>
      <Skeleton className='h-4 w-full rounded-md' />
      <Skeleton className='h-4 w-full rounded-md' />
      <Skeleton className='h-4 w-3/4 rounded-md' />
    </CardContent>
  </Card>
);

const SkeletonInterviewSection = () => (
  <Card className='bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm overflow-hidden'>
    <CardHeader className='flex flex-row items-center space-y-0 pb-3 pt-4 px-4 md:px-5 border-b border-slate-700/40 bg-gradient-to-r from-slate-800/70 to-slate-900/40'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-6 w-6 rounded-md' /> {/* Icon */}
        <Skeleton className='h-5 w-40 rounded-md' /> {/* Title */}
      </div>
    </CardHeader>
    <CardContent className='p-4 md:p-5 text-sm space-y-2'>
      <Skeleton className='h-4 w-full rounded-md' />
      <Skeleton className='h-4 w-5/6 rounded-md' />
    </CardContent>
  </Card>
);

export default function ResponsePage() {
  // --- State and Hooks (mostly unchanged) ---
  const params = useParams();
  const router = useRouter();
  const [responseData, setResponseData] = useState<HistoryItemType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] =
    useState<ApplicationMaterialKey | null>(null);
  const [applicationMaterials, setApplicationMaterials] = useState<
    GeneratedContentType["applicationMaterials"] | null
  >(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [parsedResume, setParsedResume] = useState<string>("");

  // --- Fetch Data (unchanged) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponseData(null); // Reset data on new fetch

    const idParam = params.id;
    if (!idParam) {
      setError("No response ID provided.");
      setLoading(false);
      return;
    }
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    try {
      const data = await getResponseById(id);
      if (data) {
        setResponseData(data);
        setApplicationMaterials(data.data.applicationMaterials);
        setInterviewQuestions(data.data.interviewPrep?.questions || []);
        // TODO: Populate parsedResume if stored in 'data.resume'
        // if (data.resume && typeof data.resume === 'object') {
        //   try {
        //     setParsedResume(JSON.stringify(data.resume)); // Assuming resume data is stored as an object
        //     console.log("Resume data loaded from history item for regeneration.");
        //   } catch (e) {
        //      console.error("Failed to stringify resume data from history item:", e);
        //   }
        // } else {
        //     console.warn("Resume data not found or not an object in history item. Regeneration might be disabled.");
        // }
      } else {
        setError(null);
        setResponseData(null);
      }
    } catch (err) {
      console.error("Failed to fetch response:", err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Could not load response: ${message}. Please try again later.`);
      toast.error("Failed to load response.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Regeneration Logic (unchanged) ---
  const handleRegenerate = async (field: ApplicationMaterialKey) => {
    if (!responseData || !parsedResume || isRegenerating) {
      if (!parsedResume) {
        toast.error("Resume data not available for regeneration.");
      }
      return;
    }
    setIsRegenerating(field);
    const toastId = toast.loading(`Regenerating ${field}...`);
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
          .catch(() => ({
            message: `Regeneration failed (${response.status})`,
          }));
        throw new Error(errorData.message || "Network response was not ok");
      }
      const result = await response.json();
      const updatedText = result.output;
      if (
        updatedText &&
        typeof updatedText === "string" &&
        applicationMaterials
      ) {
        const newMaterials = { ...applicationMaterials, [field]: updatedText };
        setApplicationMaterials(newMaterials);
        // Consider saving the updated data back to history here if needed
        toast.success(`${field} regenerated successfully!`, { id: toastId });
      } else {
        throw new Error("Invalid response format from regeneration API.");
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Regeneration failed: ${message}`, { id: toastId });
    } finally {
      setIsRegenerating(null);
    }
  };

  // --- Loading State (Modified Skeleton) ---
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 px-4 py-8 md:py-12'>
        {/* Background elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
          <div className='absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] opacity-50'></div>
          <div className='absolute top-1/3 -left-60 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] opacity-50'></div>
        </div>
        <div className='relative max-w-7xl mx-auto z-10 animate-pulse'>
          {/* Skeleton Header Buttons */}
          <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
            <Skeleton className='h-9 w-36 rounded-md' />
            <Skeleton className='h-9 w-48 rounded-md' />
          </div>
          {/* Skeleton Application Header */}
          <Card className='mb-8 bg-slate-900/70 border-slate-700/80 backdrop-blur-lg'>
            <CardHeader>
              <Skeleton className='h-8 w-3/5 mb-2 rounded-md' /> {/* Title */}
              <div className='flex items-center gap-2 mt-1.5'>
                <Skeleton className='h-5 w-5 rounded-md' /> {/* Icon */}
                <Skeleton className='h-5 w-2/5 rounded-md' /> {/* Company */}
              </div>
              <Skeleton className='h-3 w-1/4 mt-3 ml-auto rounded-md' />{" "}
              {/* Date */}
            </CardHeader>
          </Card>
          {/* Skeleton Content Sections */}
          <div className='space-y-6'>
            {/* Skeleton Application Materials Section */}
            <div>
              <Skeleton className='h-7 w-48 mb-4 rounded-md' />{" "}
              {/* Section Title */}
              <div className='space-y-5'>
                <SkeletonResponseSection />
                <SkeletonResponseSection />
              </div>
            </div>
            {/* Skeleton Separator */}
            <Skeleton className='h-px w-full bg-slate-700 my-6 rounded-full' />
            {/* Skeleton Interview Prep Section */}
            <div>
              <Skeleton className='h-7 w-40 mb-4 rounded-md' />{" "}
              {/* Section Title */}
              <div className='space-y-5'>
                <SkeletonInterviewSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error State (unchanged) ---
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4'>
        <motion.div // Scale/fade in error card
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className='w-full max-w-md bg-red-900/20 border border-red-500/30 text-center backdrop-blur-sm'>
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 border border-red-700/50 mb-4'
              >
                <AlertTriangle className='h-6 w-6 text-red-400' />
              </motion.div>
              <CardTitle className='text-2xl font-semibold text-slate-100'>
                Loading Error
              </CardTitle>
              <CardDescription className='text-slate-400 pt-1 px-4'>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 pt-4'>
              <Button
                onClick={() => fetchData()} // Retry button
                variant='secondary'
                className='w-full border-slate-600 hover:bg-slate-800 h-10'
              >
                Try Again
              </Button>
              <Link href='/history' className='w-full'>
                <Button
                  variant='outline'
                  className='w-full border-slate-600 hover:bg-slate-800 h-10'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' /> Go Back to History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- Not Found State (unchanged) ---
  if (!responseData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4'>
        <motion.div // Scale/fade in not found card
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className='w-full max-w-md bg-slate-900/80 border-slate-700 text-center backdrop-blur-sm'>
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-900/50 border border-blue-700/50 mb-4'
              >
                <Frown className='h-6 w-6 text-blue-400' />
              </motion.div>
              <CardTitle className='text-2xl font-semibold text-slate-100'>
                Response Not Found
              </CardTitle>
              <CardDescription className='text-slate-400 pt-1'>
                We couldn't find this application response. It might have been
                deleted or doesn't belong to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 pt-4'>
              <Link href='/history' className='w-full'>
                <Button
                  variant='outline'
                  className='w-full border-slate-600 hover:bg-slate-800 h-10'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back to History
                </Button>
              </Link>
              <Link href='/create' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10'>
                  <FilePlus className='mr-2 h-4 w-4' /> Create New Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- Main Content (Render only if responseData is available) ---
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
      icon: <Heart className='w-4 h-4' />,
      gradient: ["from-pink-500", "to-red-500"],
    },
    {
      key: "coverLetter",
      title: "Cover Letter Snippet",
      icon: <FileText className='w-4 h-4' />,
      gradient: ["from-blue-500", "to-cyan-500"],
    },
    {
      key: "whyFit",
      title: "Why You're a Good Fit",
      icon: <CheckCircle2 className='w-4 h-4' />,
      gradient: ["from-green-500", "to-emerald-500"],
    },
    {
      key: "valueAdd",
      title: "Value You Bring",
      icon: <Rocket className='w-4 h-4' />,
      gradient: ["from-orange-500", "to-amber-500"],
    },
    {
      key: "linkedinSummary",
      title: "LinkedIn Outreach Snippet",
      icon: <Linkedin className='w-4 h-4' />,
      gradient: ["from-sky-600", "to-indigo-600"],
    },
    {
      key: "shortAnswer",
      title: "Quick Form Answer",
      icon: <Zap className='w-4 h-4' />,
      gradient: ["from-violet-500", "to-purple-500"],
    },
  ];

  // Determine if there's any content to show at all
  const hasApplicationMaterials =
    applicationMaterials &&
    Object.values(applicationMaterials).some((val) => !!val);
  const hasInterviewQuestions = interviewQuestions.length > 0;
  const hasAnyContent = hasApplicationMaterials || hasInterviewQuestions;

  return (
    <motion.main
      variants={pageTransition}
      initial='hidden'
      animate='visible'
      exit='exit'
      className='min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 px-4 py-8 md:py-12'
    >
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
        <div className='absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] opacity-50'></div>
        <div className='absolute top-1/3 -left-60 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] opacity-50'></div>
      </div>

      <div className='relative max-w-7xl mx-auto z-10'>
        {/* Page Header Buttons (unchanged) */}
        <motion.div
          variants={staggerContainer}
          initial='hidden'
          animate='visible'
          className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'
        >
          <motion.div variants={itemFadeIn}>
            <Link href='/history'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 hover:text-white w-full sm:w-auto h-9 rounded-md'
              >
                <ArrowLeft className='w-4 h-4' /> Back to History
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={itemFadeIn}>
            <Link href='/create'>
              <Button
                size='sm'
                className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full sm:w-auto h-9 rounded-md'
              >
                <FilePlus className='w-4 h-4' /> Create New Application
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Application Header Card (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <Card className='mb-8 bg-slate-900/70 border-slate-700/80 backdrop-blur-lg shadow-xl'>
            <CardHeader>
              <div className='flex flex-col sm:flex-row justify-between items-start gap-3'>
                <div>
                  <CardTitle className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 pb-1'>
                    {responseData.jobTitle}
                  </CardTitle>
                  <div className='flex items-center gap-2 mt-1.5 text-slate-400'>
                    <Building className='w-4 h-4 flex-shrink-0' />
                    <span className='text-base md:text-lg'>
                      {responseData.company}
                    </span>
                  </div>
                </div>
                <div className='text-xs text-slate-500 pt-1 sm:text-right flex-shrink-0'>
                  Generated on: {formattedDate}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* --- Content Area (Tabs) --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className='space-y-8' // Add space between the two main sections
        >
          <Tabs defaultValue='applicationMaterials' className='w-full'>
            <TabsList className='w-full flex justify-center bg-slate-800/50 rounded-md p-1 mb-5'>
              <TabsTrigger
                value='applicationMaterials'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white h-10'
              >
                Application Materials
              </TabsTrigger>
              <TabsTrigger
                value='interviewPrep'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white h-10'
              >
                Interview Prep
              </TabsTrigger>
            </TabsList>
            <TabsContent value='applicationMaterials' className='space-y-8'>
              {/* Section 1: Application Materials */}
              {hasApplicationMaterials && (
                <section aria-labelledby='application-materials-heading'>
                  <h2
                    id='application-materials-heading'
                    className='text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2'
                  >
                    <Newspaper className='w-5 h-5 text-purple-400' />
                    Application Materials
                  </h2>
                  <motion.div
                    variants={staggerContainer}
                    initial='hidden'
                    animate='visible'
                    className='space-y-5'
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
                            regenerationDisabled={!parsedResume}
                            regenerationTooltip={
                              !parsedResume
                                ? "Resume data needed for regeneration"
                                : undefined
                            }
                          />
                        </motion.div>
                      ))}
                  </motion.div>
                </section>
              )}
            </TabsContent>

            <TabsContent value='interviewPrep' className='space-y-8'>
              {/* Section 2: Interview Prep */}
              {hasInterviewQuestions && (
                <section aria-labelledby='interview-prep-heading'>
                  <h2
                    id='interview-prep-heading'
                    className='text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2'
                  >
                    Interview Preparation
                  </h2>
                  <motion.div
                    variants={staggerContainer}
                    initial='hidden'
                    animate='visible'
                    className='space-y-5'
                  >
                    {interviewQuestions.map((question, index) => (
                      <motion.div
                        key={`interview-${index}`}
                        variants={itemFadeIn}
                      >
                        <ResponseSection
                          icon={<Brain className='w-4 h-4' />}
                          title={`Potential Question ${index + 1}`}
                          content={question}
                          gradientFrom='from-teal-500'
                          gradientTo='to-cyan-600'
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}
            </TabsContent>

            {/* Fallback if NO content exists at all */}
            {!hasAnyContent && (
              <motion.div variants={itemFadeIn}>
                <Card className='bg-slate-800/50 border-slate-700'>
                  <CardContent className='pt-6 text-center text-slate-400'>
                    No generated content (application materials or interview
                    questions) found for this response.
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Tabs>
        </motion.div>
      </div>
    </motion.main>
  );
}
