"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicle } from "../actions";
import { vehicleSchema, type VehicleInput } from "../schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Select } from "../components/ui";
import { Toast } from "../components/toast";

export default function NewVehiclePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: "",
      model: "",
      type: "Van",
      maxLoadCapacityKg: undefined,
      odometerKm: 0,
      acquisitionCost: undefined,
    } as any,
  });

  const onSubmit = async (data: VehicleInput) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      // Call PostgreSQL Server Action
      const result = await createVehicle(data);

      if (result.success) {
        setToast({ message: "Vehicle registered successfully! Redirecting...", type: "success" });
        reset();
        // Redirect to list page after 1.5 seconds to let the user see the success toast
        setTimeout(() => {
          router.push("/vehicles");
          router.refresh();
        }, 1500);
      } else {
        setToast({
          message: result.error || "Failed to create vehicle. Check form inputs.",
          type: "error",
        });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setToast({ message: "An unexpected error occurred. Please try again.", type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Toast Notification Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumb / Back button */}
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

      {/* Create Card Form */}
      <Card className="shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Register New Vehicle</CardTitle>
            <CardDescription>
              Introduce a new operational vehicle to your logistics fleet. All fields are mandatory.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Registration Number */}
              <Input
                label="Registration Number"
                id="registrationNumber"
                placeholder="e.g. VAN-104-AB"
                error={errors.registrationNumber?.message}
                disabled={isSubmitting}
                {...register("registrationNumber")}
              />

              {/* Vehicle Model */}
              <Input
                label="Model"
                id="model"
                placeholder="e.g. Ford Transit Cargo"
                error={errors.model?.message}
                disabled={isSubmitting}
                {...register("model")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Type Select */}
              <Select
                label="Vehicle Type"
                id="type"
                error={errors.type?.message}
                disabled={isSubmitting}
                options={[
                  { value: "Van", label: "Van / Delivery Van" },
                  { value: "Truck", label: "Truck / Rigid Truck" },
                  { value: "Semi-Trailer", label: "Semi-Trailer / Hauler" },
                  { value: "Flatbed", label: "Flatbed Utility" },
                  { value: "Sedan", label: "Sedan / Service Car" },
                ]}
                {...register("type")}
              />

              {/* Maximum Load Capacity */}
              <Input
                label="Max Load Capacity (kg)"
                id="maxLoadCapacityKg"
                type="number"
                step="any"
                placeholder="e.g. 1500"
                error={errors.maxLoadCapacityKg?.message}
                disabled={isSubmitting}
                {...register("maxLoadCapacityKg", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Odometer */}
              <Input
                label="Current Odometer (km)"
                id="odometerKm"
                type="number"
                step="any"
                placeholder="e.g. 12500"
                error={errors.odometerKm?.message}
                disabled={isSubmitting}
                {...register("odometerKm", { valueAsNumber: true })}
              />

              {/* Acquisition Cost */}
              <Input
                label="Acquisition Cost ($)"
                id="acquisitionCost"
                type="number"
                step="any"
                placeholder="e.g. 42000"
                error={errors.acquisitionCost?.message}
                disabled={isSubmitting}
                {...register("acquisitionCost", { valueAsNumber: true })}
              />
            </div>

            {/* Note on default status */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Upon creation, the vehicle's initial operational status will default to <strong className="text-zinc-700 dark:text-zinc-300">Available</strong>.</span>
            </div>
          </CardContent>

          <CardFooter>
            <Link href="/vehicles" passHref>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting} className="shadow-sm shadow-zinc-950/10">
              Register Vehicle
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
