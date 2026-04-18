import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ModalAction {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: ModalAction[];
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const sizeMap = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  full: "max-w-full m-0 rounded-none h-full",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = "md",
  className,
}: ModalProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed inset-0 z-50 m-auto w-full bg-white rounded-xl shadow-lg",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "p-0 border-0 outline-none",
        "sm:max-h-[90vh] overflow-auto",
        /* full-screen on mobile */
        "max-sm:m-0 max-sm:max-w-full max-sm:rounded-none max-sm:h-full max-sm:max-h-full",
        sizeMap[size],
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className={cn(
            "shrink-0 h-9 w-9 flex items-center justify-center rounded-lg",
            "text-text-secondary hover:text-text-primary hover:bg-slate-100",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      {children && (
        <div className="p-6">{children}</div>
      )}

      {/* Footer */}
      {actions && actions.length > 0 && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? "secondary"}
              size="md"
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </dialog>
  );
};

Modal.displayName = "Modal";

export { Modal };
