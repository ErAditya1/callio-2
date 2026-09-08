'use client';

import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AnalyticsDashboardPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Conversation Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track business outcomes, caller sentiment, conversion rates, and cost savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-card border border-border/80 p-1 text-xs">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-all ${
                  range === r ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="rounded-xl text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* 8 Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Total Handled Calls</div>
          <div className="text-3xl font-extrabold text-foreground">4,892</div>
          <div className="text-[10px] text-emerald-400 font-medium">↑ 18% vs prior period</div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Appointments Booked</div>
          <div className="text-3xl font-extrabold text-indigo-400">684</div>
          <div className="text-[10px] text-indigo-400 font-medium">14.0% Conversion Rate</div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">First-Call Resolution</div>
          <div className="text-3xl font-extrabold text-emerald-400">93.8%</div>
          <div className="text-[10px] text-emerald-400 font-medium">Zero human escalation</div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Customer Sentiment</div>
          <div className="text-3xl font-extrabold text-purple-400">91%</div>
          <div className="text-[10px] text-purple-400 font-medium">Positive rating</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outcome Breakdown Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-md space-y-4">
          <h3 className="text-base font-bold text-foreground">Call Outcome Distribution</h3>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Appointments Booked', pct: 42, color: 'bg-indigo-500' },
              { label: 'Resolved Customer FAQs', pct: 36, color: 'bg-emerald-500' },
              { label: 'Warm Transferred to Staff', pct: 14, color: 'bg-amber-500' },
              { label: 'Voicemail Drops', pct: 8, color: 'bg-purple-500' }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.pct}%</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial ROI Calculation Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Estimated Financial Savings</h3>
            <p className="text-xs text-muted-foreground mt-1">Compared to traditional outsourced call center shifts</p>

            <div className="my-6 p-6 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-2">
              <div className="text-xs uppercase font-bold text-muted-foreground">Estimated Monthly Savings</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">
                $8,420
              </div>
              <p className="text-xs text-muted-foreground">
                Based on 214 front-desk staffing hours saved this month.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
            <span>Staffing Cost Saved: <strong>$10,250</strong></span>
            <span>CallioAI Cost: <strong>$1,830</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
