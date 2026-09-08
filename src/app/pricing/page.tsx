'use client';

import {
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Interactive Calculator States
  const [monthlyCalls, setMonthlyCalls] = useState<number>(2500);
  const [avgDurationMins, setAvgDurationMins] = useState<number>(2.5);

  const totalMinutes = useMemo(() => {
    return Math.round(monthlyCalls * avgDurationMins);
  }, [monthlyCalls, avgDurationMins]);

  const estimatedCost = useMemo(() => {
    // ~$0.12/min blended price
    const baseCost = totalMinutes * 0.12;
    const discount = billingCycle === 'annual' ? 0.8 : 1.0;
    return Math.round(baseCost * discount);
  }, [totalMinutes, billingCycle]);

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Ideal for local clinics, single-location offices, and boutique agencies.',
      priceMonthly: 79,
      priceAnnual: 64,
      minutesIncluded: '600 mins/mo',
      extraPerMin: '$0.14/min',
      features: [
        '2 Active AI Voice Agents',
        '1 Dedicated US/UK Phone Number',
        '24/7 Inbound Answering',
        'Calendar Booking (Google & Cal.com)',
        'Standard Email & SMS Summaries',
        'Community & Email Support'
      ],
      popular: false,
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/dashboard/agents/create'
    },
    {
      name: 'Growth',
      description: 'For growing businesses requiring both inbound reception and outbound campaigns.',
      priceMonthly: 249,
      priceAnnual: 199,
      minutesIncluded: '2,500 mins/mo',
      extraPerMin: '$0.11/min',
      features: [
        '5 Active AI Voice Agents',
        '3 Dedicated Phone Numbers',
        'Outbound Campaigns & Retry Engine',
        'Speed-to-Lead Webhook Trigger (<30s)',
        'CRM Sync (HubSpot, Salesforce, Zapier)',
        'Advanced Voicemail Detection',
        'Priority Slack & Email Support'
      ],
      popular: true,
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/dashboard/agents/create'
    },
    {
      name: 'Business',
      description: 'For high-volume operations, medical groups, and multi-location franchises.',
      priceMonthly: 699,
      priceAnnual: 559,
      minutesIncluded: '8,000 mins/mo',
      extraPerMin: '$0.09/min',
      features: [
        'Unlimited AI Voice Agents',
        '10 Dedicated Phone Numbers',
        'Warm Human Handoff with Spoken Briefing',
        'Knowledge Base PDF & Web Crawling',
        'Custom Voice Cloning Options',
        'Call Recording & AI Transcript Intelligence',
        'Dedicated Customer Success Manager'
      ],
      popular: false,
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/dashboard/agents/create'
    },
    {
      name: 'Enterprise',
      description: 'For corporate call centers, hospital networks, and high-security compliance.',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      minutesIncluded: 'High-volume custom tier',
      extraPerMin: 'Volume discount pricing',
      features: [
        'Dedicated Private Infrastructure',
        'Custom Telephony & SIP Trunking (BYOC)',
        'HIPAA BAA & SOC2 Type II Compliance',
        'On-Premise or Private Cloud Deployment',
        'Custom LLM Fine-Tuning & Prompts',
        '99.99% Guaranteed Voice SLA',
        '24/7 Technical Phone Support'
      ],
      popular: false,
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/contact'
    }
  ];

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
          Transparent, ROI-Driven Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Start automating your calls today.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Pay for what you use. All plans include full access to studio voices, calendar integrations, and low-latency voice models.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              billingCycle === 'annual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual Billing
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {pricingTiers.map((tier, idx) => {
          const isCustom = typeof tier.priceMonthly === 'string';
          const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={idx}
              className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular
                  ? 'border-indigo-500/80 bg-card shadow-2xl shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                  : 'border-border/80 bg-card/60 hover:bg-card shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0 text-xs px-3 py-0.5 shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 min-h-[36px]">{tier.description}</p>

                {/* Price display */}
                <div className="my-6">
                  {isCustom ? (
                    <div className="text-3xl font-extrabold text-foreground">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-foreground">${price}</span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                  )}
                  <div className="text-xs text-indigo-400 font-medium mt-1">
                    Includes {tier.minutesIncluded}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 text-xs text-muted-foreground py-4 border-t border-border/60">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-border/60">
                <Button
                  asChild
                  className={`w-full rounded-xl font-semibold text-xs h-10 ${
                    tier.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-secondary hover:bg-muted text-foreground'
                  }`}
                >
                  <Link href={tier.ctaHref}>{tier.ctaText}</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Usage & Cost Estimator */}
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-2xl mb-20 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Estimate Your Monthly Calling Cost</h2>
            <p className="text-xs text-muted-foreground">Slide according to your expected volume to see transparent pricing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-muted-foreground">Estimated Monthly Calls</span>
                <span className="text-foreground font-mono">{monthlyCalls.toLocaleString()} calls</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={monthlyCalls}
                onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                <span>500</span>
                <span>10,000</span>
                <span>25,000+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-muted-foreground">Average Call Duration</span>
                <span className="text-foreground font-mono">{avgDurationMins} minutes</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={avgDurationMins}
                onChange={(e) => setAvgDurationMins(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                <span>1 min</span>
                <span>4 mins</span>
                <span>8 mins</span>
              </div>
            </div>
          </div>

          {/* Result Calculation Output Card */}
          <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-medium">Estimated Monthly Usage</div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {totalMinutes.toLocaleString()} minutes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/70">
              <div className="text-xs text-muted-foreground">Estimated Monthly Cost</div>
              <div className="text-4xl font-extrabold text-indigo-400 mt-1 font-mono">
                ${estimatedCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1 font-medium">
                ~${(estimatedCost / Math.max(1, monthlyCalls)).toFixed(2)} per answered call
              </div>
            </div>

            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
              <Link href="/dashboard/agents/create">
                Get Started with this Plan →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
