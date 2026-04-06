import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Github, Chrome, HelpCircle, Layout, TrendingUp, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && typeof location.state.isLogin === 'boolean') {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        login(email, name || 'Student User');
      } else {
        signup(email, name);
      }
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-md w-full mx-auto flex flex-col h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20">P</div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-black leading-none">Prospect</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Career Architecture</span>
            </div>
          </Link>

          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-slate-500 mb-8">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-black font-semibold hover:underline"
              >
                {isLogin ? 'Create now' : 'Sign in now'}
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-slate-900 focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black" />
                  <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-sm font-semibold text-black hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'}
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-semibold tracking-widest">OR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700">
                <Chrome className="w-5 h-5 text-black" />
                Continue with Google
              </button>
              <button className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700">
                <Github className="w-5 h-5 text-slate-900" />
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden flex-col p-12 lg:p-20 text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] opacity-5" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] opacity-5" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Support Link */}
          <div className="flex justify-end mb-12">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
              Support
            </button>
          </div>

          {/* Featured Card Container */}
          <div className="flex-grow flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              {/* Main Card */}
              <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-2xl relative z-20">
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  Reach your <br /> goals faster
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Use your Prospect dashboard to navigate the world of possibilities with ease. Manage your time and resources effectively.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Learn more
                </button>

                {/* Floating Elements */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-40 bg-black rounded-2xl shadow-xl transform rotate-6 flex flex-col p-6 text-white overflow-hidden border border-white/10">
                  <div className="flex justify-between items-start mb-auto">
                    <div className="text-lg font-bold">Prospect</div>
                    <CreditCard className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="text-sm font-mono tracking-widest mb-4">7812 2139 0823 XXXX</div>
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] opacity-70">VALID THRU<br /><span className="text-xs font-bold opacity-100">05/28</span></div>
                    <div className="text-[10px] opacity-70 text-right">CVV<br /><span className="text-xs font-bold opacity-100">09X</span></div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                </div>

                <div className="absolute -left-8 -bottom-8 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-black">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earnings</div>
                    <div className="text-lg font-bold text-slate-900">$350.40</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Content */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-white">Introducing new features</h3>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Analyzing previous trends ensures that students always make the right decision. And as the scale of the decision and its impact magnifies...
            </p>
            
            <div className="flex items-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
