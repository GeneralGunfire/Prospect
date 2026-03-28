"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Sign in
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        return;
      }

      // Save email to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("prospect_remembered_email", email);
      } else {
        localStorage.removeItem("prospect_remembered_email");
      }

      setSuccessMessage("Signing in...");
      // Redirect to dashboard/home after successful sign in
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign in failed");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-prospect-navy rounded-lg flex items-center justify-center text-white font-semibold">
            P
          </div>
          <span className="text-sm font-bold tracking-widest text-prospect-navy uppercase">
            Prospect
          </span>
        </div>
        <h1 className="text-3xl font-bold text-prospect-dark mb-2">Sign In</h1>
        <p className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-prospect-blue hover:underline font-semibold"
          >
            Create now
          </Link>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-prospect-red/10 border border-prospect-red rounded-lg">
          <p className="text-sm text-prospect-red font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-500 rounded-lg">
          <p className="text-sm text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-prospect-dark placeholder-gray-400 focus:outline-none focus:border-prospect-blue focus:bg-white focus:ring-1 focus:ring-prospect-blue transition-all duration-200 disabled:opacity-50"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-prospect-dark placeholder-gray-400 focus:outline-none focus:border-prospect-blue focus:bg-white focus:ring-1 focus:ring-prospect-blue transition-all duration-200 disabled:opacity-50"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-prospect-dark transition-colors"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-gray-300 text-prospect-blue focus:ring-prospect-blue cursor-pointer"
          />
          <span>Remember me</span>
        </label>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-prospect-blue hover:underline font-semibold"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 py-3 bg-prospect-green text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-prospect-green/20"
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
      </button>

      {/* Divider */}
      <div className="my-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400 font-semibold uppercase tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-prospect-dark font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#1f2937"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#1f2937"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#1f2937"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#1f2937"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-prospect-dark font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>
      </div>
    </form>
  );
}
