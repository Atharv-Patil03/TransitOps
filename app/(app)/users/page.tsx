"use client";

import { useEffect, useState } from "react";
import { RoleBadge } from "@/components/ui/Badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bookings: { id: string }[];
  createdAt: string;
}

interface Me { userId: string; role: string; name: string; }

const ROLES = ["DRIVER", "FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST", "ADMIN"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "DRIVER" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Role change state
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [roleError, setRoleError] = useState("");

  const load = () => {
    Promise.all([
      fetch("/api/users").then(r => r.json()),
      fetch("/api/auth/me").then(r => r.ok ? r.json() : null),
    ])
      .then(([u, m]) => { setUsers(u); setMe(m); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", email: "", role: "DRIVER" });
      setShowForm(false);
      load();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed");
    }
    setSubmitting(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    setRoleError("");
    const res = await fetch(`/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      load();
    } else {
      const d = await res.json();
      setRoleError(d.error ?? "Failed to change role");
    }
    setChangingRole(null);
  };

  const isManagerOrAdmin = me?.role === "ADMIN" || me?.role === "FLEET_MANAGER";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div className="fade-in">
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Users</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{users.length} registered users</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isManagerOrAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 8 }}>
              <span style={{ fontSize: 11, color: "#fb7185", fontWeight: 600 }}>⚡ MANAGER VIEW</span>
            </div>
          )}
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add User"}</button>
        </div>
      </div>

      {/* Role error banner */}
      {roleError && (
        <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#fb7185", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {roleError}
          <button onClick={() => setRoleError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#fb7185", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      )}

      {showForm && (
        <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Register User</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 200px", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Full Name</label>
                <input className="input-field" placeholder="e.g. Gaurish Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Email</label>
                <input className="input-field" type="email" placeholder="e.g. user@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Role</label>
                <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create User"}</button>
          </form>
        </div>
      )}

      <div className="glass-card fade-in" style={{ padding: 0, overflow: "hidden" }}>
        {/* Admin notice */}
        {isManagerOrAdmin && (
          <div style={{ padding: "12px 20px", background: "rgba(59,130,246,0.06)", borderBottom: "1px solid var(--border)", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            As a manager/admin, you can change user roles using the actions below.
          </div>
        )}

        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <p style={{ color: "var(--text-muted)" }}>No users yet. Register your first user above.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                {isManagerOrAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSelf = u.id === me?.userId;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.role === "ADMIN" ? "linear-gradient(135deg, #f43f5e, #8b5cf6)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{u.name}</span>
                          {isSelf && <span style={{ marginLeft: 6, fontSize: 10, color: "#60a5fa", fontWeight: 600 }}>YOU</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    {isManagerOrAdmin && (
                      <td>
                        {isSelf ? (
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Cannot change own role</span>
                        ) : (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {/* Role Dropdown Selector */}
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={changingRole === u.id || (me?.role !== "ADMIN" && u.role === "ADMIN")}
                              className="input-field"
                              style={{ padding: "4px 8px", fontSize: 11, width: "auto", height: "auto" }}
                            >
                              {ROLES.map(r => (
                                <option key={r} value={r} disabled={me?.role !== "ADMIN" && r === "ADMIN"}>{r}</option>
                              ))}
                            </select>
                            {changingRole === u.id && <span style={{ fontSize: 11, color: "var(--accent-blue)", display: "flex", alignItems: "center" }}>Updating…</span>}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
