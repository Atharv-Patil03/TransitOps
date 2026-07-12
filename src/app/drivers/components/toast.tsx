"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles: Record<"success" | "error", string> = {
    success:
      "bg-zinc-900 border-zinc-800 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-900 shadow-zinc-200/50 dark:shadow-none",
    error:
      "bg-rose-600 border-rose-700 text-white shadow-rose-200/50 dark:shadow-none",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4.5 py-3.5 rounded-xl border shadow-lg text-sm font-medium transition-all duration-300 ${styles[type]}`}
    >
      {type === "success" ? (
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity cursor-pointer text-xs uppercase tracking-wider font-semibold opacity-60"
      >
        Dismiss
      </button>
    </div>
  );
};
