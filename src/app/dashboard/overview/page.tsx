'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  Calendar01Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  HeadphonesIcon,
  PhoneCallIcon,
  PhoneForwardedIcon,
  PhoneIncomingIcon,
  RadioIcon,
  SparklesIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MOCK_AGENTS, MOCK_CALLS } from '@/lib/services/mockData';

export default function DashboardOverviewPage() {
  return (
    <div className="app-page space-y-8">
      {/* Morning Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
            Heyy👋 Divyansh
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Here is your live conversational operations summary for today, September 8, 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild className="rounded-xl text-xs border-[#DCE3EF] hover:bg-[#F0F3F9] hover:text-[#7186AD] focus-visible:border-[#DCE3EF] focus-visible:ring-[#DCE3EF]">
            <Link href="/demo/call">
              <HugeiconsIcon icon={RadioIcon} className="w-3.5 h-3.5 mr-1.5 text-[#7186AD]" />
              Test Live Agent
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs">
            <Link href="/dashboard/agents/create">
              + Create Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">Calls Today</div>
          <div className="text-2xl font-extrabold text-[#171717]">187</div>
          <div className="text-[10px] text-[#7186AD] font-medium flex items-center gap-0.5">
            <HugeiconsIcon icon={ChartIncreaseIcon} className="w-3 h-3 text-[#7186AD]" /> ↑ 12% vs yesterday
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">Connected Rate</div>
          <div className="text-2xl font-extrabold text-[#171717]">96.8%</div>
          <div className="text-[10px] text-[#7186AD] font-medium">Zero missed calls</div>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">Appointments</div>
          <div className="text-2xl font-extrabold text-[#171717]">42</div>
          <div className="text-[10px] text-[#7186AD] font-medium">Direct to Calendar</div>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">Qualified Leads</div>
          <div className="text-2xl font-extrabold text-[#171717]">28</div>
          <div className="text-[10px] text-[#7186AD] font-medium">Speed-to-lead &lt;30s</div>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">Avg Call Time</div>
          <div className="text-2xl font-extrabold text-[#171717]">2m 14s</div>
          <div className="text-[10px] text-[#737373]">Fast resolution</div>
        </div>
      </div>

      {/* Call Volume Chart (full width) */}
      <div>
        <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#171717]">Call Activity & Volume</h2>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#737373]">
                <span className="w-2 h-2 rounded-full bg-[#171717]" /> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-[#737373]">
                <span className="w-2 h-2 rounded-full bg-[#7186AD]" /> Outbound
              </span>
            </div>
          </div>

          {/* Simulated Volume Bar Chart */}
          <div className="relative h-56 flex items-end justify-between gap-2 pt-6 px-2 border-t border-[#EAECEF] bg-[#FFFFFF]">
            {/* gridlines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-6" aria-hidden="true">
              <span className="h-px w-full bg-[#EAECEF]" />
              <span className="h-px w-full bg-[#EAECEF]" />
              <span className="h-px w-full bg-[#EAECEF]" />
              <span className="h-px w-full bg-[#EAECEF]" />
            </div>
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
              <div key={i} className="relative flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-full max-w-[14px] bg-[#171717] rounded-t-md transition-all group-hover:bg-[#DCE3EB]"
                    style={{ height: `${(slot.inb / 45) * 100}%` }}
                    title={`Inbound: ${slot.inb}`}
                  />
                  <div
                    className="w-full max-w-[14px] bg-[#7186AD] rounded-t-md transition-all group-hover:bg-[#5D7299]"
                    style={{ height: `${(slot.out / 45) * 100}%` }}
                    title={`Outbound: ${slot.out}`}
                  />
                </div>
                <span className="text-[10px] text-[#737373] font-mono">{slot.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Agents Fleet Table */}
      <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-[#171717]">Active Agent Fleet</h2>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs border-[#DCE3EF] hover:bg-[#F0F3F9] hover:text-[#7186AD] hover:border-[#DCE3EF]">
            <Link href="/dashboard/agents">
              View All Agents
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-[#F7F7F7]">
            <TableRow className="hover:bg-transparent border-b border-[#E5E5E5]">
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Agent</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Voice</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Status</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Calls Today</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Success Rate</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Avg Time</TableHead>
              <TableHead className="h-auto pb-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-medium">
            {MOCK_AGENTS.map((agent) => (
              <TableRow key={agent.id} className="border-b border-[#E5E5E5] hover:bg-[#F0F3F9]">
                <TableCell className="py-3.5">
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                    <span>
                      <span className="block font-bold text-[#171717] text-xs">{agent.name}</span>
                      <span className="block text-[10px] font-normal text-[#737373]">{agent.role}</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell className="py-3.5 font-normal text-[#737373]">{agent.voiceName}</TableCell>
                <TableCell className="py-3.5">
                  <Badge variant="outline" className="text-[10px] py-0 bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                    ● Live
                  </Badge>
                </TableCell>
                <TableCell className="py-3.5 font-semibold text-[#171717]">{agent.metrics.callsToday} calls</TableCell>
                <TableCell className="py-3.5 font-semibold text-[#7186AD]">{agent.metrics.successRate}%</TableCell>
                <TableCell className="py-3.5 font-normal text-[#737373]">{Math.round(agent.metrics.avgDurationSec / 60)}m {agent.metrics.avgDurationSec % 60}s</TableCell>
                <TableCell className="py-3.5 text-right">
                  <span className="inline-flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs hover:bg-[#F0F3F9] hover:text-[#7186AD]">
                      <Link href={`/dashboard/agents/${agent.id}`}>Configure</Link>
                    </Button>
                    <Button asChild size="sm" className="h-7 text-xs bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg">
                      <Link href={`/demo/call?agent=${agent.id}`}>Test</Link>
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recent Calls Feed */}
      <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-[#171717]">Recent Call Activity</h2>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs border-[#DCE3EF] hover:bg-[#F0F3F9] hover:text-[#7186AD] hover:border-[#DCE3EF]">
            <Link href="/dashboard/calls">
              View All Calls
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-[#F7F7F7]">
            <TableRow className="hover:bg-transparent border-b border-[#E5E5E5]">
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Caller</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Handled By</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Time</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Duration</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Outcome</TableHead>
              <TableHead className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Sentiment</TableHead>
              <TableHead className="h-auto pb-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#737373]">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-medium">
            {MOCK_CALLS.map((call) => (
              <TableRow key={call.id} className="border-b border-[#E5E5E5] hover:bg-[#F0F3F9]">
                <TableCell className="py-3.5">
                  <span className="block font-bold text-[#171717] text-xs">{call.customerName}</span>
                  <span className="block text-[10px] font-normal text-[#737373] font-mono">{call.customerPhone}</span>
                </TableCell>
                <TableCell className="py-3.5 font-normal text-[#737373]">{call.agentName}</TableCell>
                <TableCell className="py-3.5 font-normal text-[#737373]">{call.startedAt}</TableCell>
                <TableCell className="py-3.5 font-normal font-mono text-[#737373]">{Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s</TableCell>
                <TableCell className="py-3.5">
                  <Badge variant="outline" className="text-[10px] py-0 bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                    {call.outcome}
                  </Badge>
                </TableCell>
                <TableCell className="py-3.5 font-semibold text-[#7186AD]">
                  ★ {call.sentimentScore}% Positive
                </TableCell>
                <TableCell className="py-3.5 text-right">
                  <Button asChild variant="outline" size="sm" className="h-7 text-xs rounded-lg border-[#DCE3EF] hover:bg-[#F0F3F9] hover:text-[#7186AD] hover:border-[#DCE3EF]">
                      <Link href={`/dashboard/calls/${call.id}`}>Inspect Call →</Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
