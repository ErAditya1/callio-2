"use client";

import {
  Activity,
  ArrowRight,
  Banknote,
  CheckCircle2,
  DollarSign,
  Inbox,
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
      title: "Inbound Enquiries & Strategy Calls",
      description: "Manage 'Done-for-you' voice agent build requests and enterprise strategy calls",
      href: "/superadmin/leads",
      icon: Inbox,
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      badge: "Leads & Bookings",
    },
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${metrics ? (metrics.total_wallet_balance_usd ?? 0).toFixed(2) : "0.00"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Pre-funded balance across all customer accounts
            </p>
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
          </div>
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
        </div>
      </div>

      {/* Embedded Impersonation Quick Section */}
      <div className="pt-2">
        <SuperadminImpersonationManager />
      </div>
    </div>
  );
}
