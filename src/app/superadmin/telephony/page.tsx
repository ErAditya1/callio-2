"use client";

import { Phone } from "lucide-react";
import React from "react";

import { SuperadminTelephonyInventoryManager } from "@/components/superadmin/SuperadminTelephonyInventoryManager";

export default function SuperadminTelephonyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Telephony Numbers Pool &amp; Carriers</h1>
            <p className="text-xs text-muted-foreground">
              Stock DID phone numbers from Twilio, Telnyx, and Vonage to distribute to customer organizations.
            </p>
          </div>
        </div>
      </div>

      <SuperadminTelephonyInventoryManager />
    </div>
  );
}
