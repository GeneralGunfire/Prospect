"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ThreeColumnFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Strengths Assessment",
      description:
        "Enter your marks and subjects. Our intelligent matching engine instantly identifies careers that fit your profile.",
    },
    {
      title: "Full Career Roadmap",
      description:
        "See matric requirements, universities, TVET options, potential salaries, and job market demand for each career.",
    },
    {
      title: "Study Resources",
      description:
        "Access Grade 10–12 content and resources to help you prepare for your chosen career path.",
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
            What You Get
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-prospect-blue hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-prospect-blue bg-opacity-10 flex items-center justify-center mb-4">
                <span className="text-prospect-blue text-xl font-bold">✓</span>
              </div>
              <h3 className="text-xl font-bold text-prospect-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
