import React from "react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-32 text-center px-4">
      <motion.div // Wrap the content container
        initial="hidden"
        animate="visible"
        variants={{
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
  );
}

export default HeroSection;
