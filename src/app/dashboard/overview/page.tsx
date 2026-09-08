'use client';

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Headphones,
  Lightbulb,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Radio,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_AGENTS, MOCK_CALLS } from '@/lib/services/mockData';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Morning Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Good morning, Acme Health
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Here is your live conversational operations summary for today, September 8, 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
            <Link href="/demo/call">
              <Radio className="w-3.5 h-3.5 mr-1.5 text-rose-500 animate-pulse" />
              Test Live Agent
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs">
            <Link href="/dashboard/agents/create">
              + Create Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Calls Today</div>
          <div className="text-2xl font-extrabold text-foreground">187</div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> ↑ 12% vs yesterday
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Connected Rate</div>
          <div className="text-2xl font-extrabold text-foreground">96.8%</div>
          <div className="text-[10px] text-emerald-400 font-medium">Zero missed calls</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Appointments</div>
          <div className="text-2xl font-extrabold text-indigo-400">42</div>
          <div className="text-[10px] text-indigo-400 font-medium">Direct to Calendar</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Qualified Leads</div>
          <div className="text-2xl font-extrabold text-purple-400">28</div>
          <div className="text-[10px] text-purple-400 font-medium">Speed-to-lead &lt;30s</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Call Time</div>
          <div className="text-2xl font-extrabold text-foreground">2m 14s</div>
          <div className="text-[10px] text-muted-foreground">Fast resolution</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Resolution Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400">93.4%</div>
          <div className="text-[10px] text-emerald-400 font-medium">Without escalation</div>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Call Volume Trends Chart */}
        <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">Call Activity & Volume</h2>
              <p className="text-xs text-muted-foreground">Hourly inbound vs outbound calls handled today</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Outbound
              </span>
            </div>
          </div>

          {/* Simulated Volume Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { time: '8 AM', inb: 14, out: 8 },
              { time: '9 AM', inb: 28, out: 19 },
              { time: '10 AM', inb: 38, out: 26 },
              { time: '11 AM', inb: 42, out: 30 },
              { time: '12 PM', inb: 31, out: 15 },
              { time: '1 PM', inb: 24, out: 18 },
              { time: '2 PM', inb: 40, out: 28 },
              { time: '3 PM', inb: 35, out: 22 },
              { time: '4 PM', inb: 29, out: 16 },
              { time: '5 PM', inb: 18, out: 10 }
            ].map((slot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-full max-w-[14px] bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-500"
                    style={{ height: `${(slot.inb / 45) * 100}%` }}
                    title={`Inbound: ${slot.inb}`}
                  />
                  <div
                    className="w-full max-w-[14px] bg-purple-500/80 rounded-t-md transition-all group-hover:bg-purple-400"
                    style={{ height: `${(slot.out / 45) * 100}%` }}
                    title={`Outbound: ${slot.out}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{slot.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: AI Optimization Recommendation Card */}
        <div className="lg:col-span-4 rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-card to-card p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">AI Performance Insights</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your <strong>Sarah — AI Receptionist</strong> agent has achieved a <span className="text-emerald-400 font-semibold">94.2% resolution rate</span> over the past 7 days.
            </p>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
              <div className="font-semibold text-foreground">Top Customer Question:</div>
              <div className="text-muted-foreground">"Does clinic accept Delta Dental PPO insurance?" (42 times today)</div>
            </div>
          </div>

          <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs">
            <Link href="/dashboard/knowledge">
              Review Knowledge Base FAQs →
            </Link>
          </Button>
        </div>
      </div>

      {/* Active Agents Fleet Table */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h2 className="text-base font-bold text-foreground">Active Agent Fleet</h2>
            <p className="text-xs text-muted-foreground">Current live status and performance per voice persona</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/dashboard/agents">
              View All Agents
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Agent</th>
                <th className="pb-3 font-semibold">Voice</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Calls Today</th>
                <th className="pb-3 font-semibold">Success Rate</th>
                <th className="pb-3 font-semibold">Avg Time</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {MOCK_AGENTS.map((agent) => (
                <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-foreground text-xs">{agent.name}</div>
                      <div className="text-[10px] text-muted-foreground">{agent.role}</div>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted-foreground">{agent.voiceName}</td>
                  <td className="py-3.5">
                    <Badge variant="outline" className="text-[10px] py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      ● Live
                    </Badge>
                  </td>
                  <td className="py-3.5 text-foreground font-semibold">{agent.metrics.callsToday} calls</td>
                  <td className="py-3.5 text-emerald-400 font-semibold">{agent.metrics.successRate}%</td>
                  <td className="py-3.5 text-muted-foreground">{Math.round(agent.metrics.avgDurationSec / 60)}m {agent.metrics.avgDurationSec % 60}s</td>
                  <td className="py-3.5 text-right space-x-2">
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                      <Link href={`/dashboard/agents/${agent.id}`}>Configure</Link>
                    </Button>
                    <Button asChild size="sm" className="h-7 text-xs bg-indigo-600 text-white rounded-lg">
                      <Link href={`/demo/call?agent=${agent.id}`}>Test</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Calls Feed */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Call Activity</h2>
            <p className="text-xs text-muted-foreground">Real-time transcripts, outcomes, and caller sentiment</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/dashboard/calls">
              View All Calls
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Caller</th>
                <th className="pb-3 font-semibold">Handled By</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Outcome</th>
                <th className="pb-3 font-semibold">Sentiment</th>
                <th className="pb-3 font-semibold text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {MOCK_CALLS.map((call) => (
                <tr key={call.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-foreground text-xs">{call.customerName}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{call.customerPhone}</div>
                  </td>
                  <td className="py-3.5 text-muted-foreground">{call.agentName}</td>
                  <td className="py-3.5 text-muted-foreground">{call.startedAt}</td>
                  <td className="py-3.5 font-mono">{Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s</td>
                  <td className="py-3.5">
                    <Badge variant="outline" className="text-[10px] py-0 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                      {call.outcome}
                    </Badge>
                  </td>
                  <td className="py-3.5">
                    <span className="text-xs font-semibold text-emerald-400">
                      ★ {call.sentimentScore}% Positive
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                      <Link href={`/dashboard/calls/${call.id}`}>Inspect Call →</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
