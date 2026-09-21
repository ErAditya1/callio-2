"use client";

import { DollarSign } from "lucide-react";
import React from "react";

import { SuperadminWalletManager } from "@/components/superadmin/SuperadminWalletManager";

export default function SuperadminWalletsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Customer Wallets &amp; Credit Grants</h1>
            <p className="text-xs text-muted-foreground">
              Review organization balances, audit transaction ledger, and issue manual promotional or compensation credits.
            </p>
          </div>
        </div>
      </div>

      <SuperadminWalletManager />
    </div>
  );
}
