"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Generate breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumb = segments.length > 0
    ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : "Dashboard";

  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Pages</span>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{breadcrumb}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {/* Notifications */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#fb7185",
            }}
          />
        </button>
      </div>
    </header>
  );
}
