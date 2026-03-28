"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-in-out forwards;
        }
      `}</style>

      <div className="animate-fade-in-scale">
        {/* Prospect Logo - Simple Blue Circle with "P" */}
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-prospect-blue">
          <span className="text-5xl font-bold text-white font-display">P</span>
        </div>
      </div>
    </div>
  );
}
