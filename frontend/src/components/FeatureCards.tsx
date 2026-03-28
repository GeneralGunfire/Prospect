export default function FeatureCards() {
  const features = [
    {
      title: "Free Forever",
      description: "No fees, no subscriptions. Career guidance for all South African students.",
    },
    {
      title: "Built for SA",
      description: "Real South African job data, colleges, universities, and salaries.",
    },
    {
      title: "No Login Needed",
      description: "Just take the quiz and discover your perfect career match instantly.",
    },
    {
      title: "Works Offline",
      description: "Low data friendly. Works even with limited internet connectivity.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
            Why Choose Prospect
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
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
