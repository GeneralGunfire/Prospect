import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { signIn, signUp, sendPasswordReset, getPasswordStrength } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type Mode = 'login' | 'signup' | 'forgot';

interface AuthPageProps {
  onNavigateHome: () => void;
  onAuthSuccess: (user: User) => void;
}

// ── Reusable field components ──────────────────────────────────────────────

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-white/80 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-prospect-green/40 focus:border-prospect-green text-sm';

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '••••••••'}
          className={`${inputBase} pr-11 ${error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-200'}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const { score, label, checks } = getPasswordStrength(password);
  if (!password) return null;

  const barColor =
    label === 'strong' ? 'bg-green-500' : label === 'medium' ? 'bg-amber-400' : 'bg-red-400';

  const checkItems = [
    { key: 'length', label: '8+ characters' },
    { key: 'uppercase', label: 'Uppercase letter' },
    { key: 'lowercase', label: 'Lowercase letter' },
    { key: 'number', label: 'Number' },
    { key: 'special', label: 'Special character' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 overflow-hidden"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= score ? barColor : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span
          className={`text-xs font-semibold capitalize ${
            label === 'strong'
              ? 'text-green-600'
              : label === 'medium'
              ? 'text-amber-500'
              : 'text-red-500'
          }`}
        >
          {label}
        </span>
      </div>
      {/* Requirement checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checkItems.map(({ key, label: lbl }) => (
          <div key={key} className="flex items-center gap-1.5">
            {checks[key] ? (
              <Check size={12} className="text-green-500 shrink-0" />
            ) : (
              <X size={12} className="text-gray-300 shrink-0" />
            )}
            <span className={`text-xs ${checks[key] ? 'text-green-600' : 'text-gray-400'}`}>
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Forgot Password sub-form ───────────────────────────────────────────────

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 space-y-4"
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check size={28} className="text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">Check your inbox</p>
          <p className="text-sm text-gray-500 mt-1">
            We sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-prospect-green font-medium hover:underline">
          Back to Login
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="you@example.com"
          className={`${inputBase} border-gray-200`}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-prospect-green text-white font-semibold text-sm hover:bg-prospect-green-dark transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Login
      </button>
    </form>
  );
};

// ── Main AuthPage ──────────────────────────────────────────────────────────

export default function AuthPage({ onNavigateHome, onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Clear errors on mode switch
  useEffect(() => {
    setFormError('');
    setSuccess('');
    setFieldErrors({});
  }, [mode]);

  // ── Validation ────────────────────────────────────────────────────────────

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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    setFormError('');
    try {
      const { user } = await signIn(loginEmail, loginPassword);
      setSuccess('Welcome back! Redirecting…');
      setTimeout(() => onAuthSuccess(user!), 1200);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    setFormError('');
    try {
      const { user } = await signUp(signupEmail, signupPassword, fullName);
      setSuccess('Account created! Taking you in…');
      setTimeout(() => onAuthSuccess(user!), 1000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormError('');
    setSuccess('');
    setFieldErrors({});
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 prospect-auth-bg relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-prospect-green/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-prospect-gold/10 blur-3xl pointer-events-none" />

      {/* Back to home */}
      <button
        onClick={onNavigateHome}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-prospect-green transition-colors z-10"
      >
        <ArrowLeft size={16} />
        <span>Back to home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl"
      >
        {/* Card — split layout */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/60 overflow-hidden flex">
          {/* Left panel — visual (uses SignInCard's layout concept) */}
          <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-linear-to-br from-blue-50 to-slate-100 border-r border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              {/* Dot grid background */}
              {Array.from({ length: 12 }).map((_, row) =>
                Array.from({ length: 10 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute w-1 h-1 rounded-full bg-calm-blue"
                    style={{ top: `${row * 9 + 2}%`, left: `${col * 10 + 2}%`, opacity: Math.random() * 0.6 + 0.2 }}
                  />
                ))
              )}
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg bg-calm-blue">P</div>
              <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-calm-blue to-calm-dark-blue">Prospect SA</h2>
              <p className="text-sm text-slate-600 max-w-xs">Your free career guidance platform for South African students</p>
              <div className="mt-6 space-y-3 text-left">
                {['Career assessments & quiz', 'Browse 200+ career paths', 'Bursaries & funding info', 'Study resources & calendar'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-calm-blue/20 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-calm-blue" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full md:w-1/2">
          {/* Logo + brand */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-semibold text-4xl mx-auto mb-3 shadow-lg" style={{ backgroundColor: '#1e293b' }}>P</div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Prospect</h1>
            <p className="text-sm font-semibold text-[#1B5E20] mt-0.5">Know your path. Own your future.</p>
          </div>

          <div className="px-8 pt-6 pb-8">
            {/* Mode toggle — hidden on forgot */}
            {mode !== 'forgot' && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {(['login', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === m
                        ? 'bg-white text-prospect-green shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            {/* Forgot mode heading */}
            {mode === 'forgot' && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Reset your password</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
            )}

            {/* Global success / error banners */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm"
                >
                  <Check size={16} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </motion.div>
              )}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm"
                >
                  <X size={16} className="shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'forgot' && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <ForgotPasswordForm onBack={() => switchMode('login')} />
                </motion.div>
              )}

              {mode === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                  noValidate
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setFieldErrors((p) => ({ ...p, loginEmail: '' }));
                      }}
                      placeholder="you@example.com"
                      className={`${inputBase} ${fieldErrors.loginEmail ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-200'}`}
                    />
                    {fieldErrors.loginEmail && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldErrors.loginEmail}</p>
                    )}
                  </div>

                  {/* Password */}
                  <PasswordInput
                    id="login-password"
                    label="Password"
                    value={loginPassword}
                    onChange={(v) => {
                      setLoginPassword(v);
                      setFieldErrors((p) => ({ ...p, loginPassword: '' }));
                    }}
                    error={fieldErrors.loginPassword}
                  />

                  {/* Remember me + forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-prospect-green"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-sm text-prospect-green font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl prospect-btn-primary text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-200 shadow-md shadow-prospect-green/25"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Logging in…</>
                    ) : (
                      'Log In'
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-prospect-green font-semibold hover:underline"
                    >
                      Sign up free
                    </button>
                  </p>
                </motion.form>
              )}

              {mode === 'signup' && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                  noValidate
                >
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setFieldErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      placeholder="Thabo Nkosi"
                      className={`${inputBase} ${fieldErrors.fullName ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-200'}`}
                    />
                    {fieldErrors.fullName && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        setFieldErrors((p) => ({ ...p, signupEmail: '' }));
                      }}
                      placeholder="you@example.com"
                      className={`${inputBase} ${fieldErrors.signupEmail ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-200'}`}
                    />
                    {fieldErrors.signupEmail && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldErrors.signupEmail}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <PasswordInput
                      id="signup-password"
                      label="Password"
                      value={signupPassword}
                      onChange={(v) => {
                        setSignupPassword(v);
                        setFieldErrors((p) => ({ ...p, signupPassword: '' }));
                      }}
                      error={fieldErrors.signupPassword}
                    />
                    <AnimatePresence>
                      {signupPassword && <PasswordStrengthBar password={signupPassword} />}
                    </AnimatePresence>
                  </div>

                  {/* Confirm password */}
                  <PasswordInput
                    id="confirm-password"
                    label="Confirm password"
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v);
                      setFieldErrors((p) => ({ ...p, confirmPassword: '' }));
                    }}
                    placeholder="Re-enter your password"
                    error={fieldErrors.confirmPassword}
                  />

                  {/* Terms */}
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => {
                          setAcceptTerms(e.target.checked);
                          setFieldErrors((p) => ({ ...p, terms: '' }));
                        }}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-prospect-green shrink-0"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-prospect-green font-medium hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-prospect-green font-medium hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {fieldErrors.terms && (
                      <p className="mt-1.5 text-xs text-red-500">{fieldErrors.terms}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl prospect-btn-primary text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-200 shadow-md shadow-prospect-green/25"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-prospect-green font-semibold hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          </div>{/* end right panel */}
        </div>{/* end split card */}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Free for all South African students · No credit card required
        </p>
      </motion.div>
    </div>
  );
}
