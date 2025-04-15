"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  FileText,
  Brain,
  Clock,
  Target,
  CheckCircle,
  SparklesIcon,
} from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    // Added bg-gradient from previous example as it was missing
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[180px] opacity-60"></div>
        <div className="absolute top-1/4 -left-80 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] opacity-50"></div>
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-32 text-center px-4">
        <motion.div // Wrap the content container
          initial="hidden"
          animate="visible"
          variants={{
            // Basic container for staggering children if needed later
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            <span className="block">Stop Writing Generic</span>
            <motion.span
              initial={{ width: 0 }} // Example: Animate width for gradient reveal
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mt-1 md:mt-2 overflow-hidden whitespace-nowrap" // Added overflow/whitespace for width animation
            >
              Job Applications.
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }} // Slightly later delay
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Leverage AI and your resume to instantly craft personalized cover
            letters, answer screening questions, and prepare for interviews –
            tailored to every job.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }} // Even later delay
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href="/create">
              {/* Added motion.div wrapper for potential hover/tap animations */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  Get Started Now <SparklesIcon className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Highlight / How it Works Section */}
      <motion.section // Animate section as it comes into view
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }} // Trigger when 10% is visible
        transition={{ duration: 0.7 }}
        className="relative z-10 py-16 md:py-24 bg-slate-900/40 backdrop-blur-sm px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div // Animate the heading block
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
              Generate Tailored Responses in 3 Simple Steps
            </h2>
            <p className="text-slate-400 md:text-lg max-w-xl mx-auto">
              Spend less time applying, more time interviewing. Here’s how easy
              it is:
            </p>
          </motion.div>

          <motion.div // Stagger children in the grid
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.75 }}
            transition={{ staggerChildren: 0.2 }} // Stagger delay
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            {/* Step 1 */}
            <motion.div // Animate each step card
              variants={{
                // Define variants for stagger children
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-col items-center text-center"
            >
              {/* You can add more specific animations to icons if desired */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }} // Delay icon pop slightly
                className="p-4 mb-4 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent border border-purple-500/30"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-slate-100">
                1. Upload Your Resume
              </h3>
              <p className="text-slate-400 text-sm">
                Securely upload your PDF resume. Our AI parses it instantly to
                understand your skills and experience. (Stored locally in your
                browser).
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={{
                // Use same variants for consistency
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="p-4 mb-4 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent border border-purple-500/30"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                  <Target className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-slate-100">
                2. Provide Job Details
              </h3>
              <p className="text-slate-400 text-sm">
                Enter the job title, company, description, and tech stack. Add
                optional company details for extra personalization.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={{
                // Use same variants
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="p-4 mb-4 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent border border-purple-500/30"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-slate-100">
                3. Get AI Responses
              </h3>
              <p className="text-slate-400 text-sm">
                Instantly receive tailored content for cover letters, "Why Me?"
                questions, LinkedIn messages, and potential interview questions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section // Animate section as it comes into view
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-20 md:py-28 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div // Animate heading block
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-purple-300 bg-purple-900/50 rounded-full mb-3">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
              Everything You Need to Apply Smarter
            </h2>
            <p className="text-slate-400 md:text-lg max-w-xl mx-auto">
              Go beyond generic templates and create applications that truly
              stand out.
            </p>
          </motion.div>

          <motion.div // Stagger children in the grid
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.15 }} // Slightly faster stagger
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Feature Item 1 */}
            <motion.div // Animate each feature card
              variants={{
                // Use same variants for consistency
                hidden: { opacity: 0, x: -30 }, // Slide in from left
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-start gap-4 p-5 rounded-lg bg-slate-900/50 border border-slate-800/60"
            >
              {/* Icon can have its own pop animation */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-1 flex-shrink-0 p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md text-white"
              >
                <CheckCircle className="w-5 h-5" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-slate-100">
                  Tailored Application Answers
                </h4>
                <p className="text-slate-400 text-sm">
                  Generate unique responses for "Why this company?", "Why are
                  you a good fit?", value proposition, and short form answers
                  based on the job and your resume.
                </p>
              </div>
            </motion.div>

            {/* Feature Item 2 */}
            <motion.div
              variants={{
                // Use same variants but slide from right
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-start gap-4 p-5 rounded-lg bg-slate-900/50 border border-slate-800/60"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-1 flex-shrink-0 p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md text-white"
              >
                <FileText className="w-5 h-5" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-slate-100">
                  Intelligent Resume Parsing
                </h4>
                <p className="text-slate-400 text-sm">
                  Upload your resume once. Our AI understands your background to
                  personalize every generated response. Stays securely in your
                  browser.
                </p>
              </div>
            </motion.div>

            {/* Feature Item 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-start gap-4 p-5 rounded-lg bg-slate-900/50 border border-slate-800/60"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-1 flex-shrink-0 p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-md text-white"
              >
                <Brain className="w-5 h-5" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-slate-100">
                  Interview Question Prep
                </h4>
                <p className="text-slate-400 text-sm">
                  Get a list of potential interview questions tailored to the
                  specific job description, helping you prepare effectively.
                </p>
              </div>
            </motion.div>

            {/* Feature Item 4 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-start gap-4 p-5 rounded-lg bg-slate-900/50 border border-slate-800/60"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-1 flex-shrink-0 p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md text-white"
              >
                <Clock className="w-5 h-5" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-slate-100">
                  Save Time & Stay Organized
                </h4>
                <p className="text-slate-400 text-sm">
                  Drastically reduce application time. Keep all your generated
                  responses neatly organized in your application history.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        {/* Optional: Add a visual element here */}
        {/* <motion.div ...> ... </motion.div> */}
      </motion.section>

      {/* Final CTA Section */}
      <motion.section // Simple fade-in-up for the whole section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 md:py-28 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
            Ready to Supercharge Your Job Hunt?
          </h2>
          <p className="text-slate-400 md:text-lg mb-10">
            Stop the copy-paste grind. Start creating applications that get
            noticed. Try the AI Application Assistant now.
          </p>
          <Link href="/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="px-10 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Generate Your First Response{" "}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer // Fade in footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }} // Slight delay
        className="relative z-10 border-t border-slate-800/50 py-8 px-4"
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} AI Application Assistant. All rights
            reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  );
}
