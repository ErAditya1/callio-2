"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  AudioWaveform,
  Bot,
  CheckCircle2,
  ChevronRight,
  Headphones,
  KeyRound,
  PhoneCall,
  Plus,
  Radio,
  Settings2,
  Sliders,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RechargeWalletModal } from "@/components/billing/RechargeWalletModal";
import { useAuth } from "@/lib/auth";
import { useOrgConfig } from "@/context/OrgConfigContext";
import type { WorkflowListResponse, TelephonyConfigurationListItem } from "@/client/types.gen";

interface SubscriptionInfo {
  tier_name: string;
  tier: string;
  subscription_status?: string;
  minutes_remaining: number;
  included_minutes: number;
  monthly_minutes_used: number;
  max_agents: number;
  max_concurrent_calls: number;
  wallet_balance_usd: number;
}

export default function OverviewPage() {
  const { user, getAccessToken } = useAuth();
  const { orgContext, refreshConfig } = useOrgConfig();
  const userName = user?.displayName?.split(" ")[0] || "Operator";

  // Data states
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<WorkflowListResponse[]>([]);
  const [telephonyConfigs, setTelephonyConfigs] = useState<TelephonyConfigurationListItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // 1. Fetch Workflows
      const wfPromise = fetch("/api/v1/workflow/fetch?status=active,archived", { headers })
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []);

      // 2. Fetch Telephony Configs
      const telPromise = fetch("/api/v1/organizations/telephony-configs", { headers })
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []);

      // 3. Fetch Subscription & Quotas
      const subPromise = fetch("/api/v1/organizations/subscription", { headers })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const [wfData, telData, subData] = await Promise.all([wfPromise, telPromise, subPromise]);

      setWorkflows(Array.isArray(wfData) ? wfData : []);
      setTelephonyConfigs(Array.isArray(telData) ? telData : []);
      if (subData?.current_subscription) {
        setSubscription(subData.current_subscription);
      }
    } catch (err) {
      console.error("Failed to load overview telemetry:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived metrics
  const activeWorkflows = workflows.filter((w) => w.status === "active");
  const walletBalance =
    subscription?.wallet_balance_usd ??
    (orgContext as any)?.wallet_balance_usd ??
    0.0;

  const isWalletLow = walletBalance < 5.0 && walletBalance > 0;
  const isWalletZero = walletBalance <= 0;

  const minutesUsed = subscription?.monthly_minutes_used ?? 0;
  const includedMinutes = subscription?.included_minutes ?? 60;
  const minutesPercent = includedMinutes > 0 ? Math.min(100, Math.round((minutesUsed / includedMinutes) * 100)) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* 1. Sleek Command Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-500 tracking-wider uppercase">
              Rumik Voice Core • Operational
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[11px] text-muted-foreground font-mono">~280ms Latency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your centralized control room for voice agents, telephone lines, and live call operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 h-9 text-xs font-semibold shadow-sm transition-all"
          >
            <Link href="/workflow">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Voice Agent
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => setRechargeModalOpen(true)}
            className="rounded-lg px-3.5 h-9 text-xs font-medium border-border/70 hover:bg-accent transition-all"
          >
            <Wallet className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            Top Up
          </Button>
        </div>
      </div>

      {/* 2. Key Telemetry Metrics (4 High-Signal Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Voice Agents */}
        <Link
          href="/workflow"
          className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-indigo-500/40 transition-all block shadow-xs"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Voice Agents</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {activeWorkflows.length}
              </span>
              <span className="text-xs text-muted-foreground">
                active {subscription?.max_agents ? `/ ${subscription.max_agents} allowed` : ""}
              </span>
            </div>
          )}
          <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
            <span>{workflows.length} total created</span>
            <span className="text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-medium">
              Studio <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Metric 2: Telephony & Trunks */}
        <Link
          href="/telephony-configurations"
          className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-emerald-500/40 transition-all block shadow-xs"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Phone Lines</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {telephonyConfigs.length}
              </span>
              <span className="text-xs text-muted-foreground">connected trunks</span>
            </div>
          )}
          <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
            <span>SIP / Twilio / Telnyx</span>
            <span className="text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-medium">
              Manage <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Metric 3: Wallet Balance */}
        <div className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Call Balance</span>
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isWalletZero
                    ? "bg-rose-500/10 text-rose-400"
                    : isWalletLow
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-28 my-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold tracking-tight ${
                    isWalletZero
                      ? "text-rose-400"
                      : isWalletLow
                      ? "text-amber-400"
                      : "text-foreground"
                  }`}
                >
                  ${walletBalance.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
            <span className={isWalletZero ? "text-rose-400 font-medium" : ""}>
              {isWalletZero ? "Recharge required" : isWalletLow ? "Balance running low" : "Active balance"}
            </span>
            <button
              onClick={() => setRechargeModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
            >
              + Top up
            </button>
          </div>
        </div>

        {/* Metric 4: Subscription Plan & Minutes */}
        <Link
          href="/billing"
          className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-violet-500/40 transition-all block shadow-xs"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Plan & Minutes</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-28 my-1" />
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground truncate">
                  {subscription?.tier_name || "Starter Plan"}
                </span>
                <Badge variant="outline" className="text-[10px] h-5 font-medium border-violet-500/30 text-violet-400">
                  {subscription?.subscription_status || "Active"}
                </Badge>
              </div>
              <div className="mt-2 space-y-1">
                <Progress value={minutesPercent} className="h-1.5 bg-muted" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{minutesUsed} used</span>
                  <span>{subscription?.minutes_remaining ?? includedMinutes}m left</span>
                </div>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* 3. Core Workspace Section (Clean 2-Column Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Voice Agents Hub */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                Voice Agents
              </h2>
              <p className="text-xs text-muted-foreground">
                Your conversational AI callers and interactive studio pipelines.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
              <Link href="/workflow">
                View all ({workflows.length})
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Workflow List or Sleek Starter Templates */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : workflows.length > 0 ? (
            <div className="space-y-2.5">
              {workflows.slice(0, 4).map((wf) => (
                <div
                  key={wf.id}
                  className="group p-3.5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/70 hover:border-border transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate group-hover:text-indigo-400 transition-colors">
                        {wf.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] h-4.5 px-1.5 capitalize font-medium ${
                          wf.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {wf.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-3">
                      <span>{wf.total_runs || 0} total calls</span>
                      <span>•</span>
                      <span>Created {new Date(wf.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7.5 px-2.5 text-xs rounded-lg border-border/70 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all"
                    >
                      <Link href={`/workflow/${wf.id}`}>
                        Open Canvas
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-70" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-7.5 w-7.5 text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`/workflow/${wf.id}/settings`} title="Agent Settings">
                        <Settings2 className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State with Fast Starter Presets */
            <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-6 text-center space-y-4">
              <div className="mx-auto w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-foreground">No voice agents created yet</h3>
                <p className="text-xs text-muted-foreground">
                  Build your first conversational AI agent with real-time speech synthesis in under 2 minutes.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                <Link
                  href="/workflow"
                  className="p-3.5 rounded-lg border border-border/60 bg-card/40 hover:bg-card/90 transition-all group"
                >
                  <div className="text-xs font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                    Customer Support Agent →
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Answers common queries, resolves tickets, and books appointments.
                  </p>
                </Link>
                <Link
                  href="/workflow"
                  className="p-3.5 rounded-lg border border-border/60 bg-card/40 hover:bg-card/90 transition-all group"
                >
                  <div className="text-xs font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                    Outbound Sales Qualifier →
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Reaches out to inbound leads and transfers interested callers.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Operations Launchpad & Voice Pipeline Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Launchpad */}
          <div className="space-y-3">
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Fast Launchpad
            </h2>

            <div className="rounded-xl border border-border/60 bg-card/30 divide-y divide-border/40 overflow-hidden">
              <Link
                href="/telephony-configurations"
                className="p-3.5 flex items-center justify-between hover:bg-card/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Phone Numbers & SIP Trunks</div>
                    <div className="text-[11px] text-muted-foreground">Assign DIDs and carrier routes</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/recordings"
                className="p-3.5 flex items-center justify-between hover:bg-card/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-105 transition-transform">
                    <AudioWaveform className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Call Recordings & Transcripts</div>
                    <div className="text-[11px] text-muted-foreground">Inspect audio logs and latency traces</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/campaigns"
                className="p-3.5 flex items-center justify-between hover:bg-card/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Outbound Calling Campaigns</div>
                    <div className="text-[11px] text-muted-foreground">Bulk dial leads with automated workflows</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/model-configurations"
                className="p-3.5 flex items-center justify-between hover:bg-card/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Voices & LLM Models</div>
                    <div className="text-[11px] text-muted-foreground">Cartesia, ElevenLabs, OpenAI, Gemini</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/api-keys"
                className="p-3.5 flex items-center justify-between hover:bg-card/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">API Keys & Webhooks</div>
                    <div className="text-[11px] text-muted-foreground">REST API tokens for developers</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Voice Pipeline Health Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Audio Pipeline Status
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-medium">99.98% Uptime</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-card/50 border border-border/40">
                <div className="text-muted-foreground">Speech Recognition</div>
                <div className="font-semibold text-foreground mt-0.5">Deepgram Nova-2</div>
              </div>
              <div className="p-2 rounded-lg bg-card/50 border border-border/40">
                <div className="text-muted-foreground">Voice Synthesis</div>
                <div className="font-semibold text-foreground mt-0.5">Cartesia Sonic</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-muted-foreground">Max Concurrency</span>
              <span className="font-semibold text-foreground">
                {subscription?.max_concurrent_calls ?? 2} simultaneous calls
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top-Up Modal Integration */}
      <RechargeWalletModal
        open={rechargeModalOpen}
        onOpenChange={setRechargeModalOpen}
        currentBalanceUsd={walletBalance}
        onSuccess={() => {
          fetchData();
          refreshConfig();
        }}
      />
    </div>
  );
}
