"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function DarkHeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    "Take the Quiz",
    "Get Matched",
    "See Your Path",
  ];

  return (
    <section
      ref={ref}
      className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-navy text-white relative overflow-hidden"
    >
      {/* Background blob */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-prospect-blue/5 blur-3xl"
        animate={{
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={item}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your Career Roadmap Starts Here
              </h2>
              <p className="text-lg text-gray-300">
                A personalized guide tailored to your strengths and ambitions
              </p>
            </motion.div>

            {/* 3 Steps as Badges */}
            <motion.div variants={container} className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-center space-x-4"
                >
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-prospect-blue flex items-center justify-center font-bold text-lg"
                    whileHover={{ scale: 1.2 }}
                  >
                    {index + 1}
                  </motion.div>
                  <span className="text-xl font-semibold">{step}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-prospect-blue hover:shadow-2xl text-white font-bold rounded-xl transition-all duration-200"
            >
              Start the Quiz Now
            </motion.button>
          </motion.div>

          {/* Right Decorative Shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateZ: -20 }}
            animate={inView ? { opacity: 1, scale: 1, rotateZ: 0 } : { opacity: 0, scale: 0.8, rotateZ: -20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:flex items-center justify-center"
          >
            <motion.div
              className="relative w-80 h-80"
              animate={{
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Gradient Blob */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-prospect-blue via-indigo-500 to-transparent opacity-20 blur-2xl" />
              {/* Accent Rings */}
              <motion.div
                className="absolute inset-12 rounded-2xl border border-prospect-blue opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
