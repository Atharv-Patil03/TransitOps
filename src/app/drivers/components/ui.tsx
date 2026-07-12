import React from "react";

// ==========================================================================
// Button
// ==========================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 focus:ring-zinc-950 dark:focus:ring-zinc-300",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 focus:ring-zinc-200 dark:focus:ring-zinc-700",
    outline:
      "border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 focus:ring-zinc-500",
    ghost:
      "bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900",
    destructive:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// ==========================================================================
// Input
// ==========================================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-950"
            : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-zinc-100 dark:focus:ring-zinc-900"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      )}
    </div>
  )
);
Input.displayName = "Input";

// ==========================================================================
// Select
// ==========================================================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, label, options, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
            error
              ? "border-rose-500 focus:ring-rose-200"
              : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 focus:ring-zinc-100 dark:focus:ring-zinc-900"
          } ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      )}
    </div>
  )
);
Select.displayName = "Select";

// ==========================================================================
// Card set
// ==========================================================================
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 py-5 border-b border-zinc-100 dark:border-zinc-900 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3 className={`text-lg font-semibold text-zinc-950 dark:text-zinc-50 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`text-sm text-zinc-500 dark:text-zinc-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-end gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// ==========================================================================
// Status Badge (Driver)
// ==========================================================================
interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "", ...props }) => {
  const styles: Record<string, string> = {
    AVAILABLE:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    ON_TRIP:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
    OFF_DUTY:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    SUSPENDED:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  };

  const labels: Record<string, string> = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    OFF_DUTY: "Off Duty",
    SUSPENDED: "Suspended",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || "bg-zinc-50 text-zinc-700 border-zinc-200"} ${className}`}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {labels[status] || status}
    </span>
  );
};

// ==========================================================================
// Safety Score Meter
// ==========================================================================
interface SafetyScoreProps {
  score: number;
}

export const SafetyScore: React.FC<SafetyScoreProps> = ({ score }) => {
  let color: string;
  let bgBar: string;
  let bgTrack: string;

  if (score >= 90) {
    color = "text-emerald-600 dark:text-emerald-400";
    bgBar = "bg-emerald-500";
    bgTrack = "bg-emerald-100 dark:bg-emerald-950/40";
  } else if (score >= 70) {
    color = "text-amber-600 dark:text-amber-400";
    bgBar = "bg-amber-500";
    bgTrack = "bg-amber-100 dark:bg-amber-950/40";
  } else {
    color = "text-rose-600 dark:text-rose-400";
    bgBar = "bg-rose-500";
    bgTrack = "bg-rose-100 dark:bg-rose-950/40";
  }

  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className={`w-16 h-1.5 rounded-full ${bgTrack} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${bgBar} transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${color}`}>{score.toFixed(0)}</span>
    </div>
  );
};

// ==========================================================================
// License Expiry Badge
// ==========================================================================
interface LicenseExpiryBadgeProps {
  expiryDate: Date | string;
}

export const LicenseExpiryBadge: React.FC<LicenseExpiryBadgeProps> = ({ expiryDate }) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Already expired
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        Expired
      </span>
    );
  }

  if (diffDays <= 30) {
    // Expires within 30 days
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Expires Soon
      </span>
    );
  }

  // Valid
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Valid
    </span>
  );
};
