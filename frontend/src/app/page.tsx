"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoAnimationPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/data-saver-toggle");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Glow background circle */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="w-48 h-48 rounded-full bg-prospect-blue/5 blur-3xl animate-glow" />
      </motion.div>

      {/* Logo container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
        className="relative z-10"
      >
        {/* Logo circle with glow */}
        <motion.div
          className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-prospect-blue shadow-xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 102, 255, 0.5)",
              "0 0 40px rgba(0, 102, 255, 0.8)",
              "0 0 20px rgba(0, 102, 255, 0.5)",
            ],
          }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            repeat: 1,
          }}
        >
          <span className="text-6xl md:text-7xl font-bold text-white">P</span>
        </motion.div>
      </motion.div>

      {/* Fade out animation */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.9, duration: 0.1 }}
      />
    </div>
  );
}
