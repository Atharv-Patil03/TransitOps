"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteVehicle, retireVehicle } from "../actions";
import { Button } from "./ui";
import { Toast } from "./toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";

// ---------------------------------------------------------------------------
// Vehicle data shape (matches what the server passes via serialized JSON)
// ---------------------------------------------------------------------------
interface VehicleData {
  id: string;
  registrationNumber: string;
  model: string;
  status: string;
}

interface VehicleActionsProps {
  vehicle: VehicleData;
}

export function VehicleActions({ vehicle }: VehicleActionsProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [retireOpen, setRetireOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isRetired = vehicle.status === "RETIRED";
  const isOnTrip = vehicle.status === "ON_TRIP";

  // ---- Delete Handler ----
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteVehicle(vehicle.id);
      if (result.success) {
        setToast({ message: `${vehicle.registrationNumber} has been deleted.`, type: "success" });
        setDeleteOpen(false);
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to delete vehicle.", type: "error" });
      }
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Retire Handler ----
  const handleRetire = async () => {
    setIsLoading(true);
    try {
      const result = await retireVehicle(vehicle.id);
      if (result.success) {
        setToast({ message: `${vehicle.registrationNumber} has been retired.`, type: "success" });
        setRetireOpen(false);
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to retire vehicle.", type: "error" });
      }
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1">
        {/* Edit */}
        <Link href={`/vehicles/${vehicle.id}/edit`}>
          <Button variant="ghost" size="sm" className="p-1.5 h-auto" title="Edit Vehicle">
            <svg className="w-4 h-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Button>
        </Link>

        {/* Retire */}
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 h-auto"
          title={isRetired ? "Already Retired" : "Retire Vehicle"}
          disabled={isRetired || isOnTrip}
          onClick={() => setRetireOpen(true)}
        >
          <svg className={`w-4 h-4 ${isRetired ? "text-zinc-300 dark:text-zinc-700" : "text-amber-500 hover:text-amber-700"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </Button>

        {/* Delete */}
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 h-auto"
          title={isOnTrip ? "Cannot delete while on trip" : "Delete Vehicle"}
          disabled={isOnTrip}
          onClick={() => setDeleteOpen(true)}
        >
          <svg className="w-4 h-4 text-rose-500 hover:text-rose-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </Button>
      </div>

      {/* ============================================================== */}
      {/* Delete Confirmation Dialog                                      */}
      {/* ============================================================== */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <DialogTitle className="text-center">Delete Vehicle</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to permanently delete{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {vehicle.registrationNumber}
            </strong>{" "}
            ({vehicle.model})? This action cannot be undone and all associated
            data will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} isLoading={isLoading}>
            Delete Permanently
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ============================================================== */}
      {/* Retire Confirmation Dialog                                      */}
      {/* ============================================================== */}
      <Dialog open={retireOpen} onClose={() => setRetireOpen(false)}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <DialogTitle className="text-center">Retire Vehicle</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to retire{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {vehicle.registrationNumber}
            </strong>{" "}
            ({vehicle.model})? The vehicle will be marked as <strong>RETIRED</strong> and
            will no longer be available for trip assignments. This can be reversed
            by an administrator.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRetireOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRetire}
            isLoading={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500 dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-white"
          >
            Confirm Retire
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
