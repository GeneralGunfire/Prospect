import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, AlertCircle, Loader, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

export function LoginPage() {
  const { signIn, error: authError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError('Email and password required')
      return
    }

    setLoading(true)
    try {
      const result = await signIn(email, password)

      if (result.error) {
        setLocalError(result.error)
      } else if (result.user) {
        navigate('/dashboard')
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background circles - matching landing page */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy/5 rounded-full blur-3xl -ml-36 -mb-36" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8 md:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center text-white font-semibold">
                  P
                </div>
                <div className="text-sm font-bold tracking-widest text-navy uppercase">Prospect</div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-navy mb-2">
                Sign In
              </h1>
              <p className="text-navy/60 text-sm">Welcome back to your career journey</p>
            </motion.div>

            {/* Error Message */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{displayError}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-navy placeholder-slate-400 focus:outline-none focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary transition-all duration-200"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-navy placeholder-slate-400 focus:outline-none focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary transition-all duration-200"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3 bg-navy text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-navy/20 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="my-8 relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-slate-400 font-semibold uppercase tracking-widest">
                  New here?
                </span>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="space-y-3"
            >
              <Link
                to="/signup"
                className="w-full block text-center py-3 bg-white border-2 border-navy text-navy font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-slate-50 transition-all duration-200 hover:shadow-md active:scale-95"
              >
                Create Account
              </Link>
            </motion.div>
          </div>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="text-navy/60 hover:text-navy text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
