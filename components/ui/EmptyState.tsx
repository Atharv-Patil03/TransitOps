"use client";

import React from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  href?: string;
  hrefLabel?: string;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  href,
  hrefLabel,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 16,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 13.5,
            color: "var(--text-muted)",
            maxWidth: 320,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <button className="btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {href && hrefLabel && (
        <a href={href} className="btn-primary" style={{ textDecoration: "none" }}>
          {hrefLabel}
        </a>
      )}
    </div>
  );
}
