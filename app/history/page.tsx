"use client";

import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Import the actual storage functions
import { getResponseHistory, deleteResponseFromHistory } from "@/lib/storage"; // Use the correct path to your storage utils
import { formatDistanceToNow } from "date-fns";
import {
  Trash2,
  ArrowLeft,
  ExternalLink,
  Clock,
  Building,
  Archive, // Keep Archive for empty state
  FilePlus,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HistoryItemType } from "@/lib/types"; // Use the correct path to your types
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react"; // Use framer-motion for better control
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    // Add exit animation for deletion
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const emptyStateVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// --- Skeleton Card Component ---
const SkeletonCard = () => (
  <Card className="flex flex-col bg-slate-900/70 border border-slate-700/80 rounded-xl shadow-lg backdrop-blur-md h-full">
    <CardHeader className="pb-2 pt-4 px-4 md:px-5">
      <Skeleton className="h-6 w-3/4 mb-1 rounded-md" /> {/* Title */}
      <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Company */}
    </CardHeader>
    <CardContent className="flex-grow pb-2 px-4 md:px-5">
      <Skeleton className="h-3 w-2/5 rounded-md" /> {/* Date */}
    </CardContent>
    <CardFooter className="flex justify-between items-center p-3 border-t border-slate-700/60 bg-gradient-to-t from-slate-900/80 to-transparent mt-auto">
      <Skeleton className="h-8 w-2/5 rounded-md" /> {/* View Button */}
      <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete Icon */}
    </CardFooter>
  </Card>
);

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  // Fetch history data using an async function
  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the async function from storage utils
      const fetchedHistory = await getResponseHistory();
      // Ensure sorting happens after fetching
      setHistory(
        fetchedHistory.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Could not load history. Please try again later.");
      toast.error("Failed to load history.");
      setHistory([]); // Clear history on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Depend on fetchHistory

  // Handle Deletion - Make it async to await the DB operation
  const handleDelete = async (id: string, title: string, company: string) => {
    // Optimistically update UI first
    const originalHistory = [...history];
    setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));

    try {
      // Call the async delete function
      await deleteResponseFromHistory(id);
      toast.success(
        `Deleted response for ${title || "Untitled"} at ${company || "Unknown"}.`,
      );
      // No need to re-fetch if optimistic update is sufficient
    } catch (error) {
      console.error("Failed to delete history item:", error);
      toast.error("Failed to delete response. Reverting changes.");
      // Revert state if deletion failed
      setHistory(originalHistory);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 px-4 py-8 md:py-12">
      {/* Background elements (unchanged) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] opacity-50"></div>
        <div className="absolute top-1/3 -left-60 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Page Header (unchanged, using motion) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <Link href="/create">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 hover:text-white h-9 px-3 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" /> Back to App
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 pb-1">
                Application History
              </h1>
              <p className="text-slate-400 mt-1 text-sm md:text-base">
                Manage your previously generated AI responses.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link href="/create" className="w-full sm:w-auto">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full h-9 px-4"
              >
                <FilePlus className="w-4 h-4" /> Create New Application
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            // --- Loading State with Skeletons ---
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Display multiple skeleton cards */}
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </motion.div>
          ) : error ? (
            // --- Error State ---
            <motion.div
              key="error-state"
              variants={emptyStateVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-16 flex justify-center"
            >
              <Card className="w-full max-w-lg text-center bg-red-900/20 border border-red-500/30 py-12 px-6">
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-red-500/20 rounded-full border border-red-500/40">
                    <AlertTriangle className="h-10 w-10 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Loading Error
                  </h2>
                  <p className="text-slate-400 max-w-sm mx-auto text-sm">
                    {error}
                  </p>
                  <Button
                    onClick={fetchHistory}
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : history.length === 0 ? (
            // --- Empty State ---
            <motion.div
              key="empty-state"
              variants={emptyStateVariant}
              initial="hidden"
              animate="visible"
              exit="exit" // Use exit variant
              className="mt-16 flex justify-center"
            >
              {/* Empty state card remains largely the same */}
              <Card className="w-full max-w-lg text-center bg-slate-900/60 border-2 border-dashed border-slate-700/80 py-12 px-6 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center space-y-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="p-4 bg-gradient-to-br from-purple-600/20 to-slate-800/30 rounded-full border border-purple-500/30 shadow-lg"
                  >
                    <Archive className="h-12 w-12 text-purple-300" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-semibold text-slate-100">
                      No History Yet
                    </h2>
                    <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                      Looks like you haven't generated any application
                      responses. Create one, and it will appear here
                      automatically.
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-4"
                  >
                    <Link href="/create">
                      <Button
                        size="lg"
                        className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-shadow"
                      >
                        Generate First Response
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // --- History Grid ---
            <motion.div
              key="history-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariant}
                  layout // Animate layout changes smoothly
                  exit="exit" // Apply exit animation on delete
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                  className="flex flex-col overflow-hidden"
                >
                  {/* Actual Card rendering remains the same */}
                  <Card className="h-full flex flex-col bg-slate-900/70 border border-slate-700/80 rounded-xl shadow-lg hover:shadow-purple-950/40 hover:border-slate-600/90 transition-all duration-200 backdrop-blur-md">
                    <CardHeader className="pb-2 pt-4 px-4 md:px-5">
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                        <Link
                          href={`/response/${item.id}`}
                          className="focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-sm group"
                        >
                          {item.jobTitle || "Untitled Job"}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm text-slate-400 pt-0.5">
                        <Building className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        {item.company || "Unknown Company"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2 px-4 md:px-5">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        Generated{" "}
                        {formatDistanceToNow(new Date(item.date), {
                          addSuffix: true,
                        })}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-3 border-t border-slate-700/60 bg-gradient-to-t from-slate-900/80 to-transparent mt-auto">
                      <Link
                        href={`/response/${item.id}`}
                        className="flex-1 mr-2"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left text-sky-400 hover:text-sky-300 hover:bg-sky-900/30 px-3 rounded-md"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> View Details
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500/70 hover:text-red-400 hover:bg-red-900/40 h-8 w-8 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Response</span>
                            </Button>
                          </motion.div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-950 border-slate-700 text-slate-200 shadow-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400 pt-2">
                              Permanently delete the response for{" "}
                              <strong className="text-slate-200">
                                "{item.jobTitle || "Untitled Job"}"
                              </strong>{" "}
                              at{" "}
                              <strong className="text-slate-200">
                                "{item.company || "Unknown Company"}"
                              </strong>
                              ? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-100">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(
                                  item.id,
                                  item.jobTitle,
                                  item.company,
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete Response
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
