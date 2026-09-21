"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity,
  ArrowRight,
  Banknote,
  CheckCircle2,
  DollarSign,
  Key,
  Layers,
  List,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
ArrowRight01Icon,
  Dollar01Icon,
  Key01Icon,
  ListIcon,
  Loading02Icon,
  PhoneIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons";;
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { SuperadminImpersonationManager } from "@/components/superadmin/SuperadminImpersonationManager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

interface FleetMetrics {
  total_organizations?: number;
  total_wallet_balance_usd?: number;
  fleet_active_calls?: number;
  active_paid_subscriptions?: number;
  plans_breakdown?: Record<string, number>;
}

export default function SuperadminOverviewPage() {
  const { getAccessToken } = useAuth();
  const [metrics, setMetrics] = useState<FleetMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/superuser/overview-metrics", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error("Failed to load fleet metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const navTiles = [
    {
      title: "Master API Keys",
      description: "Manage LLM, STT, and TTS provider master credentials & rates",
      href: "/superadmin/keys",
      icon: Key,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      badge: "Platform BYOK & Master",
    },
    {
      title: "Telephony Inventory",
      description: "Stock phone numbers, carrier pools, and manage DID assignment",
      href: "/superadmin/telephony",
      icon: Phone,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      badge: "Twilio / Telnyx / Vonage",
    },
    {
      title: "Customer Wallets",
      description: "Audit customer credit balances and issue manual top-up adjustments",
      href: "/superadmin/wallets",
      icon: DollarSign,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      badge: "Ledger & Grants",
    },
    {
      title: "Plans & Enterprise Tiers",
      description: "Configure tier quotas, included minutes, and custom overrides",
      href: "/superadmin/plans",
      icon: Layers,
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      badge: "SaaS Tiers",
    },
    {
      title: "Currency & Tax Rates",
      description: "Live USD to INR conversion rate and GST percentage settings",
      href: "/superadmin/rates",
      icon: Banknote,
      iconColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      badge: "INR / GST",
    },
    {
      title: "Showcase Agents",
      description: "Curate and promote public voice agents on the demo directory",
      href: "/superadmin/showcase",
      icon: Sparkles,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      badge: "Public Catalog",
    },
    {
      title: "Global Run Logs",
      description: "Live platform-wide stream of all voice call workflows and transcripts",
      href: "/superadmin/runs",
      icon: List,
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      badge: "Audit & Tracing",
    },
    {
      title: "Account Impersonation",
      description: "Directly open and test any customer workspace environment",
      href: "/superadmin/impersonation",
      icon: UserCheck,
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      badge: "Tenant Support",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-background to-purple-950/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Operations Command Center
              </h1>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                LIVE
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Global management hub for Dograh / Callio AI. Control master API keys, carrier number pools,
              customer wallet balances, SaaS tier entitlements, and platform-wide telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMetrics}
              disabled={loading}
              className="h-9 gap-2 text-xs border-border/70"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/superadmin/runs">
              <Button size="sm" className="h-9 gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs">
                <List className="h-3.5 w-3.5" />
                Global Call Logs
              </Button>
            </Link>
          </div>
  const handleProviderImpersonate = async (e: React.FormEvent) => {
            e.preventDefault();
          await handleImpersonate("provider", providerUserId);
  };

  const handleEmailImpersonate = async (e: React.FormEvent) => {
            e.preventDefault();
          await handleImpersonate("email", email);
  };

          if (checkingSuperuser) {
    return (
          <div className="app-page flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2 text-[#737373]">
              <HugeiconsIcon icon={Loading02Icon} className="h-6 w-6 animate-spin" />
              <span>Verifying administrator credentials...</span>
            </div>

            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* KPI Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fleet Concurrency
                </CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metrics ? metrics.fleet_active_calls ?? 0 : "—"}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live simultaneous calls in progress
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Organizations
                </CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metrics ? metrics.total_organizations ?? 0 : "—"}
                  );
  }

                  if (!isSuperuser) {
    return (
                  <div className="flex min-h-[75vh] w-full items-center justify-center p-4">
                    <Card className="max-w-md border-[#E5E5E5] shadow-2xl bg-[#FFFFFF]">
                      <CardHeader className="text-center pb-3">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
                          <HugeiconsIcon icon={ShieldAlertIcon} className="h-7 w-7" />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Registered customer tenant accounts
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Total Wallet Balance
                        </CardTitle>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <CardDescription className="text-sm text-[#737373] pt-1">
                          Superadmin privileges are required to view the administrative portal.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                          ${metrics ? (metrics.total_wallet_balance_usd ?? 0).toFixed(2) : "0.00"}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Pre-funded balance across all customer accounts
                        </p>
                        <CardContent className="text-center text-xs text-[#737373] leading-relaxed px-6 pb-6">
                          Your account does not have superuser privileges. Please return to
                          your workspace overview.
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Paid Subscriptions
                        </CardTitle>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <Layers className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                          {metrics ? metrics.active_paid_subscriptions ?? 0 : "—"}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Active Starter, Pro, or Enterprise organizations
                        </p>
                      </CardContent>
                      <div className="p-6 pt-0 flex flex-col gap-2">
                        <Button
                          asChild
                          className="w-full bg-neutral-950 hover:bg-neutral-800 text-white"
                        >
                          <Link href="/dashboard/overview">Return to Workspace Overview</Link>
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Launch Navigation Tiles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">
                          Administrative Control Centers
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Jump directly to any administrative subsystem via the sidebar or below.
                        </p>
                        );
  }

                        return (
                        <main className="app-page space-y-6">
                          {/* Top Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0F3F9] text-[#7186AD] border border-[#DCE3EF]">
                                  <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4" />
                                </span>
                                <h1 className="text-2xl font-bold tracking-tight">Platform Operations Center</h1>
                                <Badge variant="outline" className="bg-[#F0F3F9] text-[#7186AD] dark:text-[#7186AD] border-[#DCE3EF] text-xs">
                                  Superadmin Mode
                                </Badge>
                              </div>
                              <p className="text-sm text-[#737373]">
                                Configure platform master API keys, stock telephony numbers, grant customer credits, and monitor system operations.
                              </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              {navTiles.map((tile) => {
                                const Icon = tile.icon;
                                return (
                                  <Link key={tile.href} href={tile.href} className="group block">
                                    <Card className="h-full border-border/60 bg-card/50 hover:bg-card/90 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md hover:-translate-y-0.5">
                                      <CardHeader className="p-5 pb-3">
                                        <div className="flex items-center justify-between mb-3">
                                          <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tile.iconColor}`}
                                          >
                                            <Icon className="h-4.5 w-4.5" />
                                          </div>
                                          <Badge variant="outline" className="text-[10px] py-0 px-2 border-border/60 text-muted-foreground">
                                            {tile.badge}
                                          </Badge>
                                        </div>
                                        <CardTitle className="text-sm font-semibold group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                                          {tile.title}
                                          <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400" />
                                        </CardTitle>
                                        <CardDescription className="text-xs line-clamp-2 mt-1 leading-relaxed">
                                          {tile.description}
                                        </CardDescription>
                                      </CardHeader>
                                    </Card>
                                  </Link>
                                );
                              })}
                              <div className="flex items-center gap-3">
                                <Link href="/superadmin/runs">
                                  <Button variant="outline" size="sm" className="h-9 gap-2">
                                    <HugeiconsIcon icon={ListIcon} className="h-4 w-4" />
                                    Global Run Logs
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </div>
                            </div>

                            {/* Embedded Impersonation Quick Section */}
                            <div className="pt-2">
                              <SuperadminImpersonationManager />
                            </div>
                          </div>
                          {/* Main Tabbed Operations Dashboard */}
                          <Tabs defaultValue="keys" className="space-y-6">
                            <TabsList className="bg-[#F7F7F7] p-1 border h-11 w-full sm:w-auto flex-wrap justify-start">
                              <TabsTrigger value="keys" className="gap-2 text-xs sm:text-sm">
                                <HugeiconsIcon icon={Key01Icon} className="h-4 w-4 text-[#7186AD]" />
                                Master API Keys &amp; Pricing
                              </TabsTrigger>
                              <TabsTrigger value="telephony" className="gap-2 text-xs sm:text-sm">
                                <HugeiconsIcon icon={PhoneIcon} className="h-4 w-4 text-[#7186AD]" />
                                Telephony Inventory
                              </TabsTrigger>
                              <TabsTrigger value="wallets" className="gap-2 text-xs sm:text-sm">
                                <HugeiconsIcon icon={Dollar01Icon} className="h-4 w-4 text-amber-500" />
                                Customer Wallets &amp; Credits
                              </TabsTrigger>
                              <TabsTrigger value="showcase" className="gap-2 text-xs sm:text-sm">
                                <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-[#7186AD]" />
                                Public Showcase Agents
                              </TabsTrigger>
                              <TabsTrigger value="ops" className="gap-2 text-xs sm:text-sm">
                                <HugeiconsIcon icon={UsersIcon} className="h-4 w-4 text-[#7186AD]" />
                                Account Impersonation
                              </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Master Keys */}
                            <TabsContent value="keys" className="space-y-4">
                              <SuperadminMasterKeysManager />
                            </TabsContent>

                            {/* Tab 2: Telephony Inventory */}
                            <TabsContent value="telephony" className="space-y-4">
                              <SuperadminTelephonyInventoryManager />
                            </TabsContent>

                            {/* Tab 3: Customer Wallets & Credit Grants */}
                            <TabsContent value="wallets" className="space-y-4">
                              <SuperadminWalletManager />
                            </TabsContent>

                            {/* Tab 4: Showcase Agents */}
                            <TabsContent value="showcase" className="space-y-4">
                              <SuperadminShowcaseManager />
                            </TabsContent>

                            {/* Tab 5: Account Impersonation & Tools */}
                            <TabsContent value="ops" className="space-y-6">
                              <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Provider User ID</CardTitle>
                                    <CardDescription>
                                      Impersonate with the Stack provider user ID
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <form onSubmit={handleProviderImpersonate} className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="providerUserId">Provider User ID</Label>
                                        <Input
                                          id="providerUserId"
                                          value={providerUserId}
                                          onChange={(e) => setProviderUserId(e.target.value)}
                                          placeholder="Provider user ID"
                                          required
                                        />
                                      </div>

                                      {error?.target === "provider" && (
                                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                          {error.message}
                                        </div>
                                      )}

                                      <Button
                                        type="submit"
                                        disabled={loadingTarget !== null}
                                        className="w-full"
                                      >
                                        {loadingTarget === "provider" ? (
                                          <>
                                            <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                          </>
                                        ) : (
                                          "Impersonate by Provider ID"
                                        )}
                                      </Button>
                                    </form>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Email Address</CardTitle>
                                    <CardDescription>
                                      Impersonate with a primary email address
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <form onSubmit={handleEmailImpersonate} className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          placeholder="user@example.com"
                                          required
                                        />
                                      </div>

                                      {error?.target === "email" && (
                                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                          {error.message}
                                        </div>
                                      )}

                                      <Button
                                        type="submit"
                                        disabled={loadingTarget !== null}
                                        className="w-full"
                                      >
                                        {loadingTarget === "email" ? (
                                          <>
                                            <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                          </>
                                        ) : (
                                          "Impersonate by Email"
                                        )}
                                      </Button>
                                    </form>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </main>
                        );
}
