'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CallIncoming01Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CreditCardIcon,
  PhoneCallIcon,
  SignalFull02Icon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardOverviewKpi } from '@/types/dashboard';

interface DashboardKpisProps {
  kpi?: DashboardOverviewKpi;
  isLoading?: boolean;
}

function formatTalkTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

function TrendBadge({ pct }: { pct?: number | null }) {
  if (pct == null || isNaN(pct)) return null;
  const isPositive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
      }`}
    >
      {isPositive ? '↑' : '↓'} {Math.abs(pct)}%
    </span>
  );
}

export function DashboardKpis({ kpi, isLoading }: DashboardKpisProps) {
  if (isLoading || !kpi) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 rounded-2xl border border-border bg-card space-y-2 shadow-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-28" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Calls',
      value: kpi.total_calls.toLocaleString(),
      subtext: kpi.comparison.total_calls_change_pct != null ? 'vs previous period' : 'Recorded in period',
      trend: kpi.comparison.total_calls_change_pct,
      icon: PhoneCallIcon,
      highlight: false,
    },
    {
      label: 'Connected Rate',
      value: `${kpi.connected_rate_pct}%`,
      subtext: `${kpi.connected_calls.toLocaleString()} connected calls`,
      trend: kpi.comparison.connected_calls_change_pct,
      icon: SignalFull02Icon,
      highlight: false,
    },
    {
      label: 'Total Talk Time',
      value: formatTalkTime(kpi.talk_time_seconds),
      subtext: kpi.comparison.talk_time_change_pct != null ? 'vs previous period' : 'Total conversational duration',
      trend: kpi.comparison.talk_time_change_pct,
      icon: Clock01Icon,
      highlight: false,
    },
    {
      label: 'Success Rate',
      value: `${kpi.success_rate_pct}%`,
      subtext: `${kpi.successful_calls.toLocaleString()} successful outcomes`,
      trend: kpi.comparison.success_rate_change_pct,
      icon: CheckmarkCircle02Icon,
      highlight: false,
    },
    {
      label: 'Wallet & Credits',
      value: `$${kpi.wallet_balance_usd.toFixed(2)}`,
      subtext: 'Available credit balance',
      action: { href: '/billing', label: 'Manage' },
      icon: CreditCardIcon,
      badge: kpi.wallet_balance_usd < 5.0 ? 'Low' : undefined,
      badgeColor: kpi.wallet_balance_usd < 5.0 ? 'bg-amber-50 text-amber-700 border-amber-200' : undefined,
      highlight: kpi.wallet_balance_usd < 5.0,
    },
  ];

  return (
    <div className="space-y-3">
      {/* If active calls currently running, render active banner */}
      {kpi.active_calls > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>
            <strong>{kpi.active_calls} active call{kpi.active_calls === 1 ? '' : 's'}</strong> currently in progress across workers.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => {
          return (
            <Card
              key={idx}
              className={`p-4 rounded-2xl border transition-all hover:border-border/80 shadow-xs bg-card flex flex-col justify-between ${
                card.highlight ? 'border-amber-300/80 bg-amber-50/20' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </span>
                <HugeiconsIcon icon={card.icon} className="w-4 h-4 text-muted-foreground/60" />
              </div>

              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground tracking-tight">
                  {card.value}
                </span>
                {card.badge && (
                  <Badge variant="outline" className={`text-[10px] py-0 px-1.5 font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate">{card.subtext}</span>
                {card.trend != null && <TrendBadge pct={card.trend} />}
                {card.action && (
                  <Link
                    href={card.action.href}
                    className="text-[11px] font-semibold text-primary hover:underline ml-auto"
                  >
                    {card.action.label} →
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
