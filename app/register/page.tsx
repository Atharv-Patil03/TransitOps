"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "PASSENGER", label: "🧳 Passenger", desc: "Book and manage trips" },
  { value: "DRIVER", label: "🚌 Driver", desc: "Operate assigned vehicles" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PASSENGER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 25% 20%, rgba(59,130,246,0.08) 0%, transparent 50%), #0b0f1a",
        padding: "24px",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }} className="fade-in">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 40px rgba(139,92,246,0.3)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#f1f5f9",
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            Join TransitOps and manage your transit network
          </p>
        </div>

        {/* Card */}
        <div
          className="glass-card fade-in"
          style={{ padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Full Name
              </label>
              <input
                id="reg-name"
                className="input-field"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                id="reg-email"
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, display: "flex" }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: form.password.length >= i * 3 ? (form.password.length >= 12 ? "#10b981" : form.password.length >= 8 ? "#f59e0b" : "#f43f5e") : "rgba(255,255,255,0.08)", transition: "background 0.2s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, color: form.password.length >= 12 ? "#34d399" : form.password.length >= 8 ? "#fbbf24" : "#fb7185" }}>
                    {form.password.length >= 12 ? "Strong" : form.password.length >= 8 ? "Medium" : "Weak"}
                  </div>
                </div>
              )}
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Account Type
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROLES.map(r => (
                  <label
                    key={r.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: `1px solid ${form.role === r.value ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.07)"}`,
                      background: form.role === r.value ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => setForm({ ...form, role: r.value })}
                      style={{ display: "none" }}
                    />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${form.role === r.value ? "#3b82f6" : "#475569"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.15s" }}>
                      {form.role === r.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: form.role === r.value ? "#f1f5f9" : "#94a3b8" }}>{r.label}</div>
                      <div style={{ fontSize: 11.5, color: "#475569", marginTop: 1 }}>{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#fb7185", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="reg-submit"
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", height: 44, fontSize: 14 }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#475569" }} className="fade-in">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
