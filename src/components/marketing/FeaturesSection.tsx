'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheck01Icon,
  CheckIcon,
  ListChecksIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
} from "@hugeicons/core-free-icons";;

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface FeatureItem {
  index: string;
  title: string;
  description: string;
  visual: 'answer' | 'followup' | 'qualify' | 'schedule';
}

export interface FeaturesSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  features?: FeatureItem[];
}

/* ------------------------------------------------------------------ */
/* Small schematic product previews. Illustrative only — no metrics,   */
/* names, or claims beyond the adjacent copy. Decorative for AT.       */
/* ------------------------------------------------------------------ */

function AnswerPreview() {
  return (
    <Card className="w-full max-w-[400px] rounded-2xl border-neutral-200/80 bg-[#FFFFFF] shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)]">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <HugeiconsIcon icon={PhoneIncomingIcon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-neutral-900">Incoming call</p>
            <p className="text-[12.5px] text-neutral-500">Buyer inquiry</p>
          </div>
          <Badge className="ml-auto border-neutral-300 bg-neutral-100 text-neutral-800 shadow-none hover:bg-neutral-100">
            Answered
          </Badge>
        </div>
        <div className="mt-4 flex h-9 items-center gap-1" aria-hidden="true">
          {[35, 60, 45, 80, 55, 90, 65, 40, 70, 50, 85, 60, 45, 75, 55, 65].map((h, i) => (
            <span
              key={i}
              className="voice-wave-bar bg-gradient-to-t from-neutral-900 to-neutral-400"
              style={{
                height: `${h}%`,
                animationDelay: `${(i % 8) * 0.12}s`,
                animationDuration: `${1 + (i % 5) * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div className="mt-4 border-t border-neutral-100 pt-3.5 text-[12.5px] text-neutral-500">
          Live — AI agent responding around the clock
        </div>
      </CardContent>
    </Card>
  );
}

function FollowupPreview() {
  return (
    <Card className="w-full max-w-[400px] rounded-2xl border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)]">
      <CardContent className="space-y-0 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-900">
            <HugeiconsIcon icon={CheckIcon} className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="pb-5">
            <p className="text-[14px] font-semibold text-neutral-900">New website enquiry</p>
            <p className="text-[12.5px] text-neutral-500">Lead received</p>
          </div>
        </div>
        <div className="ml-4 h-5 w-px bg-neutral-200" aria-hidden="true" />
        <div className="flex items-start gap-3">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
            <HugeiconsIcon icon={PhoneOutgoingIcon} className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-neutral-400" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-neutral-900">Follow-up call placed</p>
            <p className="text-[12.5px] text-neutral-500">While interest is fresh</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QualifyPreview() {
  const rows = ['Preferred location', 'Budget range', 'Move-in timeline'];
  return (
    <Card className="w-full max-w-[400px] rounded-2xl border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={ListChecksIcon} className="h-4 w-4 text-neutral-900" />
          <p className="text-[14px] font-semibold text-neutral-900">Conversation notes</p>
        </div>
        <ul className="mt-4 space-y-2.5">
          {rows.map((row) => (
            <li
              key={row}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/60 px-3 py-2.5"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-900">
                <HugeiconsIcon icon={CheckIcon} className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-[13.5px] font-medium text-neutral-800">{row}</span>
              <span className="ml-auto text-[12px] text-neutral-400">Captured</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-neutral-100 pt-3.5 text-[12.5px] text-neutral-500">
          Details shared with your team
        </p>
      </CardContent>
    </Card>
  );
}

function SchedulePreview() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <Card className="w-full max-w-[400px] rounded-2xl border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={CalendarCheck01Icon} className="h-4 w-4 text-neutral-900" />
          <p className="text-[14px] font-semibold text-neutral-900">Visit scheduling</p>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5" aria-hidden="true">
          {days.map((day, i) => (
            <span
              key={i}
              className={`flex h-9 items-center justify-center rounded-lg text-[12px] font-semibold ${i === 5 ? 'bg-[#17171c] text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
            >
              {day}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-neutral-300 bg-neutral-100 px-3 py-2.5">
          <span className="text-[13.5px] font-medium text-neutral-800">Property visit</span>
          <Badge className="ml-auto border-transparent bg-transparent p-0 text-[12px] font-medium text-neutral-700 shadow-none hover:bg-transparent">
            Synced to calendar
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureVisual({ kind }: { kind: FeatureItem['visual'] }) {
  return (
    <div aria-hidden="true" className="flex justify-start lg:justify-center">
      {kind === 'answer' && <AnswerPreview />}
      {kind === 'followup' && <FollowupPreview />}
      {kind === 'qualify' && <QualifyPreview />}
      {kind === 'schedule' && <SchedulePreview />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    index: '01',
    title: 'Never miss an inquiry',
    description:
      'CallioAI answers incoming calls around the clock, giving buyers, sellers, and property owners a professional response even when your agents are unavailable.',
    visual: 'answer',
  },
  {
    index: '02',
    title: 'Follow up while interest is high',
    description:
      'CallioAI can initiate a prompt follow-up call when a new lead comes through your website, helping your team connect with prospects while their interest is fresh.',
    visual: 'followup',
  },
  {
    index: '03',
    title: 'Qualify the conversation',
    description:
      "CallioAI asks relevant questions, captures the prospect's requirements, and shares the conversation details with your team.",
    visual: 'qualify',
  },
  {
    index: '04',
    title: 'Book visits and callbacks',
    description:
      'CallioAI can schedule property visits, consultations, and callbacks through your connected calendar.',
    visual: 'schedule',
  },
];

/**
 * Detailed features section — editorial alternating text/visual rows separated
 * by subtle dividers. Same `#F6F4FF` canvas, Inter type, and ink as the hero.
 * No card grids, monochrome black/grey preview accents only (no chromatic color),
 * one functional icon per preview. Fully prop-driven with the approved defaults. */
export function FeaturesSection({
  eyebrow = 'Built for the way real estate works',
  heading = 'From first inquiry to scheduled visit.',
  description = 'CallioAI handles the conversations that keep your property business moving, from answering incoming calls to following up with new leads and scheduling visits.',
  features = DEFAULT_FEATURES,
}: FeaturesSectionProps) {
  return (
    <section aria-labelledby="features-heading" className="bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10 sm:px-10 sm:pt-24 sm:pb-12 lg:px-8">
        {/* Section header */}
        <div className="max-w-[720px]">
          <p className="flex items-center gap-2 text-[13.5px] font-medium text-neutral-500">
            <span className="h-[3px] w-4 rounded-full bg-[#5b50e6]" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2
            id="features-heading"
            className="mt-5 text-[55px] leading-[1.12] font-medium tracking-[-0.02em] text-black"
          >
            {heading}
          </h2>
          <p className="mt-5 max-w-[620px] text-[18px] leading-[1.6] text-[#5b5c64]">
            {description}
          </p>
        </div>

        {/* Alternating rows */}
        <div className="mt-6">
          {features.map((feature, i) => {
            const visualFirst = i % 2 === 1;
            return (
              <div key={feature.index}>
                <div className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-20">
                  <div className={visualFirst ? 'lg:order-2' : undefined}>
                    <p className="text-[13px] font-semibold tracking-[0.14em] text-black">
                      {feature.index}
                    </p>
                    <h3 className="mt-3 text-[32px] leading-[1.2] font-medium tracking-[-0.015em] text-black">
                      {feature.title}
                    </h3>
                    <p className="mt-4 max-w-[520px] text-[18px] leading-[1.65] text-[#5b5c64]">
                      {feature.description}
                    </p>
                  </div>
                  <div className={visualFirst ? 'lg:order-1' : undefined}>
                    <FeatureVisual kind={feature.visual} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
