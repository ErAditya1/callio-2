'use client';

import {
  ArrowRight,
  Bot,
  Copy,
  Layers,
  MoreVertical,
  Pause,
  Phone,
  Play,
  Plus,
  Radio,
  Search,
  Settings,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_AGENTS } from '@/lib/services/mockData';

export default function AgentsDashboardPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Voice Agents Fleet
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your active AI phone representatives, update conversational goals, or launch new numbers.
          </p>
        </div>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-4 shadow-lg shadow-indigo-600/20">
          <Link href="/dashboard/agents/create">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Agent
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-card border border-border/70 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input
          placeholder="Filter by agent name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 border-0 bg-transparent text-xs focus-visible:ring-0"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between shadow-md hover:border-indigo-500/50 transition-all space-y-6"
          >
            <div>
              {/* Agent Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-base">{agent.name}</h3>
                      <Badge variant="outline" className="text-[10px] py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        ● Live
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{agent.role}</div>
                    <div className="text-xs text-indigo-400 mt-1 font-medium">Voice: {agent.voiceName}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mt-4 line-clamp-2">
                {agent.description}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-border/50 text-center text-xs">
                <div className="p-2 rounded-xl bg-muted/30">
                  <div className="text-muted-foreground text-[10px]">Calls Today</div>
                  <div className="font-extrabold text-foreground text-sm mt-0.5">{agent.metrics.callsToday}</div>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <div className="text-muted-foreground text-[10px]">Resolution</div>
                  <div className="font-extrabold text-emerald-400 text-sm mt-0.5">{agent.metrics.successRate}%</div>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <div className="text-muted-foreground text-[10px]">Avg Duration</div>
                  <div className="font-extrabold text-foreground text-sm mt-0.5">{Math.round(agent.metrics.avgDurationSec / 60)}m {agent.metrics.avgDurationSec % 60}s</div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-9">
                <Link href={`/demo/call?agent=${agent.id}`}>
                  <Radio className="w-3.5 h-3.5 mr-1.5 text-rose-500 animate-pulse" />
                  Test Voice Call
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-9 px-4">
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    Manage & Analytics
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
