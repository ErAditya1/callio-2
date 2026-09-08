'use client';

import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  Sparkles,
  TrendingUp,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ExplorerOption {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  recommendedAgent: string;
  recommendedVoice: string;
  outcome: string;
  metric: string;
  script: { speaker: 'ai' | 'customer'; text: string }[];
}

const EXPLORER_OPTIONS: ExplorerOption[] = [
  {
    id: 'answer-calls',
    icon: PhoneIncoming,
    title: 'Answer Every Inbound Call',
    subtitle: 'Zero wait times, 24/7 front desk coverage, and automated FAQ resolution.',
    recommendedAgent: 'Sarah — Front Desk Receptionist',
    recommendedVoice: 'Sarah (US Professional)',
    outcome: '100% of inbound calls answered without voicemail backlog.',
    metric: 'Zero Hold Time',
    script: [
      { speaker: 'customer', text: 'Hi, are you guys open this Saturday morning?' },
      { speaker: 'ai', text: 'Yes, we are open Saturdays from 9 AM to 2 PM. Would you like me to reserve a spot for you?' },
      { speaker: 'customer', text: 'Yes please, around 11 AM.' },
      { speaker: 'ai', text: 'Done! You are scheduled for Saturday at 11:00 AM with Dr. Bennett.' }
    ]
  },
  {
    id: 'book-appointments',
    icon: Calendar,
    title: 'Book & Reschedule Appointments',
    subtitle: 'Real-time calendar synchronization with automated SMS reminders.',
    recommendedAgent: 'Jordan — Automated Booking Specialist',
    recommendedVoice: 'Priya (Bilingual Courteous)',
    outcome: 'Appointments booked directly into Google Calendar & EHR.',
    metric: '+38% Show-up Rate',
    script: [
      { speaker: 'customer', text: 'I need to push my Tuesday appointment back to Friday.' },
      { speaker: 'ai', text: 'No problem! On Friday we have 10:00 AM or 3:15 PM open. Which one suits you better?' },
      { speaker: 'customer', text: 'Let’s do 3:15 PM.' },
      { speaker: 'ai', text: 'All updated! A calendar invite and SMS confirmation are on their way.' }
    ]
  },
  {
    id: 'qualify-leads',
    icon: Briefcase,
    title: 'Qualify Inbound Leads in 30 Seconds',
    subtitle: 'Call new website form submissions instantly, check budget, and route buyers.',
    recommendedAgent: 'Alex — Speed-to-Lead Qualifier',
    recommendedVoice: 'Alex (US Energetic)',
    outcome: 'Warm leads qualified with BANT criteria and transferred to sales reps.',
    metric: '3.4x More Demos Booked',
    script: [
      { speaker: 'ai', text: 'Hi David! Alex calling from CallioAI. I saw you just requested our volume pricing. Did you have two minutes?' },
      { speaker: 'customer', text: 'Yes, we are handling around 10,000 calls a month and losing leads after hours.' },
      { speaker: 'ai', text: 'That is exactly our specialty. Can I set up a live 15-minute walkthrough with our director tomorrow at 2 PM?' }
    ]
  },
  {
    id: 'customer-support',
    icon: Headphones,
    title: 'Instant Customer Support & FAQs',
    subtitle: 'Resolve common account questions, order tracking, and refund status.',
    recommendedAgent: 'Elena — Customer Care Specialist',
    recommendedVoice: 'Elena (Warm & Friendly)',
    outcome: 'Over 80% first-call resolution without human escalation.',
    metric: '-52% Support Costs',
    script: [
      { speaker: 'customer', text: 'I made an order yesterday but haven’t received my tracking link.' },
      { speaker: 'ai', text: 'I can locate that for you! Order #8492 shipped via FedEx and will arrive tomorrow before 4 PM. I just sent the live map link to your phone.' }
    ]
  },
  {
    id: 'outbound-campaigns',
    icon: TrendingUp,
    title: 'Run Automated Calling Campaigns',
    subtitle: 'Dial hundreds of contacts with smart retry rules and voicemail detection.',
    recommendedAgent: 'Marcus — Campaign Specialist',
    recommendedVoice: 'Marcus (UK Authoritative)',
    outcome: 'High connect rates with personalized customer outreach.',
    metric: '10,000+ Calls/Day',
    script: [
      { speaker: 'ai', text: 'Hello Robert! Calling regarding your annual HVAC service check. Would you like our technician to inspect your heating system this Thursday?' },
      { speaker: 'customer', text: 'Yes, Thursday afternoon works.' },
      { speaker: 'ai', text: 'Perfect. Your maintenance slot is confirmed for Thursday between 1 and 3 PM.' }
    ]
  },
  {
    id: 'fleet-dispatch',
    icon: Truck,
    title: 'Automate Driver & Logistics Check-ins',
    subtitle: 'Eliminate manual check calls and capture real-time ETAs and gate delays.',
    recommendedAgent: 'Liam — Dispatch Agent',
    recommendedVoice: 'Liam (Direct & Fast)',
    outcome: 'Instant load tracking updates synced directly to TMS.',
    metric: '92% Check-in Automation',
    script: [
      { speaker: 'ai', text: 'Hey Steve, automated check call from Apex Dispatch for load #9401. Are you on schedule for 2 PM in Dallas?' },
      { speaker: 'customer', text: 'Yeah, running smooth. 45 miles out, ETA 1:40 PM.' },
      { speaker: 'ai', text: 'Got it Steve, updated the receiver. Gate code is 8842. Drive safe!' }
    ]
  }
];

export function UseCaseExplorer() {
  const [selectedId, setSelectedId] = useState('answer-calls');
  const activeOption = EXPLORER_OPTIONS.find((o) => o.id === selectedId) || EXPLORER_OPTIONS[0];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
            Interactive Solutions Explorer
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            What do you want your AI agent to do?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Select a business goal below to see how CallioAI automates the conversation and delivers measurable ROI.
          </p>
        </div>

        {/* 2-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Goal Selectors */}
          <div className="lg:col-span-5 space-y-2.5">
            {EXPLORER_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = opt.id === selectedId;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedId(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20'
                      : 'border-border/60 bg-card/60 hover:bg-muted/40 hover:border-border'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-foreground text-sm sm:text-base">{opt.title}</div>
                      {isSelected && (
                        <Badge variant="outline" className="text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-500/30 py-0">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {opt.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Live Preview Card */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

            {/* Top Recommended Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Agent
                </span>
                <div className="text-lg font-bold text-foreground mt-0.5">{activeOption.recommendedAgent}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-3 py-1 font-semibold">
                  ROI: {activeOption.metric}
                </Badge>
              </div>
            </div>

            {/* Simulated Conversation Script */}
            <div className="py-6 space-y-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Example Live Conversation
              </div>

              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
                {activeOption.script.map((turn, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      turn.speaker === 'ai' ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        turn.speaker === 'ai'
                          ? 'bg-muted/80 text-foreground border border-border/50 rounded-tl-sm'
                          : 'bg-indigo-600 text-white rounded-tr-sm'
                      }`}
                    >
                      <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                        {turn.speaker === 'ai' ? 'CallioAI Agent' : 'Customer'}
                      </div>
                      {turn.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome & CTA */}
            <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>{activeOption.outcome}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Voice: <span className="text-foreground font-medium">{activeOption.recommendedVoice}</span>
                </div>
              </div>

              <Button
                asChild
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl font-semibold px-5"
              >
                <Link href="/dashboard/agents/create">
                  Build this Agent
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
