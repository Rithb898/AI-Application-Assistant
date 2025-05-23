import React from "react";
import * as motion from "motion/react-client";
import { FileText, SparklesIcon, Target } from "lucide-react";

function FeatureHighlight() {
  return (
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
            Spend less time applying, more time interviewing. Here’s how easy it
            is:
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
  );
}

export default FeatureHighlight;
