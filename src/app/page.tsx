import Link from "next/link";

export const metadata = {
  title: "Dashboard | TransitOps",
  description: "TransitOps Fleet and Driver Management Dashboard",
};

export default function Home() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-zinc-950 dark:bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
          <svg className="w-8 h-8 text-white dark:text-zinc-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
          TransitOps Management
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Streamlined fleet operations. Manage your vehicles and coordinate drivers from a single, unified interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/vehicles" className="group block">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M8.25 18.75h6m-6 0V14.25m6 4.5h2.25M15 14.25v-3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125V14.25m12-3.375V9.75m0-3.375a1.125 1.125 0 012.25 0v3.375M3.75 6V4.5c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V6M3.75 6h16.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Vehicle Registry</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Manage fleet vehicles, monitor active trips, inspect capacities, and track maintenance.</p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300">
              Open Registry &rarr;
            </span>
          </div>
        </Link>

        <Link href="/drivers" className="group block">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Driver Profiles</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Monitor driver compliance, manage availability status, and review safety scores.</p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
              Manage Drivers &rarr;
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
