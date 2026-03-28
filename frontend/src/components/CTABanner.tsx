"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-prospect-blue to-blue-600 text-white relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to Find Your Career?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10">
          Start with a quick quiz that matches you to careers in South Africa
        </p>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white hover:shadow-2xl text-prospect-blue font-bold rounded-xl transition-all duration-200"
          >
            Start the Quiz
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-200"
          >
            Browse All Careers
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
