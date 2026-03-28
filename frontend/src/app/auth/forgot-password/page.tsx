"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { Loader, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        setError("Email is required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

      if (resetError) {
        setError(resetError.message || "Failed to send reset email");
        return;
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-prospect-dark mb-2">
                Email Sent
              </h1>
              <p className="text-gray-600">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Check your email and click the link to reset your password. The
              link will expire in 24 hours.
            </p>

            <div className="space-y-3 pt-4">
              <Link
                href="/auth/signin"
                className="w-full px-6 py-3 bg-prospect-green text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-200 block"
              >
                Back to Sign In
              </Link>

              <button
                onClick={() => setSent(false)}
                className="w-full px-6 py-3 border border-gray-300 text-prospect-dark font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Didn&apos;t receive? Try again
              </button>
            </div>
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
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your email and we&apos;ll send you a link to reset your password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-prospect-red/10 border border-prospect-red rounded-lg">
              <p className="text-sm text-prospect-red font-medium">{error}</p>
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
              placeholder="your@email.com"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-prospect-dark placeholder-gray-400 focus:outline-none focus:border-prospect-blue focus:bg-white focus:ring-1 focus:ring-prospect-blue transition-all duration-200 disabled:opacity-50"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3 bg-prospect-green text-white font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
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
