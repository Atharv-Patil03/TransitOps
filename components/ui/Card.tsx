"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: number;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = 24,
  accentColor,
  className = "",
  style,
  onClick,
}: CardProps) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: 0,
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        ...(accentColor ? { borderTop: `2px solid ${accentColor}` } : {}),
        ...style,
      }}
      onClick={onClick}
    >
      {/* Header */}
      {(title || headerAction) && (
        <div
          style={{
            padding: `${padding}px ${padding}px ${title ? 16 : padding}px`,
            borderBottom: children ? "1px solid var(--border)" : undefined,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div style={{ flexShrink: 0 }}>{headerAction}</div>}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: title || headerAction ? `${padding}px` : `${padding}px` }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div
          style={{
            padding: `12px ${padding}px`,
            borderTop: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

/** Metric / Stat card variant */
export function StatCard({
  title,
  value,
  sub,
  icon,
  accentColor = "#3b82f6",
  trend,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  trend?: { value: number; label: string };
}) {
  const trendUp = trend && trend.value >= 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: "20px 24px",
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{sub}</div>}
          {trend && (
            <div style={{ fontSize: 12, color: trendUp ? "#34d399" : "#fb7185", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{trendUp ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
              <span style={{ color: "var(--text-muted)" }}>{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
