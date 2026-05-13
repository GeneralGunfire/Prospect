import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Globe, Droplets, AlertCircle, Loader2, Check } from 'lucide-react';
import { signIn, signUp } from '../../lib/auth';
import type { AppPage } from '../../lib/withAuth';

interface Props {
  onNavigateHome: () => void;
  onNavigate?: (page: AppPage) => void;
}

type Mode = 'login' | 'signup';

const inputBase =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 text-sm';

const PasswordField = ({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={`${inputBase} pr-11`}
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

const features = [
  { icon: <Globe className="w-4 h-4" />, text: 'Community Impact — map opportunity gaps' },
  { icon: <Droplets className="w-4 h-4" />, text: 'Water Dashboard — monitor dam & water levels' },
  { icon: <Check className="w-4 h-4" />, text: 'Tax & Budget · Cost of Living · Civics' },
  { icon: <Check className="w-4 h-4" />, text: 'Free to use · Privacy-conscious' },
];

export default function ImpactAuthPage({ onNavigateHome, onNavigate }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (mode === 'signup') await signUp(email.trim(), password, name.trim());
      else await signIn(email.trim(), password);
      if (onNavigate) onNavigate('community-impact');
      else onNavigateHome();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => { setMode(next); setError(''); };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — form panel */}
      <div className="flex flex-col w-full md:w-1/2 min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <button onClick={onNavigateHome} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-sm">P</div>
            <span className="font-black text-sm uppercase tracking-widest text-slate-900">Prospect</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col flex-1 items-center justify-center px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-sm"
          >
            {/* Heading */}
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-slate-700" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Community Hub</h1>
              <p className="text-sm text-slate-500">Sign in to map, report, and make your community's voice count.</p>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              {(['login', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Get Involved'}
                </button>
              ))}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                >
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}
                  onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputBase} />
                  </div>
                  <PasswordField id="impact-login-pw" label="Password" value={password} onChange={setPassword} />
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-slate-700 transition-colors mt-2">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : 'Sign In'}
                  </motion.button>
                  <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="text-slate-900 font-bold hover:underline">Get involved</button>
                  </p>
                </motion.form>
              ) : (
                <motion.form key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}
                  onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Full name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Thabo Nkosi" className={inputBase} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputBase} />
                  </div>
                  <PasswordField id="impact-signup-pw" label="Password" value={password} onChange={setPassword} />
                  <PasswordField id="impact-confirm-pw" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} />
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-slate-900 shrink-0" />
                    <span className="text-sm text-slate-500">
                      I agree to the <a href="#" className="text-slate-900 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-slate-700 transition-colors">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create Account'}
                  </motion.button>
                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="text-slate-900 font-bold hover:underline">Sign in</button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-400 mt-8">Free for all South Africans · No credit card required</p>
          </motion.div>
        </div>
      </div>

      {/* Right — SA flag image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="/images/sa-flag.jpg"
          alt="South African flag"
          className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
        />
        {/* Overlay with feature list */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60 mb-4">What you get access to</p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-white/90 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
