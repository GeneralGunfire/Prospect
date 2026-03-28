"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader, ArrowRight } from "lucide-react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { supabase } from "@/lib/supabase";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password validation
  const passwordMet =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Validate all fields
      if (!fullName || !email || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }

      if (fullName.length < 2) {
        setError("Full name must be at least 2 characters");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!passwordMet) {
        setError(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!acceptTerms) {
        setError("You must accept the Terms of Service and Privacy Policy");
        return;
      }

      // Sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        return;
      }

      setSuccessMessage(
        "Account created successfully! Please check your email to verify your account."
      );

      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);

      // Redirect to sign in after delay
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      setError(err instanceof Error ? err.message : "OAuth sign up failed");
    }
  };

  const handleFacebookSignUp = async () => {
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
      setError(err instanceof Error ? err.message : "OAuth sign up failed");
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
        <h1 className="text-3xl font-bold text-prospect-dark mb-2">Sign Up</h1>
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-prospect-blue hover:underline font-semibold"
          >
            Sign in
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

      {/* Full Name Input */}
      <div>
        <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-prospect-dark placeholder-gray-400 focus:outline-none focus:border-prospect-blue focus:bg-white focus:ring-1 focus:ring-prospect-blue transition-all duration-200 disabled:opacity-50"
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
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
        <div className="relative mb-3">
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

        {/* Password Strength Indicator */}
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-prospect-dark placeholder-gray-400 focus:outline-none focus:border-prospect-blue focus:bg-white focus:ring-1 focus:ring-prospect-blue transition-all duration-200 disabled:opacity-50"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-prospect-dark transition-colors"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Terms & Conditions Checkbox */}
      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          disabled={loading}
          className="w-5 h-5 rounded border-gray-300 text-prospect-blue focus:ring-prospect-blue cursor-pointer mt-0.5 shrink-0"
          required
        />
        <span className="text-sm text-gray-700">
          I agree to the{" "}
          <Link href="#" className="text-prospect-blue hover:underline font-semibold">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-prospect-blue hover:underline font-semibold">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={loading || !acceptTerms}
        className="w-full mt-8 py-3 bg-prospect-green text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-prospect-green/20"
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
      </button>

      {/* Divider */}
      <div className="my-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400 font-semibold uppercase tracking-widest">
            Or sign up with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
          Sign up with Google
        </button>

        <button
          type="button"
          onClick={handleFacebookSignUp}
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
          Sign up with Facebook
        </button>
      </div>
    </form>
  );
}
