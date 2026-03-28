"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 min-h-screen flex items-center bg-prospect-navy text-white overflow-hidden relative">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 rounded-full bg-prospect-blue/10 blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance"
            >
              Discover Your Perfect Career Path
            </motion.h1>

            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed text-balance"
            >
              Find the right career based on your strengths, interests, and what South Africa needs
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-prospect-blue hover:shadow-2xl text-white font-bold rounded-xl transition-all duration-200"
              >
                Start the Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-200"
              >
                Browse Careers
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Decorative Shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden md:flex items-center justify-center"
          >
            <motion.div
              className="relative w-80 h-80"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Gradient Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-prospect-blue via-purple-500 to-pink-500 opacity-30 blur-3xl" />
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-prospect-blue opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              {/* Inner Accent */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-prospect-blue to-transparent opacity-20" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
