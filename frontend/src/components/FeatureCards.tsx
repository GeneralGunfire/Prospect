"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FeatureCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Free Forever",
      description: "No fees, no subscriptions. Career guidance for all South African students.",
    },
    {
      title: "Built for SA",
      description: "Real South African job data, colleges, universities, and salaries.",
    },
    {
      title: "No Login Needed",
      description: "Just take the quiz and discover your perfect career match instantly.",
    },
    {
      title: "Works Offline",
      description: "Low data friendly. Works even with limited internet connectivity.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-gray"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-prospect-navy mb-4">
            Why Choose Prospect
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
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
