"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { SuperadminShowcaseManager } from "@/components/superadmin/SuperadminShowcaseManager";

export default function SuperadminShowcasePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Public Showcase Voice Agents</h1>
            <p className="text-xs text-muted-foreground">
              Select and publish curated voice agents to the landing page and public template directory for new signups.
            </p>
          </div>
        </div>
      </div>

      <SuperadminShowcaseManager />
    </div>
  );
}
