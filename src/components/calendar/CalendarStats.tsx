"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

interface CalendarStatsProps {
  totalCount: number;
  todayCount: number;
  upcomingCount: number;
  completedCount: number;
}

export function CalendarStats({
  totalCount,
  todayCount,
  upcomingCount,
  completedCount,
}: CalendarStatsProps) {
  const stats = [
    {
      label: "Total Bookings",
      value: totalCount,
      sub: "All time scheduled",
      icon: Calendar01Icon,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Today's Appointments",
      value: todayCount,
      sub: "Scheduled for today",
      icon: Clock01Icon,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Upcoming This Week",
      value: upcomingCount,
      sub: "Next 7 days",
      icon: UserMultipleIcon,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      label: "Completed",
      value: completedCount,
      sub: "Successful sessions",
      icon: CheckmarkCircle02Icon,
      color: "text-neutral-700 bg-neutral-100 border-neutral-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
            <div className={`grid h-8 w-8 place-items-center rounded-lg border ${s.color}`}>
              <HugeiconsIcon icon={s.icon} className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-mono">
            {s.value}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
