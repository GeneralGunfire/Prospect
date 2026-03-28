export default function DarkHeroSection() {
  const steps = [
    "Take the Quiz",
    "Get Matched",
    "See Your Path",
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-navy text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                Your Career Roadmap Starts Here
              </h2>
              <p className="text-lg text-gray-300 font-sans">
                A personalized guide tailored to your strengths and ambitions
              </p>
            </div>

            {/* 3 Steps as Badges */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-prospect-blue flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="text-lg font-semibold">{step}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="px-8 py-4 bg-prospect-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200">
              Start the Quiz Now
            </button>
          </div>

          {/* Right Decorative Shape */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Gradient Blob */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-prospect-blue via-indigo-500 to-transparent opacity-20 blur-2xl"></div>
              {/* Accent Rings */}
              <div className="absolute inset-12 rounded-2xl border border-prospect-blue opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
