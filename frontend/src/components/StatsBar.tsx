"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsBar() {
  const [counts, setCounts] = useState({ careers: 0, tvet: 0, unis: 0, free: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { label: "200+ Careers", key: "careers", target: 200 },
    { label: "50 TVET Colleges", key: "tvet", target: 50 },
    { label: "26 Universities", key: "unis", target: 26 },
    { label: "100% Free", key: "free", target: 100 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate counts
          stats.forEach(({ key, target }) => {
            let current = 0;
            const increment = target / 20;
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              setCounts((prev) => ({
                ...prev,
                [key]: Math.floor(current),
              }));
            }, 50);
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 bg-prospect-blue text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold font-display mb-2">
              {counts.careers}+
            </div>
            <p className="text-lg opacity-90">Careers</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold font-display mb-2">
              {counts.tvet}
            </div>
            <p className="text-lg opacity-90">TVET Colleges</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold font-display mb-2">
              {counts.unis}
            </div>
            <p className="text-lg opacity-90">Universities</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold font-display mb-2">
              {counts.free}%
            </div>
            <p className="text-lg opacity-90">Free</p>
          </div>
        </div>
      </div>
    </section>
  );
}
