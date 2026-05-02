import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { MoveRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Typing animation for hero heading ────────────────────────────────────────
const CYCLE_WORDS = ["now", "future", "life", "path"];

function TypingWord() {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
    const word = CYCLE_WORDS[wordIndex % CYCLE_WORDS.length];

    if (phase === "typing") {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 1200);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 300);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
        return () => clearTimeout(t);
      } else {
        setWordIndex((i) => i + 1);
        setPhase("typing");
      }
    }
  }, [displayed, phase, wordIndex]);

  return (
    <span className="inline-flex items-center text-slate-800">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-[3px] h-[0.85em] rounded-sm bg-slate-700 align-middle"
      />
    </span>
  );
}

// ── Floating background paths ─────────────────────────────────────────────────
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgb(15,23,42)"
            strokeWidth={path.width}
            strokeOpacity={0.04 + path.id * 0.012}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
interface HeroProps {
  onNavigate?: (page: string) => void;
}

function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Floating paths background */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 bg-white/70 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Free for South African Students
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 text-slate-900"
            style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Know your{" "}
            <TypingWord />
          </motion.h1>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="max-w-xl mx-auto mb-10"
          >
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
              Career discovery, matric study tools, bursary finder, and civic guides — everything a Grade 10–12 student needs in one place.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.72 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                onClick={() => onNavigate?.("quiz")}
                className="gap-3 text-white border-0 min-h-[52px] font-black text-xs uppercase tracking-wider px-8 shadow-lg bg-slate-900 hover:bg-slate-800"
              >
                Take the Quiz
                <MoveRight className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate?.("careers")}
                className="gap-3 min-h-[52px] font-black text-xs uppercase tracking-wider px-8 bg-white/80 border-slate-300 text-slate-700 hover:bg-white"
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
            transition={{ delay: 1.0, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            {[
              { value: "400+", label: "Careers Listed" },
              { value: "100%", label: "Free to Use" },
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
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
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
            className="flex items-center gap-3 mt-10 justify-center"
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
        </motion.div>
      </div>
    </div>
  );
}

export { Hero };
