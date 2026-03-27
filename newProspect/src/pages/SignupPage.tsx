import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, AlertCircle, CheckCircle2, Loader, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

export function SignupPage() {
  const { signUp, error: authError } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      const result = await signUp(email, password, username, name)

      if (result.error) {
        setLocalError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || authError

  if (success) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-12">
        {/* Animated background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy/5 rounded-full blur-3xl -ml-36 -mb-36" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10 bg-white rounded-2xl border border-slate-100 shadow-lg p-8 md:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy mb-3">
            Account Created!
          </h2>
          <p className="text-navy/60 mb-8">
            Your account has been created successfully. Redirecting to login...
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader className="w-6 h-6 mx-auto text-secondary" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

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
                Create Account
              </h1>
              <p className="text-navy/60 text-sm">Join Prospect and discover your career path</p>
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-navy placeholder-slate-400 focus:outline-none focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary transition-all duration-200"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
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
                transition={{ delay: 0.25, duration: 0.5 }}
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
                <p className="text-xs text-slate-500 mt-2">At least 6 characters</p>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                transition={{ delay: 0.35, duration: 0.5 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3 bg-navy text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-navy/20 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="my-8 relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-slate-400 font-semibold uppercase tracking-widest">
                  Already a member?
                </span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="space-y-3"
            >
              <Link
                to="/login"
                className="w-full block text-center py-3 bg-white border-2 border-navy text-navy font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-slate-50 transition-all duration-200 hover:shadow-md active:scale-95"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
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
