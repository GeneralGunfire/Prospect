"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Verify that user has a valid session (from email link)
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError(
          "Invalid or expired reset link. Please request a new password reset."
        );
      }
      setInitialized(true);
    };

    checkSession();
  }, []);

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
    setLoading(true);

    try {
      if (!password || !confirmPassword) {
        setError("Both password fields are required");
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

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password");
        return;
      }

      setSuccess(true);

      // Redirect to sign in after delay
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-prospect-blue" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-prospect-dark mb-2">
              Password Reset
            </h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting to sign in&hellip;
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-md">
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
            <h1 className="text-3xl font-bold text-prospect-dark mb-2">
              Create New Password
            </h1>
            <p className="text-gray-600">
              Enter a new password for your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-prospect-red/10 border border-prospect-red rounded-lg">
              <p className="text-sm text-prospect-red font-medium">{error}</p>
              {error.includes("expired") && (
                <Link
                  href="/auth/forgot-password"
                  className="block text-prospect-blue hover:underline font-semibold text-sm mt-2"
                >
                  Request a new reset link
                </Link>
              )}
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-prospect-dark uppercase tracking-widest mb-3">
              New Password
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !passwordMet}
            className="w-full mt-8 py-3 bg-prospect-green text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Update Password
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Sign In */}
          <div className="text-center pt-4">
            <Link
              href="/auth/signin"
              className="text-prospect-blue hover:underline font-semibold text-sm"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
