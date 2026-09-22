'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AttentionItem } from '@/types/dashboard';

interface NeedsAttentionProps {
  items?: AttentionItem[];
  isLoading?: boolean;
}

export function NeedsAttention({ items, isLoading }: NeedsAttentionProps) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-2.5">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </Card>
    );
  }

  const hasItems = (items || []).length > 0;

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div>
        <CardTitle className="text-lg font-bold text-foreground">
          Needs Attention
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Actionable alerts, configuration health, and operational notices
        </p>
      </div>

      {!hasItems ? (
        <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20 flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              All systems operational
            </div>
            <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-0.5">
              No failed campaigns, low balances, or critical agent degradation detected in your active workspace.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items?.map((item) => {
            const isError = item.severity === 'error';
            const isWarning = item.severity === 'warning';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  isError
                    ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20'
                    : 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-xl mt-0.5 ${
                      isError
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    }`}
                  >
                    {isError ? (
                      <HugeiconsIcon icon={AlertCircleIcon} className="w-3.5 h-3.5" />
                    ) : isWarning ? (
                      <HugeiconsIcon icon={Alert02Icon} className="w-3.5 h-3.5" />
                    ) : (
                      <HugeiconsIcon icon={InformationCircleIcon} className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-[11px] h-7 px-2.5 shrink-0 border-border bg-background"
                >
                  <Link href={item.cta_href}>
                    {item.cta_text}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
