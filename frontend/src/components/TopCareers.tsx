"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function TopCareers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const careers = [
    {
      name: "Software Developer",
      demand: "High",
      entrySalary: "R300K - R400K",
      unis: ["UCT", "Wits"],
    },
    {
      name: "Registered Nurse",
      demand: "High",
      entrySalary: "R200K - R280K",
      unis: ["UCT", "Wits"],
    },
    {
      name: "Electrician",
      demand: "High",
      entrySalary: "R180K - R250K",
      unis: [],
    },
    {
      name: "Chartered Accountant",
      demand: "High",
      entrySalary: "R280K - R380K",
      unis: ["UP", "Stellenbosch"],
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
            Top In-Demand Careers in South Africa
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {careers.map((career, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 25 },
              }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-prospect-navy">
                  {career.name}
                </h3>
                <span className="text-2xl">🔥</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">Demand</p>
                  <p className="text-prospect-blue font-semibold">{career.demand}</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Entry Salary</p>
                  <p className="text-prospect-dark">{career.entrySalary}</p>
                </div>

                {career.unis.length > 0 && (
                  <div>
                    <p className="text-gray-600 font-semibold">Universities</p>
                    <p className="text-prospect-dark">{career.unis.join(", ")}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
