'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, AlertCircle, Plus } from 'lucide-react';
import { useOrgConfig } from '@/context/OrgConfigContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function WalletBalanceBadge() {
  const { orgContext } = useOrgConfig();

  const balance = (orgContext as any)?.wallet_balance_usd ?? 0.0;
  const isZero = balance <= 0.0;
  const isLow = balance > 0.0 && balance <= 3.0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/billing"
          className={cn(
            'group flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200',
            isZero
              ? 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/15'
              : isLow
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15'
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                isZero ? 'bg-destructive' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2',
                isZero ? 'bg-destructive' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
          </span>

          <Wallet className="h-3.5 w-3.5 opacity-80" />

          <span className="font-mono font-semibold tracking-tight">
            ${balance.toFixed(2)}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 hidden sm:inline">
            Credits
          </span>

          <span className="hidden group-hover:flex items-center justify-center w-3.5 h-3.5 rounded-full bg-background border text-[10px] text-muted-foreground ml-0.5">
            <Plus className="h-2.5 w-2.5" />
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs max-w-xs">
        {isZero ? (
          <div className="space-y-1">
            <p className="font-semibold text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Insufficient Platform Credits
            </p>
            <p className="text-muted-foreground">
              Your balance is $0.00. Recharge to place calls with platform voice agents.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-semibold">Platform Wallet Balance</p>
            <p className="text-muted-foreground">
              Calls are automatically rated per-minute against this balance. Click to recharge.
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
