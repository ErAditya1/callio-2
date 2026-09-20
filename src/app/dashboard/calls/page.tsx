'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar01Icon,
  Clock01Icon,
  Download01Icon,
  FilterIcon,
  PhoneIcon,
  PhoneIncomingIcon,
  PhoneOff01Icon,
  PlayIcon,
  Search01Icon,
  SparklesIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_CALLS } from '@/lib/services/mockData';

export default function CallsListPage() {
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');

  const filtered = MOCK_CALLS.filter((call) => {
    const matchesSearch =
      call.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.customerPhone.includes(search) ||
      call.agentName.toLowerCase().includes(search.toLowerCase()) ||
      call.summary.toLowerCase().includes(search.toLowerCase());

    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="app-page space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Call Logs & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Review detailed transcripts, AI summaries, customer sentiments, and recordings.
          </p>
        </div>

        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          <HugeiconsIcon icon={Download01Icon} className="w-3.5 h-3.5 mr-1.5" />
          Export CSV / Records
        </Button>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <HugeiconsIcon icon={Search01Icon} className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <Input
            placeholder="Search by customer, phone, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-[#F7F7F7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
          {[
            { label: 'All Outcomes', val: 'all' },
            { label: 'Appointment Booked', val: 'Appointment Booked' },
            { label: 'Lead Qualified', val: 'Lead Qualified' },
            { label: 'Resolved FAQ', val: 'Resolved FAQ' }
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setOutcomeFilter(item.val)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                outcomeFilter === item.val
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'bg-[#F7F7F7] text-[#737373] hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Table */}
      <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#737373] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Agent Handled</th>
                <th className="pb-3 font-semibold">Date / Time</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Outcome</th>
                <th className="pb-3 font-semibold">Sentiment</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((call) => (
                <tr key={call.id} className="hover:bg-[#F7F7F7] transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-foreground text-sm">{call.customerName}</div>
                    <div className="text-[11px] text-[#737373] font-mono mt-0.5">{call.customerPhone}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-foreground font-medium">{call.agentName}</div>
                    <div className="text-[10px] text-[#737373] capitalize">{call.direction} Call</div>
                  </td>
                  <td className="py-4 text-[#737373]">{call.startedAt}</td>
                  <td className="py-4 font-mono text-foreground font-semibold">
                    {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
                  </td>
                  <td className="py-4">
                    <Badge variant="outline" className="text-xs bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF] py-0.5">
                      {call.outcome}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-semibold text-[#7186AD]">
                      ★ {call.sentimentScore}% Positive
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button asChild size="sm" className="h-8 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs px-3">
                      <Link href={`/dashboard/calls/${call.id}`}>
                        Inspect Call →
                      </Link>
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
