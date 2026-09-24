'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Layers,
  Zap,
  PhoneCall,
  Bot,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Calendar,
  Check,
  HelpCircle,
  Wallet,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
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
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface CurrentSubscription {
  tier: string;
  tier_name: string;
  subscription_status: string;
  max_concurrent_calls: number;
  max_agents: number;
  current_agents_count: number;
  included_minutes: number;
  monthly_minutes_used: number;
  minutes_remaining: number;
  is_unlimited_minutes: boolean;
  overage_rate_per_minute_usd: number;
  allow_byok: boolean;
  wallet_balance_usd: number;
  plan_credits_monthly_usd?: number;
  plan_credits_remaining_usd?: number;
  included_phone_numbers?: number;
  byok_platform_fee_per_minute_usd?: number;
  allow_live_transfer?: boolean;
  allow_sip_trunking?: boolean;
  custom_monthly_price_usd?: number | null;
  billing_cycle_start: string | null;
  billing_cycle_end: string | null;
}

interface AvailablePlan {
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
  features: string[] | string;
}

function parsePlanFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.map(String);
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return features.split('\n').map((f) => f.trim()).filter(Boolean);
    }
  }
  return [];
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface SubscriptionData {
  current_subscription: CurrentSubscription;
  available_plans: AvailablePlan[];
}

interface SubscriptionPlanSectionProps {
  onSubscriptionUpdated?: () => void;
}

