import * as React from "react";
import { motion } from "motion/react";

const WORDS = ["Discover", "Plan", "Elevate", "Succeed", "Prospect SA"];
const MORPH_TIME = 0.6;
const HOLD_TIME = 0.5;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const isTestMode =
      (window as any).__PLAYWRIGHT_TEST__ ||
      sessionStorage.getItem('__test_mode__') === 'true' ||
      localStorage.getItem('__playwright_test_mode__') ||
      new URLSearchParams(window.location.search).get('__test_mode') === 'true';
    if (isTestMode) { onComplete(); return; }

    let wordIndex = 0; // which word is currently fully displayed
    let morphProgress = 0; // 0..1
    let phase: "hold" | "morph" = "hold";
    let holdElapsed = 0;
    let lastTime = performance.now();
    let rafId: number;
    let stopped = false;

    const t1 = text1Ref.current;
    const t2 = text2Ref.current;
    if (!t1 || !t2) return;

    // Show first word immediately, fully visible
    t1.textContent = WORDS[0];
    t1.style.opacity = "100%";
    t1.style.filter = "";

    t2.textContent = WORDS[1];
    t2.style.opacity = "0%";
    t2.style.filter = "blur(8px)";

    // Which span is "current" (fully visible) vs "next" (morphing in)
    // We alternate: even wordIndex → t1 is current; odd → t2 is current
    const current = () => (wordIndex % 2 === 0 ? t1 : t2);
    const next = () => (wordIndex % 2 === 0 ? t2 : t1);

    function applyMorph(f: number) {
      // next fades in
      const blurIn = Math.min(8 / Math.max(f, 0.001) - 8, 100);
      next().style.filter = `blur(${blurIn}px)`;
      next().style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      // current fades out
      const fo = 1 - f;
      const blurOut = Math.min(8 / Math.max(fo, 0.001) - 8, 100);
      current().style.filter = `blur(${blurOut}px)`;
      current().style.opacity = `${Math.pow(fo, 0.4) * 100}%`;
    }

    function finishMorph() {
      next().style.filter = "";
      next().style.opacity = "100%";
      current().style.filter = "blur(8px)";
      current().style.opacity = "0%";
    }

    function tick() {
      if (stopped) return;
      rafId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1); // cap at 100ms
      lastTime = now;

      if (phase === "hold") {
        holdElapsed += dt;
        if (holdElapsed >= HOLD_TIME) {
          holdElapsed = 0;
          morphProgress = 0;
          phase = "morph";
          // Pre-load next word into the "next" span
          const nextIndex = wordIndex + 1;
          if (nextIndex < WORDS.length) {
            next().textContent = WORDS[nextIndex];
            next().style.opacity = "0%";
            next().style.filter = "blur(8px)";
          }
        }
        return;
      }

      // morph phase
      morphProgress += dt / MORPH_TIME;
      if (morphProgress >= 1) {
        morphProgress = 1;
        finishMorph();

        wordIndex++;

        if (wordIndex >= WORDS.length - 1) {
          // Landed on last word ("Prospect SA") — hold 2s then complete
          stopped = true;
          cancelAnimationFrame(rafId);
          setTimeout(onComplete, 2000);
          return;
        }

        // Reset styles for new "current" (what was next is now current)
        // "next" slot will be loaded on next hold→morph transition
        phase = "hold";
        holdElapsed = 0;
      } else {
        applyMorph(morphProgress);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  const totalDuration = WORDS.length * (HOLD_TIME + MORPH_TIME);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(20px)" }}
      transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center overflow-hidden"
      style={{ willChange: "opacity, transform, filter" }}
    >
      {/* SVG gooey filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      {/* Morphing words */}
      <div
        className="relative flex items-center justify-center w-full px-8"
        style={{ filter: "url(#gooey)", height: "120px" }}
      >
        <span
          ref={text1Ref}
          className="absolute inline-block select-none text-center font-black text-slate-900"
          style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", letterSpacing: "-0.03em" }}
        />
        <span
          ref={text2Ref}
          className="absolute inline-block select-none text-center font-black text-slate-900"
          style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", letterSpacing: "-0.03em", opacity: "0%" }}
        />
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-14 rounded-full overflow-hidden bg-slate-100" style={{ width: "80px", height: "2px" }}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: totalDuration, ease: "linear" }}
          className="h-full bg-slate-400 rounded-full"
        />
      </div>
    </motion.div>
  );
}
