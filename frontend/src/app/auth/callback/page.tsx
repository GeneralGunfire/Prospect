"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase OAuth redirects here after authentication
    // The session is already stored in localStorage by the Supabase client
    // Redirect to home page or dashboard
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 bg-prospect-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-prospect-dark mb-2">
          Signing you in...
        </h1>
        <p className="text-gray-600">Please wait while we complete your sign in</p>
      </div>
    </div>
  );
}
