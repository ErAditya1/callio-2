'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type TierId = 'starter' | 'growth' | 'enterprise';

export interface PricingFeature {
  label: string;
  /** Tiers where the feature is included; rendered muted + struck through elsewhere. */
  includedIn: TierId[];
}

export interface PricingPlan {
  id: TierId;
  name: string;
  audience: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}

export interface PricingSectionProps {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
  features?: PricingFeature[];
  footnote?: string;
  footnoteLinkLabel?: string;
  footnoteLinkHref?: string;
}

/* Single source of truth: one ordered list, same order in every card. */
const DEFAULT_FEATURES: PricingFeature[] = [
  // Starter capabilities (included in all tiers)
  { label: '500 monthly conversation minutes', includedIn: ['starter', 'growth', 'enterprise'] },
  { label: 'Standard natural neural voices with 40+ voice options', includedIn: ['starter', 'growth', 'enterprise'] },
  { label: 'Direct calendar booking with Google Calendar and Cal.com', includedIn: ['starter', 'growth', 'enterprise'] },
  { label: 'Automated SMS appointment confirmations', includedIn: ['starter', 'growth', 'enterprise'] },
  { label: 'Email and community support', includedIn: ['starter', 'growth', 'enterprise'] },
  // Growth capabilities (Growth + Enterprise)
  { label: '2,500 monthly conversation minutes', includedIn: ['growth', 'enterprise'] },
  { label: 'Speed-to-lead outbound campaign triggers in under 30 seconds', includedIn: ['growth', 'enterprise'] },
  { label: '10,000+ monthly minutes with custom volume discounting', includedIn: ['enterprise'] },
  { label: 'Custom analytics dashboards and raw recording exports', includedIn: ['enterprise'] },
];

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For individual agents and small teams',
    ctaLabel: 'Get Started',
    ctaHref: '/auth/login',
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'For busy teams managing a steady flow of leads',
    ctaLabel: 'Book a Demo',
    ctaHref: '/auth/login',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Brokerage',
    audience: 'For brokerages with multiple agents or teams',
    ctaLabel: 'Talk to Sales',
    ctaHref: '/auth/login',
  },
];

/**
 * Pricing section — centered header, three equal white tier cards sharing one
 * ordered feature list. Unavailable features stay visible, muted + struck
 * through, so tiers compare at a glance. Growth is elevated with the black CTA.
 */
export function PricingSection({
  heading = 'Pricing',
  description = 'Start with the call coverage you need today, then choose a plan that fits your lead volume and workflow as your business grows.',
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  footnote = 'Choose a plan based on your call volume, team size, and workflow requirements.',
  footnoteLinkLabel = 'Contact us for plan details and pricing.',
  footnoteLinkHref = '/contact',
}: PricingSectionProps) {
  return (
    <section aria-labelledby="pricing-heading" className="bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 pb-16 sm:px-10 sm:pt-12 sm:pb-24 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-[640px] text-center">
          <h2
            id="pricing-heading"
            className="text-[55px] leading-[1.12] font-medium tracking-[-0.02em] text-[#0b0b0e]"
          >
            {heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#5b5c64]">{description}</p>
        </div>

        {/* Tier cards */}
        <div className="mx-auto mt-12 grid max-w-[1080px] gap-6 sm:mt-14 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col rounded-2xl border-neutral-200/80 bg-white p-2 ${plan.highlighted
                ? 'shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)] lg:-translate-y-2'
                : 'shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)]'
                }`}
            >
              <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-[32px] font-semibold tracking-tight text-[#0b0b0e]">
                  {plan.name}
                </h3>
                <p className="mt-1.5 min-h-[42px] text-[14px] leading-[1.55] text-neutral-500">
                  {plan.audience}
                </p>
                <ul className="mt-6 space-y-3">
                  {features.map((feature) => {
                    const included = feature.includedIn.includes(plan.id);
                    return (
                      <li
                        key={feature.label}
                        className={`flex items-start gap-2.5 text-[14.5px] leading-[1.5] ${included
                          ? 'text-neutral-700'
                          : 'text-neutral-400 line-through decoration-neutral-300'
                          }`}
                      >
                        <HugeiconsIcon icon={CheckIcon}
                          aria-hidden="true"
                          className={`mt-0.5 h-4 w-4 shrink-0 ${included ? 'text-emerald-600' : 'text-neutral-300'}`}
                          strokeWidth={2.5}
                        />
                        {feature.label}
                      </li>
                    );
                  })}
                </ul>
                <Button
                  asChild
                  className={`mt-8 w-full rounded-[10px] text-[14.5px] font-medium ${plan.highlighted
                    ? 'bg-[#17171c] text-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.35)] hover:bg-[#232329]'
                    : 'border-neutral-200 bg-white text-neutral-900 shadow-none hover:bg-neutral-50'
                    }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-10 max-w-[640px] text-center text-[14px] leading-[1.6] text-[#5b5c64]">
          {footnote}{' '}
          <Link href={footnoteLinkHref} className="font-medium text-neutral-900 hover:underline">
            {footnoteLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
