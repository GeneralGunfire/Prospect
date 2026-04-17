import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Globe, Users, Lock, Check, Loader2 } from 'lucide-react';

interface Props {
  onNavigateHome: () => void;
}

type Mode = 'login' | 'signup';

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-white/80 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-500 text-sm border-gray-200';

const PasswordField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
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
          placeholder="••••••••"
          className={`${inputBase} pr-11`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default function ImpactAuthPage({ onNavigateHome }: Props) {
  const [mode, setMode] = useState<Mode>('signup');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotice(
        mode === 'signup'
          ? 'Thanks for your interest! Community Impact is coming soon.'
          : 'This feature is not yet available. Check back soon.'
      );
    }, 1000);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setNotice('');
  };

  const impactPoints = [
    { icon: <Globe className="w-4 h-4 text-blue-500" />, text: 'Share what your area needs' },
    { icon: <Users className="w-4 h-4 text-blue-500" />, text: 'Help build a national opportunity map' },
    { icon: <Lock className="w-4 h-4 text-blue-500" />, text: 'Fully optional, privacy-conscious' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #f8fafc 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onNavigateHome}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors z-10"
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
          <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-r border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute w-1 h-1 rounded-full bg-blue-400"
                    style={{ top: `${row * 10 + 3}%`, left: `${col * 12 + 3}%`, opacity: Math.random() * 0.5 + 0.2 }}
                  />
                ))
              )}
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-blue-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                Community Impact
              </h2>
              <p className="text-sm text-blue-700 max-w-xs mb-8">
                Help us map opportunity gaps across South Africa — one community at a time.
              </p>
              <div className="space-y-3 text-left">
                {impactPoints.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-blue-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      {p.icon}
                    </div>
                    <span className="text-sm text-blue-800 font-medium">{p.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-blue-600 font-medium">
                Coming soon · Sign up to be notified
              </p>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full md:w-1/2">
            {/* Brand header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-black text-gray-900">Community Impact</h1>
              <p className="text-sm text-blue-700 font-semibold mt-0.5">Map opportunities in your area</p>
            </div>

            <div className="px-8 pt-6 pb-8">
              {/* Mode toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {(['signup', 'login'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === m
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {m === 'signup' ? 'Get Involved' : 'Sign In'}
                  </button>
                ))}
              </div>

              {/* Notice banner */}
              <AnimatePresence>
                {notice && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm"
                  >
                    <Check size={16} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>{notice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {mode === 'signup' && (
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
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Thabo Nkosi"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputBase}
                      />
                    </div>
                    <PasswordField id="impact-password" label="Password" value={password} onChange={setPassword} />
                    <PasswordField id="impact-confirm" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} />

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-blue-600 shrink-0"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-blue-700 font-medium hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-700 font-medium hover:underline">Privacy Policy</a>
                      </span>
                    </label>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:bg-blue-700 shadow-md shadow-blue-200"
                    >
                      {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Signing up…</>
                        : 'Create Account'}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{' '}
                      <button type="button" onClick={() => switchMode('login')} className="text-blue-700 font-semibold hover:underline">
                        Sign in
                      </button>
                    </p>
                  </motion.form>
                )}

                {mode === 'login' && (
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
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputBase}
                      />
                    </div>
                    <PasswordField id="impact-login-password" label="Password" value={password} onChange={setPassword} />

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:bg-blue-700 shadow-md shadow-blue-200"
                    >
                      {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                        : 'Sign In'}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => switchMode('signup')} className="text-blue-700 font-semibold hover:underline">
                        Get involved
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Community Impact is a future feature · No data is collected yet
        </p>
      </motion.div>
    </div>
  );
}
