"use client";

import { ReactNode } from "react";
import { FeatureCarousel } from "./FeatureCarousel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form (45%) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Carousel (55%, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] bg-prospect-green">
        <FeatureCarousel />
      </div>
    </div>
  );
}
