"use client";

import { Key } from "lucide-react";
import React from "react";

import { SuperadminMasterKeysManager } from "@/components/superadmin/SuperadminMasterKeysManager";

export default function SuperadminKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Key className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Master API Keys &amp; Provider Pricing</h1>
            <p className="text-xs text-muted-foreground">
              Configure platform master credentials (OpenAI, Deepgram, Cartesia, ElevenLabs, etc.) and per-minute billing rates.
            </p>
          </div>
        </div>
      </div>

      <SuperadminMasterKeysManager />
    </div>
  );
}
