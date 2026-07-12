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

type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
type DriverStatus  = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
type TripStatus    = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string; dot?: boolean }> = {
  // Vehicle
  AVAILABLE:       { variant: "emerald", label: "Available",       dot: true },
  ON_TRIP:         { variant: "cyan",    label: "On Trip",         dot: true },
  IN_SHOP:         { variant: "amber",   label: "In Shop",         dot: true },
  RETIRED:         { variant: "slate",   label: "Retired",         dot: false },
  // Driver
  OFF_DUTY:        { variant: "slate",   label: "Off Duty",        dot: false },
  SUSPENDED:       { variant: "rose",    label: "Suspended",       dot: true },
  // Trip
  DRAFT:           { variant: "slate",   label: "Draft",           dot: false },
  DISPATCHED:      { variant: "blue",    label: "Dispatched",      dot: true },
  COMPLETED:       { variant: "emerald", label: "Completed",       dot: false },
  CANCELLED:       { variant: "rose",    label: "Cancelled",       dot: false },
  // Maintenance
  PENDING:         { variant: "amber",   label: "Pending",         dot: true },
  IN_PROGRESS:     { variant: "cyan",    label: "In Progress",     dot: true },
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
