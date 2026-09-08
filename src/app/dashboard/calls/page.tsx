'use client';

import {
  ArrowRight,
  Calendar,
  Clock,
  Download,
  Filter,
  Phone,
  PhoneIncoming,
  PhoneOff,
  Play,
  Search,
  Sparkles,
  Volume2
} from 'lucide-react';
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Call Logs & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review detailed transcripts, AI summaries, customer sentiments, and recordings.
          </p>
        </div>

        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export CSV / Records
        </Button>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer, phone, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-muted/40"
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
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-muted/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Table */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[10px]">
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
                <tr key={call.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-foreground text-sm">{call.customerName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{call.customerPhone}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-foreground font-medium">{call.agentName}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{call.direction} Call</div>
                  </td>
                  <td className="py-4 text-muted-foreground">{call.startedAt}</td>
                  <td className="py-4 font-mono text-foreground font-semibold">
                    {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
                  </td>
                  <td className="py-4">
                    <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20 py-0.5">
                      {call.outcome}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-semibold text-emerald-400">
                      ★ {call.sentimentScore}% Positive
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button asChild size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs px-3">
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
