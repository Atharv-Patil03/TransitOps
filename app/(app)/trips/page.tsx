"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Trip {
  id: string;
  departureAt: string;
  arrivalAt: string;
  status: string;
  route: { name: string; origin: string; destination: string };
  vehicle: { number: string; type: string };
  bookings: { id: string }[];
}

interface Route { id: string; name: string; origin: string; destination: string; }
interface Vehicle { id: string; number: string; type: string; }

const statusColors: Record<string, string> = {
  SCHEDULED: "badge-blue", IN_PROGRESS: "badge-cyan", COMPLETED: "badge-violet", CANCELLED: "badge-rose",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ routeId: "", vehicleId: "", departureAt: "", arrivalAt: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([fetch("/api/trips").then(r => r.json()), fetch("/api/routes").then(r => r.json()), fetch("/api/vehicles").then(r => r.json())])
      .then(([t, r, v]) => { setTrips(t); setRoutes(r); setVehicles(v); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ routeId: "", vehicleId: "", departureAt: "", arrivalAt: "" }); setShowForm(false); load(); }
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
            <Link key={l.href} href={l.href} className={`nav-item ${l.href === "/trips" ? "active" : ""}`}>{l.label}</Link>
          ))}
        </nav>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Trip Schedule</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{trips.length} trips scheduled</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Schedule Trip"}</button>
        </div>

        {showForm && (
          <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Schedule New Trip</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Route</label>
                  <select className="input-field" value={form.routeId} onChange={e => setForm({ ...form, routeId: e.target.value })} required>
                    <option value="">Select route…</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.origin} → {r.destination})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Vehicle</label>
                  <select className="input-field" value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} required>
                    <option value="">Select vehicle…</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.number} ({v.type})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Departure</label>
                  <input className="input-field" type="datetime-local" value={form.departureAt} onChange={e => setForm({ ...form, departureAt: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Arrival</label>
                  <input className="input-field" type="datetime-local" value={form.arrivalAt} onChange={e => setForm({ ...form, arrivalAt: e.target.value })} required />
                </div>
              </div>
              {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? "Scheduling…" : "Schedule Trip"}</button>
            </form>
          </div>
        )}

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
            </div>
          ) : trips.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🕐</div>
              <p style={{ color: "var(--text-muted)" }}>No trips scheduled. Add routes and vehicles first, then schedule a trip.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Route</th><th>Vehicle</th><th>Departure</th><th>Arrival</th><th>Bookings</th><th>Status</th></tr></thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{t.route.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.route.origin} → {t.route.destination}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{t.vehicle.number}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.vehicle.type}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(t.departureAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ fontSize: 12 }}>{new Date(t.arrivalAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td><span className="badge badge-emerald">{t.bookings.length}</span></td>
                    <td><span className={`badge ${statusColors[t.status] ?? "badge-blue"}`}>{t.status}</span></td>
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
