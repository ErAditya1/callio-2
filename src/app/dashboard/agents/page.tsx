'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BotIcon,
  Copy01Icon,
  Layers01Icon,
  MoreVerticalIcon,
  PauseIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  RadioIcon,
  Search01Icon,
  Settings01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
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
    <div className="app-page space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Voice Agents Fleet
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Manage your active AI phone representatives, update conversational goals, or launch new numbers.
          </p>
        </div>

        <Button asChild className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs h-10 px-4 shadow-lg shadow-sm">
          <Link href="/dashboard/agents/create">
            <HugeiconsIcon icon={PlusIcon} className="w-4 h-4 mr-1.5" />
            Create Agent
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] max-w-md">
        <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 text-[#737373] ml-2" />
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
            className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col justify-between shadow-md hover:border-[#DCE3EF] transition-all space-y-6"
          >
            <div>
              {/* Agent Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#DCE3EF] shadow"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-base">{agent.name}</h3>
                      <Badge variant="outline" className="text-[10px] py-0 bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                        ● Live
                      </Badge>
                    </div>
                    <div className="text-xs text-[#737373] mt-0.5">{agent.role}</div>
                    <div className="text-xs text-[#7186AD] mt-1 font-medium">Voice: {agent.voiceName}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#737373] leading-relaxed mt-4 line-clamp-2">
                {agent.description}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-[#E5E5E5] text-center text-xs">
                <div className="p-2 rounded-xl bg-[#F7F7F7]">
                  <div className="text-[#737373] text-[10px]">Calls Today</div>
                  <div className="font-extrabold text-foreground text-sm mt-0.5">{agent.metrics.callsToday}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F7F7F7]">
                  <div className="text-[#737373] text-[10px]">Resolution</div>
                  <div className="font-extrabold text-[#7186AD] text-sm mt-0.5">{agent.metrics.successRate}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F7F7F7]">
                  <div className="text-[#737373] text-[10px]">Avg Duration</div>
                  <div className="font-extrabold text-foreground text-sm mt-0.5">{Math.round(agent.metrics.avgDurationSec / 60)}m {agent.metrics.avgDurationSec % 60}s</div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-9">
                <Link href={`/demo/call?agent=${agent.id}`}>
                  <HugeiconsIcon icon={RadioIcon} className="w-3.5 h-3.5 mr-1.5 text-rose-500 animate-pulse" />
                  Test Voice Call
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button asChild size="sm" className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs h-9 px-4">
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    Manage & Analytics
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
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
