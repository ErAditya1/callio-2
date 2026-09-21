'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  Layers,
  Users,
  Zap,
  PhoneCall,
  Bot,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sliders,
  SlidersHorizontal,
  Building2,
  Search,
  Check,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface PlanItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  price_usd: number;
  price_inr: number;
  billing_interval: string;
  included_minutes: number;
  max_concurrent_calls: number;
  max_agents: number;
  overage_rate_per_minute_usd: number;
  allow_byok: boolean;
  is_active: boolean;
  is_public: boolean;
  features: string[];
  created_at: string | null;
}

interface FleetStats {
  total_organizations: number;
  total_wallet_balance_usd: number;
  fleet_active_calls: number;
  plans_breakdown: Record<string, number>;
  active_paid_subscriptions: number;
}

interface OrgListItem {
  id: number;
  provider_id: string;
  subscription_tier?: string;
  wallet_balance_usd?: number;
}

interface OrgSubscriptionDetails {
  organization_id: number;
  provider_id: string;
  subscription_tier: string;
  tier_name: string;
  subscription_status: string;
  effective_limits: {
    max_concurrent_calls: number;
    max_agents: number;
    included_minutes: number;
    monthly_minutes_used: number;
    minutes_remaining: number;
    is_unlimited_minutes: boolean;
    overage_rate_per_minute_usd: number;
    allow_byok: boolean;
    wallet_balance_usd: number;
    current_agents_count: number;
  };
  enterprise_overrides: {
    custom_concurrent_limit?: number | null;
    custom_monthly_minutes?: number | null;
    custom_max_agents?: number | null;
    custom_allow_byok?: boolean | null;
    price_per_second_usd?: number | null;
  };
  billing_cycle: {
    start: string | null;
    end: string | null;
  };
}

