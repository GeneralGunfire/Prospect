"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUpNumber({ end, duration = 2.5 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, end, duration]);

  return <div ref={ref}>{count}</div>;
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Careers", count: 200 },
    { label: "TVET Colleges", count: 50 },
    { label: "Universities", count: 26 },
    { label: "Free", count: 100 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-prospect-blue to-blue-600 text-white relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center relative z-10"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <motion.div
              className="text-5xl md:text-6xl font-bold mb-2 will-change-transform"
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : { scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1,
              }}
            >
              <CountUpNumber end={stat.count} duration={2.5} />
              {stat.count === 100 ? "%" : "+"}
            </motion.div>
            <p className="text-lg md:text-xl opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
