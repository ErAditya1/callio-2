"use client";

import { Layers } from "lucide-react";
import React from "react";

import { SuperadminPlansManager } from "@/components/superadmin/SuperadminPlansManager";

export default function SuperadminPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SaaS Plans &amp; Enterprise Tiers</h1>
            <p className="text-xs text-muted-foreground">
              Define standard customer plans (Starter, Pro, Enterprise), included minutes, overage rates, and custom enterprise limit overrides.
            </p>
          </div>
        </div>
      </div>

      <SuperadminPlansManager />
    </div>
  );
}
