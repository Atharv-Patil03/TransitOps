"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalUsers: number;
  totalRoutes: number;
  totalTrips: number;
  totalBookings: number;
  totalVehicles: number;
  activeTrips: number;
  recentBookings: RecentBooking[];
}

interface RecentBooking {
  id: string;
  seats: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  trip: { route: { name: string; origin: string; destination: string } };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  route: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  trip: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  booking: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  vehicle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  live: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  arrow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  sub,
  icon: IconComp,
  colorClass,
  iconColor,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: React.ComponentType;
  colorClass: string;
  iconColor: string;
}) {
  return (
    <div className={`glass-card ${colorClass}`} style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{sub}</div>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${iconColor}20`,
            border: `1px solid ${iconColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
          }}
        >
          <IconComp />
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    CONFIRMED: "badge-emerald",
    PENDING: "badge-amber",
    CANCELLED: "badge-rose",
    SCHEDULED: "badge-blue",
    IN_PROGRESS: "badge-cyan",
    COMPLETED: "badge-violet",
  };
  return <span className={`badge ${map[status] ?? "badge-blue"}`}>{status}</span>;
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { title: "Total Users", value: stats.totalUsers, sub: "Registered passengers & staff", icon: Icon.users, colorClass: "stat-blue", iconColor: "#3b82f6" },
        { title: "Routes", value: stats.totalRoutes, sub: "Active transit routes", icon: Icon.route, colorClass: "stat-cyan", iconColor: "#06b6d4" },
        { title: "Trips", value: stats.totalTrips, sub: `${stats.activeTrips} currently active`, icon: Icon.trip, colorClass: "stat-violet", iconColor: "#8b5cf6" },
        { title: "Bookings", value: stats.totalBookings, sub: "Total reservations made", icon: Icon.booking, colorClass: "stat-emerald", iconColor: "#10b981" },
        { title: "Vehicles", value: stats.totalVehicles, sub: "Fleet size", icon: Icon.vehicle, colorClass: "stat-amber", iconColor: "#f59e0b" },
      ]
    : [];

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 32 }} className="fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
              Operations Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Real-time overview of your transit network
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                  flexShrink: 0,
                }}
                className="pulse"
              />
              <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>Live</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 110 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 32 }} className="fade-in">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {/* Recent Bookings */}
        <div className="glass-card fade-in" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Recent Bookings</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Latest 5 reservations</p>
            </div>
            <Link href="/bookings">
              <button className="btn-ghost" style={{ fontSize: 12 }}>
                View all <Icon.arrow />
              </button>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 40 }} />
              ))}
            </div>
          ) : !stats?.recentBookings?.length ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No bookings yet. Create your first booking!</p>
              <Link href="/bookings">
                <button className="btn-primary" style={{ marginTop: 16 }}>
                  Create Booking
                </button>
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Route</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{b.user.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.user.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 13 }}>
                        {b.trip.route.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {b.trip.route.origin} → {b.trip.route.destination}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--accent-blue)" }}>{b.seats}</span>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {new Date(b.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }} className="fade-in">
          {[
            { href: "/routes", label: "Add Route", icon: Icon.route, color: "#06b6d4" },
            { href: "/vehicles", label: "Add Vehicle", icon: Icon.vehicle, color: "#f59e0b" },
            { href: "/trips", label: "Schedule Trip", icon: Icon.trip, color: "#8b5cf6" },
            { href: "/bookings", label: "New Booking", icon: Icon.booking, color: "#10b981" },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <div
                className="glass-card"
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${action.color}20`,
                    border: `1px solid ${action.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: action.color,
                    flexShrink: 0,
                  }}
                >
                  <action.icon />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>
                  {action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
    </>
  );
}
