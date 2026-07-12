"use client";

import React from "react";

type BadgeVariant =
  | "blue" | "cyan" | "violet" | "emerald" | "amber" | "rose"
  | "slate" | "orange" | "pink" | "default";

const VARIANT_MAP: Record<BadgeVariant, string> = {
  blue:    "badge-blue",
  cyan:    "badge-cyan",
  violet:  "badge-violet",
  emerald: "badge-emerald",
  amber:   "badge-amber",
  rose:    "badge-rose",
  slate:   "badge-slate",
  orange:  "badge-orange",
  pink:    "badge-pink",
  default: "badge-blue",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  dot = false,
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`badge ${VARIANT_MAP[variant]} ${className}`}
      style={{ fontSize: size === "sm" ? 10 : 11, padding: size === "sm" ? "1px 7px" : undefined }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "currentColor",
            display: "inline-block",
            marginRight: 5,
          }}
        />
      )}
      {children}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "OUT_OF_SERVICE" | "RETIRED";
type DriverStatus  = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
type TripStatus    = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DELAYED";
type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string; dot?: boolean }> = {
  // Vehicle
  ACTIVE:          { variant: "emerald", label: "Active",          dot: true },
  MAINTENANCE:     { variant: "amber",   label: "Maintenance",     dot: true },
  OUT_OF_SERVICE:  { variant: "rose",    label: "Out of Service",  dot: true },
  RETIRED:         { variant: "slate",   label: "Retired",         dot: false },
  // Driver
  AVAILABLE:       { variant: "emerald", label: "Available",       dot: true },
  ON_TRIP:         { variant: "cyan",    label: "On Trip",         dot: true },
  OFF_DUTY:        { variant: "slate",   label: "Off Duty",        dot: false },
  SUSPENDED:       { variant: "rose",    label: "Suspended",       dot: true },
  // Trip
  SCHEDULED:       { variant: "blue",    label: "Scheduled",       dot: false },
  IN_PROGRESS:     { variant: "cyan",    label: "In Progress",     dot: true },
  COMPLETED:       { variant: "emerald", label: "Completed",       dot: false },
  CANCELLED:       { variant: "rose",    label: "Cancelled",       dot: false },
  DELAYED:         { variant: "amber",   label: "Delayed",         dot: true },
  // Maintenance
  PENDING:         { variant: "amber",   label: "Pending",         dot: true },
  // Bookings
  CONFIRMED:       { variant: "emerald", label: "Confirmed",       dot: false },
};

interface StatusBadgeProps {
  status: VehicleStatus | DriverStatus | TripStatus | MaintenanceStatus | string;
  showDot?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({ status, showDot, size = "md" }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { variant: "default" as BadgeVariant, label: status };
  return (
    <Badge
      variant={config.variant}
      dot={showDot ?? config.dot}
      size={size}
    >
      {config.label}
    </Badge>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
const ROLE_BADGE_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  ADMIN:             { variant: "rose",    label: "Admin" },
  FLEET_MANAGER:     { variant: "blue",    label: "Fleet Manager" },
  DRIVER:            { variant: "amber",   label: "Driver" },
  SAFETY_OFFICER:    { variant: "emerald", label: "Safety Officer" },
  FINANCIAL_ANALYST: { variant: "violet",  label: "Financial Analyst" },
};

export function RoleBadge({ role, size = "md" }: { role: string; size?: "sm" | "md" }) {
  const config = ROLE_BADGE_MAP[role] ?? { variant: "default" as BadgeVariant, label: role };
  return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}
