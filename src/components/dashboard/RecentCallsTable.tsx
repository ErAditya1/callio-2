'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Call02Icon,
  Clock01Icon,
  PhoneCallIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RecentCallItem } from '@/types/dashboard';

interface RecentCallsTableProps {
  calls?: RecentCallItem[];
  isLoading?: boolean;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatCallTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '-';
  }
}

function getOutcomeBadge(outcome: string) {
  const o = outcome.toUpperCase();
  if (['COMPLETED', 'XFER', 'INTERESTED', 'CONVERTED', 'QUALIFIED'].includes(o)) {
    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium">{outcome}</Badge>;
  }
  if (['FAILED', 'ERROR'].includes(o)) {
    return <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 font-medium">{outcome}</Badge>;
  }
  if (['NO_ANSWER', 'BUSY', 'CANCELED'].includes(o)) {
    return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 font-medium">{outcome}</Badge>;
  }
  return <Badge variant="outline" className="text-muted-foreground">{outcome}</Badge>;
}

export function RecentCallsTable({ calls, isLoading }: RecentCallsTableProps) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const hasCalls = (calls || []).length > 0;

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Recent Call Activity
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest live interactions, phone connections, and conversational transcripts
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-8 border-border hover:bg-muted"
        >
          <Link href="/usage">
            View All Calls
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      {!hasCalls ? (
        <div className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-muted/20">
          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
            <HugeiconsIcon icon={Call02Icon} className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-xs font-bold text-foreground">No recent calls</h3>
          <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5 mb-3">
            Inbound and outbound calls will show here in real-time as sessions occur.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8">
            <Link href="/demo/call">
              <HugeiconsIcon icon={PhoneCallIcon} className="w-3.5 h-3.5 mr-1 text-primary" />
              Test a Call
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Caller / Contact
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Voice Agent
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Duration
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Outcome
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Time
                </TableHead>
                <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {calls?.map((call) => (
                <TableRow
                  key={call.id}
                  className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="py-3.5 font-medium">
                    <div className="flex items-center gap-2">
                      {call.call_type === 'inbound' ? (
                        <HugeiconsIcon icon={PhoneIncomingIcon} className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <HugeiconsIcon icon={PhoneOutgoingIcon} className="w-3.5 h-3.5 text-purple-500" />
                      )}
                      <span className="font-bold text-foreground font-mono">
                        {call.contact}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-foreground font-medium">
                    <Link
                      href={`/workflow/${call.agent_id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {call.agent_name}
                    </Link>
                  </TableCell>

                  <TableCell className="py-3.5 font-mono text-muted-foreground">
                    {formatDuration(call.duration_seconds)}
                  </TableCell>

                  <TableCell className="py-3.5">
                    {getOutcomeBadge(call.outcome)}
                  </TableCell>

                  <TableCell className="py-3.5 font-mono text-muted-foreground">
                    {formatCallTime(call.created_at)}
                  </TableCell>

                  <TableCell className="py-3.5 text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs rounded-lg border-border hover:bg-muted"
                    >
                      <Link href={`/workflow/${call.agent_id}/run/${call.id}`}>
                        Inspect →
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
