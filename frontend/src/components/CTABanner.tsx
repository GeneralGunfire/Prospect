export default function CTABanner() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-blue text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Ready to Find Your Career?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10">
          Start with a quick quiz that matches you to careers in South Africa
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white hover:bg-gray-100 text-prospect-blue font-semibold rounded-lg transition-all duration-200">
            Start the Quiz
          </button>
          <button className="px-8 py-4 border-2 border-white hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200">
            Browse All Careers
          </button>
        </div>
      </div>
    </section>
  );
}
