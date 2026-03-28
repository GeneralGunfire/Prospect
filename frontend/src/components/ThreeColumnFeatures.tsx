export default function ThreeColumnFeatures() {
  const features = [
    {
      title: "Strengths Assessment",
      description:
        "Enter your marks and subjects. Our intelligent matching engine instantly identifies careers that fit your profile.",
    },
    {
      title: "Full Career Roadmap",
      description:
        "See matric requirements, universities, TVET options, potential salaries, and job market demand for each career.",
    },
    {
      title: "Study Resources",
      description:
        "Access Grade 10–12 content and resources to help you prepare for your chosen career path.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
            What You Get
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-prospect-blue hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-prospect-blue bg-opacity-10 flex items-center justify-center mb-4">
                <span className="text-prospect-blue text-xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-prospect-navy mb-3 font-display">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
