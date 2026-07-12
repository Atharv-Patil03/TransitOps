"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  seats: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  trip: { departureAt: string; route: { name: string; origin: string; destination: string } };
}

interface User { id: string; name: string; email: string; }
interface Trip { id: string; departureAt: string; route: { name: string }; }

const statusColors: Record<string, string> = {
  CONFIRMED: "badge-emerald", PENDING: "badge-amber", CANCELLED: "badge-rose",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: "", tripId: "", seats: "1" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([fetch("/api/bookings").then(r => r.json()), fetch("/api/users").then(r => r.json()), fetch("/api/trips").then(r => r.json())])
      .then(([b, u, t]) => { setBookings(b); setUsers(u); setTrips(t); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, seats: Number(form.seats) }) });
    if (res.ok) { setForm({ userId: "", tripId: "", seats: "1" }); setShowForm(false); load(); }
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
            <Link key={l.href} href={l.href} className={`nav-item ${l.href === "/bookings" ? "active" : ""}`}>{l.label}</Link>
          ))}
        </nav>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Bookings</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{bookings.length} total reservations</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ New Booking"}</button>
        </div>

        {showForm && (
          <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Create Booking</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Passenger</label>
                  <select className="input-field" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
                    <option value="">Select user…</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Trip</label>
                  <select className="input-field" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })} required>
                    <option value="">Select trip…</option>
                    {trips.map(t => <option key={t.id} value={t.id}>{t.route.name} — {new Date(t.departureAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Seats</label>
                  <input className="input-field" type="number" min="1" max="20" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} required />
                </div>
              </div>
              {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? "Booking…" : "Confirm Booking"}</button>
            </form>
          </div>
        )}

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
              <p style={{ color: "var(--text-muted)" }}>No bookings yet. Add users and trips first.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Passenger</th><th>Route</th><th>Departure</th><th>Seats</th><th>Status</th><th>Booked</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{b.user.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.user.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 13 }}>{b.trip.route.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.trip.route.origin} → {b.trip.route.destination}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(b.trip.departureAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td><span style={{ fontWeight: 700, color: "var(--accent-blue)" }}>{b.seats}</span></td>
                    <td><span className={`badge ${statusColors[b.status] ?? "badge-blue"}`}>{b.status}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
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
