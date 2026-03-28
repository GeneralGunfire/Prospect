"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WhoAreWe() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sections = [
    {
      title: "For Students",
      description: "Get clarity on your future with a personalized career path based on real data.",
    },
    {
      title: "For Parents",
      description: "Support your child's decision with evidence-based career recommendations.",
    },
    {
      title: "For Teachers",
      description: "Guide your students with comprehensive career resources and subject relevance.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-gray"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <motion.h2
              variants={item}
              className="text-4xl md:text-5xl font-bold text-prospect-navy mb-4"
            >
              Helping South African Students Succeed
            </motion.h2>
            <motion.p
              variants={item}
              className="text-lg text-gray-600 mb-8"
            >
              We believe every student deserves a clear path forward. Our mission is to make career guidance free, accessible, and tailored to the South African context.
            </motion.p>

            {/* 3 Bulleted Sections */}
            <motion.div variants={container} className="space-y-6">
              {sections.map((section, index) => (
                <motion.div key={index} variants={item}>
                  <h3 className="text-lg font-bold text-prospect-navy mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">
                    {section.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image Placeholder (2x2 Grid) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            {[0, 1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-prospect-blue/30 to-blue-400/30 rounded-xl h-40"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
