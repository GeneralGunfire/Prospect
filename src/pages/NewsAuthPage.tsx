import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Newspaper, Calculator, MapPin, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { AppPage } from '../lib/withAuth';

interface Props {
  onNavigateHome: () => void;
  onNavigate?: (page: AppPage) => void;
}

type Mode = 'login' | 'signup';

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-white/80 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-400/40 focus:border-amber-500 text-sm border-gray-200';

const PasswordField = ({
  id, label, value, onChange,
}: { id: string; label: string; value: string; onChange: (v: string) => void }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          className={`${inputBase} pr-11`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const FEATURES = [
  { icon: <Newspaper className="w-4 h-4 text-amber-600" />, text: 'SA News — curated daily, no sensitive content' },
  { icon: <Calculator className="w-4 h-4 text-amber-600" />, text: 'Tax & Budget — 2026 PAYE calculator' },
  { icon: <MapPin className="w-4 h-4 text-amber-600" />, text: 'Cost of Living — by province' },
  { icon: <Building2 className="w-4 h-4 text-amber-600" />, text: 'Civics — government forms & rights' },
];

export default function NewsAuthPage({ onNavigateHome, onNavigate }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, go straight to news
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && onNavigate) onNavigate('news');
    });
  }, [onNavigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your full name.');
      if (!email.trim()) return setError('Please enter your email.');
      if (password.length < 8) return setError('Password must be at least 8 characters.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
      if (!acceptTerms) return setError('Please accept the terms to continue.');
    } else {
      if (!email.trim()) return setError('Please enter your email.');
      if (!password) return setError('Please enter your password.');
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
      if (onNavigate) onNavigate('news');
      else onNavigateHome();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => { setMode(next); setError(''); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 prospect-auth-bg relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-slate-900/5 blur-3xl pointer-events-none" />

      <button
        onClick={onNavigateHome}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 transition-colors z-10"
      >
        <ArrowLeft size={16} />
        Back to home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/8 border border-white/60 overflow-hidden flex">
          {/* Left panel */}
          <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-linear-to-br from-amber-50 to-slate-100 border-r border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute w-1 h-1 rounded-full bg-amber-400"
                    style={{ top: `${row * 10 + 3}%`, left: `${col * 12 + 3}%`, opacity: Math.random() * 0.5 + 0.2 }}
                  />
                ))
              )}
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-slate-900" style={{ letterSpacing: '-0.02em' }}>
                News & Info Hub
              </h2>
              <p className="text-sm text-slate-600 max-w-xs mb-8">
                Stay informed with curated SA news, understand your taxes, know your rights, and see what life costs in your province.
              </p>
              <div className="space-y-3 text-left">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-slate-500 font-medium">Free · No ads · Updated daily</p>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full md:w-1/2">
            <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-black text-gray-900">News & Info Hub</h1>
              <p className="text-sm text-slate-500 font-semibold mt-0.5">News · Tax · Costs · Civics</p>
            </div>

            <div className="px-8 pt-6 pb-8">
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {(['signup', 'login'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {m === 'signup' ? 'Get Started' : 'Sign In'}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {mode === 'signup' ? (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Thabo Nkosi" className={inputBase} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputBase} />
                    </div>
                    <PasswordField id="news-pw" label="Password" value={password} onChange={setPassword} />
                    <PasswordField id="news-confirm" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} />

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={e => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-amber-500 shrink-0"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-slate-900 font-semibold hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-slate-900 font-semibold hover:underline">Privacy Policy</a>
                      </span>
                    </label>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:bg-slate-800 shadow-md shadow-slate-900/20"
                    >
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{' '}
                      <button type="button" onClick={() => switchMode('login')} className="text-slate-900 font-semibold hover:underline">Sign in</button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputBase} />
                    </div>
                    <PasswordField id="news-login-pw" label="Password" value={password} onChange={setPassword} />

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:bg-slate-800 shadow-md shadow-slate-900/20"
                    >
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => switchMode('signup')} className="text-slate-900 font-semibold hover:underline">Get started</button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          One account for all Prospect features — News, School Assist, Careers & Community.
        </p>
      </motion.div>
    </div>
  );
}
