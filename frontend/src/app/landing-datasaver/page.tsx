"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setProspectMode } from "@/lib/utils";

export default function LandingDataSaver() {
  const router = useRouter();

  const toggleMode = () => {
    setProspectMode("normal");
    router.push("/landing-normal");
  };

  return (
    <div className="bg-white text-black">
      {/* Navigation */}
      <nav className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/landing-datasaver" className="font-bold text-lg">
            Prospect
          </Link>
          <button
            onClick={toggleMode}
            className="text-sm underline"
          >
            Switch to Normal
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="py-12 border-b border-gray-300">
          <h1 className="text-4xl font-bold mb-4">Discover Your Perfect Career Path</h1>
          <p className="text-lg mb-6">
            Find the right career based on your strengths, interests, and what South Africa needs
          </p>
          <div className="space-y-2">
            <a href="#quiz" className="block text-blue-600 underline py-2">
              Start the Quiz
            </a>
            <a href="#careers" className="block text-blue-600 underline py-2">
              Browse Careers
            </a>
          </div>
        </section>

        {/* Why Choose Prospect */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-8">Why Choose Prospect</h2>
          <ul className="space-y-4">
            <li>
              <strong>Free Forever:</strong> No fees, no subscriptions. Career guidance for all South African students.
            </li>
            <li>
              <strong>Built for SA:</strong> Real South African job data, colleges, universities, and salaries.
            </li>
            <li>
              <strong>No Login Needed:</strong> Just take the quiz and discover your perfect career match instantly.
            </li>
            <li>
              <strong>Works Offline:</strong> Low data friendly. Works even with limited internet connectivity.
            </li>
          </ul>
        </section>

        {/* Your Career Roadmap */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-6">Your Career Roadmap Starts Here</h2>
          <p className="mb-6">A personalized guide tailored to your strengths and ambitions</p>
          <ol className="space-y-3 ml-4">
            <li>1. Take the Quiz - Answer questions about your strengths and interests</li>
            <li>2. Get Matched - Find careers that align with your profile</li>
            <li>3. See Your Path - View your personalized career roadmap</li>
          </ol>
          <a href="#quiz" className="block text-blue-600 underline py-4">
            Start the Quiz Now
          </a>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-6">By The Numbers</h2>
          <ul className="space-y-2">
            <li>200+ Careers</li>
            <li>50 TVET Colleges</li>
            <li>26 Universities</li>
            <li>100% Free</li>
          </ul>
        </section>

        {/* How It Works */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <ol className="space-y-4 ml-4">
            <li>1. Take the Quiz - Answer questions about your strengths, interests, and subjects</li>
            <li>2. Get Matched - Our algorithm matches you with careers that fit your profile</li>
            <li>3. See Your Path - View your personalized career roadmap with universities and TVET options</li>
          </ol>
        </section>

        {/* Who We Help */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-6">Helping South African Students Succeed</h2>
          <p className="mb-6">We believe every student deserves a clear path forward.</p>
          <ul className="space-y-4">
            <li>
              <strong>For Students:</strong> Get clarity on your future with a personalized career path.
            </li>
            <li>
              <strong>For Parents:</strong> Support your child with evidence-based career recommendations.
            </li>
            <li>
              <strong>For Teachers:</strong> Guide your students with comprehensive career resources.
            </li>
          </ul>
        </section>

        {/* What You Get */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-8">What You Get</h2>
          <ul className="space-y-6">
            <li>
              <strong>Strengths Assessment:</strong> Enter your marks and subjects. Our algorithm instantly identifies matching careers.
            </li>
            <li>
              <strong>Full Career Roadmap:</strong> See matric requirements, universities, TVET options, salaries, and job market demand.
            </li>
            <li>
              <strong>Study Resources:</strong> Access Grade 10–12 content to help you prepare.
            </li>
          </ul>
        </section>

        {/* Top Careers */}
        <section className="py-12 border-b border-gray-300">
          <h2 className="text-3xl font-bold mb-8">Top In-Demand Careers in South Africa</h2>
          <ul className="space-y-6">
            <li>
              <strong>Software Developer</strong> - Entry Salary: R300,000 - R400,000. High demand.
            </li>
            <li>
              <strong>Registered Nurse</strong> - Entry Salary: R200,000 - R280,000. High demand.
            </li>
            <li>
              <strong>Electrician</strong> - Entry Salary: R180,000 - R250,000. High demand.
            </li>
            <li>
              <strong>Chartered Accountant</strong> - Entry Salary: R280,000 - R380,000. High demand.
            </li>
          </ul>
        </section>

        {/* Final CTA */}
        <section className="py-12 border-b border-gray-300 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Career?</h2>
          <p className="mb-6">Start with a quick quiz that matches you to careers in South Africa</p>
          <div className="space-y-2">
            <a href="#quiz" className="block text-blue-600 underline">
              Start the Quiz
            </a>
            <a href="#careers" className="block text-blue-600 underline">
              Browse All Careers
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm mb-4">
            <strong>Prospect</strong> - Free career guidance for South African high school students
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-8">
            <div>
              <p className="font-bold mb-2">Explore</p>
              <ul className="space-y-1">
                <li><a href="#" className="text-blue-600 underline">Home</a></li>
                <li><a href="#" className="text-blue-600 underline">Careers</a></li>
                <li><a href="#" className="text-blue-600 underline">Universities</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">Tools</p>
              <ul className="space-y-1">
                <li><a href="#" className="text-blue-600 underline">Career Quiz</a></li>
                <li><a href="#" className="text-blue-600 underline">Subject Selector</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">Resources</p>
              <ul className="space-y-1">
                <li><a href="#" className="text-blue-600 underline">Blog</a></li>
                <li><a href="#" className="text-blue-600 underline">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">Legal</p>
              <ul className="space-y-1">
                <li><a href="#" className="text-blue-600 underline">Privacy</a></li>
                <li><a href="#" className="text-blue-600 underline">Terms</a></li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            © 2024 Prospect. All rights reserved. | Free for South African students.
          </p>
        </div>
      </footer>
    </div>
  );
}
