"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteDriver, suspendDriver, activateDriver } from "../actions";
import { Button } from "./ui";
import { Toast } from "./toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";

interface DriverData {
  id: string;
  name: string;
  licenseNumber: string;
  status: string;
}

interface DriverActionsProps {
  driver: DriverData;
}

export function DriverActions({ driver }: DriverActionsProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isSuspended = driver.status === "SUSPENDED";
  const isAvailable = driver.status === "AVAILABLE";
  const isOnTrip = driver.status === "ON_TRIP";

  // ---- Handlers ----
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDriver(driver.id);
      if (result.success) {
        setToast({ message: `${driver.name} has been deleted.`, type: "success" });
        setDeleteOpen(false);
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to delete driver.", type: "error" });
      }
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async () => {
    setIsLoading(true);
    try {
      const result = await suspendDriver(driver.id);
      if (result.success) {
        setToast({ message: `${driver.name} has been suspended.`, type: "success" });
        setSuspendOpen(false);
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to suspend driver.", type: "error" });
      }
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      const result = await activateDriver(driver.id);
      if (result.success) {
        setToast({ message: `${driver.name} is now active and available.`, type: "success" });
        setActivateOpen(false);
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to activate driver.", type: "error" });
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

      {/* Row Actions */}
      <div className="flex items-center justify-end gap-1.5">
        {/* Edit */}
        <Link href={`/drivers/${driver.id}/edit`}>
          <Button variant="ghost" size="sm" className="p-1.5 h-auto" title="Edit Driver Details">
            <svg className="w-4 h-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Button>
        </Link>

        {/* Activate / Suspend Toggle Button */}
        {isSuspended ? (
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            title="Activate Driver"
            onClick={() => setActivateOpen(true)}
          >
            <svg className="w-4 h-4 text-emerald-600 hover:text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            title={isOnTrip ? "Cannot suspend while on trip" : "Suspend Driver"}
            disabled={isOnTrip}
            onClick={() => setSuspendOpen(true)}
          >
            <svg className={`w-4 h-4 ${isOnTrip ? "text-zinc-300 dark:text-zinc-700" : "text-amber-500 hover:text-amber-700"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </Button>
        )}

        {/* Delete */}
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 h-auto"
          title={isOnTrip ? "Cannot delete while on trip" : "Delete Driver Record"}
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
          <DialogTitle className="text-center">Delete Driver Record</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to permanently delete the driver profile for{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{driver.name}</strong>{" "}
            (License: {driver.licenseNumber})? This will erase all historical driver records.
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
      {/* Suspend Confirmation Dialog                                     */}
      {/* ============================================================== */}
      <Dialog open={suspendOpen} onClose={() => setSuspendOpen(false)}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <DialogTitle className="text-center">Suspend Driver</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to suspend{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{driver.name}</strong>?
            Suspended drivers cannot be assigned to any new delivery trips until reactivated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setSuspendOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSuspend}
            isLoading={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500"
          >
            Confirm Suspension
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ============================================================== */}
      {/* Activate Confirmation Dialog                                    */}
      {/* ============================================================== */}
      <Dialog open={activateOpen} onClose={() => setActivateOpen(false)}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <DialogTitle className="text-center">Activate Driver</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to reactivate{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{driver.name}</strong>?
            This will mark the driver as <strong>Available</strong> for immediate dispatch.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setActivateOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleActivate}
            isLoading={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500"
          >
            Confirm Activation
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
