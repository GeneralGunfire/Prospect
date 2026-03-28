export default function TopCareers() {
  const careers = [
    {
      name: "Software Developer",
      demand: "High",
      entrySalary: "R300,000 - R400,000",
      unis: ["UCT", "Wits", "Stellenbosch"],
      tvet: ["City TVET", "Damelin"],
    },
    {
      name: "Registered Nurse",
      demand: "High",
      entrySalary: "R200,000 - R280,000",
      unis: ["University of Cape Town", "University of Johannesburg"],
      tvet: ["Peninsula Maternity Hospital", "Western Cape TVET"],
    },
    {
      name: "Electrician",
      demand: "High",
      entrySalary: "R180,000 - R250,000",
      unis: [],
      tvet: ["Boland College", "Northlink College"],
    },
    {
      name: "Chartered Accountant",
      demand: "High",
      entrySalary: "R280,000 - R380,000",
      unis: ["University of Pretoria", "UNISA", "Stellenbosch"],
      tvet: [],
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-prospect-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-prospect-navy mb-4 font-display">
            Top In-Demand Careers in South Africa
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-prospect-navy font-display">
                  {career.name}
                </h3>
                <span className="text-red-500 text-2xl">🔥</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">Demand Level</p>
                  <p className="text-prospect-blue font-semibold">{career.demand}</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Entry Salary</p>
                  <p className="text-prospect-dark">{career.entrySalary}</p>
                </div>

                {career.unis.length > 0 && (
                  <div>
                    <p className="text-gray-600 font-semibold">Top Universities</p>
                    <p className="text-prospect-dark">{career.unis.slice(0, 2).join(", ")}</p>
                  </div>
                )}

                {career.tvet.length > 0 && (
                  <div>
                    <p className="text-gray-600 font-semibold">TVET Options</p>
                    <p className="text-prospect-dark">{career.tvet.slice(0, 1).join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
