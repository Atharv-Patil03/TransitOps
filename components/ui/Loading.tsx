"use client";

import React from "react";

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color = "var(--accent-blue)" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ─── Full-page loading overlay ─────────────────────────────────────────────────
export function PageLoading({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 14,
      }}
    >
      <Spinner size={36} />
      <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>{message}</p>
    </div>
  );
}

// ─── Skeleton line ─────────────────────────────────────────────────────────────
export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 6,
  style,
}: {
  width?: string | number;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="glass-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height={18} width="60%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={12} width={`${100 - i * 10}%`} />
      ))}
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={48} borderRadius={8} />
      ))}
    </div>
  );
}
