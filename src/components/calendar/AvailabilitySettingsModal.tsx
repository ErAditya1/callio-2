"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  GlobeIcon,
  Settings01Icon,
  Tick01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export interface CalendarSettingsData {
  organization_id?: number;
  timezone: string;
  weekly_schedule: Record<string, string[]>;
  slot_duration_mins: number;
  buffer_mins: number;
  max_advance_days: number;
  meeting_title_template: string;
  location_type: string;
  static_meeting_url?: string | null;
}

interface AvailabilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: CalendarSettingsData;
  onSave: (settings: Partial<CalendarSettingsData>) => Promise<void>;
}

const DAYS_OF_WEEK = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export function AvailabilitySettingsModal({
  isOpen,
  onClose,
  initialSettings,
  onSave,
}: AvailabilitySettingsModalProps) {
  const [schedule, setSchedule] = useState<Record<string, string[]>>(
    initialSettings.weekly_schedule || {
      mon: ["10:00-19:00"],
      tue: ["10:00-19:00"],
      wed: ["10:00-19:00"],
      thu: ["10:00-19:00"],
      fri: ["10:00-19:00"],
      sat: ["10:00-17:00"],
      sun: [],
    }
  );
  const [timezone, setTimezone] = useState(initialSettings.timezone || "Asia/Kolkata");
  const [slotDuration, setSlotDuration] = useState(initialSettings.slot_duration_mins || 30);
  const [bufferMins, setBufferMins] = useState(initialSettings.buffer_mins || 10);
  const [locationType, setLocationType] = useState(initialSettings.location_type || "phone_call");
  const [meetingUrl, setMeetingUrl] = useState(initialSettings.static_meeting_url || "");
  const [titleTemplate, setTitleTemplate] = useState(
    initialSettings.meeting_title_template || "Consultation with {lead_name}"
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (dayKey: string) => {
    setSchedule((prev) => {
      const current = prev[dayKey] || [];
      if (current.length > 0) {
        return { ...prev, [dayKey]: [] };
      } else {
        return { ...prev, [dayKey]: ["10:00-19:00"] };
      }
    });
  };

  const updateHours = (dayKey: string, start: string, end: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: [`${start}-${end}`],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        timezone,
        weekly_schedule: schedule,
        slot_duration_mins: slotDuration,
        buffer_mins: bufferMins,
        location_type: locationType,
        static_meeting_url: meetingUrl || null,
        meeting_title_template: titleTemplate,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <HugeiconsIcon icon={Settings01Icon} className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Availability &amp; Calendar Rules
              </h2>
              <p className="text-xs text-muted-foreground">
                Set when AI Voice Agents &amp; customers can book slots. Zero Google OAuth setup required.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={XIcon} className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Timezone & General */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Timezone
              </label>
              <div className="relative">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="America/New_York">America/New_York (EST -5:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST -8:00)</option>
                  <option value="Europe/London">Europe/London (GMT +0:00)</option>
                  <option value="UTC">UTC (+0:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Meeting Type / Location
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="phone_call">Phone Call (AI or Sales Team)</option>
                <option value="google_meet">Google Meet (Link in Email)</option>
                <option value="zoom">Zoom Meeting</option>
                <option value="office">In-Person Office Visit</option>
              </select>
            </div>
          </div>

          {/* 2. Slot & Buffer Durations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-border/60 py-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Slot Duration
              </label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSlotDuration(mins)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                      slotDuration === mins
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Buffer Between Bookings
              </label>
              <div className="flex gap-2">
                {[0, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setBufferMins(mins)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                      bufferMins === mins
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {mins === 0 ? "None" : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Weekly Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Weekly Working Hours
            </h3>
            <div className="space-y-2">
              {DAYS_OF_WEEK.map(({ key, label }) => {
                const ranges = schedule[key] || [];
                const isEnabled = ranges.length > 0;
                const [start, end] = isEnabled
                  ? ranges[0].split("-")
                  : ["10:00", "19:00"];

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-colors ${
                      isEnabled
                        ? "border-border bg-card"
                        : "border-border/40 bg-muted/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleDay(key)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        id={`check-${key}`}
                      />
                      <label
                        htmlFor={`check-${key}`}
                        className="text-xs font-medium text-foreground cursor-pointer select-none"
                      >
                        {label}
                      </label>
                    </div>

                    {isEnabled ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={start}
                          onChange={(e) => updateHours(key, e.target.value, end)}
                          className="rounded border border-input bg-background px-2 py-1 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <input
                          type="time"
                          value={end}
                          onChange={(e) => updateHours(key, start, e.target.value)}
                          className="rounded border border-input bg-background px-2 py-1 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-xs italic text-muted-foreground mr-4">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            ⚡ Changes apply immediately to AI Voice Agent slot checks.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
