'use client';

import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Megaphone,
  Pause,
  Play,
  Plus,
  Repeat,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_CAMPAIGNS } from '@/lib/services/mockData';

export default function CampaignsDashboardPage() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Calling Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Orchestrate automated outbound calling sequences, monitor live connect rates, and track appointments.
          </p>
        </div>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-4 shadow-lg shadow-indigo-600/20">
          <Link href="/outbound-calls">
            <Plus className="w-4 h-4 mr-1.5" />
            + New Campaign
          </Link>
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md space-y-6"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-foreground">{camp.name}</h2>
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 ${
                      camp.status === 'running'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    ● {camp.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Caller Agent: <span className="text-foreground font-medium">{camp.agentName}</span> • Created {camp.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">
                  {camp.status === 'running' ? 'Pause Campaign' : 'Resume'}
                </Button>
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-8">
                  <Link href="/dashboard/calls">View Call Logs</Link>
                </Button>
              </div>
            </div>

            {/* Funnel Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Contacts</div>
                <div className="text-xl font-extrabold text-foreground mt-1">{camp.funnel.contacts.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Calls Placed</div>
                <div className="text-xl font-extrabold text-foreground mt-1">{camp.funnel.callsPlaced.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Connected</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">{camp.funnel.connected.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Qualified</div>
                <div className="text-xl font-extrabold text-indigo-400 mt-1">{camp.funnel.qualified.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Appointments</div>
                <div className="text-xl font-extrabold text-purple-400 mt-1">{camp.funnel.appointmentsBooked.toLocaleString()}</div>
              </div>
            </div>

            {/* Funnel Conversion Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Funnel Conversion</span>
                <span className="font-semibold text-emerald-400">
                  {camp.conversionRate}% Appointment Set Rate
                </span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '55%' }} />
                <div className="bg-indigo-500 h-full" style={{ width: '25%' }} />
                <div className="bg-purple-500 h-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
