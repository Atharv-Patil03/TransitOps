"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDriver } from "../actions";
import { driverSchema, type DriverInput } from "../schema";
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
} from "../components/ui";
import { Toast } from "../components/toast";

export default function NewDriverPage() {
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
    reset,
  } = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      licenseCategory: "B",
      licenseExpiry: "",
      contactNumber: "",
    },
  });

  const onSubmit = async (data: DriverInput) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      const result = await createDriver(data);

      if (result.success) {
        setToast({
          message: "Driver registered successfully! Redirecting...",
          type: "success",
        });
        reset();
        setTimeout(() => {
          router.push("/drivers");
          router.refresh();
        }, 1500);
      } else {
        setToast({
          message: result.error || "Failed to create driver. Check form inputs.",
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
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/drivers"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors gap-1.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Drivers
        </Link>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Register New Driver</CardTitle>
            <CardDescription>
              Add a new driver to your fleet operations. All fields are required.
              The driver's initial safety score will be set to 100 and status to
              Available.
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

              {/* Info panel filling the second column */}
              <div className="flex items-end">
                <div className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Safety score defaults to{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      100
                    </strong>
                    . Status defaults to{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      Available
                    </strong>
                    .
                  </span>
                </div>
              </div>
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
              Register Driver
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
