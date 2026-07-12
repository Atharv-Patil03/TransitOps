import Link from "next/link";
import { Suspense } from "react";
import { getDrivers } from "./actions";
import { DriverFilters } from "./components/filters";
import { Card, Button, StatusBadge, SafetyScore, LicenseExpiryBadge } from "./components/ui";
import { DriverActions } from "./components/driver-actions";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export const metadata = {
  title: "Driver Profiles | TransitOps",
  description: "Manage driver records, safety scores, license categories, and operational statuses.",
};

export default async function DriversPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  const status = resolvedParams.status;

  const response = await getDrivers(search, status);
  const drivers = response.success ? response.data || [] : [];
  const error = response.success ? null : response.error;

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Driver Profiles
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm">
            Track driver availability, safety performance, and license compliance across your fleet.
          </p>
        </div>
        <Link href="/drivers/new" passHref>
          <Button className="w-full md:w-auto shadow-sm shadow-zinc-950/10">
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766v-.11z" />
            </svg>
            Add Driver
          </Button>
        </Link>
      </div>

      {/* Database Error */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <span className="font-semibold">Database Connection Issue:</span> {error}.
            Please ensure your local PostgreSQL database is running.
          </div>
        </div>
      )}

      {/* Filters */}
      <Suspense fallback={<div className="h-10 mb-6 w-full animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-lg"></div>}>
        <DriverFilters />
      </Suspense>

      {/* Table */}
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">License Number</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">License Expiry</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Safety Score</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              {drivers.length > 0 ? (
                drivers.map((driver: any) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase flex-shrink-0">
                          {driver.name
                            .split(" ")
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {driver.name}
                        </span>
                      </div>
                    </td>

                    {/* License Number */}
                    <td className="px-6 py-4 font-mono font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider text-xs">
                      {driver.licenseNumber}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {driver.licenseCategory}
                    </td>

                    {/* License Expiry + Badge */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                          {formatDate(driver.licenseExpiry)}
                        </span>
                        <LicenseExpiryBadge expiryDate={driver.licenseExpiry} />
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 font-medium">
                      {driver.contactNumber}
                    </td>

                    {/* Safety Score */}
                    <td className="px-6 py-4">
                      <SafetyScore score={driver.safetyScore} />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={driver.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <DriverActions
                        driver={{
                          id: driver.id,
                          name: driver.name,
                          licenseNumber: driver.licenseNumber,
                          status: driver.status,
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        No Drivers Found
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 mb-5">
                        {search || (status && status !== "ALL")
                          ? "There are no drivers matching your active search filters."
                          : "No drivers have been registered yet. Start by adding your first driver."}
                      </p>
                      {(search || (status && status !== "ALL")) && (
                        <Link href="/drivers" passHref>
                          <Button variant="outline" size="sm">
                            Clear Filters
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
