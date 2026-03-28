"use client";

import { useRouter } from "next/navigation";
import { getProspectMode, setProspectMode } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ModeToggle() {
  const router = useRouter();
  const [mode, setMode] = useState<"normal" | "datasaver">("normal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getProspectMode());
    setMounted(true);
  }, []);

  const toggleMode = () => {
    const newMode = mode === "normal" ? "datasaver" : "normal";
    setProspectMode(newMode);
    setMode(newMode);

    // Redirect to appropriate landing page
    const currentPath = window.location.pathname;
    if (currentPath.includes("landing")) {
      router.push(newMode === "normal" ? "/landing-normal" : "/landing-datasaver");
    }
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
      title={`Switch to ${mode === "normal" ? "Data Saver" : "Normal"} Mode`}
    >
      <motion.span
        key={mode}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {mode === "normal" ? "📊" : "📵"}
      </motion.span>
    </motion.button>
  );
}
