import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { ArchitecturePipeline } from '@/components/marketing/ArchitecturePipeline';
import { DirectPhoneTestCall } from '@/components/marketing/DirectPhoneTestCall';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { HeroInteractiveCall } from '@/components/marketing/HeroInteractiveCall';
import { RoiCalculator } from '@/components/marketing/RoiCalculator';
import { UseCaseSimulator } from '@/components/marketing/UseCaseSimulator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'CallioAI — Autonomous AI Voice Calling for Modern Business',
  description:
    'Automate customer calls, qualify inbound leads in 30s, and book appointments on your calendar with natural, human-grade AI voice agents.',
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Ambient background mesh glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle Live Engine Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Voice Engine 2.0</span>
            <span className="opacity-40">•</span>
            <span className="text-foreground/90 font-mono">Sub-350ms Latency</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            AI voice agents that{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              actually close deals
            </span>{' '}
            & answer 24/7.
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Eliminate missed calls, dial web leads within 30 seconds, and schedule calendar appointments automatically with human-grade conversational voice intelligence.
          </p>

          {/* Hero Voice Agent Interactive Calling Widget */}
          <div className="mt-10 sm:mt-12">
            <HeroInteractiveCall />
          </div>

          {/* Secondary Quick Links / Value Props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Zero hold times
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Calendar & CRM sync
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              14-day free trial
            </span>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF & LIVE METRICS TICKER */}
      <section className="py-12 border-y border-border/40 bg-muted/10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 text-center mb-6">
            Trusted by modern clinics, brokerages, logistics, and fast-growing businesses
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70 text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-8">
            <span className="hover:text-foreground transition-colors">Acme Health</span>
            <span className="hover:text-foreground transition-colors">Oakwood Realty</span>
            <span className="hover:text-foreground transition-colors">Nexus Logistics</span>
            <span className="hover:text-foreground transition-colors">Apex Financial</span>
            <span className="hover:text-foreground transition-colors">Beacon Dental</span>
          </div>

          {/* Live Telemetry Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/30 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">1.2M+</div>
              <p className="text-xs text-muted-foreground">Voice Minutes Handled</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">&lt;350ms</div>
              <p className="text-xs text-muted-foreground">End-to-End Latency</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">94.2%</div>
              <p className="text-xs text-muted-foreground">First-Call Resolution</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">99.98%</div>
              <p className="text-xs text-muted-foreground">Telephony Core Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUB-350MS LATENCY ARCHITECTURE PIPELINE */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <ArchitecturePipeline />
      </section>

      {/* 5. INTERACTIVE USE CASE SIMULATOR */}
      <section className="py-16 sm:py-24 border-t border-border/40 max-w-6xl mx-auto px-4 sm:px-6">
        <UseCaseSimulator />
      </section>

      {/* 6. INBOUND VS OUTBOUND DEEP DIVE */}
      <section className="py-16 sm:py-24 border-t border-border/40 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 text-xs">
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 inline" />
              Two Powerful Modes
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Master inbound reception & proactive outbound dialing.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Whether answering high-stakes front-desk emergencies or reaching out to fresh website prospects, CallioAI delivers consistent performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inbound Receptionist Card */}
            <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card/70 space-y-5 shadow-xl marketing-glow-card">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <PhoneIncoming className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">24/7 Inbound Receptionist</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Never let another high-intent caller get stranded in voicemail. Your AI receptionist picks up on ring #1 across 100+ concurrent calls, checks real-time inventory, and schedules calendar appointments.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Always available 24/7/365 with zero busy signals</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calendar booking with automated SMS confirmation links</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Warm transfer with spoken briefing to team cellphones</span>
                </li>
              </ul>
              <div className="pt-3">
                <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
                  <Link href="/inbound-calls">
                    Explore Inbound Receptionist
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Outbound Campaigns Card */}
            <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card/70 space-y-5 shadow-xl marketing-glow-card">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <PhoneForwarded className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Sub-30s Speed-to-Lead Outbound</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Leads contacted within 5 minutes are 21x more likely to convert. CallioAI automatically triggers outbound calls to web form submissions while prospect intent is highest.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant callback upon web form or webhook submission</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Smart retry rules, time zone filtering & voicemail skip</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live 2-way syncing with HubSpot, Salesforce & CRMs</span>
                </li>
              </ul>
              <div className="pt-3">
                <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
                  <Link href="/outbound-calls">
                    Explore Outbound Campaigns
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE OUTBOUND PHONE TEST SECTION */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <DirectPhoneTestCall />
      </section>

      {/* 8. INTERACTIVE ROI & COST SAVINGS CALCULATOR */}
      <section className="py-16 sm:py-24 border-t border-border/40 max-w-6xl mx-auto px-4 sm:px-6">
        <RoiCalculator />
      </section>

      {/* 9. ENTERPRISE SECURITY & COMPLIANCE */}
      <section className="py-16 border-t border-border/40 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Built to meet the stringent privacy and uptime demands of hospitals, financial firms, and enterprise call operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-border/70 bg-card/60 text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs sm:text-sm text-foreground">SOC2 Type II</div>
              <p className="text-[11px] text-muted-foreground">Audited data handling and access controls</p>
            </div>

            <div className="p-5 rounded-2xl border border-border/70 bg-card/60 text-center space-y-2">
              <Lock className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs sm:text-sm text-foreground">HIPAA Compliant</div>
              <p className="text-[11px] text-muted-foreground">BAA execution and PHI audio redaction</p>
            </div>

            <div className="p-5 rounded-2xl border border-border/70 bg-card/60 text-center space-y-2">
              <Zap className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs sm:text-sm text-foreground">TCPA Compliant</div>
              <p className="text-[11px] text-muted-foreground">Calling hour checks and DNC filtering</p>
            </div>

            <div className="p-5 rounded-2xl border border-border/70 bg-card/60 text-center space-y-2">
              <Clock className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs sm:text-sm text-foreground">99.99% Uptime SLA</div>
              <p className="text-[11px] text-muted-foreground">Multi-region carrier failover redundancy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE FAQ ACCORDION */}
      <section className="py-16 sm:py-24 border-t border-border/40">
        <FaqAccordion />
      </section>

      {/* 11. HIGH-IMPACT FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-card to-card p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Ready to automate your phone calls?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Deploy your first AI voice agent in less than 5 minutes. No coding required. Start your 14-day free trial today.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl px-8 h-12 shadow-lg shadow-indigo-600/25"
                >
                  <Link href="/workflow">
                    Create Your Agent Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-7 h-12 font-medium border-border/80"
                >
                  <Link href="/pricing">View Pricing Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
