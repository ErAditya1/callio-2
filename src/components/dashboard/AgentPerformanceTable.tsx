'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  BotIcon,
  CheckmarkCircle02Icon,
  PlusSignIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import type { AgentPerformanceItem } from '@/types/dashboard';

interface AgentPerformanceTableProps {
  agents?: AgentPerformanceItem[];
  isLoading?: boolean;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }
  return `${mins}m ${Math.round(seconds % 60)}s`;
}

export function AgentPerformanceTable({ agents, isLoading }: AgentPerformanceTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const hasAgents = (agents || []).length > 0;

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Voice Agent Performance
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fleet effectiveness, call volume distribution, and conversational resolution
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-8 border-border hover:bg-muted"
        >
          <Link href="/workflow">
            View All Agents
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      {!hasAgents ? (
        <div className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-muted/20">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <HugeiconsIcon icon={BotIcon} className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No voice agents yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            Build your first AI conversational agent to handle inbound inquiries and automated outbound campaigns.
          </p>
          <Button asChild size="sm" className="rounded-xl text-xs h-8">
            <Link href="/workflow/create">
              <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5 mr-1" />
              Create your first agent
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Agent
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Calls in Period
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Success Rate
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Talk Time
                </TableHead>
                <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {agents?.map((agent) => (
                <TableRow
                  key={agent.id}
                  onClick={() => router.push(`/workflow/${agent.id}`)}
                  className="cursor-pointer border-b border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="py-3.5 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground hover:text-primary transition-colors">
                          {agent.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ID: #{agent.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] py-0 px-2 font-medium capitalize ${
                        agent.status === 'active' || agent.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5 font-semibold text-foreground">
                    {agent.total_calls.toLocaleString()} calls
                  </TableCell>

                  <TableCell className="py-3.5 font-semibold">
                    <span
                      className={
                        agent.success_rate_pct >= 70
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : agent.success_rate_pct >= 40
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-muted-foreground'
                      }
                    >
                      {agent.success_rate_pct}%
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 text-muted-foreground font-mono">
                    {formatDuration(agent.talk_time_seconds)}
                  </TableCell>

                  <TableCell className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs rounded-lg hover:bg-muted"
                      >
                        <Link href={`/workflow/${agent.id}`}>Configure</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="h-7 text-xs rounded-lg bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Link href={`/demo/call?agent=${agent.id}`}>Test Call</Link>
                      </Button>
                    </div>
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
