"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Track Your Career Progress",
    description: "Monitor your journey from high school to your dream career",
    stat: "200+ Careers",
  },
  {
    title: "Study with Purpose",
    description:
      "Access Grade 10-12 content designed for your chosen career path",
    stat: "100% Free",
  },
  {
    title: "Find Your Fit",
    description: "Discover universities and TVET colleges perfect for your goals",
    stat: "76 Institutions",
  },
  {
    title: "Know What Employers Need",
    description: "See real job demand and salary data across South Africa",
    stat: "Live Market Data",
  },
];

export function FeatureCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Grid Pattern Background */}
      <style>{`
        .carousel-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="absolute inset-0 carousel-grid" />

      {/* Carousel Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Slide Content */}
        <div className="relative overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === current ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                {/* Stat Badge */}
                <div className="inline-block px-4 py-2 bg-prospect-green/10 rounded-lg">
                  <p className="text-sm font-semibold text-prospect-green">
                    {slide.stat}
                  </p>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-prospect-dark leading-tight">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600">{slide.description}</p>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 bg-prospect-green text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-8 px-2">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Support Button (top right) */}
      <button className="absolute top-8 right-8 px-4 py-2 text-white text-sm font-medium hover:underline">
        Support
      </button>
    </div>
  );
}
