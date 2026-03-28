"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      title: "Take the Quiz",
      description: "Answer questions about your strengths, interests, and subjects to help us understand you better.",
    },
    {
      title: "Get Matched",
      description: "Our algorithm matches you with careers that align with your profile and market demand.",
    },
    {
      title: "See Your Path",
      description: "View your personalized career roadmap with universities, TVET colleges, and entry requirements.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={ref} className="py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-prospect-navy mb-4">
            How It Works
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={item} className="text-center">
              {/* Numbered Circle */}
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.15 }}
              >
                <div className="w-16 h-16 rounded-full bg-prospect-blue text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  {index + 1}
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-prospect-navy mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
