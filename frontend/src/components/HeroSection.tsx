export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 min-h-screen flex items-center bg-prospect-navy text-white overflow-hidden">
      {/* CSS Grid Background Pattern */}
      <style>{`
        .grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="absolute inset-0 grid-pattern"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight">
                Discover Your Perfect Career Path
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-sans">
                Find the right career based on your strengths, interests, and what South Africa needs
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-prospect-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 text-center">
                Start the Quiz
              </button>
              <button className="px-8 py-4 border-2 border-white hover:bg-white hover:text-prospect-navy text-white font-semibold rounded-lg transition-all duration-200 text-center">
                Browse Careers
              </button>
            </div>
          </div>

          {/* Right Decorative Shape */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Gradient Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-prospect-blue via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
              {/* Outer Ring */}
              <div className="absolute inset-8 rounded-full border-2 border-prospect-blue opacity-30"></div>
              {/* Inner Accent */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-prospect-blue to-transparent opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
