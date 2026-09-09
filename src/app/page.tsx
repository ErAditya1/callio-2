import {
  ArrowRight,
  CheckCircle2,
  Lock,
  PhoneForwarded,
  PhoneIncoming,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { HeroInteractiveCall } from '@/components/marketing/HeroInteractiveCall';
import { DirectPhoneTestCall } from '@/components/marketing/DirectPhoneTestCall';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'CallioAI — AI Voice Agents that Get Work Done',
  description:
    'Automate customer calls, qualify leads, and book appointments with natural, human-grade AI voice agents.',
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      {/* 1. HERO SECTION (Minimal & Focused) */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle Focus Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/30 text-muted-foreground text-xs font-medium mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Autonomous Voice Intelligence</span>
            <span className="opacity-40">•</span>
            <span className="text-foreground/80 font-normal">Sub-350ms Latency</span>
          </div>

          {/* Clean Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            AI voice agents that{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              actually get work done.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Automate inbound customer calls, qualify inbound leads, and schedule appointments on your calendar with natural, human-like voice conversations.
          </p>

          {/* Hero Voice Agent Interactive Showcase (Single Focus) */}
          <div className="mt-10 sm:mt-12">
            <HeroInteractiveCall />
          </div>

          {/* Secondary Quick Links */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/workflow" className="hover:text-foreground transition-colors inline-flex items-center gap-1 font-medium">
              Create your voice agent <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
            <span>•</span>
            <Link href="/ai-voice-agents" className="hover:text-foreground transition-colors">
              Explore AI voice agents
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MINIMAL SOCIAL PROOF (Quiet & Clean) */}
      <section className="py-10 border-y border-border/40 bg-muted/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70 mb-6">
            Trusted by clinics, real estate teams, logistics, and fast-growing businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Acme Health</span>
            <span>Oakwood Realty</span>
            <span>Nexus Logistics</span>
            <span>Apex Financial</span>
            <span>Beacon Dental</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Simple to deploy. Powerful in production.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Turn your business knowledge into an autonomous phone agent in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/60 bg-card/40 space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-500">01</span>
              <h3 className="font-semibold text-foreground text-base">Train with your knowledge</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your website FAQs, scheduling rules, or documents. Your agent learns your business in minutes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-card/40 space-y-2">
              <span className="text-xs font-mono font-bold text-violet-500">02</span>
              <h3 className="font-semibold text-foreground text-base">Connect phone numbers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Assign a dedicated local number or forward calls from your existing Twilio, Telnyx, or carrier system.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-card/40 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-500">03</span>
              <h3 className="font-semibold text-foreground text-base">Automate real outcomes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The agent answers calls instantly, books appointments directly into your calendar, and updates your CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INBOUND VS OUTBOUND (Clean 2-Column Split) */}
      <section className="py-16 sm:py-20 border-t border-border/40 bg-muted/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inbound */}
            <div className="p-8 rounded-2xl border border-border/70 bg-card/60 space-y-4">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <PhoneIncoming className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Inbound Calling & Reception</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Never let another high-intent call go to voicemail. Your AI receptionist answers 24/7 on the first ring, answers complex questions, and routes urgent cases to staff.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>24/7/365 availability with zero wait queues</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Calendar scheduling with automated confirmation SMS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Warm transfer to human staff when requested</span>
                </li>
              </ul>
            </div>

            {/* Outbound */}
            <div className="p-8 rounded-2xl border border-border/70 bg-card/60 space-y-4">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <PhoneForwarded className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Outbound Speed-to-Lead</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Dial website leads within 30 seconds of form submission. Qualify prospects while interest is high and dramatically increase sales conversion rates.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Instant callback upon web form submission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Smart retry rules, timezone detection & voicemail skip</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Live CRM syncing to HubSpot, Salesforce, or webhooks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. LIVE OUTBOUND PHONE TEST SECTION */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <DirectPhoneTestCall />
      </section>

      {/* 5. MEASURABLE METRICS (Minimal Numbers) */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">+38%</div>
              <p className="text-xs text-muted-foreground">More Appointments Booked</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">-52%</div>
              <p className="text-xs text-muted-foreground">Support Cost per Call</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">94.2%</div>
              <p className="text-xs text-muted-foreground">First-Call Resolution</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">&lt;30s</div>
              <p className="text-xs text-muted-foreground">Speed-to-Lead Callback</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ENTERPRISE SECURITY (Focused Row) */}
      <section className="py-12 border-t border-border/40 bg-muted/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-bit TLS Audio Encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" /> Automated PII Redaction
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" /> 99.9% Uptime Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* 7. MINIMAL FINAL CTA */}
      <section className="py-16 sm:py-24 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ready to automate your phone calls?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Deploy your first AI voice agent in less than 5 minutes. No credit card required.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button asChild className="rounded-xl px-6 h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm">
              <Link href="/workflow">
                Create Voice Agent
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-5 h-11 font-medium text-sm">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
