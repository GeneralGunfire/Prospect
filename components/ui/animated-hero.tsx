import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { MoveRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Rotating career titles ────────────────────────────────────────────────────
const TITLES = ["Career.", "Future.", "Path.", "Calling.", "Direction."];

function RotatingTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % TITLES.length), 2400);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 min-h-[1.15em]">
      &nbsp;
      {TITLES.map((title, i) => (
        <motion.span
          key={i}
          className="absolute font-black"
          style={{ color: "#3B5A7F" }}
          initial={{ opacity: 0, y: 70 }}
          transition={{ type: "spring", stiffness: 55, damping: 15 }}
          animate={
            index === i
              ? { y: 0, opacity: 1 }
              : { y: index > i ? -90 : 90, opacity: 0 }
          }
        >
          {title}
        </motion.span>
      ))}
    </span>
  );
}


// ── Particles ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  cx:  44 + Math.random() * 54,
  cy:  4  + Math.random() * 92,
  r:   0.8 + Math.random() * 1.8,
  dur: 5  + Math.random() * 7,
  dx:  (Math.random() - 0.5) * 18,
  dy:  (Math.random() - 0.5) * 18,
  op:  0.08 + Math.random() * 0.18,
}));

function Particles() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {PARTICLES.map((p) => (
        <motion.circle
          key={p.id}
          cx={`${p.cx}%`}
          cy={`${p.cy}%`}
          r={p.r}
          fill="#3B5A7F"
          fillOpacity={p.op}
          animate={{
            cx:  [`${p.cx}%`, `${p.cx + p.dx}%`, `${p.cx}%`],
            cy:  [`${p.cy}%`, `${p.cy + p.dy}%`, `${p.cy}%`],
          }}
          transition={{
            duration:  p.dur,
            repeat:    Infinity,
            ease:      "easeInOut",
            delay:     Math.random() * 4,
          }}
        />
      ))}
    </svg>
  );
}

// ── Wave lines ────────────────────────────────────────────────────────────────
function WaveLines() {
  const waves = Array.from({ length: 18 }, (_, i) => ({
    i,
    y0:  65 + i * 17,
    amp: 75 + i * 4,
    phase: i * 0.22,
    op:  i < 3 ? 0.04 : i < 8 ? 0.065 : i < 14 ? 0.08 : 0.045,
    sw:  i === 6 || i === 7 ? 1.0 : 0.55,
  }));

  return (
    <svg
      viewBox="0 0 700 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {waves.map(({ i, y0, amp, phase, op, sw }) => {
        const d = `M -40 ${y0} C 140 ${y0 - amp}, 380 ${y0 + amp * 0.65}, 560 ${y0 - amp * 0.38} S 760 ${y0 + 24 * Math.sin(phase)}, 760 ${y0 + 24 * Math.sin(phase)}`;
        return (
          <motion.path
            key={i}
            d={d}
            stroke="#3B5A7F"
            strokeWidth={sw}
            strokeOpacity={op}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2.2, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] },
              opacity:    { duration: 0.3, delay: i * 0.045 },
            }}
          />
        );
      })}
    </svg>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div
      className="w-full relative"
      style={{ paddingTop: 0 }}
    >
      {/* ── Full-height background layer ── */}
      <div className="absolute inset-0 pointer-events-none z-0">

        {/* Primary blue glow — top centre */}
        <motion.div
          animate={{
            scale:   [1, 1.14, 1],
            opacity: [0.13, 0.22, 0.13],
            x:       [0, 24, 0],
            y:       [0, -16, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width:  560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(59,90,127,0.18)",
            filter: "blur(130px)",
            top: "-8%",
            left: "42%",
            transform: "translateX(-50%)",
            willChange: "transform, opacity",
          }}
        />

        {/* Secondary gold glow — bottom right */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          style={{
            position: "absolute",
            width:  320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(249,168,37,0.15)",
            filter: "blur(100px)",
            bottom: "8%",
            right:  "10%",
            willChange: "transform, opacity",
          }}
        />

        {/* Wave lines */}
        <div className="absolute inset-0 opacity-70">
          <WaveLines />
        </div>

        {/* Particles */}
        <Particles />

        {/* Centre spotlight — lifts the text out of the gradient */}
        <div
          style={{
            position: "absolute",
            width:  700,
            height: 500,
            top:    "8%",
            left:   "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse at 50% 38%, rgba(238,242,249,0.92) 0%, transparent 65%)",
          }}
        />

      </div>

      {/* ── Hero content ── */}
      <div className="container mx-auto relative z-10">
        <div className="flex gap-6 py-24 lg:py-44 items-center justify-center flex-col">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white/70 shadow-sm"
              style={{ backdropFilter: "blur(8px)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-prospect-blue-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                Free career guidance for SA students
              </span>
              <MoveRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-black text-slate-900"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Discover Your Perfect
              <RotatingTitle />
            </h1>
          </motion.div>

          {/* Subheading — glass card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.56 }}
          >
            <div
              className="max-w-2xl text-center px-7 py-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.62)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 28px rgba(59,90,127,0.08)",
              }}
            >
              <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Take our free quiz, discover careers matched to your interests and marks, find
                bursaries, explore TVET paths, and get a full roadmap to your dream career —
                all in one place.
              </p>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.72 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="gap-3 text-white border-0 min-h-12.5 font-black text-xs uppercase tracking-wider px-8 shadow-lg"
                style={{
                  backgroundColor: "#1e293b",
                  boxShadow: "0 4px 18px rgba(30,41,59,0.22)",
                }}
              >
                Take the Quiz
                <MoveRight className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="gap-3 min-h-12.5 font-black text-xs uppercase tracking-wider px-8"
                variant="outline"
                style={{
                  background: "rgba(255,255,255,0.76)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderColor: "rgba(203,213,225,1)",
                  color: "#334155",
                }}
              >
                Explore Careers
                <GraduationCap className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-2"
          >
            {[
              { value: "400+",    label: "Careers Listed" },
              { value: "100%",    label: "Free to Use" },
              { value: "Gr 10–12", label: "Study Content" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-black text-slate-900" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {label}
                </span>
              </div>
            ))}
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Live &amp; Free
              </span>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex items-center gap-3 mt-6"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-slate-400" fill="none">
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
