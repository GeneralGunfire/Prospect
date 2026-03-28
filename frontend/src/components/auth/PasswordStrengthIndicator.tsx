"use client";

import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const strength =
    metCount <= 1 ? "weak" : metCount <= 3 ? "medium" : "strong";
  const strengthColor =
    strength === "weak"
      ? "bg-prospect-red"
      : strength === "medium"
        ? "bg-yellow-500"
        : "bg-green-500";
  const strengthText =
    strength === "weak" ? "Weak" : strength === "medium" ? "Medium" : "Strong";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-prospect-dark uppercase tracking-widest">
            Password Strength
          </label>
          <span className={`text-xs font-semibold ${strength === "weak" ? "text-prospect-red" : strength === "medium" ? "text-yellow-600" : "text-green-600"}`}>
            {strengthText}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(metCount / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-600 font-medium">Requirements:</p>
        <ul className="space-y-1.5">
          {requirements.map((req) => (
            <li
              key={req.label}
              className="flex items-center gap-2 text-xs text-gray-700"
            >
              {req.met ? (
                <Check className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
