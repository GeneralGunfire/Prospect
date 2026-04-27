import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  BookOpen,
  GraduationCap,
  Banknote,
  Lightbulb,
  MessageCircle,
  ArrowUp,
  Mic,
  Paperclip,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import type { AppPage } from '../lib/withAuth';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';

interface Props {
  onNavigate: (page: AppPage) => void;
  onNavigateHome: () => void;
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) { textarea.style.height = `${minHeight}px`; return; }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Infinity));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);
  return { textareaRef, adjustHeight };
}

// ── Q&A Database ───────────────────────────────────────────────────────────────

const QA_DATABASE = [
  {
    keywords: ['subject', 'choose', 'select', 'pick', 'stream', 'which'],
    answer: `Choosing subjects is one of the most important decisions you'll make. Here's how to approach it:

**Think backwards from your career goal:**
1. What careers interest you? Work backwards to see which subjects those careers need.
2. Math is the biggest door-opener — required for Engineering, Science, Accounting, and most tech careers.
3. Physical Sciences pairs with Math for Engineering and Medicine.
4. Life Sciences is needed for Medicine, Pharmacy, Nursing, and Veterinary Science.
5. Accounting is required for CA (Chartered Accountant) and Commerce degrees.

Avoid choosing subjects just because your friends chose them. Choose based on your goals.

Use our Career Quiz to discover which career paths match your personality — that'll help you pick the right subjects.`,
  },
  {
    keywords: ['aps', 'score', 'points', 'university', 'admission', 'entry', 'requirement', 'matric'],
    answer: `Your APS (Admission Point Score) is calculated from your best 6 matric subjects.

**Mark → Points conversion:**
• 90–100% = 7 points (Distinction)
• 80–89% = 6 points
• 70–79% = 5 points
• 60–69% = 4 points
• 50–59% = 3 points
• 40–49% = 2 points
• Below 40% = 1 point

Maximum APS = 42 points.

**Typical requirements:**
• Medicine: 36+ APS
• Engineering: 30+ APS
• Commerce / Law: 26–30 APS
• Education / Social Work: 20–24 APS
• TVET Diplomas: 14–18 APS (or no minimum)

Use the APS Calculator on this app to see exactly which programmes you qualify for.`,
  },
  {
    keywords: ['tvet', 'college', 'trade', 'practical', 'artisan', 'diploma', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
    answer: `TVET (Technical and Vocational Education and Training) colleges are an excellent path for students who prefer hands-on, practical careers.

**Why TVET is a great choice:**
• Shorter programmes (1–3 years) vs university degrees
• Lower or no APS requirements — some accept Grade 10/11
• Direct pathways into well-paying trade careers
• Apprenticeships let you earn while you learn
• NSFAS funding available for TVET students

**Popular TVET career paths:**
• Electrician (Electrical Installation — N1 to N6)
• Plumber (Plumbing — NQF 4)
• Motor Mechanic (Automotive)
• Welder / Boilermaker
• Carpentry & Joinery
• IT Support, Networking
• Business Management (N4–N6)

Don't see TVET as a fallback — it's a strong first choice for people who want real-world skills fast.`,
  },
  {
    keywords: ['nsfas', 'bursary', 'funding', 'afford', 'money', 'financial', 'fee', 'free', 'cost', 'pay'],
    answer: `NSFAS (National Student Financial Aid Scheme) is free money from the South African government for qualifying students.

**You qualify if:**
• You are a South African citizen
• You've been accepted to a public university or TVET college
• Your household earns less than R350,000 per year

**NSFAS covers:**
• Full tuition fees
• Accommodation allowance
• Food / meal allowance (~R3,000/month)
• Book allowance (~R2,500/semester)
• Transport allowance (if applicable)

**How to apply:**
1. Go to nsfas.org.za
2. Create an account with your ID number
3. Apply before the deadline (usually September for the following year)
4. Submit proof of income (payslips or SASSA letter)

Also explore: Eskom, Sasol, MTN, Transnet sector bursaries, and the Bursaries section in this app.`,
  },
  {
    keywords: ['study', 'improve', 'grades', 'marks', 'pass', 'fail', 'better', 'exam', 'test', 'revision'],
    answer: `Improving grades takes the right system, not just more time. Here's what actually works:

**Proven study habits:**
• Study in 45-minute blocks, take 15-minute breaks (Pomodoro method)
• Past exam papers are the most effective study tool — do them timed
• Teach someone else the content — if you can explain it, you know it
• Switch off your phone. Even having it nearby reduces focus by 20%

**Subject-specific tips:**
• Maths: Do problems every day. Watching solutions ≠ doing them.
• Science: Draw diagrams, write definitions in your own words.
• Languages: Read articles, write summaries, practise grammar drills.
• History / Geography: Create timelines and mind maps.

**Free resources:**
• Khan Academy — free Maths, Science, History videos
• Siyavula — free Maths & Science textbooks and practice
• DBE past papers: education.gov.za
• Study Library in this app (Grades 10–12)

Consistency beats cramming. 1 hour daily outperforms 6 hours before the exam.`,
  },
  {
    keywords: ['work', 'job', 'part-time', 'earn', 'income', 'balance', 'gap year'],
    answer: `It's possible to work and study at the same time — but you need an honest plan.

**Best options for working students:**
• UNISA (distance learning) — full flexibility, no fixed class times
• Part-time programmes at some universities (evenings/weekends)
• TVET colleges often have day and evening options
• Learnerships / apprenticeships — earn a monthly stipend while training

**Realistic balance guide:**
• 20 hrs/week study + 20 hrs/week work = manageable
• Full-time work + full-time study = very high dropout risk
• Start with 10 hrs/week part-time; only increase if grades stay stable

**Tips:**
• Choose flexible gig work (delivery, tutoring, call centre)
• Communicate with your employer during exam periods
• Block study time in your calendar like a work shift

Gap year alternative: A structured gap year with work + NSFAS application can be smarter than failing first year.`,
  },
  {
    keywords: ['career', 'unsure', 'confused', 'direction', 'path', 'choice', 'decide', 'not sure'],
    answer: `Not knowing what you want to do is completely normal — most adults don't either.

**A structured way to find direction:**

Step 1 — Know yourself:
• What subjects do you enjoy? (Not just what you're good at — what do you like?)
• What activities make you lose track of time?
• Do you prefer working with people, things, ideas, or data?

Step 2 — Explore, don't commit:
• Take the Career Quiz on this app (based on RIASEC psychology)
• Ask 3 adults about their actual day-to-day work
• Shadow someone for a day in a career you're curious about

Step 3 — Focus on the path, not the destination:
• Choose subjects that keep multiple doors open (Maths especially)
• Most graduates end up working in different fields than their degree

Reminder: Career uncertainty means you're thinking seriously — that's a good sign.`,
  },
  {
    keywords: ['university', 'application', 'apply', 'deadline', 'cau', 'central application'],
    answer: `Applying to South African universities — key steps:

**The Central Applications Office (CAO):**
• Handles applications for most universities in one place
• Website: cao.ac.za
• Applications typically open April–September each year
• Apply early — popular programmes fill up fast

**What you'll need:**
• Grade 11 final results (most offers are based on Grade 11)
• ID document
• Application fee (R100–R200 per university; some waive for NSFAS applicants)

**Universities with their own portals:**
• UCT, Wits, Stellenbosch — direct application systems
• UP, UJ, UNISA — also have separate systems

**Timeline:**
• Apply by August/September for the following year
• Offers go out from October onwards
• Accept your place by November/December

Tip: Apply to 3–4 universities at different APS levels — a "reach", a "match", and a "safe" option.`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'help', 'what can'],
    answer: `Hello! I'm the School Assist chatbot. I can help you with:

• Choosing matric subjects
• Understanding APS scores and university entry requirements
• TVET and trade career options
• NSFAS and bursary applications
• Study strategies and exam preparation
• Working while studying
• Career direction and decision-making
• University application process

What would you like to know about?`,
  },
];

