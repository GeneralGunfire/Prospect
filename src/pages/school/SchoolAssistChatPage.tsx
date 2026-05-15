import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  BookOpen,
  GraduationCap,
  Banknote,
  Lightbulb,
  MessageCircle,
  ArrowUp,
  Paperclip,
  Calculator,
  X,
  ImageIcon,
} from 'lucide-react';
import type { AppPage } from '../../lib/withAuth';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import AppHeader from '../../components/shell/AppHeader';

interface Props {
  onNavigate: (page: AppPage) => void;
  onNavigateHome: () => void;
}

interface AttachedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  images?: AttachedImage[];
  timestamp: Date;
  error?: boolean;
}

const SYSTEM_PROMPT = `You are School Assist, an AI guidance counsellor for South African high school students (Grades 10–12). You help students with:
- Choosing matric subjects
- Understanding APS scores and university entry requirements
- TVET and trade career options
- NSFAS and bursary applications
- Study strategies and exam preparation
- Career direction and decision-making
- University application process
- Academic questions (Maths, Science, English, etc.)

If a student uploads an image of their work, homework, or exam paper, help them understand and solve it.

Be warm, encouraging, and practical. Use South African context (NSFAS, CAO, DBE, etc.). Format responses with **bold** for key points and bullet points where helpful. Keep answers focused and clear — students are reading on mobile.`;

const OLLAMA_URL = '/ollama/api/chat';

async function callOllama(messages: Message[], newText: string, images: AttachedImage[] = []): Promise<string> {
  const hasImages = images.length > 0;
  const model = hasImages ? 'llava' : 'llama3.2';

  const history = messages.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  const userMessage: Record<string, unknown> = {
    role: 'user',
    content: newText || (hasImages ? 'Please help me with this image.' : ''),
  };
  if (hasImages) {
    userMessage.images = images
      .filter((img) => img.mimeType.startsWith('image/'))
      .map((img) => img.base64);
  }

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        userMessage,
      ],
      stream: false,
    }),
  });
  if (!response.ok) throw new Error(`Ollama ${response.status}`);
  const data = await response.json();
  return data.message?.content ?? 'Sorry, I could not generate a response.';
}

// ── Topic chips ────────────────────────────────────────────────────────────────

const TOPIC_CHIPS = [
  { icon: BookOpen,      label: 'Subjects',    q: 'How do I choose my matric subjects?' },
  { icon: Calculator,    label: 'APS Score',   q: 'How is my APS score calculated?' },
  { icon: Banknote,      label: 'Funding',     q: 'How do I apply for NSFAS?' },
  { icon: GraduationCap, label: 'University',  q: 'How do I apply to university?' },
  { icon: Lightbulb,     label: 'Study Tips',  q: 'What are the best ways to study and improve my marks?' },
  { icon: MessageCircle, label: 'Career Quiz', q: 'How does the career quiz work?' },
];

const STARTER_QUESTIONS = [
  { label: 'Subjects & APS',    q: 'How do I choose my matric subjects?' },
  { label: 'NSFAS & Bursaries', q: 'How do I apply for NSFAS and what other bursaries can I get?' },
  { label: 'Career Guidance',   q: "I'm not sure what career to choose — help me figure it out" },
  { label: 'University Entry',  q: 'How do I apply to university and what are the deadlines?' },
  { label: 'Study Tips',        q: 'What are the best ways to study and improve my marks?' },
];

// ── Predefined answers ────────────────────────────────────────────────────────

