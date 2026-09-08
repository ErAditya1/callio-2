"use client";

import {
  ArrowRight,
  AudioLines,
  Bot,
  Brain,
  CircleDollarSign,
  Database,
  ExternalLink,
  FileText,
  Key,
  Megaphone,
  Phone,
  Radio,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function OverviewPage() {
  const { user } = useAuth();
  const userName = user?.displayName?.split(" ")[0] || "Operator";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-muted/40 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5">
                <Sparkles className="w-3 h-3 mr-1.5 inline" />
                Callio AI Platform
              </Badge>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                ● Telephony Pipeline: Active
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome, {userName}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Autonomous conversational voice operations. Build, orchestrate, and deploy human-grade voice AI agents with live telephony, sub-second latency, and enterprise function calling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 rounded-xl font-semibold h-11 px-5"
            >
              <Link href="/workflow">
                <Bot className="w-4 h-4 mr-2" />
                Open Agent Studio
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-xl h-11 border-border/80 hover:bg-muted font-medium"
            >
              <Link href="/campaigns">
                <Megaphone className="w-4 h-4 mr-2 text-indigo-400" />
                Launch Campaign
              </Link>
            </Button>
          </div>
        </div>

        {/* Real-Time Telemetry Stats Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground font-medium">Average Response Latency</div>
            <div className="text-xl font-bold text-foreground mt-0.5 flex items-center gap-1.5">
              <span>~540ms</span>
              <span className="text-[10px] text-emerald-400 font-normal">Ultra-Fast</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Voice Synthesis Engine</div>
            <div className="text-xl font-bold text-foreground mt-0.5">ElevenLabs & Cartesia</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Speech Recognition (STT)</div>
            <div className="text-xl font-bold text-foreground mt-0.5">Deepgram Nova-3</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Supported Protocols</div>
            <div className="text-xl font-bold text-foreground mt-0.5">SIP URI / WebRTC</div>
          </div>
        </div>
      </div>

      {/* Primary Action Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Core AI Capabilities</h2>
            <p className="text-xs text-muted-foreground">Manage every stage of your conversational voice architecture</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Agent Studio */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Voice Agent Studio</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Visual node graph editor with prompt engineering, interruptibility, and branch routing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/workflow" className="flex items-center gap-1">
                  Launch Canvas <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: AI Models & Voices */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">AI Models & Voice Library</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Connect LLMs (OpenAI, Anthropic, Gemini, Groq) and ultra-realistic voice models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/model-configurations" className="flex items-center gap-1">
                  Configure Voices <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Telephony & SIP */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Telephony & Numbers</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Connect custom SIP trunks, Twilio/Telnyx numbers, and configure inbound DID routes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/telephony-configurations" className="flex items-center gap-1">
                  Manage Telephony <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 4: Outbound Campaigns */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Outbound Calling</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Launch automated dialers, lead qualification sequences, and dynamic campaign workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/campaigns" className="flex items-center gap-1">
                  View Campaigns <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 5: Tools & Actions */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Tools & API Webhooks</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Equip your agents with custom API integrations, calendar booking, and CRM sync.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/tools" className="flex items-center gap-1">
                  Define Functions <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 6: Recordings & Intelligence */}
          <Card className="hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <AudioLines className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Call Intelligence & Audio</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Stream recorded audio, inspect latency waterfalls, and export conversation transcripts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="p-0 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                <Link href="/recordings" className="flex items-center gap-1">
                  Browse Recordings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enterprise Developer & Analytics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card/60 border-border/70 p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground text-sm">Developer API & Webhooks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Programmatically trigger inbound sessions, dispatch outbound batch calls, and receive real-time webhook events for completed conversations.
            </p>
            <Button asChild size="sm" variant="outline" className="rounded-lg text-xs h-8">
              <Link href="/api-keys">
                Generate API Credentials →
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="bg-card/60 border-border/70 p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground text-sm">Real-Time Usage & Telemetry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Monitor concurrent call capacity, track talk-time metrics, inspect token consumption, and audit latency metrics across all live agents.
            </p>
            <Button asChild size="sm" variant="outline" className="rounded-lg text-xs h-8">
              <Link href="/usage">
                View Operational Usage →
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
