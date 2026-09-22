'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  RefreshCwIcon,
} from '@hugeicons/core-free-icons';
import React from 'react';

import { AgentPerformanceTable } from '@/components/dashboard/AgentPerformanceTable';
import { CallActivityChart } from '@/components/dashboard/CallActivityChart';
import { CampaignOverview } from '@/components/dashboard/CampaignOverview';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { NeedsAttention } from '@/components/dashboard/NeedsAttention';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable';
import { UsageOverview } from '@/components/dashboard/UsageOverview';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardOverviewPage() {
  const {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch,
    rangePreset,
    setRangePreset,
    lastUpdated,
  } = useDashboard();

  return (
    <div className="app-page space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* 1. Header with workspace greeting, date presets, and actions */}
      <DashboardHeader
        rangePreset={rangePreset}
        onRangeChange={setRangePreset}
        onRefresh={refetch}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Error banner if fetching failed */}
      {error && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/20 flex items-center justify-between gap-3 text-rose-800 dark:text-rose-200 text-xs">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Unable to refresh live metrics:</strong> {error}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-7 text-xs rounded-xl border-rose-300 dark:border-rose-800 hover:bg-rose-100"
          >
            <HugeiconsIcon icon={RefreshCwIcon} className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* 2. Top-level dynamic KPI statistics */}
      <DashboardKpis kpi={data?.overview} isLoading={isLoading} />

      {/* 3. Call Activity Chart + Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <CallActivityChart activity={data?.call_activity} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-4">
          <UsageOverview usage={data?.usage} isLoading={isLoading} />
        </div>
      </div>

      {/* 4. Active Voice Agent Performance Table */}
      <AgentPerformanceTable agents={data?.agent_performance} isLoading={isLoading} />

      {/* 5. Campaign Overview + Needs Attention Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <CampaignOverview campaigns={data?.campaigns} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-6">
          <NeedsAttention items={data?.attention_items} isLoading={isLoading} />
        </div>
      </div>

      {/* 6. Recent Real Calls Feed */}
      <RecentCallsTable calls={data?.recent_calls} isLoading={isLoading} />

      {/* 7. Quick Operational Actions */}
      <div className="pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Quick Launch & Operations
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