const FALLBACK_ANSWER = `I don't have a specific answer for that question yet — this chatbot is still growing!

Here's what I can help with:
• Choosing matric subjects
• APS scores and university requirements
• TVET and trade careers
• NSFAS and bursary funding
• Study tips and exam prep
• Work-life-study balance
• Career direction
• University applications

Try rephrasing your question, or use the Study Library and Career Quiz for more personalised guidance.`;

function findAnswer(question: string): string {
  const lower = question.toLowerCase();
  for (const qa of QA_DATABASE) {
    if (qa.keywords.some((kw) => lower.includes(kw))) return qa.answer;
  }
  return FALLBACK_ANSWER;
}

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Topic chips ────────────────────────────────────────────────────────────────

const TOPIC_CHIPS = [
  { icon: BookOpen,      label: 'Subjects',     q: 'How do I choose my matric subjects?' },
  { icon: Calculator,    label: 'APS Score',    q: 'How is my APS score calculated?' },
  { icon: Banknote,      label: 'Funding',      q: 'How do I apply for NSFAS?' },
  { icon: GraduationCap, label: 'University',   q: 'How do I apply to university?' },
  { icon: Lightbulb,     label: 'Study Tips',   q: 'How can I improve my grades?' },
  { icon: MessageCircle, label: 'Career Quiz',  q: 'How does the career quiz work?' },
];

// ── Category cards (hero bottom) ──────────────────────────────────────────────

