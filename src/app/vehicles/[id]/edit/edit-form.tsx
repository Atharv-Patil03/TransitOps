"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVehicle } from "../../actions";
import { vehicleSchema, type VehicleInput } from "../../schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Button,
} from "../../components/ui";
import { Toast } from "../../components/toast";

interface EditVehicleFormProps {
  vehicle: {
    id: string;
    registrationNumber: string;
    model: string;
    type: string;
    maxLoadCapacityKg: number;
    odometerKm: number;
    acquisitionCost: number;
  };
}

export function EditVehicleForm({ vehicle }: EditVehicleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Setup form with resolver and database pre-filled default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      maxLoadCapacityKg: vehicle.maxLoadCapacityKg,
      odometerKm: vehicle.odometerKm,
      acquisitionCost: vehicle.acquisitionCost,
    },
  });

  const onSubmit = async (data: VehicleInput) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      const result = await updateVehicle(vehicle.id, data);

      if (result.success) {
        setToast({
          message: "Vehicle specifications updated successfully! Redirecting...",
          type: "success",
        });

        // Delay redirect slightly to show the toast animation
        setTimeout(() => {
          router.push("/vehicles");
          router.refresh();
        }, 1500);
      } else {
        setToast({
          message: result.error || "Failed to update vehicle details.",
          type: "error",
        });
        setIsSubmitting(false);
      }
    } catch {
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Edit Vehicle Details</CardTitle>
          <CardDescription>
            Update specifications, load limits, or mileage logs for vehicle{" "}
            <strong className="text-zinc-900 dark:text-zinc-100 uppercase">
              {vehicle.registrationNumber}
            </strong>
            .
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
        </CardContent>

        <CardFooter>
          <Link href="/vehicles" passHref>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="shadow-sm shadow-zinc-950/10"
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
