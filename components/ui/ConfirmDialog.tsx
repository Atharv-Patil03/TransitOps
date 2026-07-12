"use client";

import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger:  { color: "#fb7185", bg: "rgba(244,63,94,0.12)",  border: "rgba(244,63,94,0.25)",  icon: "🗑️" },
  warning: { color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "⚠️" },
  info:    { color: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)", icon: "ℹ️" },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (accessibility)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const s = VARIANT_STYLES[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "min(440px, calc(100vw - 32px))",
          background: "var(--bg-card)",
          border: `1px solid ${s.border}`,
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "slideUp 0.18s ease",
        }}
      >
        {/* Icon + Title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: s.bg,
              border: `1px solid ${s.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {s.icon}
          </div>
          <div>
            <h2
              id="confirm-title"
              style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}
            >
              {title}
            </h2>
            {description && (
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button
            ref={cancelRef}
            className="btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className="btn-primary"
            onClick={onConfirm}
            disabled={loading}
            style={{ background: s.color, boxShadow: `0 0 20px ${s.bg}` }}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
