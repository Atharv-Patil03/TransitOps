"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDriver } from "../../actions";
import { driverSchema, type DriverInput } from "../../schema";
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

interface EditDriverFormProps {
  driver: {
    id: string;
    name: string;
    licenseNumber: string;
    licenseCategory: string;
    licenseExpiry: string;
    contactNumber: string;
  };
}

export function EditDriverForm({ driver }: EditDriverFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiry: driver.licenseExpiry,
      contactNumber: driver.contactNumber,
    },
  });

  const onSubmit = async (data: DriverInput) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      const result = await updateDriver(driver.id, data);

      if (result.success) {
        setToast({
          message: "Driver profile updated successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/drivers");
          router.refresh();
        }, 1500);
      } else {
        setToast({
          message: result.error || "Failed to update driver details.",
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
          <CardTitle>Edit Driver Details</CardTitle>
          <CardDescription>
            Modify name, license details, contact, or expiry metrics for{" "}
            <strong className="text-zinc-900 dark:text-zinc-100 uppercase">
              {driver.name}
            </strong>
            .
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Row 1: Name + License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              id="name"
              placeholder="e.g. Alex Johnson"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />
            <Input
              label="License Number"
              id="licenseNumber"
              placeholder="e.g. DL-2024-78901"
              error={errors.licenseNumber?.message}
              disabled={isSubmitting}
              {...register("licenseNumber")}
            />
          </div>

          {/* Row 2: Category + Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="License Category"
              id="licenseCategory"
              error={errors.licenseCategory?.message}
              disabled={isSubmitting}
              options={[
                { value: "A", label: "A — Motorcycles" },
                { value: "B", label: "B — Cars / Light Vehicles" },
                { value: "C", label: "C — Trucks / Heavy Goods" },
                { value: "D", label: "D — Buses / Passenger" },
                { value: "E", label: "E — Trailers / Articulated" },
              ]}
              {...register("licenseCategory")}
            />
            <Input
              label="License Expiry Date"
              id="licenseExpiry"
              type="date"
              error={errors.licenseExpiry?.message}
              disabled={isSubmitting}
              {...register("licenseExpiry")}
            />
          </div>

          {/* Row 3: Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Number"
              id="contactNumber"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              error={errors.contactNumber?.message}
              disabled={isSubmitting}
              {...register("contactNumber")}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Link href="/drivers" passHref>
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
