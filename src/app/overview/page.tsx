"use client";

import {
  ArrowRight,
  AudioWaveform,
  Bot,
  CheckCircle2,
  Clock,
  KeyRound,
  PhoneCall,
  Plus,
  Radio,
  Sliders,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function OverviewPage() {
  const { user } = useAuth();
  const userName = user?.displayName?.split(" ")[0] || "Operator";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* 1. Concentrative Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-500 tracking-wide uppercase">
              Rumik Voice Core • Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your centralized control room for voice agents, telephone numbers, and call logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 h-9 text-xs font-semibold shadow-sm"
          >
            <Link href="/workflow">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Voice Agent
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-lg px-3.5 h-9 text-xs font-medium border-border/70"
          >
            <Link href="/telephony-configurations">
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              Phone Numbers
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Key Telemetry at a Glance (4 High-Signal Tiles) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Link
          href="/workflow"
          className="p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all block group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-medium">Voice Agents</span>
            <Bot className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-foreground">Active</div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Manage studio canvas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/telephony-configurations"
          className="p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all block group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-medium">Telephony</span>
            <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-foreground">SIP & Carriers</div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Inbound DID routing</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/recordings"
          className="p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all block group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-medium">Call Intelligence</span>
            <AudioWaveform className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-foreground">Transcripts</div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Inspect audio & logs</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/usage"
          className="p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all block group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-medium">Response Latency</span>
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-foreground">~350ms</div>
          <div className="text-[11px] text-emerald-500 font-medium mt-1">
            Ultra-low speech latency
          </div>
        </Link>
      </div>

      {/* 3. 3-Step Setup Guide (Clear & Easy to Understand) */}
      <div className="rounded-xl border border-border/70 bg-card/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Quick Setup: Launch Your First Phone Agent</h2>
            <p className="text-xs text-muted-foreground">Follow these 3 straightforward steps to start answering calls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/workflow"
            className="p-4 rounded-lg border border-border/60 bg-card/50 hover:bg-card/90 transition-colors space-y-2 block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                STEP 1
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Configure Agent & Prompt</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Define agent instructions, select a human-like studio voice, and test it directly in your browser.
            </p>
          </Link>

          <Link
            href="/telephony-configurations"
            className="p-4 rounded-lg border border-border/60 bg-card/50 hover:bg-card/90 transition-colors space-y-2 block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                STEP 2
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Connect Phone Number</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Attach a Twilio, Telnyx, Vonage, or private SIP trunk to assign a real telephone number.
            </p>
          </Link>

          <Link
            href="/recordings"
            className="p-4 rounded-lg border border-border/60 bg-card/50 hover:bg-card/90 transition-colors space-y-2 block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded">
                STEP 3
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Call & Review Transcripts</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Dial your agent number from your mobile phone and review real-time recordings and transcripts.
            </p>
          </Link>
        </div>
      </div>

      {/* 4. Core Operational Hub (Focused 3-Card Grid) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Workspace Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border/70 bg-card/40 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-foreground">Voice Agent Studio</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Design conversational flows, prompt engineering, appointment booking logic, and webhook actions.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full text-xs h-8 border-border/70 rounded-lg">
              <Link href="/workflow">Open Canvas Studio →</Link>
            </Button>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card/40 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-foreground">Voices & LLM Models</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Configure OpenAI, Gemini, Groq, or Anthropic LLM models alongside ElevenLabs and Cartesia voices.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full text-xs h-8 border-border/70 rounded-lg">
              <Link href="/model-configurations">Configure Models →</Link>
            </Button>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-card/40 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">API Keys & Webhooks</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate developer tokens to programmatically initiate calls and receive call completion webhooks.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full text-xs h-8 border-border/70 rounded-lg">
              <Link href="/api-keys">Manage API Keys →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
