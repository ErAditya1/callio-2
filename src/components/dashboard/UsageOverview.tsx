'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Clock01Icon,
  CoinsDollarIcon,
  CreditCardIcon,
  Layers01Icon,
  PhoneCallIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { UsageSummary } from '@/types/dashboard';

interface UsageOverviewProps {
  usage?: UsageSummary;
  isLoading?: boolean;
}

export function UsageOverview({ usage, isLoading }: UsageOverviewProps) {
  if (isLoading || !usage) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </Card>
    );
  }

  const quotaPct =
    usage.monthly_minutes_limit && usage.monthly_minutes_limit > 0
      ? Math.min(100, Math.round((usage.monthly_minutes_used / usage.monthly_minutes_limit) * 100))
      : null;

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Usage & Credits
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Resource consumption, credit burn, and monthly plan allocation
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-8 border-border hover:bg-muted"
        >
          <Link href="/billing">Manage Billing</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Conversational Minutes in Range */}
        <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Minutes in Period</span>
            <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <div className="text-xl font-black text-foreground font-mono">
            {usage.total_duration_minutes.toLocaleString()} min
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">
            Across inbound & outbound
          </span>
        </div>

        {/* Estimated Spend */}
        <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Period Spend</span>
            <HugeiconsIcon icon={CoinsDollarIcon} className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <div className="text-xl font-black text-foreground font-mono">
            ${usage.estimated_spend_usd.toFixed(2)}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">
            AI + Telephony compute
          </span>
        </div>
      </div>

      {/* Plan quota or Wallet status bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={Layers01Icon} className="w-3.5 h-3.5 text-primary" />
            Plan: <span className="capitalize font-mono">{usage.subscription_tier.replace(/_/g, ' ')}</span>
          </span>
          <span className="text-muted-foreground font-mono text-[11px]">
            Balance: <strong>${usage.wallet_balance_usd.toFixed(2)}</strong>
          </span>
        </div>

        {quotaPct != null ? (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{usage.monthly_minutes_used} min used</span>
              <span>{usage.monthly_minutes_limit} min limit ({quotaPct}%)</span>
            </div>
            <Progress value={quotaPct} className="h-1.5 bg-muted" />
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground">
            On-demand pay-as-you-go billing enabled with automatic minute metering.
          </div>
        )}
      </div>
    </Card>
  );
}
