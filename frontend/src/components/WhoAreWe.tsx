export default function WhoAreWe() {
  const sections = [
    {
      title: "For Students",
      description: "Get clarity on your future with a personalized career path based on real data.",
    },
    {
      title: "For Parents",
      description: "Support your child's decision with evidence-based career recommendations.",
    },
    {
      title: "For Teachers",
      description: "Guide your students with comprehensive career resources and subject relevance.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-gray">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
              Helping South African Students Succeed
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We believe every student deserves a clear path forward. Our mission is to make career guidance free, accessible, and tailored to the South African context.
            </p>

            {/* 3 Bulleted Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-prospect-navy mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Placeholder (2x2 Grid) */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-prospect-blue to-blue-400 rounded-lg h-40 opacity-50"></div>
            <div className="bg-gradient-to-br from-purple-400 to-blue-300 rounded-lg h-40 opacity-50"></div>
            <div className="bg-gradient-to-br from-indigo-400 to-blue-400 rounded-lg h-40 opacity-50"></div>
            <div className="bg-gradient-to-br from-blue-300 to-prospect-blue rounded-lg h-40 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
