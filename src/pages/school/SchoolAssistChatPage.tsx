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
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGemini(
  messages: Message[],
  newText: string,
  newImages: AttachedImage[]
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key configured.');

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const history = messages.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const userParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
  if (newText.trim()) userParts.push({ text: newText.trim() });
  for (const img of newImages) {
    userParts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } });
    userParts.push({ text: '(Image attached above — please help me with this.)' });
  }

  const contents = [
    ...history,
    { role: 'user', parts: userParts },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return response.text ?? 'Sorry, I could not generate a response. Please try again.';
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

const CATEGORY_CARDS = [
  {
    icon: BookOpen,
    label: 'Subjects & APS',
    description: 'Subject choices, APS scores, and entry requirements',
    q: 'Help me choose my matric subjects and understand APS scores',
  },
  {
    icon: Banknote,
    label: 'Bursaries & NSFAS',
    description: 'Funding options, application deadlines, eligibility',
    q: 'Tell me about NSFAS and bursaries I can apply for',
  },
  {
    icon: GraduationCap,
    label: 'Career Guidance',
    description: 'Find a path that fits your strengths and interests',
    q: "I'm not sure what career to choose — help me decide",
  },
];

// ── Typing dots ────────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Prospect mark — geometric monogram, no gradient ───────────────────────────

function ProspectMark({ size = 64 }: { size?: number }) {
  const s = size;
  const pad = s * 0.22;
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-slate-900"
      style={{ width: s, height: s }}
    >
      <svg width={s - pad * 2} height={s - pad * 2} viewBox="0 0 20 20" fill="none">
        {/* P lettermark */}
        <rect x="4" y="3" width="2.5" height="14" rx="1" fill="white" />
        <rect x="4" y="3" width="10" height="2.5" rx="1" fill="white" />
        <rect x="4" y="9" width="8" height="2.5" rx="1" fill="white" />
        <rect x="11.5" y="3" width="2.5" height="8.5" rx="1" fill="white" />
      </svg>
    </div>
  );
}

function renderText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
    return <span key={li}>{rendered}{li < lines.length - 1 && <br />}</span>;
  });
}

// ── Chat input box ─────────────────────────────────────────────────────────────

