import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Headphones,
  Lock,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

import { HeroInteractiveCall } from '@/components/marketing/HeroInteractiveCall';
import { ProductSimulator } from '@/components/marketing/ProductSimulator';
import { UseCaseExplorer } from '@/components/marketing/UseCaseExplorer';
import { VoiceShowcase } from '@/components/marketing/VoiceShowcase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'CallioAI — AI Voice Agents that Get Work Done',
  description: 'Automate customer calls, qualify leads, book appointments, and follow up with human-grade AI voice agents. The business operating system for phone calls.',
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[20%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[5%] right-[20%] w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-[130px]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CallioAI 2.0 is Live</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Ultra-Low 350ms Voice Latency</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.1]">
            AI voice agents that{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-400 to-violet-500 bg-clip-text text-transparent">
              actually get work done.
            </span>
          </h1>

          {/* Supporting Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automate customer calls, qualify leads, book appointments, answer questions, and follow up
            automatically with natural, human-grade voice agents.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/25 rounded-xl font-semibold px-7 h-12 text-base"
            >
              <Link href="/dashboard/agents/create">
                Build your AI Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto rounded-xl border-border/80 hover:bg-muted font-medium px-6 h-12 text-base"
            >
              <Link href="/demo">
                <Radio className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
                Try a Live Demo
              </Link>
            </Button>
          </div>

          {/* Hero Live Call Simulator Preview */}
          <div className="mt-14 lg:mt-20">
            <HeroInteractiveCall />
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / TRUSTED BY */}
      <section className="py-12 border-y border-border/50 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-8">
            Trusted by over 1,200+ clinics, brokerages, logistics fleets, and fast-growing businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" /> ACME Health
            </div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> Oakwood Realty
            </div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Nexus Logistics
            </div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> Apex Financial
            </div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500" /> Beacon Dental
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE USE CASE EXPLORER */}
      <UseCaseExplorer />

      {/* 4. HOW CALLIOAI WORKS (Understand -> Decide -> Act -> Outcome) */}
      <section className="py-20 lg:py-28 relative bg-card/40 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
              Autonomous Intelligence
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How CallioAI turns phone calls into outcomes.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Every conversation follows a battle-tested decision pipeline to understand customer intent,
              consult your business logic, and execute real actions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-foreground text-lg">Understand</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Listens with human-grade speech recognition, detects intent, accents, and emotional sentiment in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-foreground text-lg">Decide</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Consults your knowledge base, calendar availability, CRM data, and qualification rules in sub-seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-foreground text-lg">Act</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Books the calendar slot, logs notes to HubSpot, triggers SMS confirmation, or warm-transfers to your team.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3 relative group hover:border-blue-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-bold text-foreground text-lg">Outcome</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Delivers structured call summaries, audio recordings, conversion metrics, and actionable analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT LIFECYCLE SIMULATOR */}
      <ProductSimulator />

      {/* 6. STUDIO VOICES SHOWCASE */}
      <VoiceShowcase />

      {/* 7. INBOUND VS OUTBOUND CALLING SECTION */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Inbound Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-xl shadow-black/10">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit">
                  <PhoneIncoming className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Inbound Calling & AI Receptionist
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Never miss another customer call. CallioAI answers instantly on the first ring, 24/7, resolving questions, booking appointments, and routing complex cases to your staff with full context.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>24/7/365 availability with zero queue wait times</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Intelligent live human transfer with caller briefing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Automated SMS follow-ups & confirmation links</span>
                  </li>
                </ul>
              </div>

              <Button asChild variant="outline" className="w-fit rounded-xl">
                <Link href="/inbound-calls">
                  Explore Inbound Calling →
                </Link>
              </Button>
            </div>

            {/* Outbound Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-xl shadow-black/10">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit">
                  <PhoneForwarded className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Outbound Campaigns & Speed-to-Lead
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Call leads within 30 seconds of filling out a form, follow up with existing customers, and run outreach campaigns that feel completely natural and convert at scale.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Sub-30 second callback for web inquiries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Smart retry logic, timezone scheduling & voicemail detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Visual campaign funnels and conversion analytics</span>
                  </li>
                </ul>
              </div>

              <Button asChild variant="outline" className="w-fit rounded-xl">
                <Link href="/outbound-calls">
                  Explore Outbound Campaigns →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BUSINESS ROI & CUSTOMER STORIES METRICS */}
      <section className="py-20 lg:py-28 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
              Measurable Business ROI
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Proven outcomes for businesses of every size.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground">+38%</div>
              <div className="text-sm font-semibold text-foreground">More Appointments</div>
              <p className="text-xs text-muted-foreground">Booked directly onto team calendars</p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground">-52%</div>
              <div className="text-sm font-semibold text-foreground">Support Overhead</div>
              <p className="text-xs text-muted-foreground">Cut per-ticket voice support costs</p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground">94.2%</div>
              <div className="text-sm font-semibold text-foreground">First-Call Resolution</div>
              <p className="text-xs text-muted-foreground">Resolved without human escalation</p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground">3.4x</div>
              <div className="text-sm font-semibold text-foreground">Speed-to-Lead Capacity</div>
              <p className="text-xs text-muted-foreground">Form submissions dialed in &lt;30s</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE SECURITY & TRUST */}
      <section className="py-20 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
            <Lock className="w-3.5 h-3.5 mr-1.5 inline" />
            Enterprise-Grade Security
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built with security, privacy, and compliance first.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            End-to-end encryption in transit and at rest, role-based access control, SOC2 & HIPAA ready architecture, and strict data retention controls.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit TLS Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dedicated Private Numbers
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Automated PII Redaction
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 99.99% Voice SLA
            </span>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 via-card to-card p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
              Your next conversation could be automated.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Build an AI voice agent that answers, talks, and takes action for your business in less than 5 minutes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 rounded-xl font-semibold px-8 h-12 text-base"
              >
                <Link href="/dashboard/agents/create">
                  Build Your Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto rounded-xl border-border/80 hover:bg-muted font-medium px-6 h-12 text-base"
              >
                <Link href="/demo">
                  Try a Live Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
