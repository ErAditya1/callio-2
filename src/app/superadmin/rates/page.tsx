"use client";

import { Banknote } from "lucide-react";
import React from "react";

import { SuperadminSettingsManager } from "@/components/superadmin/SuperadminSettingsManager";

export default function SuperadminRatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Banknote className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Currency &amp; Tax Settings</h1>
            <p className="text-xs text-muted-foreground">
              Manage platform USD to INR exchange conversion rate, GST tax percentage, and payment gateway configuration.
            </p>
          </div>
        </div>
      </div>

      <SuperadminSettingsManager />
    </div>
  );
}
