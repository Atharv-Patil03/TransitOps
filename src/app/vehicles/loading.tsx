import { Card } from "./components/ui";

export default function VehiclesLoading() {
  // Generate 5 mock skeleton rows
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header Panel Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 mb-8">
        <div>
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-zinc-100 dark:bg-zinc-900 rounded-md animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mb-6">
        <div className="h-10 w-full sm:max-w-md bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
        <div className="h-10 w-full sm:w-48 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
      </div>

      {/* Main Table Skeleton */}
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4.5">Registration Number</th>
                <th className="px-6 py-4.5">Model</th>
                <th className="px-6 py-4.5">Vehicle Type</th>
                <th className="px-6 py-4.5 text-right">Max Load Capacity</th>
                <th className="px-6 py-4.5 text-right">Odometer</th>
                <th className="px-6 py-4.5 text-right">Acquisition Cost</th>
                <th className="px-6 py-4.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              {skeletonRows.map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-5">
                    <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
