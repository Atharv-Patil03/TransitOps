"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: number;
  trips: { id: string }[];
}

const VEHICLE_TYPES = ["BUS", "TRAIN", "METRO", "FERRY"];

const typeColors: Record<string, string> = {
  BUS: "badge-emerald", TRAIN: "badge-blue", METRO: "badge-violet", FERRY: "badge-cyan",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ number: "", type: "BUS", capacity: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    fetch("/api/vehicles").then(r => r.json()).then(d => { setVehicles(d); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
    });
    if (res.ok) { setForm({ number: "", type: "BUS", capacity: "" }); setShowForm(false); load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSubmitting(false);
  };

  return (
    <div style={{ display: "flex" }}>
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
          {[{ href: "/", label: "Dashboard" }, { href: "/routes", label: "Routes" }, { href: "/trips", label: "Trips" }, { href: "/vehicles", label: "Vehicles" }, { href: "/bookings", label: "Bookings" }, { href: "/users", label: "Users" }].map(l => (
            <Link key={l.href} href={l.href} className={`nav-item ${l.href === "/vehicles" ? "active" : ""}`}>{l.label}</Link>
          ))}
        </nav>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Fleet Management</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{vehicles.length} vehicles in fleet</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Vehicle"}</button>
        </div>

        {showForm && (
          <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Register Vehicle</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Vehicle Number</label>
                  <input className="input-field" placeholder="e.g. BUS-001" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Capacity (seats)</label>
                  <input className="input-field" type="number" min="1" placeholder="e.g. 50" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
                </div>
              </div>
              {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? "Registering…" : "Register Vehicle"}</button>
            </form>
          </div>
        )}

        {/* Grid of vehicles */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130 }} />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚌</div>
            <p style={{ color: "var(--text-muted)" }}>No vehicles yet. Register your first vehicle above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {vehicles.map(v => (
              <div key={v.id} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span className={`badge ${typeColors[v.type] ?? "badge-blue"}`}>{v.type}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.trips.length} trips</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{v.number}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{v.capacity}</span> seats capacity
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
