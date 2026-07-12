import Link from "next/link";
import { Suspense } from "react";
import { getVehicles } from "./actions";
import { VehicleFilters } from "./components/filters";
import { Card, Badge, Button } from "./components/ui";
import { VehicleActions } from "./components/vehicle-actions";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export const metadata = {
  title: "Vehicle Registry | TransitOps",
  description: "Manage fleet vehicles, capacity, odometer readings, and status logs.",
};

export default async function VehiclesPage({ searchParams }: PageProps) {
  // Await search parameters in Next.js 15+
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  const status = resolvedParams.status;

  // Fetch data directly from PostgreSQL using our Server Action
  const response = await getVehicles(search, status);
  const vehicles = response.success ? response.data || [] : [];
  const error = response.success ? null : response.error;

  // Number Formatters
  const formatCost = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const formatNumber = (val: number) => new Intl.NumberFormat("en-US").format(val);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vehicles Registry
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm">
            Monitor and manage your fleet assets, payload capacities, and active maintenance statuses.
          </p>
        </div>
        <Link href="/vehicles/new" passHref>
          <Button className="w-full md:w-auto shadow-sm shadow-zinc-950/10">
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Database Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <span className="font-semibold">Database Connection Issue:</span> {error}. 
            Please ensure your local PostgreSQL database is running and migrations are successfully applied.
          </div>
        </div>
      )}

      {/* Filters (Client Component) */}
      <Suspense fallback={<div className="h-10 mb-6 w-full animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-lg"></div>}>
        <VehicleFilters />
      </Suspense>

      {/* Main Table Content */}
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <tr>
                <th className="px-6 py-4.5">Registration Number</th>
                <th className="px-6 py-4.5">Model</th>
                <th className="px-6 py-4.5">Vehicle Type</th>
                <th className="px-6 py-4.5 text-right">Max Load Capacity</th>
                <th className="px-6 py-4.5 text-right">Odometer</th>
                <th className="px-6 py-4.5 text-right">Acquisition Cost</th>
                <th className="px-6 py-4.5 text-center">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle: any) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-300">
                      {vehicle.model}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {vehicle.type}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-300">
                      {formatNumber(vehicle.maxLoadCapacityKg)} kg
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-600 dark:text-zinc-400">
                      {formatNumber(vehicle.odometerKm)} km
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-950 dark:text-zinc-50">
                      {formatCost(vehicle.acquisitionCost)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <VehicleActions
                        vehicle={{
                          id: vehicle.id,
                          registrationNumber: vehicle.registrationNumber,
                          model: vehicle.model,
                          status: vehicle.status,
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State Row */
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800 mb-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M8.25 18.75h6m-6 0V14.25m6 4.5h2.25M15 14.25v-3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125V14.25m12-3.375V9.75m0-3.375a1.125 1.125 0 012.25 0v3.375M3.75 6V4.5c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V6M3.75 6h16.5"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        No Vehicles Found
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 mb-5">
                        {search || status !== "ALL"
                          ? "There are no vehicles matching your active search filters."
                          : "Your registry is currently empty. Get started by adding your first fleet vehicle."}
                      </p>
                      {(search || status !== "ALL") && (
                        <Link href="/vehicles" passHref>
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
