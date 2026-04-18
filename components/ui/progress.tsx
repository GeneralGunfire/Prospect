import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: "xs" | "sm" | "md";
  color?: "primary" | "success" | "warning" | "info";
}

const colorMap: Record<string, string> = {
  primary: "bg-[#1E3A5F]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info:    "bg-blue-500",
};

const sizeMap: Record<string, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      label,
      showPercent = false,
      size = "md",
      color = "primary",
      ...props
    },
    ref
  ) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(label || showPercent) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <span className="text-sm text-text-secondary">{label}</span>
            )}
            {showPercent && (
              <span className="text-sm font-semibold text-text-primary">
                {Math.round(pct)}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          className={cn(
            "w-full bg-slate-100 rounded-full overflow-hidden",
            sizeMap[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorMap[color]
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