export function SubscriptionPlanSection({ onSubscriptionUpdated }: SubscriptionPlanSectionProps) {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<AvailablePlan | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'razorpay'>('wallet');

  const { getAccessToken, user } = useAuth();

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/organizations/subscription?category=developer', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load subscription data:', err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handlePlanClick = (plan: AvailablePlan) => {
    if (data?.current_subscription.tier === plan.slug) return;
    if (plan.slug === 'enterprise') {
      toast.info('Enterprise Custom Plans', {
        description:
          'Please contact support@dograh.com or your account executive for dedicated SIP trunking, SLA, and custom concurrency allocations.',
      });
      return;
    }
    const currentBal = data?.current_subscription.wallet_balance_usd ?? 0;
    if (plan.price_usd > 0 && currentBal < plan.price_usd) {
      setPaymentMethod('razorpay');
    } else {
      setPaymentMethod('wallet');
    }
    setSelectedPlanForUpgrade(plan);
    setConfirmModalOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlanForUpgrade) return;
    const isFree = selectedPlanForUpgrade.price_usd === 0 || selectedPlanForUpgrade.slug === 'pay_as_you_go';

    try {
      setUpgrading(true);
      const token = await getAccessToken();

      if (isFree || paymentMethod === 'wallet') {
        const res = await fetch('/api/v1/organizations/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            plan_slug: selectedPlanForUpgrade.slug,
            payment_method: 'wallet',
          }),
        });

        if (res.ok) {
          const resData = await res.json();
          toast.success(resData.message || `Switched to ${selectedPlanForUpgrade.name}!`);
          setConfirmModalOpen(false);
          fetchSubscription();
          if (onSubscriptionUpdated) {
            onSubscriptionUpdated();
          }
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.detail || 'Failed to switch subscription plan');
        }
      } else {
        // Razorpay direct checkout
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Failed to load Razorpay payment SDK. Please check your connection.');
          setUpgrading(false);
          return;
        }

        const orderRes = await fetch('/api/v1/organizations/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            plan_slug: selectedPlanForUpgrade.slug,
            payment_method: 'razorpay',
          }),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json().catch(() => ({}));
          const errMsg =
            typeof err.detail === 'string'
              ? err.detail
              : Array.isArray(err.detail)
              ? err.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ')
              : 'Failed to create payment order';
          toast.error(errMsg);
          setUpgrading(false);
          return;
        }

        const orderData = await orderRes.json();
        if (orderData.status !== 'payment_required') {
          toast.success(orderData.message || `Upgraded to ${selectedPlanForUpgrade.name}!`);
          setConfirmModalOpen(false);
          fetchSubscription();
          if (onSubscriptionUpdated) onSubscriptionUpdated();
          return;
        }

        const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : '';
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'CallioAI',
          image: logoUrl,
          description: `Subscription: ${selectedPlanForUpgrade.name}`,
          order_id: orderData.order_id,
          prefill: {
            name: (user as any)?.name || '',
            email: (user as any)?.primaryEmail || (user as any)?.email || '',
          },
          notes: {
            platform: 'CallioAI',
            plan_slug: selectedPlanForUpgrade.slug,
            receipt: orderData.receipt,
          },
          theme: { color: '#6366f1' },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch('/api/v1/organizations/subscription/upgrade/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  plan_slug: selectedPlanForUpgrade.slug,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                const verifyData = await verifyRes.json();
                toast.success(verifyData.message || `Payment verified! Welcome to ${selectedPlanForUpgrade.name}!`);
                setConfirmModalOpen(false);
                fetchSubscription();
                if (onSubscriptionUpdated) onSubscriptionUpdated();
              } else {
                const verifyErr = await verifyRes.json().catch(() => ({}));
                toast.error(verifyErr.detail || 'Payment verification failed');
              }
            } catch (err) {
              console.error(err);
              toast.error('Error verifying payment');
            }
          },
          modal: {
            ondismiss: () => {
              toast.info('Plan upgrade payment was cancelled.');
              setUpgrading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while switching plan');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-8 flex items-center justify-center space-x-2 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading subscription plans and quotas...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const current = data.current_subscription;
  const plans = data.available_plans;

  // Usage percentage calculation
  const totalMins = current.included_minutes;
  const usedMins = current.monthly_minutes_used;
  const remainingMins = Math.max(0, current.minutes_remaining);
  const minutesPct = totalMins > 0 ? Math.min(100, Math.round((usedMins / totalMins) * 100)) : 0;

  return (
    <div className="space-y-8">
      {/* Active Subscription & Quota Card */}
      <Card className="border-primary/20 bg-card shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight">{current.tier_name}</h3>
                  <Badge
                    variant="outline"
                    className="capitalize font-semibold text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200"
                  >
                    {current.subscription_status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current active subscription tier &amp; live concurrency allocations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-mono">
                Line Concurrency: {current.max_concurrent_calls} Lines
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono">
                Agents: {current.current_agents_count} / {current.max_agents >= 9999 ? '∞' : current.max_agents} Active
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Plan Quotas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Credits Progress */}
            <div className="p-4 rounded-xl border bg-background space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-emerald-500" />
                  Monthly Plan Credits
                </span>
                {(current.plan_credits_monthly_usd || 0) > 0 ? (
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${(current.plan_credits_remaining_usd ?? current.plan_credits_monthly_usd ?? 0).toFixed(2)} USD left
                  </span>
                ) : (
                  <Badge variant="outline" className="text-[11px]">Pay-As-You-Go</Badge>
                )}
              </div>

              {(current.plan_credits_monthly_usd || 0) > 0 ? (
                <>
                  {(() => {
                    const monthly = current.plan_credits_monthly_usd || 1;
                    const remaining = current.plan_credits_remaining_usd ?? monthly;
                    const used = Math.max(0, monthly - remaining);
                    const pct = Math.min(100, Math.round((used / monthly) * 100));
                    const approxMins = Math.round(remaining / 0.12);
                    return (
                      <>
                        <Progress value={pct} className="h-2" />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>${used.toFixed(2)} used ({pct}%)</span>
                          <span>${monthly.toFixed(2)} included</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between pt-0.5">
                          <span>~{approxMins.toLocaleString()} standard mins remaining</span>
                          {remaining <= 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">Overflown to Wallet</span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Platform Wallet:</span>
                    <span className="font-mono font-bold text-foreground">
                      ${(current.wallet_balance_usd || 0).toFixed(2)} USD
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calls billed per second from platform wallet balance. Recharge as needed.
                  </p>
                </div>
              )}
            </div>

            {/* Concurrent Call Lines & Numbers */}
            <div className="p-4 rounded-xl border bg-background space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-blue-500" />
                  Lines &amp; Numbers
                </span>
                <span className="font-mono font-bold text-foreground">
                  {current.max_concurrent_calls} Lines / {current.included_phone_numbers || 0} No.
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maximum concurrent calling capacity and included dedicated platform phone numbers.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {current.included_phone_numbers || 0} Free Numbers Included
                </Badge>
                {current.allow_live_transfer && (
                  <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-500/20 bg-blue-500/10">
                    Live Transfer
                  </Badge>
                )}
              </div>
            </div>

            {/* AI Agents & BYOK */}
            <div className="p-4 rounded-xl border bg-background space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-indigo-500" />
                  Voice Agents &amp; BYOK
                </span>
                <span className="font-mono font-bold text-foreground">
                  {current.current_agents_count} / {current.max_agents >= 9999 ? 'Unlimited' : current.max_agents}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {current.allow_byok ? (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> BYOK Allowed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Managed Keys Only
                  </Badge>
                )}
                {current.allow_sip_trunking && (
                  <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/20 bg-purple-500/10">
                    SIP Trunking
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                Wallet balance: {(current.wallet_balance_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans Comparison & Upgrade Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Upgrade or Switch Your Plan
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Unified credit-based plans in Indian Rupees (₹). Deducts per-second based on your exact AI model stack and carrier.
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {plans.map((plan) => {
            const isCurrent = current.tier === plan.slug;
            const isEnterprise = plan.slug === 'enterprise';
            const price = plan.price_inr === 0 ? '₹0' : `₹${plan.price_inr.toLocaleString()}`;
            const isUnlimitedCredits = plan.monthly_credits_usd === -1 || (plan.monthly_credits_usd || 0) >= 999999;
            const isUnlimitedAgents = plan.max_agents === -1 || plan.max_agents >= 9999;

            return (
              <Card
                key={plan.slug}
                style={{ overflow: 'visible' }}
                className={`relative flex flex-col justify-between transition-all rounded-2xl border overflow-visible ${
                  isCurrent
                    ? 'border-primary shadow-md ring-2 ring-primary/20 bg-primary/[0.02]'
                    : isEnterprise
                    ? 'border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.03] to-transparent hover:border-indigo-500/70 shadow-xs'
                    : 'border-border/70 hover:border-border shadow-xs'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap pointer-events-none">
                    <Badge className="bg-primary text-primary-foreground text-[11px] font-bold px-3.5 py-1 shadow-md border border-primary-foreground/20 tracking-wide uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Current Active Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pt-7">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30 bg-primary/10">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs min-h-[34px] leading-relaxed mt-1">
                    {plan.description}
                  </CardDescription>

                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
                        {isEnterprise ? 'Custom' : price}
                      </span>
                      {!isEnterprise && (
                        <span className="text-xs text-muted-foreground font-medium">
                          / {plan.billing_interval}
                        </span>
                      )}
                    </div>
                    {isEnterprise ? (
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                        Custom contract configured per organization
                      </p>
                    ) : isUnlimitedCredits ? (
                      <div className="mt-1">
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                          Unlimited (∞) Calling Credits Included
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Enterprise high-throughput calling
                        </p>
                      </div>
                    ) : (plan.monthly_credits_usd || 0) > 0 ? (
                      <div className="mt-1">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {plan.monthly_credits_usd?.toLocaleString()} Cr Included
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Refills automatically every cycle
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay-per-second from wallet
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-xs border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Concurrency:</span>
                      <span className="font-semibold font-mono">{plan.max_concurrent_calls} lines</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone Numbers:</span>
                      <span className="font-semibold font-mono">
                        {plan.included_phone_numbers ? `${plan.included_phone_numbers} Included` : 'Extra'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Agents:</span>
                      <span className="font-semibold font-mono">
                        {isUnlimitedAgents ? 'Unlimited (∞)' : `${plan.max_agents} agents`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">BYOK Keys:</span>
                      <span className="font-semibold font-mono">
                        {plan.allow_byok ? 'Allowed' : 'Master Only'}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const featuresList = parsePlanFeatures(plan.features);
                    if (featuresList.length === 0) return null;
                    return (
                      <div className="space-y-2 border-t pt-3">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Included Features
                        </span>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {featuresList.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-tight">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </CardContent>

                <CardFooter className="pt-4 border-t">
                  {isCurrent ? (
                    <Button variant="outline" disabled className="w-full text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-500" />
                      Active Plan
                    </Button>
                  ) : isEnterprise ? (
                    <Button
                      onClick={() => handlePlanClick(plan)}
                      className="w-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Contact Enterprise Sales
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePlanClick(plan)}
                      className="w-full text-xs font-semibold"
                    >
                      Switch to {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Interactive Model Stack & Minute Estimator Card */}
        <div className="mt-8 p-5 rounded-2xl border bg-muted/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                How Do Included Credits Convert into Calling Minutes?
              </h4>
              <p className="text-xs text-muted-foreground">
                Your credits deduct dynamically per second. Choosing cost-effective AI models yields far more calling minutes:
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
              Per-Second Deduction
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl border bg-background space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-emerald-600">Ultra-Light Stack</span>
                <span className="font-mono text-muted-foreground">~$0.06/min</span>
              </div>
              <p className="text-[11px] text-muted-foreground">GPT-4o-mini + Deepgram + Cartesia</p>
              <div className="pt-1 font-mono font-bold text-foreground">
                Starter ($49) = <span className="text-emerald-600">~816 Mins</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border bg-background space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-blue-600">Standard Platform</span>
                <span className="font-mono text-muted-foreground">~$0.12/min</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Claude-3.5-Haiku + Deepgram + ElevenLabs</p>
              <div className="pt-1 font-mono font-bold text-foreground">
                Starter ($49) = <span className="text-blue-600">~408 Mins</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border bg-background space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-purple-600">Premium Conversational</span>
                <span className="font-mono text-muted-foreground">~$0.22/min</span>
              </div>
              <p className="text-[11px] text-muted-foreground">GPT-4o / Claude Sonnet + Custom Voice</p>
              <div className="pt-1 font-mono font-bold text-foreground">
                Starter ($49) = <span className="text-purple-600">~222 Mins</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border bg-background space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-indigo-600">BYOK (Own Keys)</span>
                <span className="font-mono text-muted-foreground">$0.04/min fee</span>
              </div>
              <p className="text-[11px] text-muted-foreground">You pay model providers directly</p>
              <div className="pt-1 font-mono font-bold text-foreground">
                Starter ($49) = <span className="text-indigo-600">~1,225 Mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Switch Confirmation Dialog */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedPlanForUpgrade?.price_usd === 0 ? 'Switch Plan' : 'Subscribe to'} {selectedPlanForUpgrade?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPlanForUpgrade?.price_usd === 0
                ? 'Your organization will switch to the Pay-As-You-Go plan.'
                : 'Complete payment to activate your monthly included minutes and plan limits.'}
            </DialogDescription>
          </DialogHeader>

          {selectedPlanForUpgrade && (() => {
            const plan = selectedPlanForUpgrade;
            const currentBal = data?.current_subscription.wallet_balance_usd ?? 0;
            const canPayFromWallet = currentBal >= plan.price_usd;

            return (
              <div className="space-y-4 py-2 text-sm">
                <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Plan Price:</span>
                    <span className="font-bold font-mono text-foreground">
                      ${plan.price_usd} USD / month (₹{plan.price_inr})
                    </span>
                  </div>
                  {plan.monthly_credits_usd ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included Calling Credits:</span>
                      <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                        ${plan.monthly_credits_usd}.00 USD (~{Math.round(plan.monthly_credits_usd / 0.12)} mins)
                      </span>
                    </div>
                  ) : plan.included_minutes > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included Calling Minutes:</span>
                      <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                        {plan.included_minutes.toLocaleString()} mins
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concurrent Lines:</span>
                    <span className="font-semibold font-mono">{plan.max_concurrent_calls} simultaneous lines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Numbers:</span>
                    <span className="font-semibold font-mono">
                      {plan.included_phone_numbers ? `${plan.included_phone_numbers} Included` : 'Extra ($2.50/mo)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Voice Agents:</span>
                    <span className="font-semibold font-mono">{plan.max_agents} agents</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BYOK Platform Fee:</span>
                    <span className="font-semibold font-mono">${(plan.byok_platform_fee_per_minute_usd || 0.04).toFixed(2)}/min</span>
                  </div>
                </div>

                {/* Payment Method Selector for Paid Plans */}
                {plan.price_usd > 0 && (
                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Select Payment Method
                    </Label>

                    {/* Option A: Wallet */}
                    <div
                      onClick={() => {
                        if (canPayFromWallet) setPaymentMethod('wallet');
                      }}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                        !canPayFromWallet
                          ? 'opacity-60 bg-muted/20 border-dashed cursor-not-allowed'
                          : paymentMethod === 'wallet'
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-xs cursor-pointer'
                          : 'border-border/60 hover:border-border cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'wallet' && canPayFromWallet ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          <Wallet className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                            Pay with Platform Wallet
                            {canPayFromWallet && (
                              <Badge variant="outline" className="text-[10px] h-4 text-emerald-500 border-emerald-500/30">
                                Available
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Balance: ${currentBal.toFixed(2)} USD
                            {!canPayFromWallet && ` (Short by $${(plan.price_usd - currentBal).toFixed(2)})`}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'wallet' && canPayFromWallet ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'wallet' && canPayFromWallet && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    {/* Option B: Razorpay */}
                    <div
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-xs'
                          : 'border-border/60 hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'razorpay' ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            Razorpay Checkout (UPI, Cards, Netbanking)
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Direct payment: ₹{plan.price_inr} + 18% GST
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'razorpay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                )}

                {plan.price_usd === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Your existing wallet balance remains intact. You will be billed pay-as-you-go from your wallet.
                  </p>
                )}
              </div>
            );
          })()}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpgrade}
              disabled={upgrading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : selectedPlanForUpgrade?.price_usd === 0 ? (
                'Switch to Pay-As-You-Go (Free)'
              ) : paymentMethod === 'wallet' ? (
                `Pay $${selectedPlanForUpgrade?.price_usd} & Upgrade`
              ) : (
                `Proceed to Pay ₹${selectedPlanForUpgrade?.price_inr}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
