'use client';

import {
  ArrowRight,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function RoiCalculator() {
  const [monthlyCalls, setMonthlyCalls] = useState<number>(1200);
  const [avgMinutes, setAvgMinutes] = useState<number>(3.5);
  const [currentHourlyCost, setCurrentHourlyCost] = useState<number>(22); // $22/hr for front desk / SDR

  // Calculations
  const totalCallMinutes = monthlyCalls * avgMinutes;
  // CallioAI cost: ~0.11 / min (inclusive of telephony + speech + LLM)
  const callioMonthlyCost = Math.round(totalCallMinutes * 0.11);

  // Human staff hours needed (including wrap-up time + idle buffer: ~1.4x call time)
  const humanHoursNeeded = Math.ceil((totalCallMinutes * 1.4) / 60);
  // Human staff cost = hours * hourly rate + payroll overhead (15%)
  const humanMonthlyCost = Math.round(humanHoursNeeded * currentHourlyCost * 1.15);

  const monthlySavings = Math.max(0, humanMonthlyCost - callioMonthlyCost);
  const annualSavings = monthlySavings * 12;
  const savingsPercent = humanMonthlyCost > 0 ? Math.round((monthlySavings / humanMonthlyCost) * 100) : 0;

  // Missed calls recaptured: average small/mid business misses 24% of calls
  const estimatedMissedCalls = Math.round(monthlyCalls * 0.24);

  return (
    <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/70 to-card/95 p-6 sm:p-10 shadow-2xl relative overflow-hidden marketing-glow-card">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
            <Calculator className="w-3.5 h-3.5 mr-1.5 inline" />
            Interactive ROI Model
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Calculate your operational cost reduction.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            See how much your organization saves by replacing manual call queues and after-hours answering services with CallioAI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column (Left) */}
          <div className="lg:col-span-7 space-y-6 bg-muted/20 p-6 sm:p-8 rounded-2xl border border-border/60">
            {/* Slider 1: Monthly Calls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  Monthly Inbound & Outbound Calls
                </label>
                <span className="text-base font-bold text-indigo-400 font-mono px-3 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  {monthlyCalls.toLocaleString()} calls
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={monthlyCalls}
                onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                aria-label="Monthly Inbound & Outbound Calls"
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>100 calls</span>
                <span>5,000 calls</span>
                <span>10,000 calls</span>
              </div>
            </div>

            {/* Slider 2: Average Call Length */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Average Call Duration
                </label>
                <span className="text-base font-bold text-indigo-400 font-mono px-3 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  {avgMinutes} mins
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={avgMinutes}
                onChange={(e) => setAvgMinutes(Number(e.target.value))}
                aria-label="Average Call Duration"
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>1 min (quick triage)</span>
                <span>5 mins (scheduling)</span>
                <span>10 mins (in-depth support)</span>
              </div>
            </div>

            {/* Slider 3: Current Staff Hourly Rate */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Current Human Staff Hourly Rate
                </label>
                <span className="text-base font-bold text-indigo-400 font-mono px-3 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  ${currentHourlyCost}/hr
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="45"
                step="1"
                value={currentHourlyCost}
                onChange={(e) => setCurrentHourlyCost(Number(e.target.value))}
                aria-label="Current Human Staff Hourly Rate"
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>$12/hr (Offshore)</span>
                <span>$22/hr (US Receptionist)</span>
                <span>$45/hr (Specialized SDR)</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero after-hours overtime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant scale to 100+ concurrent calls</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-background to-background relative shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Estimated Annual Savings</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {savingsPercent}% Lower Cost
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                  ${annualSavings.toLocaleString()}
                  <span className="text-base sm:text-lg font-normal text-muted-foreground">/yr</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Saved across salaries, recruiting, benefits, and answering services.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Traditional Staff Cost:</span>
                  <span className="font-semibold text-rose-400 line-through font-mono">
                    ${(humanMonthlyCost * 12).toLocaleString()}/yr
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                  <span className="text-muted-foreground">CallioAI Platform Cost:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ${(callioMonthlyCost * 12).toLocaleString()}/yr
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-2">
                  <span className="text-muted-foreground">Missed Calls Recovered:</span>
                  <span className="font-bold text-indigo-400 font-mono">
                    ~{estimatedMissedCalls} calls/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold h-11 rounded-xl shadow-lg shadow-indigo-500/25">
                <Link href="/workflow">
                  Start Saving Today
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
