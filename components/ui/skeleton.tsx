import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: number | string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedMap = {
  sm:   "rounded",
  md:   "rounded-lg",
  lg:   "rounded-xl",
  full: "rounded-full",
};

const SkeletonItem = ({ className, height, rounded = "md" }: {
  className?: string;
  height?: number | string;
  rounded?: "sm" | "md" | "lg" | "full";
}) => (
  <div
    className={cn("skeleton w-full", roundedMap[rounded], className)}
    style={{ height: typeof height === "number" ? `${height}px` : height ?? "1rem" }}
    aria-hidden="true"
  />
);

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, height, rounded = "md", ...props }, ref) => {
    if (count === 1) {
      return (
        <div ref={ref} className={className} {...props}>
          <SkeletonItem height={height} rounded={rounded} />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonItem key={i} height={height} rounded={rounded} />
        ))}
      </div>
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
