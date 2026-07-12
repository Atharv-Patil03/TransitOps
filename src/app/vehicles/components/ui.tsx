import React from "react";

// Reusable Button Component
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
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
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

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
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

// Reusable Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, ...props }, ref) => {
    return (
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
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Card Components
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
  <div
    className={`px-6 py-5 border-b border-zinc-100 dark:border-zinc-900 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-lg font-semibold text-zinc-950 dark:text-zinc-50 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p
    className={`text-sm text-zinc-500 dark:text-zinc-400 mt-1 ${className}`}
    {...props}
  >
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

// Badge Component for Statuses
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED" | string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "", ...props }) => {
  const styles: Record<string, string> = {
    AVAILABLE:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    ON_TRIP:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
    IN_SHOP:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    RETIRED:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  };

  const label: Record<string, string> = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
  };

  const currentStyle = styles[status] || "bg-zinc-50 text-zinc-700 border-zinc-200";
  const currentLabel = label[status] || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {currentLabel}
    </span>
  );
};

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, label, options, id, ...props }, ref) => {
    return (
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
            className={`w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
              error
                ? "border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-950"
                : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-zinc-100 dark:focus:ring-zinc-900"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
