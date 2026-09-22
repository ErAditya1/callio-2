'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Megaphone01Icon,
  PlayIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { CampaignSummaryItem } from '@/types/dashboard';

interface CampaignOverviewProps {
  campaigns?: CampaignSummaryItem[];
  isLoading?: boolean;
}

function getStatusBadge(state: string) {
  const s = state.toLowerCase();
  switch (s) {
    case 'running':
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 capitalize">● Running</Badge>;
    case 'completed':
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 capitalize">✓ Completed</Badge>;
    case 'paused':
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 capitalize">❚❚ Paused</Badge>;
    case 'failed':
      return <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 capitalize">✕ Failed</Badge>;
    case 'syncing':
      return <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 capitalize">◌ Syncing</Badge>;
    default:
      return <Badge variant="outline" className="capitalize">{state}</Badge>;
  }
}

export function CampaignOverview({ campaigns, isLoading }: CampaignOverviewProps) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </Card>
    );
  }

  const hasCampaigns = (campaigns || []).length > 0;

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Outbound Campaigns
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bulk calling batches, dispatch execution, and contact completion
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-8 border-border hover:bg-muted"
        >
          <Link href="/campaigns">
            View Campaigns
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      {!hasCampaigns ? (
        <div className="py-8 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-muted/20">
          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
            <HugeiconsIcon icon={Megaphone01Icon} className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-xs font-bold text-foreground">No campaigns created yet</h3>
          <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5 mb-3">
            Upload contact leads from CSV to start automated conversational calling workflows.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8">
            <Link href="/campaigns/new">
              <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5 mr-1" />
              Create Campaign
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns?.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="block p-4 rounded-2xl border border-border/70 hover:border-border transition-all bg-card/80 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="truncate">
                  <div className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate">
                    {campaign.name}
                  </div>
                  {campaign.workflow_name && (
                    <div className="text-[10px] text-muted-foreground">
                      Agent: {campaign.workflow_name}
                    </div>
                  )}
                </div>
                <div>{getStatusBadge(campaign.state)}</div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>
                    {campaign.processed_rows} / {campaign.total_rows} processed
                  </span>
                  <span>{campaign.progress_pct}%</span>
                </div>
                <Progress value={campaign.progress_pct} className="h-1.5 bg-muted" />
              </div>

              {campaign.failed_rows > 0 && (
                <div className="mt-2 text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                  ⚠ {campaign.failed_rows} failed / undelivered attempts
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
