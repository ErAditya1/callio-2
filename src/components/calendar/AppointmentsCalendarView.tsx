"use client";

import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock01Icon,
  Menu01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { AppointmentData } from "./AppointmentDetailModal";

interface AppointmentsCalendarViewProps {
  appointments: AppointmentData[];
  onSelectAppointment: (appt: AppointmentData) => void;
  onOpenAvailability: () => void;
}

export function AppointmentsCalendarView({
  appointments,
  onSelectAppointment,
  onOpenAvailability,
}: AppointmentsCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const monthYearLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; dateString: string; isCurrentMonth: boolean }> = [];

    // Preceding empty/prev-month days
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthTotalDays - i;
      const prevDate = new Date(year, month - 1, dNum);
      days.push({
        dayNumber: dNum,
        dateString: prevDate.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        dayNumber: d,
        dateString: dateStr,
        isCurrentMonth: true,
      });
    }

    // Remaining days to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      days.push({
        dayNumber: n,
        dateString: nextDate.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  // Group appointments by date string YYYY-MM-DD
  const apptsByDate = useMemo(() => {
    const map = new Map<string, AppointmentData[]>();
    for (const a of filteredAppointments) {
      const dStr = a.scheduled_start.split("T")[0];
      const list = map.get(dStr) || [];
      list.push(a);
      map.set(dStr, list);
    }
    return map;
  }, [filteredAppointments]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-input bg-background p-0.5">
            <button
              onClick={prevMonth}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-foreground min-w-[130px] text-center font-mono">
              {monthYearLabel}
            </span>
            <button
              onClick={nextMonth}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-input bg-background p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Calendar Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Status filters & Availability trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Button variant="outline" size="sm" onClick={onOpenAvailability} className="text-xs">
            <HugeiconsIcon icon={Clock01Icon} className="mr-1.5 h-3.5 w-3.5" />
            Working Hours
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "month" ? (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-[11px] font-semibold text-muted-foreground py-2 uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
              {calendarDays.map((cell, idx) => {
                const dayAppts = apptsByDate.get(cell.dateString) || [];
                const isToday =
                  new Date().toISOString().split("T")[0] === cell.dateString;

                return (
                  <div
                    key={idx}
                    className={`min-h-[105px] p-2 transition-colors ${
                      cell.isCurrentMonth
                        ? "bg-card"
                        : "bg-muted/15 text-muted-foreground/60"
                    } ${isToday ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-medium ${
                          isToday
                            ? "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground font-bold"
                            : cell.isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                      {dayAppts.length > 0 && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded-full">
                          {dayAppts.length}
                        </span>
                      )}
                    </div>

                    {/* Appointment pills */}
                    <div className="mt-1.5 space-y-1">
                      {dayAppts.slice(0, 3).map((appt) => {
                        const timeStr = new Date(appt.scheduled_start).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" }
                        );
                        return (
                          <div
                            key={appt.id}
                            onClick={() => onSelectAppointment(appt)}
                            className="group flex items-center justify-between rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.8 text-[11px] text-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors shadow-2xs"
                          >
                            <span className="truncate font-medium">{appt.customer_name}</span>
                            <span className="shrink-0 text-[10px] font-mono opacity-80 pl-1">
                              {timeStr}
                            </span>
                          </div>
                        );
                      })}
                      {dayAppts.length > 3 && (
                        <button
                          onClick={() => onSelectAppointment(dayAppts[0])}
                          className="text-[10px] text-primary hover:underline font-medium pl-1"
                        >
                          +{dayAppts.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="divide-y divide-border">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => {
              const start = new Date(appt.scheduled_start);
              return (
                <div
                  key={appt.id}
                  onClick={() => onSelectAppointment(appt)}
                  className="flex items-center justify-between p-4 hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-mono text-xs font-bold">
                      {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {appt.customer_name}
                        <span className="text-xs font-normal text-muted-foreground font-mono">
                          ({appt.customer_phone})
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                        <span>
                          {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                        {appt.notes && <span>• {appt.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${
                      appt.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : appt.status === "completed"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No appointments found for the selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
