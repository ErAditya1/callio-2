'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CallActivityPoint } from '@/types/dashboard';

interface CallActivityChartProps {
  activity?: CallActivityPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border px-3.5 py-2.5 rounded-xl shadow-lg text-xs space-y-1 z-50">
        <div className="font-bold text-foreground mb-1.5">{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-semibold text-foreground font-mono">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function CallActivityChart({ activity, isLoading }: CallActivityChartProps) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </Card>
    );
  }

  const hasCalls = (activity || []).some((pt) => pt.total_calls > 0);

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Call Activity & Conversational Volume
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time call dispatch, connected sessions, and successful completions
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900 dark:bg-neutral-100" />
            Total Calls
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
            Connected
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
            Successful
          </span>
        </div>
      </div>

      {!hasCalls ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-muted/20">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
            📊
          </div>
          <p className="text-sm font-semibold text-foreground">No call activity for this period</p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Calls will automatically populate this chart once outbound campaigns are dispatched or inbound lines receive calls.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activity}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis
                dataKey="label"
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground font-mono"
              />
              <YAxis
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground font-mono"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
              <Bar
                dataKey="total_calls"
                name="Total Calls"
                fill="currentColor"
                className="fill-neutral-900 dark:fill-neutral-100"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="connected_calls"
                name="Connected"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="successful_calls"
                name="Successful"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
