'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckIcon,
  CheckmarkCircle02Icon,
  MinusIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const PLANS = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Ideal for solo practitioners, boutique agencies, and local businesses automating front-desk calls.',
      monthlyPrice: 49,
      annualPrice: 39,
      includedMinutes: '500 mins/mo',
      overageRate: '$0.12/additional min',
      badge: null,
      popular: false,
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/workflow',
      features: [
        '500 monthly conversation minutes',
        '1 dedicated local or toll-free phone number',
        'Inbound receptionist & outbound calling',
        'Standard natural neural voices (40+ voices)',
        'Direct calendar booking (Google / Cal.com)',
        'Automated SMS appointment confirmations',
        'Unlimited custom knowledge uploads (PDF, FAQ)',
        'Basic webhook notifications',
        'Email & community support'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Best for growing clinics, real estate brokerages, and sales teams requiring high volume and deep CRM integrations.',
      monthlyPrice: 199,
      annualPrice: 159,
      includedMinutes: '2,500 mins/mo',
      overageRate: '$0.09/additional min',
      badge: 'Most Popular',
      popular: true,
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/workflow',
      features: [
        '2,500 monthly conversation minutes',
        '3 dedicated phone numbers + bring your own number',
        'Sub-350ms ultra-low latency streaming voice engine',
        'Premium Cartesia & ElevenLabs neural voices',
        'Warm human transfer with spoken voice briefing',
        'Full 2-way CRM sync (HubSpot, Salesforce, Zoho)',
        'Speed-to-lead outbound campaign triggers (<30s)',
        'Smart voicemail detection & personalized drops',
        'Custom webhook actions with live API payloads',
        'Priority Slack channel & phone support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for high-volume call centers, healthcare networks, and enterprises needing custom SIP infrastructure.',
      monthlyPrice: null, // Custom
      annualPrice: null,
      includedMinutes: '10,000+ mins/mo',
      overageRate: 'Custom tiered rates from $0.06/min',
      badge: 'High Scale',
      popular: false,
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/contact',
      features: [
        '10,000+ monthly minutes (custom volume discounting)',
        'Unlimited concurrent lines (1,000+ simultaneous calls)',
        'Bring Your Own Carrier / Custom SIP Trunking (Smartflo, Twilio)',
        'Fine-tuned domain-specific LLMs for your terminology',
        'HIPAA Business Associate Agreement (BAA) & SOC2 compliance',
        'Automated PII / PHI audio and transcript redaction',
        'Custom analytics dashboards & raw recording exports',
        'Dedicated Solutions Architect & Customer Success Manager',
        '99.99% Voice Uptime SLA guarantee'
      ]
    }
  ];

  const COMPARISON_ROWS = [
    { category: 'Telephony & Voice Channels' },
    { feature: 'Included Monthly Minutes', starter: '500 mins', growth: '2,500 mins', enterprise: '10,000+ mins' },
    { feature: 'Extra Minute Cost', starter: '$0.12 / min', growth: '$0.09 / min', enterprise: 'From $0.06 / min' },
    { feature: 'Dedicated Numbers', starter: '1 Number', growth: '3 Numbers', enterprise: 'Unlimited' },
    { feature: 'Concurrent Call Lines', starter: '5 lines', growth: '50 lines', enterprise: '1,000+ lines' },
    { feature: 'Bring Your Own Carrier / SIP', starter: false, growth: true, enterprise: true },
    { feature: 'Inbound Receptionist', starter: true, growth: true, enterprise: true },
    { feature: 'Outbound Campaigns', starter: true, growth: true, enterprise: true },

    { category: 'Voice & AI Capabilities' },
    { feature: 'Voice Latency', starter: '<450ms', growth: '<350ms (Ultra-Low)', enterprise: '<320ms (Dedicated Edge)' },
    { feature: 'Barge-In (Interruption Handling)', starter: true, growth: true, enterprise: true },
    { feature: 'Multi-Language Support (40+)', starter: true, growth: true, enterprise: true },
    { feature: 'Warm Transfer to Human Team', starter: 'Basic', growth: 'With Spoken Briefing', enterprise: 'Advanced Multi-Department' },
    { feature: 'Fine-Tuned Custom Models', starter: false, growth: false, enterprise: true },

    { category: 'Integrations & Actions' },
    { feature: 'Google Calendar & Cal.com', starter: true, growth: true, enterprise: true },
    { feature: 'SMS Confirmation & Links', starter: true, growth: true, enterprise: true },
    { feature: 'HubSpot & Salesforce CRM', starter: false, growth: true, enterprise: true },
    { feature: 'Webhooks & Zapier API', starter: 'Basic', growth: 'Real-Time Bi-Directional', enterprise: 'Dedicated Private Endpoints' },

    { category: 'Security & Support' },
    { feature: '256-bit TLS Audio Encryption', starter: true, growth: true, enterprise: true },
    { feature: 'HIPAA BAA Agreement', starter: false, growth: false, enterprise: true },
    { feature: 'Automated PII Redaction', starter: false, growth: true, enterprise: true },
    { feature: 'Support Level', starter: 'Email Support', growth: 'Priority 24/7 Slack & Phone', enterprise: 'Dedicated Account Manager' },
    { feature: 'Uptime SLA', starter: '99.9%', growth: '99.95%', enterprise: '99.99%' }
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 text-xs">
          <HugeiconsIcon icon={SparklesIcon} className="w-3.5 h-3.5 mr-1.5 inline" />
          Transparent, ROI-Driven Pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
          Simple plans. Unlimited scale.{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Pay only for results.
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Deploy autonomous voice agents for a fraction of traditional call center or receptionist costs.
          No hidden telephony fees. 14-day free trial on all plans.
        </p>

        {/* Monthly vs Annual Billing Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-md">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              !isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
        {PLANS.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                plan.popular
                  ? 'border-indigo-500/80 bg-gradient-to-b from-card via-card to-indigo-950/20 shadow-2xl shadow-indigo-500/10 lg:-translate-y-2'
                  : 'border-border/70 bg-card/60 hover:border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="text-[11px] font-bold tracking-wider uppercase text-white bg-indigo-600 px-4 py-1 rounded-bl-xl shadow-md">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-5 border-y border-border/50 my-6">
                  {price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                        ${price}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">/ month</span>
                      {isAnnual && (
                        <span className="text-[11px] text-muted-foreground ml-2">billed annually</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground">Custom</span>
                      <span className="text-xs text-muted-foreground font-medium">tailored to volume</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {plan.includedMinutes}
                    </span>
                    <span className="text-muted-foreground">{plan.overageRate}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    What is included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-snug">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border/40">
                <Button
                  asChild
                  className={`w-full h-11 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border/70'
                  }`}
                >
                  <Link href={plan.ctaHref}>
                    {plan.ctaText}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <p className="text-[11px] text-center text-muted-foreground mt-2">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-24 rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Compare Plan Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Detailed breakdown of features, telephony limits, and security across all tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="py-4 px-4 font-bold text-foreground w-2/5">Plan Features</th>
                <th className="py-4 px-4 font-bold text-foreground w-1/5 text-center">Starter</th>
                <th className="py-4 px-4 font-bold text-indigo-400 w-1/5 text-center bg-indigo-500/5 rounded-t-xl">Growth</th>
                <th className="py-4 px-4 font-bold text-foreground w-1/5 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {COMPARISON_ROWS.map((row, idx) => {
                if (row.category) {
                  return (
                    <tr key={idx} className="bg-muted/30">
                      <td colSpan={4} className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        {row.category}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground/90">{row.feature}</td>
                    
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <HugeiconsIcon icon={CheckIcon} className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <HugeiconsIcon icon={MinusIcon} className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">{row.starter}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center bg-indigo-500/5">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? (
                          <HugeiconsIcon icon={CheckIcon} className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <HugeiconsIcon icon={MinusIcon} className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono text-xs font-semibold text-indigo-300">{row.growth}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <HugeiconsIcon icon={CheckIcon} className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <HugeiconsIcon icon={MinusIcon} className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono text-xs font-semibold text-foreground">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="mb-20">
        <FaqAccordion />
      </div>

      {/* Final Conversion Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-card p-10 sm:p-14 text-center space-y-5 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Ready to supercharge your phone operations?
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Create your first AI voice agent in 2 minutes. Start talking with your agent right inside your web browser.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl px-8 shadow-lg shadow-indigo-600/25">
            <Link href="/workflow">
              Start Free Trial Now
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl border-border/80">
            <Link href="/contact">Speak with an Engineer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
