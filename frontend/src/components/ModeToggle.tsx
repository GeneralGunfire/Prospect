"use client";

import { useRouter } from "next/navigation";
import { getProspectMode, setProspectMode } from "@/lib/utils";
import { useState, useEffect } from "react";

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
    <button
      onClick={toggleMode}
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
      title={`Switch to ${mode === "normal" ? "Data Saver" : "Normal"} Mode`}
    >
      {mode === "normal" ? "📊" : "📵"}
    </button>
  );
}