interface ChatInputBoxProps {
  compact: boolean;
  input: string;
  setInput: (v: string) => void;
  attachedImages: AttachedImage[];
  isTyping: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null> | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSend: () => void;
  onChipSend: (q: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onAdjustHeight: (reset?: boolean) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
}

function ChatInputBox({
  compact,
  input,
  setInput,
  attachedImages,
  isTyping,
  textareaRef,
  fileInputRef,
  onSend,
  onChipSend,
  onKeyDown,
  onAdjustHeight,
  onFileChange,
  onRemoveImage,
}: ChatInputBoxProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 focus-within:border-slate-400 transition-colors shadow-sm">
      {/* Image previews */}
      {attachedImages.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 flex-wrap">
          {attachedImages.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.previewUrl} alt="attachment" className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
              <button
                type="button"
                onClick={() => onRemoveImage(img.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="px-4 pt-4 pb-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (!compact) onAdjustHeight(); }}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about your future…"
          rows={1}
          className="w-full resize-none bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400 leading-relaxed"
          style={{ minHeight: compact ? '44px' : '60px', maxHeight: '180px', overflow: 'hidden' }}
        />
      </div>

      {/* Quick chips (non-compact only) */}
      {!compact && (
        <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
          {TOPIC_CHIPS.slice(0, 3).map(({ icon: Icon, label, q }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChipSend(q)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all text-xs font-medium"
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 border-t border-slate-100 ${compact ? 'py-2' : 'py-2.5'}`}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors py-1"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Upload photo</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />

        <div className="flex items-center gap-2">
          {attachedImages.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ImageIcon className="w-3 h-3" />
              {attachedImages.length}
            </span>
          )}
          <motion.button
            type="button"
            onClick={onSend}
            disabled={(!input.trim() && attachedImages.length === 0) || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              (input.trim() || attachedImages.length > 0) && !isTyping
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            {isTyping
              ? <span className="w-3 h-3 border-2 border-slate-400/40 border-t-slate-400 rounded-full animate-spin" />
              : <ArrowUp className="w-4 h-4" />
            }
          </motion.button>
        </div>
      </div>
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
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 52, maxHeight: 180 });

  const hasChatStarted = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newImages: AttachedImage[] = await Promise.all(
      files.slice(0, 4).map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          id: `${Date.now()}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type,
        };
      })
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
    setIsTyping(true);
    setApiError(null);

    try {
      const reply = await callGemini(messages, text, images);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      const isQuota = errMsg.includes('429') || errMsg.toLowerCase().includes('quota');
      setApiError(isQuota
        ? 'The AI quota has been reached. Please try again later or contact support.'
        : 'Failed to get a response. Please check your connection and try again.'
      );
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: isQuota
          ? "I'm currently unavailable due to high demand. Please try again in a moment."
          : "I couldn't connect right now. Please try again.",
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  function handleReset() {
    setMessages([]);
    setInput('');
    setAttachedImages([]);
    setApiError(null);
    adjustHeight(true);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* ── Top nav ── */}
      {user ? (
        <AppHeader currentPage="school-assist-chat" user={user} onNavigate={onNavigate} mode="school" />
      ) : (
        <header className="shrink-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
          <button
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            Back
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

      {/* ── API error banner ── */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="shrink-0 mx-4 mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 flex-1">{apiError}</p>
            <button onClick={() => setApiError(null)} className="text-amber-400 hover:text-amber-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero (no chat yet) ── */}
      <AnimatePresence>
        {!hasChatStarted && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col items-center justify-center flex-1 px-4 pb-8 ${user ? 'pt-24' : 'pt-8'}`}
          >
            <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-10">

              {/* Wordmark + heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-5 text-center"
              >
                <ProspectMark size={56} />
                <div>
                  <h1 className="text-3xl font-black text-slate-900" style={{ letterSpacing: '-0.03em' }}>
                    School Assist
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Ask anything about subjects, bursaries, careers, or university. Upload a photo of your work for help.
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
                <ChatInputBox
                  compact={false}
                  input={input}
                  setInput={setInput}
                  attachedImages={attachedImages}
                  isTyping={isTyping}
                  textareaRef={textareaRef}
                  fileInputRef={fileInputRef}
                  onSend={() => sendMessage(input)}
                  onChipSend={(q) => sendMessage(q, [])}
                  onKeyDown={handleKeyDown}
                  onAdjustHeight={adjustHeight}
                  onFileChange={handleFileChange}
                  onRemoveImage={removeImage}
                />
              </motion.div>

              {/* Category cards — 3-col, distinct, not identical */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
              >
                {CATEGORY_CARDS.map(({ icon: Icon, label, description, q }, i) => (
                  <motion.button
                    key={label}
                    onClick={() => sendMessage(q, [])}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-400 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{description}</p>
                    </div>
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
            <div className="max-w-xl mx-auto space-y-6">
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
                        <ProspectMark size={30} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-600">You</span>
                      </div>
                    )}
                    <div className={`flex flex-col gap-1 max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Image attachments */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-1 justify-end">
                          {msg.images.map((img) => (
                            <img
                              key={img.id}
                              src={img.previewUrl}
                              alt="attachment"
                              className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                            />
                          ))}
                        </div>
                      )}
                      {msg.text && (
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white rounded-tr-sm'
                            : msg.error
                            ? 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                        }`}>
                          {msg.role === 'bot' ? renderText(msg.text) : msg.text}
                        </div>
                      )}
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
                      <ProspectMark size={30} />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">Thinking</span>
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
              <ChatInputBox
                compact
                input={input}
                setInput={setInput}
                attachedImages={attachedImages}
                isTyping={isTyping}
                textareaRef={undefined}
                fileInputRef={fileInputRef}
                onSend={() => sendMessage(input)}
                onChipSend={(q) => sendMessage(q, [])}
                onKeyDown={handleKeyDown}
                onAdjustHeight={adjustHeight}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
              />
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-0.5 scrollbar-hide">
                {TOPIC_CHIPS.map(({ icon: Icon, label, q }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(q, [])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all text-xs font-medium shrink-0 whitespace-nowrap"
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
