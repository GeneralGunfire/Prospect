import { useEffect, useState } from "react";
import { motion } from "motion/react";

// ── Typing animation ──────────────────────────────────────────────────────────
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
        const t = setTimeout(() => setPhase("pause"), 1400);
        return () => clearTimeout(t);
      }
    }
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 300);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        return () => clearTimeout(t);
      } else {
        setWordIndex((i) => i + 1);
        setPhase("typing");
      }
    }
  }, [displayed, phase, wordIndex]);

  return (
    <span className="inline-flex items-baseline text-slate-900">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-0.5 inline-block w-1 h-[0.8em] rounded-xs bg-slate-900 align-baseline translate-y-[0.05em]"
      />
    </span>
  );
}

// ── Floating background paths ─────────────────────────────────────────────────
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.4 + i * 0.025,
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
            strokeOpacity={0.03 + path.id * 0.009}
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
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        >
          {/* Heading — fluid from 2.25rem on 375px up to 7rem on wide screens */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-black text-slate-900 mb-8 sm:mb-10"
            style={{
              fontSize: "clamp(2.25rem, 8vw, 7rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Know your{" "}
            <TypingWord />
          </motion.h1>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 mb-12 sm:mb-14"
          >
            {[
              { value: "400+", label: "SA careers" },
              { value: "26", label: "TVET colleges" },
              { value: "9", label: "Provinces covered" },
              { value: "100%", label: "Free, always" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span
                  className="text-2xl sm:text-3xl font-black text-slate-900"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {value}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex items-center justify-center gap-2.5"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" fill="none">
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export { Hero };
