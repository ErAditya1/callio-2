'use client';

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  PlusIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";;
import { useOrgConfig } from '@/context/OrgConfigContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function WalletBalanceBadge() {
  const { orgContext } = useOrgConfig();

  const balance = (orgContext as any)?.wallet_balance_usd ?? 0.0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/billing"
          className={cn(
            'group flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200',
            'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          )}
        >
          <HugeiconsIcon icon={Wallet01Icon} className="h-3.5 w-3.5 opacity-80" />

          <span className="font-mono font-bold tracking-tight">
            {balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cr
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 hidden sm:inline">
            Balance
          </span>

          <span className="hidden group-hover:flex items-center justify-center w-3.5 h-3.5 rounded-full bg-background border text-[10px] text-muted-foreground ml-0.5">
            <HugeiconsIcon icon={PlusIcon} className="h-2.5 w-2.5" />
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs max-w-xs">
        {balance <= 0 ? (
          <div className="space-y-1">
            <p className="font-semibold text-neutral-900 flex items-center gap-1">
              <HugeiconsIcon icon={AlertCircleIcon} className="h-3.5 w-3.5" /> Insufficient Platform Credits
            </p>
            <p className="text-muted-foreground">
              Your balance is 0 Cr. Recharge to place calls with platform voice agents.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-semibold">Platform Wallet Credits</p>
            <p className="text-muted-foreground">
              Calls are automatically rated per-second against your credits balance (Cr). Click to recharge.
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