const CATEGORY_CARDS = [
  { icon: GraduationCap, label: 'Subjects & APS',   q: 'Help me choose my matric subjects and understand APS scores' },
  { icon: Banknote,      label: 'Funding',           q: 'Tell me about NSFAS and bursaries' },
  { icon: ChevronRight,  label: 'Career Guidance',   q: "I'm not sure what career to choose, help me decide" },
];

// ── Typing dots ────────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Prospect logo mark ────────────────────────────────────────────────────────

function ProspectMark({ size = 64 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size, height: size,
        background: 'conic-gradient(from 180deg at 50% 50%, #3b82f6 0deg, #60a5fa 90deg, #93c5fd 180deg, #3b82f6 360deg)',
        boxShadow: '0 8px 32px rgba(59,130,246,0.25)',
      }}
    >
      <div
        className="rounded-full bg-white"
        style={{ width: size * 0.42, height: size * 0.42 }}
      />
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SchoolAssistChatPage({ onNavigate, onNavigateHome }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 52, maxHeight: 180 });

  const hasChatStarted = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    adjustHeight(true);
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: findAnswer(text), timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700 + Math.random() * 400);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  function handleReset() { setMessages([]); setInput(''); adjustHeight(true); }

  // ── Input box ─────────────────────────────────────────────────────────────

  const InputBox = ({ compact = false }: { compact?: boolean }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all">
      {/* Textarea */}
      <div className="px-4 pt-4 pb-1">
        <textarea
          ref={compact ? undefined : textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (!compact) adjustHeight(); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          rows={1}
          className="w-full resize-none bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400 leading-relaxed"
          style={{ minHeight: compact ? '44px' : '56px', maxHeight: '180px', overflow: 'hidden' }}
        />
      </div>

      {/* Pill chips row */}
      {!compact && (
        <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
          {TOPIC_CHIPS.slice(0, 3).map(({ icon: Icon, label, q }) => (
            <button
              key={label}
              type="button"
              onClick={() => sendMessage(q)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-xs font-medium"
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 border-t border-slate-100 ${compact ? 'py-2' : 'py-2.5'}`}>
        <button type="button" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition-colors py-1">
          <Paperclip className="w-3.5 h-3.5" />
          <span>Upload Files</span>
        </button>

        <div className="flex items-center gap-2">
          <button type="button" className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <Mic className="w-4 h-4" />
          </button>
          <motion.button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              input.trim() && !isTyping
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            {isTyping
              ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <ArrowUp className="w-4 h-4" />
            }
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* ── Top nav ── */}
      {user ? (
        <AppHeader currentPage="school-assist-chat" user={user} onNavigate={onNavigate} mode="school" />
      ) : (
        <header className="shrink-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <ProspectMark size={28} />
            <span className="font-bold text-sm text-slate-900">School Assist</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </header>
      )}

      {/* ── Hero (no chat yet) ── */}
      <AnimatePresence>
        {!hasChatStarted && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col items-center justify-center flex-1 px-4 pb-8 ${user ? 'pt-20' : ''}`}
          >
            <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">

              {/* Logo + heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <ProspectMark size={72} />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Ready to{' '}
                    <span className="text-blue-600">assist you</span>
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Ask me anything or try one of the suggestions below
                  </p>
                </div>
              </motion.div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full"
              >
                <InputBox />
              </motion.div>

              {/* Category cards */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-3 gap-3 w-full"
              >
                {CATEGORY_CARDS.map(({ icon: Icon, label, q }, i) => (
                  <motion.button
                    key={label}
                    onClick={() => sendMessage(q)}
                    whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium leading-tight text-center">{label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat messages ── */}
      <AnimatePresence>
        {hasChatStarted && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 overflow-y-auto px-4 py-5 ${user ? 'pt-24' : 'pt-5'}`}
          >
            <div className="max-w-xl mx-auto space-y-5">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {msg.role === 'bot' ? (
                      <div className="shrink-0 mt-0.5">
                        <ProspectMark size={32} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-500">You</span>
                      </div>
                    )}
                    <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'
                      }`}>
                        {msg.role === 'bot' ? renderText(msg.text) : msg.text}
                      </div>
                      <p className="text-[10px] text-slate-400 px-1">
                        {msg.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 items-end"
                  >
                    <div className="shrink-0">
                      <ProspectMark size={32} />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <span className="text-xs text-slate-500">Thinking</span>
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom bar (chat mode) ── */}
      <AnimatePresence>
        {hasChatStarted && (
          <motion.div
            key="bottom-bar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 bg-white border-t border-slate-100 px-4 py-3"
          >
            <div className="max-w-xl mx-auto">
              <InputBox compact />
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {TOPIC_CHIPS.map(({ icon: Icon, label, q }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(q)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-xs font-medium shrink-0 whitespace-nowrap"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
