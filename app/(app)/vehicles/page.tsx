"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";

interface Vehicle {
  id: string;
  number: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  status: string;
  odometer: number;
  acquisitionCost: number;
  trips: { id: string }[];
}

const VEHICLE_TYPES = ["BUS", "MINIBUS", "TRUCK", "VAN", "CAR", "TRAIN", "METRO", "FERRY"];

const typeColors: Record<string, string> = {
  BUS: "badge-emerald", 
  MINIBUS: "badge-cyan",
  TRUCK: "badge-violet", 
  VAN: "badge-orange",
  CAR: "badge-blue",
  TRAIN: "badge-blue", 
  METRO: "badge-violet", 
  FERRY: "badge-cyan",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    number: "",
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    type: "BUS",
    capacity: "",
    odometer: "0",
    acquisitionCost: "0",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setVehicles(d);
        } else {
          setVehicles([]);
          if (d.error) setError(d.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setVehicles([]);
        setLoading(false);
        setError("Failed to connect to server");
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: Number(form.year),
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        acquisitionCost: Number(form.acquisitionCost),
      }),
    });
    if (res.ok) {
      setForm({
        number: "",
        licensePlate: "",
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        type: "BUS",
        capacity: "",
        odometer: "0",
        acquisitionCost: "0",
      });
      setShowForm(false);
      load();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to create vehicle");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div className="fade-in">
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Fleet Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            {Array.isArray(vehicles) ? vehicles.length : 0} vehicles in fleet
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card fade-in" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Register Vehicle
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Registration Number
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. VAN-05"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  License Plate
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. MH-12-AB-1234"
                  value={form.licensePlate}
                  onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Type
                </label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Make
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Tata"
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Model Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Winger"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Model Year
                </label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="e.g. 2023"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Max Load Capacity (kg)
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  placeholder="e.g. 500"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Initial Odometer (km)
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  placeholder="e.g. 15000"
                  value={form.odometer}
                  onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Acquisition Cost (₹)
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  placeholder="e.g. 850000"
                  value={form.acquisitionCost}
                  onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
                  required
                />
              </div>
            </div>
            {error && <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Registering…" : "Register Vehicle"}
            </button>
          </form>
        </div>
      )}

      {/* Grid of vehicles */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 12 }} />
          ))}
        </div>
      ) : !Array.isArray(vehicles) || vehicles.length === 0 ? (
        <div className="glass-card fade-in" style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚌</div>
          <p style={{ color: "var(--text-muted)" }}>No vehicles registered yet. Register your first vehicle above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }} className="fade-in">
          {vehicles.map((v) => (
            <div key={v.id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className={`badge ${typeColors[v.type] ?? "badge-blue"}`}>{v.type}</span>
                <StatusBadge status={v.status} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                {v.number}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                {v.make} {v.model} ({v.year})
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                    Load Cap
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>{v.capacity} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                    Odometer
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>{v.odometer} km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
