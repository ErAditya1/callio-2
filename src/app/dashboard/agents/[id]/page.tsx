'use client';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  Headphones,
  Layers,
  Pause,
  Phone,
  Play,
  Radio,
  Settings,
  Sparkles,
  TrendingUp,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_AGENTS, MOCK_CALLS } from '@/lib/services/mockData';

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const agent = MOCK_AGENTS.find((a) => a.id === id) || MOCK_AGENTS[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'calls' | 'knowledge' | 'voice'>('overview');

  if (!agent) {
    notFound();
  }

  const agentCalls = MOCK_CALLS.filter((c) => c.agentId === agent.id);

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/agents"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Agent Fleet
        </Link>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{agent.name}</h1>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  ● Live in Production
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {agent.role} • Voice: <span className="text-indigo-400 font-medium">{agent.voiceName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-9">
              <Link href={`/demo/call?agent=${agent.id}`}>
                <Radio className="w-3.5 h-3.5 mr-1.5 text-rose-500 animate-pulse" />
                Test Live Call
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-9 px-4">
              <Link href="/workflow">
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Open Flow Canvas
              </Link>
            </Button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-6">
          {[
            { key: 'overview', label: 'Overview & Performance' },
            { key: 'calls', label: `Call Records (${agentCalls.length})` },
            { key: 'knowledge', label: 'Knowledge Base' },
            { key: 'voice', label: 'Voice Settings' }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === t.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-border/80 bg-card">
              <div className="text-xs text-muted-foreground">Total Handled Calls</div>
              <div className="text-2xl font-extrabold text-foreground mt-1">{agent.metrics.totalCalls.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl border border-border/80 bg-card">
              <div className="text-xs text-muted-foreground">Resolution Rate</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{agent.metrics.successRate}%</div>
            </div>
            <div className="p-4 rounded-2xl border border-border/80 bg-card">
              <div className="text-xs text-muted-foreground">Avg Call Time</div>
              <div className="text-2xl font-extrabold text-foreground mt-1">
                {Math.floor(agent.metrics.avgDurationSec / 60)}m {agent.metrics.avgDurationSec % 60}s
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border/80 bg-card">
              <div className="text-xs text-muted-foreground">Customer Sentiment</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">{agent.metrics.sentimentScore}% Positive</div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-foreground">Current Operating Prompt Instructions</h3>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
              {agent.systemPrompt}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Calls */}
      {activeTab === 'calls' && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Outcome</th>
                  <th className="pb-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {agentCalls.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="py-3 font-bold">{c.customerName}</td>
                    <td className="py-3 text-muted-foreground">{c.startedAt}</td>
                    <td className="py-3 font-mono">{Math.floor(c.durationSec / 60)}m {c.durationSec % 60}s</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        {c.outcome}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                        <Link href={`/dashboard/calls/${c.id}`}>Transcript →</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Knowledge */}
      {activeTab === 'knowledge' && (
        <div className="rounded-3xl border border-border/80 bg-card p-8 text-center space-y-4">
          <h3 className="text-base font-bold text-foreground">Attached Knowledge Sources</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            This agent is currently configured with Acme Clinic General FAQ (42 questions) and Pricing Table v2.
          </p>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/dashboard/knowledge">Manage Knowledge Base →</Link>
          </Button>
        </div>
      )}

      {/* Tab 4: Voice */}
      {activeTab === 'voice' && (
        <div className="rounded-3xl border border-border/80 bg-card p-8 space-y-4">
          <h3 className="text-base font-bold text-foreground">Assigned Voice Engine</h3>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground text-sm">{agent.voiceName}</div>
              <div className="text-xs text-muted-foreground">{agent.language} • {agent.accent}</div>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/voices">Change Voice in Marketplace →</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