const PREDEFINED: Record<string, string> = {
  'How do I choose my matric subjects?':
    `Choosing your matric subjects is one of the most important decisions you'll make — here's how to think about it:\n\n**Start with what you want to study after school.** Different careers require specific subjects. For example:\n- **Engineering or Medicine** → you need Maths (not Maths Literacy) and Physical Sciences\n- **Law or Commerce** → English, Maths or Maths Literacy, and Accounting are helpful\n- **Teaching or Social Work** → Humanities subjects like History, Geography, or Life Sciences\n\n**Know the difference between Maths and Maths Literacy.** Maths opens more university doors. Maths Literacy is fine for some diplomas and TVET programmes but closes off engineering, science, and most BCom degrees.\n\n**Check APS requirements early.** Look up your target university and course and see what subjects and minimum levels they require — then work backwards.\n\n**Don't just pick what's "easy".** Choose subjects you can pass at a high level. A 60% in Maths is worth more than a 90% in a subject that doesn't unlock your goal.\n\nUse the **Grade 10 Subject Selector** on Prospect to see exactly which careers your current subjects open or close.`,

  'How is my APS score calculated?':
    `Your **APS (Admission Point Score)** is how universities measure your matric results. Here's how it works:\n\n**Each subject gets points based on your percentage:**\n- 80–100% → 7 points\n- 70–79% → 6 points\n- 60–69% → 5 points\n- 50–59% → 4 points\n- 40–49% → 3 points\n- 30–39% → 2 points\n- 0–29% → 1 point\n\n**You add up your best 6 subjects** (Life Orientation counts at most universities but usually only contributes half, so check each university's rules).\n\n**Example:** If you get 75% in 6 subjects → 6 × 6 = **36 APS**\n\n**What APS do you need?**\n- Teaching / Social Work: usually 24–28\n- Commerce / BCom: usually 28–32\n- Engineering: usually 30–35\n- Medicine / Law: usually 35–42\n\nRemember: some programmes also have **minimum subject levels** on top of the APS — for example "Level 5 (60%) in Maths" — so check both requirements for your chosen course.`,

  'How do I apply for NSFAS?':
    `**NSFAS (National Student Financial Aid Scheme)** is free government funding for students from households earning under R350 000 per year. Here's the process:\n\n**When to apply:** Applications usually open in **September** for the following year. Don't miss this window — late applications are rarely accepted.\n\n**Where to apply:** Go to **myNSFAS.org.za** and create an account. You apply once and NSFAS contacts institutions directly.\n\n**What you'll need:**\n- Your ID number\n- Parents' or guardian's ID numbers\n- Proof of income (payslips, SASSA letter, or affidavit if unemployed)\n- Your matric results or Grade 11 report\n- Proof of registration at a public university or TVET college\n\n**What NSFAS covers:**\n- Tuition fees\n- Accommodation (if you live in a residence)\n- A monthly living allowance (food, transport, data)\n- A laptop or learning device allowance\n\n**Important:** NSFAS only covers **public** universities and TVET colleges — not private institutions.\n\n**Other bursaries:** Check the **Bursary Finder** on Prospect for corporate and government bursaries that don't have income limits.`,

  'How do I apply for NSFAS and what other bursaries can I get?':
    `**NSFAS (National Student Financial Aid Scheme)** is free government funding for students from households earning under R350 000 per year. Here's the process:\n\n**When to apply:** Applications usually open in **September** for the following year. Don't miss this window — late applications are rarely accepted.\n\n**Where to apply:** Go to **myNSFAS.org.za** and create an account. You apply once and NSFAS contacts institutions directly.\n\n**What you'll need:**\n- Your ID number\n- Parents' or guardian's ID numbers\n- Proof of income (payslips, SASSA letter, or affidavit if unemployed)\n- Your matric results or Grade 11 report\n\n**What NSFAS covers:** Tuition, accommodation, a monthly living allowance, and a laptop allowance.\n\n**Other bursaries to explore:**\n- **Sasol Bursary** — Engineering and Science students\n- **Anglo American** — Mining, Engineering, Finance\n- **Nedbank, ABSA, Standard Bank** — Commerce and Finance students\n- **National Research Foundation (NRF)** — Academic achievers\n- **Funza Lushaka** — Teaching bursary (full funding + salary after graduation)\n- **HWSETA, MERSETA, SETA bursaries** — Trade and technical fields\n\nUse the **Bursary Finder** on Prospect to search by field, province, and eligibility.`,

  "I'm not sure what career to choose — help me figure it out":
    `Not knowing what you want to do is completely normal — most Grade 10–12 students feel the same way. Here's a practical process:\n\n**Step 1: Take the RIASEC Career Quiz on Prospect.**\nIt takes about 10 minutes and matches your personality type to career clusters. It doesn't tell you exactly what to do, but it narrows the field significantly.\n\n**Step 2: Think about what you're naturally good at.**\n- Do you enjoy working with numbers or logic? → Science, Engineering, Finance\n- Do you like helping or working with people? → Medicine, Teaching, Social Work, Law\n- Do you prefer making or building things? → Engineering, Trades, Architecture\n- Do you enjoy creative work? → Design, Media, Marketing\n\n**Step 3: Check what your subjects allow.**\nYour current subjects are the biggest filter. If you don't have Maths, some engineering and science paths are closed — but there are still 300+ careers available to you.\n\n**Step 4: Don't aim for a specific job title — aim for a field.**\nMost careers of the future don't have names yet. Choosing a field (like healthcare, technology, or business) gives you flexibility.\n\n**Step 5: Look at demand and salary in SA.**\nThe **Career Browser** on Prospect shows which careers are most in-demand by province and what they typically pay.\n\nStart with the quiz — it takes 10 minutes and gives you a real starting point.`,

  'How do I apply to university and what are the deadlines?':
    `Applying to university in South Africa follows a specific process. Here's the full picture:\n\n**Most universities use the CAO (Central Applications Office)** for undergraduate applications. You apply once and select multiple institutions.\n\n**Key deadlines (2026 intake):**\n- Applications typically open: **April–May**\n- Early application deadline: **June 30** (priority consideration)\n- Main closing date: **September 30** for most universities\n- Some programmes (Medicine, Law, Actuarial Science) close earlier — check each university\n\n**Documents you'll need:**\n- Certified copy of your ID\n- Grade 11 results (for application) and final matric results (for confirmation)\n- Proof of payment of application fee (R100–R200 at most institutions)\n\n**Tips:**\n- Apply to **3–5 institutions** across different competitiveness levels\n- Check APS requirements AND subject-specific minimums for each programme\n- Apply to your **first choice early** — spots fill up\n- NSFAS applications run **separately** — apply at myNSFAS.org.za at the same time\n\n**Important dates for your calendar:**\n- Grade 11 results → build your application list\n- September → NSFAS applications open\n- October–November → Matric exams\n- January → Final results + conditional offer confirmations`,

  'What are the best ways to study and improve my marks?':
    `Improving your marks comes down to **consistency and method**, not just studying more. Here's what actually works:\n\n**1. Active recall over passive reading.**\nDon't just re-read your notes. Close the book and try to write down everything you remember. This forces your brain to retrieve information — which is how you actually learn it.\n\n**2. Past papers are your best friend.**\nFor matric subjects, the DBE releases past papers going back 10 years. Do them under exam conditions. Mark yourself honestly. The same types of questions repeat every year.\n\n**3. Space your studying — don't cram.**\nStudy a topic, then come back to it 2 days later, then a week later. Spaced repetition is how long-term memory works.\n\n**4. Fix your weak spots first.**\nMost students spend time on what they already know. Identify which topics cost you the most marks and target those specifically.\n\n**5. Build a study schedule.**\nUse the **Academic Calendar** on Prospect to plan around school terms and exam dates. Schedule specific subjects on specific days — don't just "study when you feel like it."\n\n**6. Ask for help early.**\nIf you're stuck on a concept, ask here — upload a photo of your work or textbook page and I'll explain it step by step.\n\n**7. Sleep and exercise matter.**\nStudying exhausted is mostly wasted time. 7–8 hours of sleep consolidates memory. Even a 20-minute walk improves focus significantly.`,

  'How does the career quiz work?':
    `The **RIASEC Career Quiz** on Prospect is based on Holland's theory of career personalities — one of the most widely used career matching systems in the world.\n\n**How it works:**\nYou answer 42 statements about activities you enjoy or find interesting — things like "I like fixing mechanical things" or "I enjoy helping people solve problems." There's no right or wrong answer.\n\n**The 6 personality types (RIASEC):**\n- **R — Realistic:** Hands-on, practical, likes working with tools or outdoors\n- **I — Investigative:** Analytical, curious, likes research and problem-solving\n- **A — Artistic:** Creative, expressive, likes design, writing, or performing\n- **S — Social:** People-oriented, likes teaching, helping, or counselling\n- **E — Enterprising:** Leadership-driven, likes business, persuasion, and managing\n- **C — Conventional:** Organised, detail-oriented, likes data and structured tasks\n\n**What you get after:**\nYour top 2–3 personality types, matched to a list of careers that fit your profile — with links to salary data, APS requirements, and bursaries for each one.\n\n**It takes about 10 minutes.** Head to the **Career Guide** section on Prospect to start. No account needed.`,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const el = textareaRef.current;
      if (!el) return;
      if (reset) { el.style.height = `${minHeight}px`; return; }
      el.style.height = `${minHeight}px`;
      el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight ?? Infinity))}px`;
    },
    [minHeight, maxHeight]
  );
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);
  return { textareaRef, adjustHeight };
}

// ── Processing bar ─────────────────────────────────────────────────────────────

function ProcessingBar({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="shrink-0 overflow-hidden"
    >
      {/* Progress bar track */}
      <div className="h-[2px] bg-slate-100 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-slate-800"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          style={{ width: '40%' }}
        />
      </div>
      {/* Status label */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border-b border-slate-100">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"
          style={{ animation: 'pulse 1.4s ease-in-out infinite' }}
        />
        <span className="text-[11px] font-medium text-slate-500 tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

// ── Typing dots ────────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-[3px] py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-slate-300"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── ProspectMark ──────────────────────────────────────────────────────────────

function ProspectMark({ size = 64, pulse = false }: { size?: number; pulse?: boolean }) {
  const s = size;
  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: s, height: s }}>
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-full bg-slate-900"
          animate={{ opacity: [0.06, 0.14, 0.06], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="rounded-full bg-slate-900 flex items-center justify-center"
        style={{ width: s, height: s }}
      >
        <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="2.6" height="18" rx="1.3" fill="white" />
          <path d="M7.6 3 Q19 3 19 9 Q19 15 7.6 15" stroke="white" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M7.6 6 Q15.5 6 15.5 9 Q15.5 12 7.6 12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="18.2" cy="5.4" r="1.5" fill="white" opacity="0.55" />
        </svg>
      </div>
    </div>
  );
}

// ── Message text renderer ──────────────────────────────────────────────────────

function renderText(text: string) {
  return text.split('\n').map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
    return <span key={li}>{rendered}{li < arr.length - 1 && <br />}</span>;
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SchoolAssistChatPage({ onNavigate, onNavigateHome }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processingLabel, setProcessingLabel] = useState<string | null>(null);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 200 });

  const hasChatStarted = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newImages: AttachedImage[] = await Promise.all(
      files.slice(0, 4).map(async (file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        base64: await fileToBase64(file),
        mimeType: file.type,
      }))
    );
    setAttachedImages((prev) => [...prev, ...newImages].slice(0, 4));
    e.target.value = '';
  }

  function removeImage(id: string) {
    setAttachedImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function sendMessage(text: string, images: AttachedImage[] = attachedImages) {
    if (!text.trim() && images.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      images: images.length > 0 ? [...images] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImages([]);
    adjustHeight(true);

    const botId = (Date.now() + 1).toString();
    const predefined = !images.length ? PREDEFINED[text.trim()] : undefined;

    if (predefined) {
      setMessages((prev) => [...prev, { id: botId, role: 'bot', text: predefined, timestamp: new Date() }]);
      // Upgrade silently in background
      callOllama([...messages, userMsg], text, []).then((aiReply) => {
        setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, text: aiReply } : m));
      }).catch(() => {});
      return;
    }

    const hasImageAttachment = images.some((img) => img.mimeType.startsWith('image/'));
    setIsTyping(true);
    setProcessingLabel(hasImageAttachment ? 'Analysing image — this may take a moment' : 'Thinking');

    try {
      const reply = await callOllama(messages, text, images);
      setMessages((prev) => [...prev, { id: botId, role: 'bot', text: reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: botId, role: 'bot', timestamp: new Date(), error: true,
        text: "Couldn't reach the AI. Make sure Ollama is running, or try one of the suggested questions.",
      }]);
    } finally {
      setIsTyping(false);
      setProcessingLabel(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  function handleReset() {
    setMessages([]);
    setInput('');
    setAttachedImages([]);
    setProcessingLabel(null);
    adjustHeight(true);
  }

  const canSend = (input.trim().length > 0 || attachedImages.length > 0) && !isTyping;

  return (
    <div className="flex flex-col h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      {/* ── Header ── */}
      {user ? (
        <AppHeader currentPage="school-assist-chat" user={user} onNavigate={onNavigate} mode="school" />
      ) : (
        <header className="shrink-0 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-20" style={{ height: 52 }}>
          <button
            onClick={onNavigateHome}
            className="text-[13px] font-medium text-slate-400 hover:text-slate-800 transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-2">
            <ProspectMark size={26} pulse />
            <span className="text-[13px] font-bold text-slate-900 tracking-tight">School Assist</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </header>
      )}

      {/* ── Processing bar ── */}
      <AnimatePresence>
        {isTyping && processingLabel && (
          <ProcessingBar label={processingLabel} />
        )}
      </AnimatePresence>

      {/* ── Hero state ── */}
      <AnimatePresence>
        {!hasChatStarted && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            className={`flex flex-col flex-1 overflow-y-auto px-4 pb-6 ${user ? 'pt-28' : 'pt-10'}`}
          >
            <div className="w-full max-w-lg mx-auto flex flex-col gap-8">

              {/* Mark + heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <ProspectMark size={34} pulse />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">School Assist AI</span>
                </div>
                <h1 className="text-[28px] sm:text-[34px] font-black text-slate-900 leading-[1.1] mb-3" style={{ letterSpacing: '-0.03em' }}>
                  What do you need help with?
                </h1>
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Ask about subjects, bursaries, careers, or university. Upload a photo of your work.
                </p>
              </motion.div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <InputDock
                  input={input}
                  setInput={setInput}
                  attachedImages={attachedImages}
                  isTyping={isTyping}
                  canSend={canSend}
                  textareaRef={textareaRef}
                  fileInputRef={fileInputRef}
                  onSend={() => sendMessage(input)}
                  onKeyDown={handleKeyDown}
                  onAdjustHeight={adjustHeight}
                  onFileChange={handleFileChange}
                  onRemoveImage={removeImage}
                />
              </motion.div>

              {/* Starter questions */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
              >
                <div className="px-5 py-3 border-b border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Common questions</p>
                </div>
                {STARTER_QUESTIONS.map(({ label, q }, i) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(q, [])}
                    className="w-full flex items-center gap-4 px-5 py-3.5 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-[11px] font-black text-slate-200 tabular-nums shrink-0 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400 mb-0.5">{label}</p>
                      <p className="text-[13px] text-slate-700 group-hover:text-slate-900 transition-colors leading-snug truncate">{q}</p>
                    </div>
                    <ArrowUp className="w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0 rotate-45 transition-colors" />
                  </button>
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
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className={`flex-1 overflow-y-auto px-4 py-6 ${user ? 'pt-28' : 'pt-6'}`}
          >
            <div className="max-w-xl mx-auto space-y-8">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {msg.role === 'bot' ? (
                      <div className="shrink-0 mt-0.5">
                        <ProspectMark size={28} />
                      </div>
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full shrink-0 mt-1 flex items-center justify-center"
                        style={{ background: 'oklch(91% 0.005 80)' }}
                      >
                        <span className="text-[9px] font-bold text-slate-500 leading-none">You</span>
                      </div>
                    )}

                    <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end max-w-[78%]' : 'items-start flex-1 min-w-0'}`}>
                      {/* Image attachments */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap justify-end mb-1">
                          {msg.images.map((img) =>
                            img.mimeType === 'application/pdf' ? (
                              <div key={img.id} className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1">
                                <Paperclip className="w-4 h-4 text-slate-400" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">PDF</span>
                              </div>
                            ) : (
                              <img key={img.id} src={img.previewUrl} alt="attachment" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                            )
                          )}
                        </div>
                      )}

                      {/* Bubble / text */}
                      {msg.text && (
                        msg.role === 'user' ? (
                          <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] leading-relaxed bg-slate-900 text-white">
                            {msg.text}
                          </div>
                        ) : msg.error ? (
                          <div className="px-4 py-3 rounded-2xl text-[14px] leading-relaxed border border-amber-200 bg-amber-50 text-amber-800">
                            {msg.text}
                          </div>
                        ) : (
                          <div className="text-[14px] leading-[1.75] text-slate-700 max-w-prose">
                            {renderText(msg.text)}
                          </div>
                        )
                      )}

                      <p className="text-[10px] text-slate-400 px-0.5">
                        {msg.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator in stream */}
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="flex gap-3 items-start"
                  >
                    <ProspectMark size={28} pulse />
                    <TypingDots />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pinned input dock (chat mode) ── */}
      <AnimatePresence>
        {hasChatStarted && (
          <motion.div
            key="dock"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 bg-white border-t border-slate-100 px-4 pt-3 pb-4"
          >
            <div className="max-w-xl mx-auto space-y-2.5">
              <InputDock
                input={input}
                setInput={setInput}
                attachedImages={attachedImages}
                isTyping={isTyping}
                canSend={canSend}
                textareaRef={textareaRef}
                fileInputRef={fileInputRef}
                onSend={() => sendMessage(input)}
                onKeyDown={handleKeyDown}
                onAdjustHeight={adjustHeight}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
              />
              {/* Topic chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                {TOPIC_CHIPS.map(({ icon: Icon, label, q }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(q, [])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all text-[11px] font-medium shrink-0 whitespace-nowrap"
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

// ── Input dock ─────────────────────────────────────────────────────────────────

interface InputDockProps {
  input: string;
  setInput: (v: string) => void;
  attachedImages: AttachedImage[];
  isTyping: boolean;
  canSend: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null> | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onAdjustHeight: (reset?: boolean) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
}

function InputDock({
  input, setInput, attachedImages, isTyping, canSend,
  textareaRef, fileInputRef, onSend, onKeyDown, onAdjustHeight, onFileChange, onRemoveImage,
}: InputDockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white focus-within:border-slate-400 transition-colors overflow-hidden">
      {/* Attachment previews */}
      <AnimatePresence>
        {attachedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex gap-2 px-4 pt-3 flex-wrap"
          >
            {attachedImages.map((img) => (
              <div key={img.id} className="relative group">
                {img.mimeType === 'application/pdf' ? (
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-0.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase">PDF</span>
                  </div>
                ) : (
                  <img src={img.previewUrl} alt="attachment" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text input */}
      <div className="px-4 pt-3 pb-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); onAdjustHeight(); }}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about your future…"
          rows={1}
          className="w-full resize-none bg-transparent border-none text-[14px] text-slate-800 focus:outline-none placeholder:text-slate-400 leading-relaxed"
          style={{ minHeight: 48, maxHeight: 200, overflow: 'hidden' }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-700 transition-colors py-1 pr-2"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Photo or PDF</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={onFileChange} />

        <div className="flex items-center gap-2">
          {attachedImages.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ImageIcon className="w-3 h-3" />
              {attachedImages.length}
            </span>
          )}
          <motion.button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.06 } : {}}
            whileTap={canSend ? { scale: 0.93 } : {}}
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              canSend ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed',
            ].join(' ')}
          >
            {isTyping
              ? <span className="w-3 h-3 border-[1.5px] border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
              : <ArrowUp className="w-4 h-4" />
            }
          </motion.button>
        </div>
      </div>
    </div>
  );
}
