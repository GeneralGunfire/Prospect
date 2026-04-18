import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const inputEl = (
      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            "w-full bg-white border rounded-lg text-text-primary placeholder:text-text-tertiary",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            "text-base", /* 16px — prevents iOS auto-zoom */
            "h-11 px-3",
            icon && iconPosition === "left" && "pl-9",
            icon && iconPosition === "right" && "pr-9",
            error
              ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
              : "border-border",
            className
          )}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    );

    if (!label && !error && !hint) return inputEl;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1e293b]"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        {inputEl}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-500 flex items-center gap-1"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-sm text-[#64748b]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
