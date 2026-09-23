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
  Trash2,
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
  monthly_credits_usd?: number;
  included_phone_numbers?: number;
  max_concurrent_calls: number;
  max_agents: number;
  overage_rate_per_minute_usd: number;
  byok_platform_fee_per_minute_usd?: number;
  allow_byok: boolean;
  allow_live_transfer?: boolean;
  allow_sip_trunking?: boolean;
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
    plan_credits_monthly_usd?: number;
    plan_credits_remaining_usd?: number;
    included_phone_numbers?: number;
    byok_platform_fee_per_minute_usd?: number;
    allow_live_transfer?: boolean;
    allow_sip_trunking?: boolean;
    custom_monthly_price_usd?: number | null;
  };
  enterprise_overrides: {
    custom_concurrent_limit?: number | null;
    custom_monthly_minutes?: number | null;
    custom_max_agents?: number | null;
    custom_allow_byok?: boolean | null;
    custom_monthly_price_usd?: number | null;
    custom_monthly_credits_usd?: number | null;
    custom_included_phone_numbers?: number | null;
    custom_byok_platform_fee_usd?: number | null;
    custom_allow_live_transfer?: boolean | null;
    custom_allow_sip_trunking?: boolean | null;
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
  const [planCategoryFilter, setPlanCategoryFilter] = useState<'all' | 'simple' | 'developer'>('all');
  const [modalPlanCategory, setModalPlanCategory] = useState<'simple' | 'developer'>('simple');
  const [planForm, setPlanForm] = useState<Partial<PlanItem>>({
    slug: '',
    name: '',
    description: '',
    price_usd: 0,
    price_inr: 0,
    billing_interval: 'month',
    included_minutes: 0,
    monthly_credits_usd: 0,
    included_phone_numbers: 0,
    max_concurrent_calls: 2,
    max_agents: 2,
    overage_rate_per_minute_usd: 0.10,
    byok_platform_fee_per_minute_usd: 0.04,
    allow_byok: true,
    allow_live_transfer: false,
    allow_sip_trunking: false,
    is_active: true,
    is_public: true,
    features: [],
  });
  const [featuresText, setFeaturesText] = useState('');

  const filteredPlans = plans.filter((p) => {
    if (planCategoryFilter === 'simple') return p.slug.startsWith('simple_');
    if (planCategoryFilter === 'developer') return !p.slug.startsWith('simple_');
    return true;
  });

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
  const [customMonthlyPrice, setCustomMonthlyPrice] = useState<string>('');
  const [customMonthlyCredits, setCustomMonthlyCredits] = useState<string>('');
  const [customIncludedPhoneNumbers, setCustomIncludedPhoneNumbers] = useState<string>('');
  const [customByokFee, setCustomByokFee] = useState<string>('');
  const [customLiveTransfer, setCustomLiveTransfer] = useState<boolean | null>(null);
  const [customSipTrunking, setCustomSipTrunking] = useState<boolean | null>(null);
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
        setCustomMonthlyPrice(
          data.enterprise_overrides.custom_monthly_price_usd != null
            ? String(data.enterprise_overrides.custom_monthly_price_usd)
            : ''
        );
        setCustomMonthlyCredits(
          data.enterprise_overrides.custom_monthly_credits_usd != null
            ? String(data.enterprise_overrides.custom_monthly_credits_usd)
            : ''
        );
        setCustomIncludedPhoneNumbers(
          data.enterprise_overrides.custom_included_phone_numbers != null
            ? String(data.enterprise_overrides.custom_included_phone_numbers)
            : ''
        );
        setCustomByokFee(
          data.enterprise_overrides.custom_byok_platform_fee_usd != null
            ? String(data.enterprise_overrides.custom_byok_platform_fee_usd)
            : ''
        );
        setCustomLiveTransfer(data.enterprise_overrides.custom_allow_live_transfer ?? null);
        setCustomSipTrunking(data.enterprise_overrides.custom_allow_sip_trunking ?? null);
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

  const handleCategorySwitch = (category: 'simple' | 'developer') => {
    setModalPlanCategory(category);
    if (!isEditing) {
      if (category === 'simple') {
        setPlanForm((prev) => ({
          ...prev,
          slug: prev.slug?.startsWith('simple_') ? prev.slug : `simple_${prev.slug || 'minute_pack'}`,
          name: prev.name || 'Custom Minute Pack',
          description: prev.description || 'All-inclusive calling minutes for business outbound campaigns.',
          price_usd: prev.price_usd || 49.0,
          price_inr: prev.price_inr || 3999.0,
          included_minutes: prev.included_minutes || 500,
          monthly_credits_usd: 0,
          included_phone_numbers: prev.included_phone_numbers || 1,
          max_concurrent_calls: prev.max_concurrent_calls || 3,
          max_agents: prev.max_agents || 3,
          overage_rate_per_minute_usd: 0.08,
          byok_platform_fee_per_minute_usd: 0.03,
          allow_byok: false,
          allow_live_transfer: true,
          allow_sip_trunking: false,
        }));
        setFeaturesText(
          '500 Calling Minutes per month\n3 Simultaneous Concurrent Lines\nUp to 3 Active AI Voice Agents\n1 Dedicated Platform Phone Number\nCSV Campaign Runner & Scheduler\nFull Call Recordings & Transcripts'
        );
      } else {
        setPlanForm((prev) => ({
          ...prev,
          slug: prev.slug?.startsWith('simple_') ? prev.slug.replace(/^simple_/, '') : (prev.slug || 'custom_pro_tier'),
          name: prev.name || 'Developer Pro Tier',
          description: prev.description || 'Full API, BYOK custom keys, and high-concurrency developer tier.',
          price_usd: prev.price_usd || 69.0,
          price_inr: prev.price_inr || 5999.0,
          included_minutes: prev.included_minutes || 600,
          monthly_credits_usd: 50.0,
          included_phone_numbers: prev.included_phone_numbers || 2,
          max_concurrent_calls: prev.max_concurrent_calls || 5,
          max_agents: prev.max_agents || 5,
          overage_rate_per_minute_usd: 0.08,
          byok_platform_fee_per_minute_usd: 0.04,
          allow_byok: true,
          allow_live_transfer: true,
          allow_sip_trunking: true,
        }));
        setFeaturesText(
          '$50.00 Included Call Credits / month\n5 Simultaneous Concurrent Lines\n5 Active AI Voice Agents\n2 Included Dedicated Phone Numbers\nBYOK Supported ($0.04/min platform fee)\nWebhooks & REST API Access'
        );
      }
    }
  };

  const handleOpenEditPlan = (plan?: PlanItem) => {
    if (plan) {
      setIsEditing(true);
      const isSimple = plan.slug.startsWith('simple_');
      setModalPlanCategory(isSimple ? 'simple' : 'developer');
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
      const targetCategory = planCategoryFilter === 'developer' ? 'developer' : 'simple';
      setModalPlanCategory(targetCategory);
      if (targetCategory === 'simple') {
        setPlanForm({
          slug: 'simple_custom_pack',
          name: 'Custom Minute Pack',
          description: 'All-inclusive calling minutes for business outbound campaigns.',
          price_usd: 49.0,
          price_inr: 3999.0,
          billing_interval: 'month',
          included_minutes: 500,
          monthly_credits_usd: 0,
          included_phone_numbers: 1,
          max_concurrent_calls: 3,
          max_agents: 3,
          overage_rate_per_minute_usd: 0.08,
          byok_platform_fee_per_minute_usd: 0.03,
          allow_byok: false,
          allow_live_transfer: true,
          allow_sip_trunking: false,
          is_active: true,
          is_public: true,
          features: [],
        });
        setFeaturesText(
          '500 Calling Minutes per month\n3 Simultaneous Concurrent Lines\nUp to 3 Active AI Voice Agents\n1 Dedicated Platform Phone Number\nCSV Campaign Runner & Scheduler\nFull Call Recordings & Transcripts'
        );
      } else {
        setPlanForm({
          slug: 'custom_pro_tier',
          name: 'Developer Pro Tier',
          description: 'Full API, BYOK custom keys, and high-concurrency developer tier.',
          price_usd: 69.0,
          price_inr: 5999.0,
          billing_interval: 'month',
          included_minutes: 600,
          monthly_credits_usd: 50.0,
          included_phone_numbers: 2,
          max_concurrent_calls: 5,
          max_agents: 5,
          overage_rate_per_minute_usd: 0.08,
          byok_platform_fee_per_minute_usd: 0.04,
          allow_byok: true,
          allow_live_transfer: true,
          allow_sip_trunking: true,
          is_active: true,
          is_public: true,
          features: [],
        });
        setFeaturesText(
          '$50.00 Included Call Credits / month\n5 Simultaneous Concurrent Lines\n5 Active AI Voice Agents\n2 Included Dedicated Phone Numbers\nBYOK Supported ($0.04/min platform fee)\nWebhooks & REST API Access'
        );
      }
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

  const handleDeletePlan = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate plan '${name}' (${slug})?`)) {
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/plans/${slug}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || `Plan '${name}' deleted successfully`);
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || 'Failed to delete plan');
      }
    } catch (e) {
      toast.error('Network error deleting plan');
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
        custom_monthly_price_usd: customMonthlyPrice.trim() ? parseFloat(customMonthlyPrice) : null,
        custom_monthly_credits_usd: customMonthlyCredits.trim() ? parseFloat(customMonthlyCredits) : null,
        custom_included_phone_numbers: customIncludedPhoneNumbers.trim() ? parseInt(customIncludedPhoneNumbers, 10) : null,
        custom_byok_platform_fee_usd: customByokFee.trim() ? parseFloat(customByokFee) : null,
        custom_allow_live_transfer: customLiveTransfer,
        custom_allow_sip_trunking: customSipTrunking,
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Available Subscription Plans
              </CardTitle>
              <CardDescription>
                Manage public and private pricing tiers, minute packs, concurrency limits, and overage billing rates.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Tabs */}
              <div className="flex items-center bg-muted/60 p-1 rounded-lg border">
                <button
                  type="button"
                  onClick={() => setPlanCategoryFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    planCategoryFilter === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All ({plans.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlanCategoryFilter('simple')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    planCategoryFilter === 'simple'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Simple Minute Packs ({plans.filter((p) => p.slug.startsWith('simple_')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlanCategoryFilter('developer')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    planCategoryFilter === 'developer'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Developer Tiers ({plans.filter((p) => !p.slug.startsWith('simple_')).length})
                </button>
              </div>

              <Button
                onClick={() => handleOpenEditPlan()}
                className="gap-1.5 shadow-xs font-semibold"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
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
                  <TableHead>Overage / Extra Calls</TableHead>
                  <TableHead>BYOK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No subscription plans found matching current filter. Click &quot;Create Plan&quot; to define one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((p) => (
                    <TableRow key={p.slug} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm">{p.name}</span>
                            {p.slug.startsWith('simple_') ? (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300">
                                ⚡ Simple Pack
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-300">
                                🛠️ Developer
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{p.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          {p.slug === 'enterprise' || p.price_usd === 0 ? (
                            <>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {p.slug === 'simple_trial' ? '₹0 (Free Trial)' : 'Custom Contract'}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {p.slug === 'simple_trial' ? 'Self-Service' : 'Org-level Pricing'}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-semibold">${p.price_usd} / {p.billing_interval}</span>
                              <span className="text-xs text-muted-foreground">₹{p.price_inr} / {p.billing_interval}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {(p.monthly_credits_usd ?? 0) > 0 ? (
                            <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                              ${p.monthly_credits_usd?.toFixed(0)} Credits
                            </Badge>
                          ) : p.slug === 'enterprise' ? (
                            <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200">
                              Custom Credits
                            </Badge>
                          ) : p.included_minutes > 0 ? (
                            <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                              {p.included_minutes.toLocaleString()} mins
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pay-per-sec</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {p.max_concurrent_calls} lines
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {p.max_agents >= 9999 ? 'Unlimited' : `${p.max_agents} agents`}
                      </TableCell>
                      <TableCell>
                        {p.slug === 'pay_as_you_go' ? (
                          <Badge variant="outline" className="text-[11px] text-muted-foreground font-normal">
                            Direct Wallet (Pay-per-sec)
                          </Badge>
                        ) : p.slug.startsWith('simple_') ? (
                          <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-200 font-normal">
                            Minute Quota Billing
                          </Badge>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                              Dynamic (Model Stack)
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Wallet overflow at active model rates
                            </span>
                          </div>
                        )}
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
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditPlan(p)}
                            className="h-8 w-8 p-0"
                            title="Edit Plan"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(p.slug, p.name)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete / Deactivate Plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Tier</span>
                    <p className="text-sm font-bold text-primary mt-0.5 truncate">{orgDetails.tier_name}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {orgDetails.effective_limits.custom_monthly_price_usd != null
                        ? `Custom: $${orgDetails.effective_limits.custom_monthly_price_usd}/mo`
                        : orgDetails.subscription_status}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Calling Credits</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${(orgDetails.effective_limits.plan_credits_remaining_usd ?? 0).toFixed(2)}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      of ${(orgDetails.effective_limits.plan_credits_monthly_usd ?? 0).toFixed(2)} monthly
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Concurrency</span>
                    <p className="text-sm font-bold mt-0.5">{orgDetails.effective_limits.max_concurrent_calls} Lines</p>
                    <span className="text-[10px] text-muted-foreground">Simultaneous Calls</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Phone Numbers</span>
                    <p className="text-sm font-bold mt-0.5">
                      {orgDetails.effective_limits.included_phone_numbers ?? 0} Free
                    </p>
                    <span className="text-[10px] text-muted-foreground">Extra: $2.50/mo</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Voice Agents</span>
                    <p className="text-sm font-bold mt-0.5">
                      {orgDetails.effective_limits.current_agents_count} / {orgDetails.effective_limits.max_agents}
                    </p>
                    <span className="text-[10px] text-muted-foreground">Active Workflows</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">BYOK Fee</span>
                    <p className="text-sm font-bold mt-0.5">
                      {((orgDetails.effective_limits.byok_platform_fee_per_minute_usd ?? 0.04) * 100).toFixed(0)}¢/min
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      BYOT: $0.00 tel
                    </span>
                  </div>
                </div>

                {/* Plan Assignment Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Assign Subscription Tier</Label>
                    <span className="text-xs text-muted-foreground">
                      Selected: <strong className="text-primary font-mono">{targetPlanSlug}</strong>
                    </span>
                  </div>

                  {/* Simple Minute Packs Group */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <Zap className="h-3.5 w-3.5" />
                      Simple Minute Packs (Business Client App)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {plans
                        .filter((p) => p.slug.startsWith('simple_'))
                        .map((p) => {
                          const isSelected = targetPlanSlug === p.slug;
                          return (
                            <button
                              key={p.slug}
                              type="button"
                              onClick={() => setTargetPlanSlug(p.slug)}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-600'
                                  : 'border-border hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">{p.name}</span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1">
                                {p.price_usd === 0 ? '₹0 Free' : `₹${p.price_inr} ($${p.price_usd})`} • {p.included_minutes} mins
                              </p>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Developer Tiers Group */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                      <Layers className="h-3.5 w-3.5" />
                      Developer Tiers (Advanced Dev Portal)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {plans
                        .filter((p) => !p.slug.startsWith('simple_'))
                        .map((p) => {
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
                                {p.slug === 'enterprise' ? 'Custom Contract' : `$${p.price_usd}/mo`} • {p.max_concurrent_calls} lines
                              </p>
                            </button>
                          );
                        })}
                    </div>
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

                  {/* Row 1: Enterprise Custom Contract Pricing & Credits */}
                  <div className="p-3.5 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Enterprise Contract Pricing &amp; Credits (Organization Level)
                      </span>
                      <span className="text-[10px] text-muted-foreground">Overrides public plan price</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="custom-monthly-price" className="text-xs font-medium">
                          Custom Monthly Price ($ USD / mo)
                        </Label>
                        <Input
                          id="custom-monthly-price"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 499.00"
                          value={customMonthlyPrice}
                          onChange={(e) => setCustomMonthlyPrice(e.target.value)}
                          className="text-sm bg-background"
                        />
                        <p className="text-[10px] text-muted-foreground">Organization custom contract fee</p>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="custom-monthly-credits" className="text-xs font-medium">
                          Monthly Plan Credits ($ USD / mo)
                        </Label>
                        <Input
                          id="custom-monthly-credits"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 550.00"
                          value={customMonthlyCredits}
                          onChange={(e) => setCustomMonthlyCredits(e.target.value)}
                          className="text-sm bg-background"
                        />
                        <p className="text-[10px] text-muted-foreground">Credited every billing cycle</p>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="custom-included-numbers" className="text-xs font-medium">
                          Included Platform Phone Numbers
                        </Label>
                        <Input
                          id="custom-included-numbers"
                          type="number"
                          placeholder="e.g. 5"
                          value={customIncludedPhoneNumbers}
                          onChange={(e) => setCustomIncludedPhoneNumbers(e.target.value)}
                          className="text-sm bg-background"
                        />
                        <p className="text-[10px] text-muted-foreground">Free before $2.50/mo rent</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Concurrency, Agents, BYOK Rate & Custom Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="custom-concurrency" className="text-xs">
                        Custom Concurrent Lines
                      </Label>
                      <Input
                        id="custom-concurrency"
                        type="number"
                        placeholder="Plan default"
                        value={customConcurrency}
                        onChange={(e) => setCustomConcurrency(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-agents" className="text-xs">
                        Custom Max Voice Agents
                      </Label>
                      <Input
                        id="custom-agents"
                        type="number"
                        placeholder="Plan default"
                        value={customMaxAgents}
                        onChange={(e) => setCustomMaxAgents(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-byok-fee" className="text-xs">
                        BYOK Platform Fee ($/min)
                      </Label>
                      <Input
                        id="custom-byok-fee"
                        type="number"
                        step="0.001"
                        placeholder="Default $0.04"
                        value={customByokFee}
                        onChange={(e) => setCustomByokFee(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-rate" className="text-xs">
                        Custom Call Rate ($/sec)
                      </Label>
                      <Input
                        id="custom-rate"
                        type="number"
                        step="0.0001"
                        placeholder="e.g. 0.0010"
                        value={customPriceSec}
                        onChange={(e) => setCustomPriceSec(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 3: Feature Permissions & Cycle Reset */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold">Allow BYOK</Label>
                        <p className="text-[10px] text-muted-foreground">Custom Model Keys</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant={customByok === true ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 text-[11px] px-2"
                          onClick={() => setCustomByok(customByok === true ? null : true)}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={customByok === false ? 'destructive' : 'outline'}
                          size="sm"
                          className="h-6 text-[11px] px-2"
                          onClick={() => setCustomByok(customByok === false ? null : false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold">Live Transfer &amp; SIP</Label>
                        <p className="text-[10px] text-muted-foreground">Warm transfer &amp; BYOT</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant={customLiveTransfer === true ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 text-[11px] px-2"
                          onClick={() => setCustomLiveTransfer(customLiveTransfer === true ? null : true)}
                        >
                          Transfer
                        </Button>
                        <Button
                          type="button"
                          variant={customSipTrunking === true ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 text-[11px] px-2"
                          onClick={() => setCustomSipTrunking(customSipTrunking === true ? null : true)}
                        >
                          SIP
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold">Reset Cycle Credits</Label>
                        <p className="text-[10px] text-muted-foreground">Refill plan credits immediately</p>
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
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center justify-between">
              <span>{isEditing ? `Edit Plan: ${planForm.name}` : 'Create Subscription Plan'}</span>
              <Badge variant={modalPlanCategory === 'simple' ? 'default' : 'secondary'} className={modalPlanCategory === 'simple' ? 'bg-emerald-600 hover:bg-emerald-600' : ''}>
                {modalPlanCategory === 'simple' ? '⚡ Simple Minute Pack' : '🛠️ Developer Tier'}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Updating configuration for plan '${planForm.slug}'. Changes take effect immediately across portals.`
                : 'Choose the plan type and configure calling limits, pricing, and features.'}
            </DialogDescription>
          </DialogHeader>

          {/* Category Switcher (only when creating new plan) */}
          {!isEditing && (
            <div className="space-y-2 pt-1 pb-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Plan Target &amp; Category
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('simple')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    modalPlanCategory === 'simple'
                      ? 'border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    <Zap className="h-4 w-4" />
                    Simple Minute Pack
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Published in <strong>Business Client Portal (web-app)</strong>. Fixed minute bundle, no BYOK, uses master platform telephony.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategorySwitch('developer')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    modalPlanCategory === 'developer'
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm text-primary">
                    <Layers className="h-4 w-4" />
                    Developer Tier
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Published in <strong>Developer Portal (frontend)</strong>. Supports BYOK custom keys, wallet credits, and API integrations.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Banner explaining target portal */}
          <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            modalPlanCategory === 'simple'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
              : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200'
          }`}>
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              {modalPlanCategory === 'simple' ? (
                <>
                  <strong>Business Client Application:</strong> This plan will be available for purchase and upgrade in the simplified calling dashboard (port 3001). Slug will start with <code className="font-mono font-bold">simple_</code>.
                </>
              ) : (
                <>
                  <strong>Advanced Developer Portal:</strong> This plan will be available in the developer console (port 3000) with LLM/Voice provider switching and BYOK support.
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSavePlan} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="plan-slug" className="text-xs font-semibold">
                  Plan Slug (Unique Key)
                </Label>
                <Input
                  id="plan-slug"
                  value={planForm.slug || ''}
                  onChange={(e) => {
                    let val = e.target.value.toLowerCase().replace(/\s+/g, '_');
                    if (modalPlanCategory === 'simple' && !val.startsWith('simple_')) {
                      // ensure simple_ prefix if typed
                      val = `simple_${val}`;
                    }
                    setPlanForm({ ...planForm, slug: val });
                  }}
                  placeholder={modalPlanCategory === 'simple' ? 'simple_starter_plus' : 'growth_pro_tier'}
                  disabled={isEditing}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-[10px] text-muted-foreground">
                  {modalPlanCategory === 'simple'
                    ? 'Simple plans must start with simple_ for auto-discovery in client app.'
                    : 'Developer plan identifier (e.g. starter, pro, enterprise).'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plan-name" className="text-xs font-semibold">Display Name</Label>
                <Input
                  id="plan-name"
                  value={planForm.name || ''}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder={modalPlanCategory === 'simple' ? 'Starter Minute Pack' : 'Growth Pro'}
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

            {/* Pricing Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price-usd" className="text-xs font-semibold">Price (USD $)</Label>
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

            {/* Quota & Limits Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="included-minutes" className="text-xs font-semibold">
                  Included Minutes
                </Label>
                <Input
                  id="included-minutes"
                  type="number"
                  value={planForm.included_minutes ?? 0}
                  onChange={(e) => setPlanForm({ ...planForm, included_minutes: parseInt(e.target.value, 10) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-concurrency" className="text-xs font-semibold">
                  Concurrent Lines
                </Label>
                <Input
                  id="max-concurrency"
                  type="number"
                  value={planForm.max_concurrent_calls ?? 2}
                  onChange={(e) => setPlanForm({ ...planForm, max_concurrent_calls: parseInt(e.target.value, 10) || 1 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-agents" className="text-xs font-semibold">
                  Max AI Agents
                </Label>
                <Input
                  id="max-agents"
                  type="number"
                  value={planForm.max_agents ?? 2}
                  onChange={(e) => setPlanForm({ ...planForm, max_agents: parseInt(e.target.value, 10) || 1 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone-numbers" className="text-xs font-semibold">
                  Free Numbers
                </Label>
                <Input
                  id="phone-numbers"
                  type="number"
                  value={planForm.included_phone_numbers ?? 0}
                  onChange={(e) => setPlanForm({ ...planForm, included_phone_numbers: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            {/* Overage and Platform Rates */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="overage-rate" className="text-xs font-semibold">
                  Overage ($/min)
                </Label>
                <Input
                  id="overage-rate"
                  type="number"
                  step="0.001"
                  disabled={planForm.slug === 'pay_as_you_go'}
                  value={planForm.slug === 'pay_as_you_go' ? 0 : (planForm.overage_rate_per_minute_usd ?? 0.08)}
                  onChange={(e) => setPlanForm({ ...planForm, overage_rate_per_minute_usd: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="byok-platform-fee" className="text-xs font-semibold">
                  BYOK Fee ($/min)
                </Label>
                <Input
                  id="byok-platform-fee"
                  type="number"
                  step="0.001"
                  value={planForm.byok_platform_fee_per_minute_usd ?? 0.03}
                  onChange={(e) => setPlanForm({ ...planForm, byok_platform_fee_per_minute_usd: parseFloat(e.target.value) || 0.03 })}
                  placeholder="0.03"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="monthly-credits" className="text-xs font-semibold">
                  Call Credits ($ USD)
                </Label>
                <Input
                  id="monthly-credits"
                  type="number"
                  step="1"
                  disabled={modalPlanCategory === 'simple'}
                  value={modalPlanCategory === 'simple' ? 0 : (planForm.monthly_credits_usd ?? 0)}
                  onChange={(e) => setPlanForm({ ...planForm, monthly_credits_usd: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Feature Switches */}
            <div className="grid grid-cols-3 gap-3 p-3 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-byok-switch" className="text-xs font-semibold cursor-pointer">
                  Allow BYOK Keys
                </Label>
                <Switch
                  id="allow-byok-switch"
                  checked={planForm.allow_byok ?? false}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, allow_byok: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow-transfer-switch" className="text-xs font-semibold cursor-pointer">
                  Live Call Transfers
                </Label>
                <Switch
                  id="allow-transfer-switch"
                  checked={planForm.allow_live_transfer ?? true}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, allow_live_transfer: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow-sip-switch" className="text-xs font-semibold cursor-pointer">
                  SIP Trunking
                </Label>
                <Switch
                  id="allow-sip-switch"
                  checked={planForm.allow_sip_trunking ?? false}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, allow_sip_trunking: checked })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="features-text" className="text-xs font-semibold">
                Marketing Feature Bullets (one bullet per line)
              </Label>
              <Textarea
                id="features-text"
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="500 Calling Minutes per month&#10;3 Simultaneous Concurrent Lines&#10;1 Dedicated Phone Number"
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
                <Label htmlFor="is-active" className="text-xs cursor-pointer font-medium">Active Plan</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is-public"
                  checked={planForm.is_public ?? true}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, is_public: checked })}
                />
                <Label htmlFor="is-public" className="text-xs cursor-pointer font-medium">Public in Billing Pages</Label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setPlanModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingPlan} className="bg-primary hover:bg-primary/90 font-semibold">
                {savingPlan ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
