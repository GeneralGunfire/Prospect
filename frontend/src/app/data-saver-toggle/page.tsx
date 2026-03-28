"use client";

import { useRouter } from "next/navigation";
import { setProspectMode } from "@/lib/utils";

export default function DataSaverTogglePage() {
  const router = useRouter();

  const handleModeSelect = (mode: "normal" | "datasaver") => {
    setProspectMode(mode);
    router.push(mode === "normal" ? "/landing-normal" : "/landing-datasaver");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-prospect-blue mx-auto mb-8">
            <span className="text-3xl font-bold text-white font-display">P</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
            Choose Your Experience
          </h1>
          <p className="text-lg text-gray-600">
            Pick the version that works best for you
          </p>
        </div>

        <div className="space-y-4">
          {/* Normal Mode Button */}
          <button
            onClick={() => handleModeSelect("normal")}
            className="w-full py-4 px-6 bg-prospect-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 text-center"
          >
            Normal Mode
          </button>

          {/* Data Saver Button */}
          <button
            onClick={() => handleModeSelect("datasaver")}
            className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-prospect-navy font-semibold rounded-lg transition-all duration-200 text-center"
          >
            Data Saver
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          You can switch modes anytime on the landing page
        </p>
      </div>
    </div>
  );
}