export function SuperadminPlansManager() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [fleetStats, setFleetStats] = useState<FleetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Plan Edit Dialog state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planForm, setPlanForm] = useState<Partial<PlanItem>>({
    slug: '',
    name: '',
    description: '',
    price_usd: 0,
    price_inr: 0,
    billing_interval: 'month',
    included_minutes: 0,
    max_concurrent_calls: 2,
    max_agents: 2,
    overage_rate_per_minute_usd: 0.10,
    allow_byok: true,
    is_active: true,
    is_public: true,
    features: [],
  });
  const [featuresText, setFeaturesText] = useState('');

  // Organization Tier & Overrides state
  const [orgs, setOrgs] = useState<OrgListItem[]>([]);
  const [orgSearch, setOrgSearch] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [orgDetails, setOrgDetails] = useState<OrgSubscriptionDetails | null>(null);
  const [loadingOrgDetails, setLoadingOrgDetails] = useState(false);
  const [savingOrgPlan, setSavingOrgPlan] = useState(false);

  // Override Form
  const [targetPlanSlug, setTargetPlanSlug] = useState('pay_as_you_go');
  const [customConcurrency, setCustomConcurrency] = useState<string>('');
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [customMaxAgents, setCustomMaxAgents] = useState<string>('');
  const [customPriceSec, setCustomPriceSec] = useState<string>('');
  const [customByok, setCustomByok] = useState<boolean | null>(null);
  const [resetMinutesUsed, setResetMinutesUsed] = useState<boolean>(false);

  const { getAccessToken } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const token = await getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [plansRes, statsRes, orgsRes] = await Promise.all([
        fetch('/api/v1/superuser/plans?include_inactive=true', { headers }),
        fetch('/api/v1/superuser/fleet-stats', { headers }),
        fetch('/api/v1/superuser/organizations', { headers }),
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setFleetStats(statsData);
      }
      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        setOrgs(Array.isArray(orgsData) ? orgsData : []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscription plans and fleet statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadOrgDetails = useCallback(async (orgId: number) => {
    try {
      setLoadingOrgDetails(true);
      setSelectedOrgId(orgId);
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/organizations/${orgId}/subscription`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data: OrgSubscriptionDetails = await res.json();
        setOrgDetails(data);
        setTargetPlanSlug(data.subscription_tier);
        setCustomConcurrency(
          data.enterprise_overrides.custom_concurrent_limit != null
            ? String(data.enterprise_overrides.custom_concurrent_limit)
            : ''
        );
        setCustomMinutes(
          data.enterprise_overrides.custom_monthly_minutes != null
            ? String(data.enterprise_overrides.custom_monthly_minutes)
            : ''
        );
        setCustomMaxAgents(
          data.enterprise_overrides.custom_max_agents != null
            ? String(data.enterprise_overrides.custom_max_agents)
            : ''
        );
        setCustomPriceSec(
          data.enterprise_overrides.price_per_second_usd != null
            ? String(data.enterprise_overrides.price_per_second_usd)
            : ''
        );
        setCustomByok(data.enterprise_overrides.custom_allow_byok ?? null);
        setResetMinutesUsed(false);
      } else {
        toast.error('Failed to load organization subscription');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching organization subscription details');
    } finally {
      setLoadingOrgDetails(false);
    }
  }, [getAccessToken]);

  const handleOpenEditPlan = (plan?: PlanItem) => {
    if (plan) {
      setIsEditing(true);
      setPlanForm({ ...plan });
      const initialFeatures = Array.isArray(plan.features)
        ? plan.features.join('\n')
        : typeof plan.features === 'string'
        ? (() => {
            try {
              const p = JSON.parse(plan.features);
              return Array.isArray(p) ? p.join('\n') : plan.features;
            } catch {
              return plan.features;
            }
          })()
        : '';
      setFeaturesText(initialFeatures);
    } else {
      setIsEditing(false);
      setPlanForm({
        slug: '',
        name: '',
        description: '',
        price_usd: 49.0,
        price_inr: 3999.0,
        billing_interval: 'month',
        included_minutes: 400,
        max_concurrent_calls: 3,
        max_agents: 3,
        overage_rate_per_minute_usd: 0.09,
        allow_byok: true,
        is_active: true,
        is_public: true,
        features: [],
      });
      setFeaturesText('Included Calling Minutes\nConcurrent Lines\nActive AI Agents\nBYOK Supported');
    }
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.slug || !planForm.name) {
      toast.error('Slug and Name are required');
      return;
    }

    try {
      setSavingPlan(true);
      const token = await getAccessToken();
      const parsedFeatures = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        ...planForm,
        features: parsedFeatures,
      };

      const res = await fetch('/api/v1/superuser/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Plan '${planForm.name}' saved successfully!`);
        setPlanModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || 'Failed to save plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving plan');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleSaveOrgPlanAndOverrides = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) return;

    try {
      setSavingOrgPlan(true);
      const token = await getAccessToken();

      const payload = {
        plan_slug: targetPlanSlug,
        custom_concurrent_limit: customConcurrency.trim() ? parseInt(customConcurrency, 10) : null,
        custom_monthly_minutes: customMinutes.trim() ? parseInt(customMinutes, 10) : null,
        custom_max_agents: customMaxAgents.trim() ? parseInt(customMaxAgents, 10) : null,
        custom_allow_byok: customByok,
        custom_price_per_second_usd: customPriceSec.trim() ? parseFloat(customPriceSec) : null,
        reset_minutes_used: resetMinutesUsed,
      };

      const res = await fetch(`/api/v1/superuser/organizations/${selectedOrgId}/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Organization plan and enterprise limits updated successfully!');
        loadOrgDetails(selectedOrgId);
        fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || 'Failed to update organization plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving organization overrides');
    } finally {
      setSavingOrgPlan(false);
    }
  };

  const filteredOrgs = orgs.filter(
    (o) =>
      o.id.toString().includes(orgSearch.trim()) ||
      o.provider_id.toLowerCase().includes(orgSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SaaS Subscription Plans & Quotas</h2>
          <p className="text-muted-foreground text-sm">
            Define multi-tier pricing, monthly included minutes, concurrent line allocations, and enterprise client overrides.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Fleet
          </Button>
          <Button size="sm" onClick={() => handleOpenEditPlan()} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      {fleetStats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Organizations
              </CardTitle>
              <Building2 className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetStats.total_organizations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active tenants across system
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Paid Subscriptions
              </CardTitle>
              <Zap className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {fleetStats.active_paid_subscriptions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Starter, Pro & Enterprise tiers
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fleet Concurrency
              </CardTitle>
              <PhoneCall className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetStats.fleet_active_calls}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active live voice lines
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Customer Wallets
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${fleetStats.total_wallet_balance_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Funded balance across orgs
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section 1: Subscription Plans Catalog */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Available Subscription Plans
              </CardTitle>
              <CardDescription>
                Public and private pricing tiers, included minutes, line limits, and overage billing rates.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">Plan Name</TableHead>
                  <TableHead>Price (USD / INR)</TableHead>
                  <TableHead>Included Mins</TableHead>
                  <TableHead>Concurrency</TableHead>
                  <TableHead>Agents Limit</TableHead>
                  <TableHead>Overage Rate</TableHead>
                  <TableHead>BYOK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No subscription plans found. Click &quot;Create Plan&quot; to define one.
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((p) => (
                    <TableRow key={p.slug} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{p.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{p.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold">${p.price_usd} / {p.billing_interval}</span>
                          <span className="text-xs text-muted-foreground">₹{p.price_inr} / {p.billing_interval}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.included_minutes > 0 ? (
                          <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                            {p.included_minutes.toLocaleString()} mins
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pay-per-sec</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {p.max_concurrent_calls} lines
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {p.max_agents >= 9999 ? 'Unlimited' : `${p.max_agents} agents`}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        ${p.overage_rate_per_minute_usd.toFixed(2)}/min
                      </TableCell>
                      <TableCell>
                        {p.allow_byok ? (
                          <Badge variant="secondary" className="text-xs font-normal">Allowed</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">Master Keys Only</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {p.is_active ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[10px]">Active</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">Inactive</Badge>
                          )}
                          {p.is_public && (
                            <Badge variant="outline" className="text-[10px]">Public</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditPlan(p)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Organization Subscription Inspector & Enterprise Overrides */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Org Selector Column */}
        <Card className="border-border/60 shadow-xs lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Select Organization
            </CardTitle>
            <CardDescription>
              Choose a tenant to inspect subscription quotas or configure custom enterprise allocations.
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search org ID or provider..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[460px] overflow-y-auto divide-y">
              {filteredOrgs.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No organizations match &quot;{orgSearch}&quot;
                </div>
              ) : (
                filteredOrgs.map((org) => {
                  const isSelected = selectedOrgId === org.id;
                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => loadOrgDetails(org.id)}
                      className={`w-full text-left p-3.5 transition-colors flex items-center justify-between hover:bg-muted/50 ${
                        isSelected ? 'bg-primary/10 border-l-4 border-l-primary font-medium' : ''
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-semibold truncate">
                          {org.provider_id || `Org #${org.id}`}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>ID: {org.id}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">
                            ${(org.wallet_balance_usd ?? 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] shrink-0 uppercase tracking-wider"
                      >
                        {org.subscription_tier || 'pay_as_you_go'}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Org Plan & Override Editor Column */}
        <Card className="border-border/60 shadow-xs lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Organization Quotas &amp; Custom Overrides
            </CardTitle>
            <CardDescription>
              {selectedOrgId
                ? `Managing Tier & Limits for Org #${selectedOrgId} (${orgDetails?.provider_id || '...' })`
                : 'Select an organization on the left to inspect effective limits and apply enterprise adjustments.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedOrgId ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed rounded-xl">
                <Sliders className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium">No Organization Selected</p>
                <p className="text-xs mt-1">Pick a tenant from the list to view or override their plan.</p>
              </div>
            ) : loadingOrgDetails ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading organization subscription...</p>
              </div>
            ) : orgDetails ? (
              <form onSubmit={handleSaveOrgPlanAndOverrides} className="space-y-6">
                {/* Active Effective Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Tier</span>
                    <p className="text-sm font-bold text-primary mt-0.5">{orgDetails.tier_name}</p>
                    <span className="text-[10px] text-muted-foreground">Status: {orgDetails.subscription_status}</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Concurrency</span>
                    <p className="text-sm font-bold mt-0.5">{orgDetails.effective_limits.max_concurrent_calls} Lines</p>
                    <span className="text-[10px] text-muted-foreground">Simultaneous Calls</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Voice Agents</span>
                    <p className="text-sm font-bold mt-0.5">
                      {orgDetails.effective_limits.current_agents_count} / {orgDetails.effective_limits.max_agents}
                    </p>
                    <span className="text-[10px] text-muted-foreground">Active Workflows</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Plan Minutes</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {orgDetails.effective_limits.included_minutes > 0
                        ? `${orgDetails.effective_limits.minutes_remaining.toFixed(0)} left`
                        : 'Pay-As-You-Go'}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      Used: {orgDetails.effective_limits.monthly_minutes_used.toFixed(1)}m
                    </span>
                  </div>
                </div>

                {/* Plan Assignment Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Base Subscription Plan</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {plans.map((p) => {
                      const isSelected = targetPlanSlug === p.slug;
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => setTargetPlanSlug(p.slug)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{p.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            ${p.price_usd}/mo • {p.max_concurrent_calls} lines
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Enterprise Custom Overrides Section */}
                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Enterprise Custom Limits &amp; Overrides
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Values entered here take precedence over the base plan limits for high-volume enterprise agreements.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="custom-concurrency" className="text-xs">
                        Custom Concurrent Line Limit (Simultaneous Calls)
                      </Label>
                      <Input
                        id="custom-concurrency"
                        type="number"
                        placeholder="Leave blank to use plan default"
                        value={customConcurrency}
                        onChange={(e) => setCustomConcurrency(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-minutes" className="text-xs">
                        Custom Monthly Minutes Allocation
                      </Label>
                      <Input
                        id="custom-minutes"
                        type="number"
                        placeholder="Leave blank to use plan default"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-agents" className="text-xs">
                        Custom Maximum Voice Agents
                      </Label>
                      <Input
                        id="custom-agents"
                        type="number"
                        placeholder="Leave blank to use plan default"
                        value={customMaxAgents}
                        onChange={(e) => setCustomMaxAgents(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-rate" className="text-xs">
                        Custom Call Rate ($ USD / Second)
                      </Label>
                      <Input
                        id="custom-rate"
                        type="number"
                        step="0.0001"
                        placeholder="e.g. 0.0010 for $0.06/min"
                        value={customPriceSec}
                        onChange={(e) => setCustomPriceSec(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold">Allow BYOK (Custom Keys)</Label>
                        <p className="text-[11px] text-muted-foreground">
                          Force allow or disallow Bring-Your-Own-Key model keys
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={customByok === true ? 'default' : 'outline'}
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => setCustomByok(customByok === true ? null : true)}
                        >
                          Allow
                        </Button>
                        <Button
                          type="button"
                          variant={customByok === false ? 'destructive' : 'outline'}
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => setCustomByok(customByok === false ? null : false)}
                        >
                          Disallow
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold">Reset Current Month Minutes</Label>
                        <p className="text-[11px] text-muted-foreground">
                          Zero out monthly_minutes_used to give fresh allowance
                        </p>
                      </div>
                      <Switch
                        checked={resetMinutesUsed}
                        onCheckedChange={setResetMinutesUsed}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={savingOrgPlan}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    {savingOrgPlan ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save Plan &amp; Custom Overrides
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Plan Edit / Create Modal */}
      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {isEditing ? `Edit Plan: ${planForm.name}` : 'Create New Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              Configure pricing, calling minutes quota, line concurrency, and marketing feature bullets.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePlan} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="plan-slug" className="text-xs font-semibold">Plan Slug (Unique Key)</Label>
                <Input
                  id="plan-slug"
                  value={planForm.slug || ''}
                  onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g. growth_tier"
                  disabled={isEditing}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plan-name" className="text-xs font-semibold">Display Name</Label>
                <Input
                  id="plan-name"
                  value={planForm.name || ''}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g. Growth Pro"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-desc" className="text-xs font-semibold">Description</Label>
              <Input
                id="plan-desc"
                value={planForm.description || ''}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                placeholder="Brief summary of who this plan is for..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price-usd" className="text-xs font-semibold">Price (USD)</Label>
                <Input
                  id="price-usd"
                  type="number"
                  step="0.01"
                  value={planForm.price_usd ?? 0}
                  onChange={(e) => setPlanForm({ ...planForm, price_usd: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price-inr" className="text-xs font-semibold">Price (INR ₹)</Label>
                <Input
                  id="price-inr"
                  type="number"
                  step="1"
                  value={planForm.price_inr ?? 0}
                  onChange={(e) => setPlanForm({ ...planForm, price_inr: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="billing-interval" className="text-xs font-semibold">Interval</Label>
                <Input
                  id="billing-interval"
                  value={planForm.billing_interval || 'month'}
                  onChange={(e) => setPlanForm({ ...planForm, billing_interval: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="included-minutes" className="text-xs font-semibold">Included Mins / mo</Label>
                <Input
                  id="included-minutes"
                  type="number"
                  value={planForm.included_minutes ?? 0}
                  onChange={(e) => setPlanForm({ ...planForm, included_minutes: parseInt(e.target.value, 10) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-concurrency" className="text-xs font-semibold">Max Concurrent Calls</Label>
                <Input
                  id="max-concurrency"
                  type="number"
                  value={planForm.max_concurrent_calls ?? 2}
                  onChange={(e) => setPlanForm({ ...planForm, max_concurrent_calls: parseInt(e.target.value, 10) || 1 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-agents" className="text-xs font-semibold">Max Agents Limit</Label>
                <Input
                  id="max-agents"
                  type="number"
                  value={planForm.max_agents ?? 2}
                  onChange={(e) => setPlanForm({ ...planForm, max_agents: parseInt(e.target.value, 10) || 1 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="overage-rate" className="text-xs font-semibold">Overage Rate ($ USD / Min)</Label>
                <Input
                  id="overage-rate"
                  type="number"
                  step="0.001"
                  value={planForm.overage_rate_per_minute_usd ?? 0.10}
                  onChange={(e) => setPlanForm({ ...planForm, overage_rate_per_minute_usd: parseFloat(e.target.value) || 0.10 })}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg mt-4 bg-muted/10">
                <Label htmlFor="allow-byok-switch" className="text-xs font-semibold cursor-pointer">
                  Allow Custom Keys (BYOK)
                </Label>
                <Switch
                  id="allow-byok-switch"
                  checked={planForm.allow_byok ?? true}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, allow_byok: checked })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="features-text" className="text-xs font-semibold">
                Feature Bullets (one per line)
              </Label>
              <Textarea
                id="features-text"
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="400 Calling Minutes included&#10;3 Concurrent call lines&#10;BYOK Supported"
                className="text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="is-active"
                  checked={planForm.is_active ?? true}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, is_active: checked })}
                />
                <Label htmlFor="is-active" className="text-xs cursor-pointer">Active Plan</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is-public"
                  checked={planForm.is_public ?? true}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, is_public: checked })}
                />
                <Label htmlFor="is-public" className="text-xs cursor-pointer">Public in Customer Billing Page</Label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setPlanModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingPlan} className="bg-primary hover:bg-primary/90">
                {savingPlan ? 'Saving...' : 'Save Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
