export default function HowItWorks() {
  const steps = [
    {
      title: "Take the Quiz",
      description: "Answer questions about your strengths, interests, and subjects to help us understand you better.",
    },
    {
      title: "Get Matched",
      description: "Our algorithm matches you with careers that align with your profile and market demand.",
    },
    {
      title: "See Your Path",
      description: "View your personalized career roadmap with universities, TVET colleges, and entry requirements.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Numbered Circle */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-prospect-blue text-white flex items-center justify-center text-3xl font-bold font-display">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-prospect-navy mb-3 font-display">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
