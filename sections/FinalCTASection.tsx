import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import * as motion from "motion/react-client";

function FinalCTASection() {
  return (
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
  );
}

export default FinalCTASection;
