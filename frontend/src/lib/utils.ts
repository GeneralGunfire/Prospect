import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ProspectMode = "normal" | "datasaver";

export function setProspectMode(mode: ProspectMode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("prospect_mode", mode);
  }
}

export function getProspectMode(): ProspectMode {
  if (typeof window === "undefined") return "normal";
  return (localStorage.getItem("prospect_mode") as ProspectMode) || "normal";
}
