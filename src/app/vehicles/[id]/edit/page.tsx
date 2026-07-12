import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleById } from "../../actions";
import { EditVehicleForm } from "./edit-form";

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Vehicle | TransitOps",
  description: "Update fleet vehicle specifications, capacity, or odometer.",
};

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params;

  // Fetch the current vehicle data from PostgreSQL
  const result = await getVehicleById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const vehicle = result.data;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/vehicles"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Vehicles
        </Link>
      </div>

      {/* Render Client Form and pass database entity */}
      <EditVehicleForm
        vehicle={{
          id: vehicle.id,
          registrationNumber: vehicle.registrationNumber,
          model: vehicle.model,
          type: vehicle.type,
          maxLoadCapacityKg: vehicle.maxLoadCapacityKg,
          odometerKm: vehicle.odometerKm,
          acquisitionCost: vehicle.acquisitionCost,
        }}
      />
    </div>
  );
}
