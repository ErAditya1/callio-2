"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CallIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
  Mail01Icon,
  Share01Icon,
  UserIcon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export interface AppointmentData {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  notes?: string | null;
  meeting_link?: string | null;
  campaign_id?: number | null;
  ics_uid?: string;
}

interface AppointmentDetailModalProps {
  appointment: AppointmentData | null;
  onClose: () => void;
  onStatusChange?: (id: number, newStatus: string) => Promise<void>;
}

export function AppointmentDetailModal({
  appointment,
  onClose,
  onStatusChange,
}: AppointmentDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!appointment) return null;

  const startDate = new Date(appointment.scheduled_start);
  const endDate = new Date(appointment.scheduled_end);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = `${startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} – ${endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  const handleStatus = async (newStatus: string) => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    try {
      await onStatusChange(appointment.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <HugeiconsIcon icon={Calendar01Icon} className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Appointment Details
              </h2>
              <span
                className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={XIcon} className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Timing card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground pl-6 font-mono font-medium">
              {formattedTime}
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-2.5 rounded-xl border border-border p-4 bg-muted/10">
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.customer_name}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={CallIcon} className="h-4 w-4" />
              <span className="font-mono">{appointment.customer_phone}</span>
            </div>
            {appointment.customer_email && (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />
                <span>{appointment.customer_email}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Consultation Notes / Context
              </label>
              <div className="rounded-lg border border-border bg-background p-3 text-xs text-foreground">
                {appointment.notes}
              </div>
            </div>
          )}

          {/* Location link */}
          {appointment.meeting_link && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Meeting Link
              </label>
              <a
                href={appointment.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline font-mono break-all"
              >
                {appointment.meeting_link}
              </a>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-6 py-3.5 bg-muted/20">
          <div className="flex items-center gap-1.5">
            {appointment.status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-emerald-700 hover:bg-emerald-50"
                onClick={() => handleStatus("completed")}
                disabled={isUpdating}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mr-1 h-3.5 w-3.5" />
                Mark Completed
              </Button>
            )}
            {appointment.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-rose-700 hover:bg-rose-50"
                onClick={() => handleStatus("cancelled")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            )}
          </div>

          <Button size="sm" variant="default" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
