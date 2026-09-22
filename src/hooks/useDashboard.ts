'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useOrganizationTimezone } from '@/hooks/useOrganizationTimezone';
import { useAuth } from '@/lib/auth';
import type { DashboardOverviewResponse, DashboardRangePreset } from '@/types/dashboard';

interface UseDashboardOptions {
  pollingIntervalMs?: number;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { pollingIntervalMs = 45000 } = options;
  const { user, loading: authLoading } = useAuth();
  const timezone = useOrganizationTimezone();

  const [rangePreset, setRangePreset] = useState<DashboardRangePreset>('7d');
  const [customDates, setCustomDates] = useState<{ start?: string; end?: string }>({});
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Track active fetch to cancel or ignore stale responses
  const abortControllerRef = useRef<AbortController | null>(null);
  const userOrgKey = user
    ? ('selectedTeam' in user ? (user.selectedTeam as any)?.id : (user as any).organizationId)
    : null;

  const fetchData = useCallback(
    async (isBackground = false) => {
      if (authLoading || !user) {
        return;
      }

      if (isBackground) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const queryParams = new URLSearchParams({
          range_preset: rangePreset,
          timezone: timezone || 'UTC',
        });

        if (rangePreset === 'custom') {
          if (customDates.start) queryParams.set('start_date', customDates.start);
          if (customDates.end) queryParams.set('end_date', customDates.end);
        }

        // Use the same-origin Next.js proxy at /api/v1/[...path].
        // The proxy (src/app/api/v1/[...path]/route.ts) auto-injects the
        // dograh_auth_token cookie as a Bearer header, so no manual token
        // retrieval is needed. This avoids CORS issues and works for both
        // local and stack auth providers.
        const url = `/api/v1/dashboard/overview?${queryParams.toString()}`;

        const response = await fetch(url, {
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg =
            response.status === 401
              ? 'Session expired. Please log in again.'
              : errBody.detail || `Server error (${response.status})`;
          throw new Error(errMsg);
        }

        const json: DashboardOverviewResponse = await response.json();
        setData(json);
        setLastUpdated(new Date());
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch dashboard overview:', err);
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [authLoading, user, rangePreset, timezone, customDates]
  );

  // Re-fetch whenever range, timezone, or workspace changes
  useEffect(() => {
    fetchData(false);
  }, [fetchData, userOrgKey]);

  // Polling for live dashboard refresh
  useEffect(() => {
    if (pollingIntervalMs <= 0) return;

    const interval = setInterval(() => {
      // Only refresh if document is currently focused/visible
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchData(true);
      }
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [fetchData, pollingIntervalMs]);

  const handleRefresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch: handleRefresh,
    rangePreset,
    setRangePreset,
    customDates,
    setCustomDates,
    lastUpdated,
  };
}
