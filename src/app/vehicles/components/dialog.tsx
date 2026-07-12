"use client";

import React, { useEffect, useRef } from "react";

// ==========================================================================
// Dialog (Modal Overlay)
// ==========================================================================
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 pt-6 pb-2 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-lg font-semibold text-zinc-950 dark:text-zinc-50 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p
    className={`text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`px-6 pb-6 pt-2 flex items-center justify-end gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);
