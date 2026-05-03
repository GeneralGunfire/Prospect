import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, BookOpen, CalendarDays, Target, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, signUp, sendPasswordReset, getPasswordStrength } from '../lib/auth';
import type { User } from '@supabase/supabase-js';

type Mode = 'login' | 'signup' | 'forgot';

interface AuthPageProps {
  onNavigateHome: () => void;
  onAuthSuccess: (user: User) => void;
}

const inputBase =
  'w-full px-4 py-3 min-h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 text-base sm:text-sm';

const PasswordField = ({
  id, label, value, onChange, placeholder, error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string;
}) => {
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
          placeholder={placeholder ?? '••••••••'}
          className={`${inputBase} pr-11 ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const { score, label, checks } = getPasswordStrength(password);
  if (!password) return null;
  const barColor = label === 'strong' ? 'bg-green-500' : label === 'medium' ? 'bg-amber-400' : 'bg-red-400';
  const checkItems = [
    { key: 'length', label: '8+ characters' },
    { key: 'uppercase', label: 'Uppercase' },
    { key: 'lowercase', label: 'Lowercase' },
    { key: 'number', label: 'Number' },
    { key: 'special', label: 'Special char' },
  ] as const;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? barColor : 'bg-slate-100'}`} />
          ))}
        </div>
        <span className={`text-xs font-bold capitalize ${label === 'strong' ? 'text-green-600' : label === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checkItems.map(({ key, label: lbl }) => (
          <div key={key} className="flex items-center gap-1.5">
            {checks[key] ? <Check size={11} className="text-green-500 shrink-0" /> : <X size={11} className="text-slate-300 shrink-0" />}
            <span className={`text-xs ${checks[key] ? 'text-green-600' : 'text-slate-400'}`}>{lbl}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    try { await sendPasswordReset(email); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 space-y-4">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <Check size={22} className="text-green-600" />
      </div>
      <div>
        <p className="font-bold text-slate-900">Check your inbox</p>
        <p className="text-sm text-slate-500 mt-1">We sent a reset link to <strong>{email}</strong></p>
      </div>
      <button onClick={onBack} className="text-sm text-slate-900 font-bold hover:underline">Back to Login</button>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email address</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
          placeholder="you@example.com" className={inputBase} />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 min-h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-slate-700 transition-colors">
        {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
      </button>
      <button type="button" onClick={onBack}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={13} /> Back to Login
      </button>
    </form>
  );
};

const features = [
  { icon: <BookOpen className="w-4 h-4" />, text: 'Grade 10–12 study library, free & curriculum-aligned' },
  { icon: <CalendarDays className="w-4 h-4" />, text: 'SA school term calendar & exam dates' },
  { icon: <Target className="w-4 h-4" />, text: 'Personalised study planner & progress tracking' },
  { icon: <Check className="w-4 h-4" />, text: 'Free forever · No credit card required' },
];

export default function AuthPage({ onNavigateHome, onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => { setFormError(''); setSuccess(''); setFieldErrors({}); }, [mode]);

  const validateLogin = () => {
    const errors: Record<string, string> = {};
    if (!loginEmail) errors.loginEmail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+$/.test(loginEmail)) errors.loginEmail = 'Enter a valid email.';
    if (!loginPassword) errors.loginPassword = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignup = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!signupEmail) errors.signupEmail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+$/.test(signupEmail)) errors.signupEmail = 'Enter a valid email.';
    const { score } = getPasswordStrength(signupPassword);
    if (!signupPassword) errors.signupPassword = 'Password is required.';
    else if (score < 3) errors.signupPassword = 'Password is too weak.';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (signupPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!acceptTerms) errors.terms = 'You must accept the terms to continue.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true); setFormError('');
    try {
      const { user } = await signIn(loginEmail, loginPassword);
      setSuccess('Welcome back! Redirecting…');
      setTimeout(() => onAuthSuccess(user!), 1200);
    } catch (err) { setFormError(err instanceof Error ? err.message : 'Login failed.'); }
    finally { setLoading(false); }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true); setFormError('');
    try {
      const { user } = await signUp(signupEmail, signupPassword, fullName);
      setSuccess('Account created! Taking you in…');
      setTimeout(() => onAuthSuccess(user!), 1000);
    } catch (err) { setFormError(err instanceof Error ? err.message : 'Sign up failed.'); }
    finally { setLoading(false); }
  };

  const switchMode = (next: Mode) => { setMode(next); setFormError(''); setSuccess(''); setFieldErrors({}); };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — form panel */}
      <div className="flex flex-col w-full md:w-1/2 min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-6 border-b border-slate-100">
          <button onClick={onNavigateHome} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-sm">P</div>
            <span className="font-black text-sm uppercase tracking-widest text-slate-900">Prospect</span>
          </div>
        </div>

        {/* Form body */}
        <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-sm"
          >
            {/* Heading */}
            {mode !== 'forgot' && (
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6 text-slate-700" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">School Assist</h1>
                <p className="text-sm text-slate-500">
                  {mode === 'login' ? 'Welcome back. Sign in to your study space.' : 'Create a free account to get started.'}
                </p>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Reset password</h1>
                <p className="text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>
              </div>
            )}

            {/* Mode toggle */}
            {mode !== 'forgot' && (
              <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                {(['login', 'signup'] as const).map((m) => (
                  <button key={m} onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            {/* Banners */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  <Check size={15} className="shrink-0 mt-0.5" /><span>{success}</span>
                </motion.div>
              )}
              {formError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /><span>{formError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'forgot' && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                  <ForgotPasswordForm onBack={() => switchMode('login')} />
                </motion.div>
              )}

              {mode === 'login' && (
                <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }} onSubmit={handleLogin} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email address</label>
                    <input type="email" value={loginEmail}
                      onChange={e => { setLoginEmail(e.target.value); setFieldErrors(p => ({ ...p, loginEmail: '' })); }}
                      placeholder="you@example.com"
                      className={`${inputBase} ${fieldErrors.loginEmail ? 'border-red-300' : ''}`} />
                    {fieldErrors.loginEmail && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.loginEmail}</p>}
                  </div>
                  <PasswordField id="login-pw" label="Password" value={loginPassword}
                    onChange={v => { setLoginPassword(v); setFieldErrors(p => ({ ...p, loginPassword: '' })); }}
                    error={fieldErrors.loginPassword} />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900" />
                      <span className="text-sm text-slate-500">Remember me</span>
                    </label>
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="text-sm text-slate-900 font-bold hover:underline">Forgot password?</button>
                  </div>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-3 min-h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-slate-700 transition-colors">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Logging in…</> : 'Log In'}
                  </motion.button>
                  <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="text-slate-900 font-bold hover:underline">Sign up free</button>
                  </p>
                </motion.form>
              )}

              {mode === 'signup' && (
                <motion.form key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }} onSubmit={handleSignup} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Full name</label>
                    <input type="text" value={fullName}
                      onChange={e => { setFullName(e.target.value); setFieldErrors(p => ({ ...p, fullName: '' })); }}
                      placeholder="Thabo Nkosi"
                      className={`${inputBase} ${fieldErrors.fullName ? 'border-red-300' : ''}`} />
                    {fieldErrors.fullName && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email address</label>
                    <input type="email" value={signupEmail}
                      onChange={e => { setSignupEmail(e.target.value); setFieldErrors(p => ({ ...p, signupEmail: '' })); }}
                      placeholder="you@example.com"
                      className={`${inputBase} ${fieldErrors.signupEmail ? 'border-red-300' : ''}`} />
                    {fieldErrors.signupEmail && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.signupEmail}</p>}
                  </div>
                  <div>
                    <PasswordField id="signup-pw" label="Password" value={signupPassword}
                      onChange={v => { setSignupPassword(v); setFieldErrors(p => ({ ...p, signupPassword: '' })); }}
                      error={fieldErrors.signupPassword} />
                    <AnimatePresence>{signupPassword && <PasswordStrengthBar password={signupPassword} />}</AnimatePresence>
                  </div>
                  <PasswordField id="confirm-pw" label="Confirm password" value={confirmPassword}
                    onChange={v => { setConfirmPassword(v); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
                    placeholder="Re-enter your password" error={fieldErrors.confirmPassword} />
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={acceptTerms}
                        onChange={e => { setAcceptTerms(e.target.checked); setFieldErrors(p => ({ ...p, terms: '' })); }}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-slate-900 shrink-0" />
                      <span className="text-sm text-slate-500">
                        I agree to the <a href="#" className="text-slate-900 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    {fieldErrors.terms && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.terms}</p>}
                  </div>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-3 min-h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-slate-700 transition-colors">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create Account'}
                  </motion.button>
                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="text-slate-900 font-bold hover:underline">Log in</button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-400 mt-8">Free for all South African students · No credit card required</p>
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
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
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
