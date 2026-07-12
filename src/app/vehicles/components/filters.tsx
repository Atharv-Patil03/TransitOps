"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Input, Select } from "./ui";

export function VehicleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");

  // Effect to update local state if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setStatus(searchParams.get("status") || "ALL");
  }, [searchParams]);

  // Push updates to URL with transition
  const updateFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }

    if (newStatus && newStatus !== "ALL") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    startTransition(() => {
      router.push(`/vehicles?${params.toString()}`);
    });
  };

  // Debounce search input to avoid query spamming
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilters(search, status);
      }
    }, 350); // 350ms debounce delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, searchParams]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatus(val);
    updateFilters(search, val);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mb-6">
      <div className="relative w-full sm:max-w-md">
        <Input
          placeholder="Search by registration number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isPending ? (
            <svg
              className="animate-spin h-4 w-4 text-zinc-400"
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
          ) : (
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="w-full sm:w-48">
        <Select
          value={status}
          onChange={handleStatusChange}
          options={[
            { value: "ALL", label: "All Statuses" },
            { value: "AVAILABLE", label: "Available" },
            { value: "ON_TRIP", label: "On Trip" },
            { value: "IN_SHOP", label: "In Shop" },
            { value: "RETIRED", label: "Retired" },
          ]}
        />
      </div>
    </div>
  );
}
