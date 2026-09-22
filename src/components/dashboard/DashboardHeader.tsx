'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Calendar01Icon,
  RadioIcon,
  RefreshCwIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import type { DashboardRangePreset } from '@/types/dashboard';

interface DashboardHeaderProps {
  rangePreset: DashboardRangePreset;
  onRangeChange: (preset: DashboardRangePreset) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

const PRESETS: { key: DashboardRangePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
];

export function DashboardHeader({
  rangePreset,
  onRangeChange,
  onRefresh,
  isRefreshing,
  lastUpdated,
}: DashboardHeaderProps) {
  const { user } = useAuth();

  const userName = React.useMemo(() => {
    if (!user) return 'there';
    if ('displayName' in user && user.displayName) return user.displayName.split(' ')[0];
    if ('name' in user && user.name) return user.name.split(' ')[0];
    if ('primaryEmail' in user && user.primaryEmail) return user.primaryEmail.split('@')[0];
    if ('email' in user && user.email) return user.email.split('@')[0];
    return 'there';
  }, [user]);

  const workspaceName = React.useMemo(() => {
    if (!user) return null;
    if ('selectedTeam' in user && (user.selectedTeam as any)?.displayName) {
      return (user.selectedTeam as any).displayName;
    }
    return null;
  }, [user]);

  const formattedTime = React.useMemo(() => {
    if (!lastUpdated) return null;
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [lastUpdated]);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-border/40 pb-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {userName} 👋
          </h1>
          {workspaceName && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              {workspaceName}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <span>Real-time voice intelligence & conversational operations</span>
          {formattedTime && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[11px] font-mono text-muted-foreground/80">Updated at {formattedTime}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Preset Selector */}
        <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border/70 text-xs">
          {PRESETS.map((preset) => {
            const isActive = rangePreset === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => onRangeChange(preset.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${isActive
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-xl text-xs h-9 px-3 gap-1.5"
          title="Refresh dashboard metrics"
        >
          <HugeiconsIcon
            icon={RefreshCwIcon}
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>


        <Button
          size="sm"
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs h-9 shadow-sm"
        >
          <Link href="/workflow/create">
            <HugeiconsIcon icon={Add01Icon} className="w-3.5 h-3.5 mr-1" />
            Create Agent
          </Link>
        </Button>
      </div>
    </div>
  );
}
