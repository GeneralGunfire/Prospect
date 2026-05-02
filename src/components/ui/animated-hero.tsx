import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

// ── Typing animation ──────────────────────────────────────────────────────────
const CAREERS = ['Doctor.', 'Engineer.', 'Designer.', 'Accountant.', 'Lawyer.', 'Entrepreneur.'];

function TypingText() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = CAREERS[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % CAREERS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-slate-700">
      {displayed}
      <span className="inline-block w-0.5 h-[0.85em] bg-slate-700 ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

// ── Floating career icons ─────────────────────────────────────────────────────
const ICONS = [
  { emoji: '💻', label: 'Tech',        x: '72%', y: '18%', delay: 0.0, size: 'text-2xl' },
  { emoji: '⚕️', label: 'Healthcare',  x: '82%', y: '42%', delay: 0.2, size: 'text-xl'  },
  { emoji: '⚖️', label: 'Law',         x: '65%', y: '65%', delay: 0.4, size: 'text-2xl' },
  { emoji: '🎨', label: 'Design',      x: '88%', y: '22%', delay: 0.1, size: 'text-lg'  },
  { emoji: '🏗️', label: 'Engineering', x: '58%', y: '32%', delay: 0.3, size: 'text-xl'  },
  { emoji: '📊', label: 'Finance',     x: '78%', y: '72%', delay: 0.5, size: 'text-xl'  },
  { emoji: '🔬', label: 'Science',     x: '92%', y: '55%', delay: 0.15, size: 'text-lg' },
  { emoji: '✈️', label: 'Aviation',    x: '55%', y: '78%', delay: 0.35, size: 'text-lg' },
];

function FloatingIcons({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      {ICONS.map(({ emoji, label, x, y, delay, size }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 + delay, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ left: x, top: y }}
          className="absolute"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + delay * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay,
            }}
            // Subtle parallax offset from mouse
            style={{
              x: mouseX * (0.008 + delay * 0.003),
              y: mouseY * (0.006 + delay * 0.002),
            }}
            className="relative group cursor-default"
          >
            {/* Glass pill */}
            <div
              className={`${size} px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/60 select-none`}
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {emoji}
              <span className="text-xs font-black uppercase tracking-widest text-slate-600 hidden group-hover:block whitespace-nowrap">
                {label}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

// ── Particle dots ─────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  cx: 45 + Math.random() * 55,   // right half only (%)
  cy: 5  + Math.random() * 90,
  r:  1  + Math.random() * 2,
  dur: 4 + Math.random() * 6,
  dx: (Math.random() - 0.5) * 18,
  dy: (Math.random() - 0.5) * 18,
  opacity: 0.15 + Math.random() * 0.25,
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
          fillOpacity={p.opacity}
          animate={{
            cx: [`${p.cx}%`, `${p.cx + p.dx}%`, `${p.cx}%`],
            cy: [`${p.cy}%`, `${p.cy + p.dy}%`, `${p.cy}%`],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </svg>
  );
}

// ── Wave lines ────────────────────────────────────────────────────────────────
function WaveLines() {
  const waves = Array.from({ length: 20 }, (_, i) => {
    const offset = i * 15;
    const amp    = 85 + i * 3.5;
    const phase  = i * 0.2;
    return {
      i, offset, amp, phase,
      opacity: i < 3 ? 0.05 : i < 9 ? 0.08 : i < 15 ? 0.10 : 0.06,
      strokeWidth: i === 7 || i === 8 ? 1.1 : 0.65,
    };
  });

  return (
    <svg
      viewBox="0 0 700 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {waves.map(({ i, offset, amp, phase, opacity, strokeWidth }) => {
        const y0  = 75 + offset;
        const d   = `M -40 ${y0} C 140 ${y0 - amp}, 380 ${y0 + amp * 0.7}, 560 ${y0 - amp * 0.4} S 760 ${y0 + 28 * Math.sin(phase)}, 760 ${y0 + 28 * Math.sin(phase)}`;
        return (
          <motion.path
            key={i}
            d={d}
            stroke="#3B5A7F"
            strokeWidth={strokeWidth}
            strokeOpacity={opacity}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
              opacity:    { duration: 0.35, delay: i * 0.04 },
            }}
          />
        );
      })}
    </svg>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function Hero({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Parallax: track mouse relative to section center
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouseX(e.clientX - rect.left - rect.width  / 2);
      setMouseY(e.clientY - rect.top  - rect.height / 2);
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, #f0f4ff 0%, #e8f4fd 40%, #ffffff 100%)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-70">
          <WaveLines />
        </div>
        <Particles />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        <FloatingIcons mouseX={mouseX} mouseY={mouseY} />
      </div>

      <div className="relative z-20 w-full max-w-[1100px] mx-auto px-6 pt-20 pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center justify-center gap-2.5 mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
              South Africa's Premier Career Platform
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Discover Your Perfect 
              <span className="block mt-2 bg-gradient-to-r from-blue-400 to-blue-400 text-transparent bg-clip-text">
                Calling
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.6 }}
            className="mb-12 max-w-xl mx-auto"
          >
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Discover a career based on your strengths, find bursaries, and access Grade 10–12 study materials — all in one modern platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              onClick={() => onNavigate?.('quiz')}
              whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 28px rgba(15,23,42,0.22)' }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20"
            >
              Start Career Quiz
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('careers')}
              whileHover={{ scale: 1.04, y: -2, borderColor: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.9)' }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-200 text-slate-600 hover:bg-white/60"
            >
              Explore Careers
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            {[
              { value: '400+', label: 'SA Careers', color: 'bg-blue-50 border-blue-100' },
              { value: '100%', label: 'Free Forever', color: 'bg-blue-50 border-blue-100' },
              { value: 'Gr 10–12', label: 'All Grades', color: 'bg-amber-50 border-amber-100' },
            ].map(({ value, label, color }) => (
              <div key={label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${color}`}>
                <span className="text-xl font-black text-slate-900" style={{ letterSpacing: '-0.03em' }}>{value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Now</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-14 flex items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-slate-400" fill="none">
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Scroll to explore</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
