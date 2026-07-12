"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  stops: { id: string; name: string; order: number }[];
  trips: { id: string }[];
  createdAt: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", origin: "", destination: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    fetch("/api/routes")
      .then((r) => r.json())
      .then((d) => { setRoutes(d); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", origin: "", destination: "" });
      setShowForm(false);
      load();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar placeholder — reuse same sidebar structure */}
      <aside style={{ width: 220, minHeight: "100vh", background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", position: "fixed", top: 0, left: 0, zIndex: 50, display: "flex", flexDirection: "column", padding: "0 12px" }}>
        <div style={{ padding: "24px 4px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>TransitOps</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Operations Hub</div>
            </div>
          </div>
        </div>
        <nav style={{ marginTop: 16, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { href: "/", label: "Dashboard" }, { href: "/routes", label: "Routes" },
            { href: "/trips", label: "Trips" }, { href: "/vehicles", label: "Vehicles" },
            { href: "/bookings", label: "Bookings" }, { href: "/users", label: "Users" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className={`nav-item ${l.href === "/routes" ? "active" : ""}`}>{l.label}</Link>
          ))}
        </nav>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Routes</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{routes.length} routes configured</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Route"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>New Route</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Route Name</label>
                  <input className="input-field" placeholder="e.g. Blue Line Express" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Origin</label>
                  <input className="input-field" placeholder="e.g. Central Station" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Destination</label>
                  <input className="input-field" placeholder="e.g. Airport Terminal" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
                </div>
              </div>
              {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create Route"}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 48 }} />)}
            </div>
          ) : routes.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
              <p style={{ color: "var(--text-muted)" }}>No routes yet. Add your first route above.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Origin</th><th>Destination</th><th>Stops</th><th>Trips</th><th>Created</th></tr></thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</td>
                    <td>{r.origin}</td>
                    <td>{r.destination}</td>
                    <td><span className="badge badge-blue">{r.stops.length} stops</span></td>
                    <td><span className="badge badge-violet">{r.trips.length} trips</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
