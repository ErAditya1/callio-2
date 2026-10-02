"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { CalendarStats } from "@/components/calendar/CalendarStats";
import {
  AvailabilitySettingsModal,
  type CalendarSettingsData,
} from "@/components/calendar/AvailabilitySettingsModal";
import {
  AppointmentDetailModal,
  type AppointmentData,
} from "@/components/calendar/AppointmentDetailModal";
import { AppointmentsCalendarView } from "@/components/calendar/AppointmentsCalendarView";

export default function CalendarPage() {
  const { user, getAccessToken, redirectToLogin, loading } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<CalendarSettingsData>({
    timezone: "Asia/Kolkata",
    weekly_schedule: {
      mon: ["10:00-19:00"],
      tue: ["10:00-19:00"],
      wed: ["10:00-19:00"],
      thu: ["10:00-19:00"],
      fri: ["10:00-19:00"],
      sat: ["10:00-17:00"],
      sun: [],
    },
    slot_duration_mins: 30,
    buffer_mins: 10,
    max_advance_days: 14,
    meeting_title_template: "Consultation with {lead_name}",
    location_type: "phone_call",
  });

  const [appointments, setAppointments] = useState<AppointmentData[]>([
    {
      id: 1,
      customer_name: "Rahul Verma",
      customer_phone: "+91 98765 43210",
      customer_email: "rahul@example.com",
      scheduled_start: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      scheduled_end: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
      status: "confirmed",
      notes: "Interested in AI Voice Agent for real estate inquiries.",
    },
    {
      id: 2,
      customer_name: "Ananya Desai",
      customer_phone: "+91 99887 76655",
      customer_email: "ananya@fintech.io",
      scheduled_start: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
      scheduled_end: new Date(Date.now() + 26.5 * 3600 * 1000).toISOString(),
      status: "confirmed",
      notes: "Demo requested for loan EMI reminder agent.",
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      redirectToLogin();
    }
  }, [loading, user, redirectToLogin]);

  useEffect(() => {
    if (loading || !user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getAccessToken();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Fetch settings & appointments from backend
        const [settingsRes, apptsRes] = await Promise.all([
          fetch("/api/v1/calendar/settings", { headers })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/v1/calendar/appointments", { headers })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        if (settingsRes) {
          setSettings(settingsRes);
        }
        if (apptsRes?.appointments && Array.isArray(apptsRes.appointments) && apptsRes.appointments.length > 0) {
          setAppointments(apptsRes.appointments);
        }
      } catch (err) {
        console.warn("Using local calendar state:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loading, user, getAccessToken]);

  const handleSaveSettings = async (updates: Partial<CalendarSettingsData>) => {
    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/calendar/settings", {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
      } else {
        setSettings((prev) => ({ ...prev, ...updates }));
      }
    } catch {
      setSettings((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`/api/v1/calendar/appointments/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Failed to update status on server:", err);
    } finally {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  // Derived stats
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000);

  const todayCount = appointments.filter(
    (a) => a.scheduled_start.split("T")[0] === todayStr && a.status !== "cancelled"
  ).length;

  const upcomingCount = appointments.filter((a) => {
    const d = new Date(a.scheduled_start);
    return d >= now && d <= nextWeek && a.status === "confirmed";
  }).length;

  const completedCount = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground">
            <HugeiconsIcon icon={Calendar01Icon} className="h-6 w-6 text-primary" />
            Calendar &amp; Schedule Bookings
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Native AI appointment scheduling engine. Zero-OAuth Google Calendar sync via automated .ics invites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAvailabilityOpen(true)}
            className="text-xs font-semibold"
          >
            <HugeiconsIcon icon={Settings01Icon} className="mr-1.5 h-3.5 w-3.5" />
            Working Hours
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <CalendarStats
        totalCount={appointments.length}
        todayCount={todayCount}
        upcomingCount={upcomingCount}
        completedCount={completedCount}
      />

      {/* Main Interactive Grid */}
      <AppointmentsCalendarView
        appointments={appointments}
        onSelectAppointment={(appt) => setSelectedAppointment(appt)}
        onOpenAvailability={() => setIsAvailabilityOpen(true)}
      />

      {/* Availability Drawer Modal */}
      <AvailabilitySettingsModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
        initialSettings={settings}
        onSave={handleSaveSettings}
      />

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
