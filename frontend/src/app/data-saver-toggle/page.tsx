"use client";

import { useRouter } from "next/navigation";
import { setProspectMode } from "@/lib/utils";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function DataSaverTogglePage() {
  const router = useRouter();

  const handleModeSelect = (mode: "normal" | "datasaver") => {
    setProspectMode(mode);
    router.push(mode === "normal" ? "/landing-normal" : "/landing-datasaver");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 overflow-hidden">
      {/* Animated background blob */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 rounded-full bg-prospect-blue/5 blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-300/5 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glassmorphic card */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md glass-card p-8 md:p-12"
      >
        {/* Logo */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-prospect-blue shadow-lg">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-3xl md:text-4xl font-bold text-center text-prospect-navy mb-3"
        >
          Choose Your Experience
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={item}
          className="text-center text-lg text-gray-600 mb-10"
        >
          Pick the version that works best for you
        </motion.p>

        {/* Button container */}
        <motion.div
          variants={container}
          className="space-y-4 mb-8"
        >
          {/* Normal Mode Button */}
          <motion.button
            variants={item}
            onClick={() => handleModeSelect("normal")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full py-4 px-6 bg-prospect-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl"
          >
            Full Experience
          </motion.button>

          {/* Data Saver Button */}
          <motion.button
            variants={item}
            onClick={() => handleModeSelect("datasaver")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-prospect-navy font-semibold rounded-xl transition-all duration-200 text-center border border-gray-300"
          >
            Data Saver Mode
          </motion.button>
        </motion.div>

        {/* Help text */}
        <motion.p
          variants={item}
          className="text-center text-sm text-gray-500"
        >
          You can switch modes anytime on the landing page
        </motion.p>
      </motion.div>
    </div>
  );
}
