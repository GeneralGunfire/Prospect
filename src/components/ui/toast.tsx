import * as React from "react";
import { cn } from "../../lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  add: (message: string, variant: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ add: () => {} });

let externalAdd: ((msg: string, v: ToastVariant) => void) | null = null;

export const toast = {
  success: (msg: string) => externalAdd?.(msg, "success"),
  error:   (msg: string) => externalAdd?.(msg, "error"),
  warning: (msg: string) => externalAdd?.(msg, "warning"),
  info:    (msg: string) => externalAdd?.(msg, "info"),
};

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#10b981" opacity=".2"/>
      <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#ef4444" opacity=".2"/>
      <path d="M10 6l-4 4M6 6l4 4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14 13H2L8 2z" fill="#f59e0b" opacity=".2"/>
      <path d="M8 6v3M8 11v.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#3b82f6" opacity=".2"/>
      <path d="M8 7v4M8 5v.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const variantBorder: Record<ToastVariant, string> = {
  success: "border-l-emerald-500",
  error:   "border-l-red-500",
  warning: "border-l-amber-500",
  info:    "border-l-blue-500",
};

const ToastItem = ({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) => {
  React.useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), 4000);
    return () => clearTimeout(t);
  }, [item.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 bg-white border border-border rounded-xl shadow-md px-4 py-3",
        "border-l-4 animate-slide-in-left min-w-[280px] max-w-sm",
        variantBorder[item.variant]
      )}
    >
      <span className="mt-0.5 shrink-0">{iconMap[item.variant]}</span>
      <p className="text-sm text-text-primary flex-1">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const add = React.useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    externalAdd = add;
    return () => { externalAdd = null; };
  }, [add]);

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
