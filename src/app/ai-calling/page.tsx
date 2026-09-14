import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Repeat,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { ArchitecturePipeline } from '@/components/marketing/ArchitecturePipeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'AI Calling Platform — Enterprise Telephony & Voice Workflows | CallioAI',
  description:
    'Turn customer phone calls into automated business workflows. Inbound receptionist, speed-to-lead outbound dialer, and real-time conversation intelligence.',
};

export default function AICallingPage() {
  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
        <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3.5 py-1 text-xs">
          <PhoneCall className="w-3.5 h-3.5 mr-1.5 inline" />
          Enterprise Telephony Engine
        </Badge>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Turn phone calls into{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            automated workflows.
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          From incoming front-desk customer support to automated thousands-strong outbound sales campaigns, CallioAI powers your entire calling operations with zero telephony infrastructure.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 px-8 h-12 text-sm font-semibold"
          >
            <Link href="/dashboard/agents/create">
              Get Started with AI Calling
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl px-7 h-12 text-sm font-medium border-border/80">
            <Link href="/pricing">
              View Pricing & Plans
            </Link>
          </Button>
        </div>
      </div>

      {/* Two Pillars: Inbound & Outbound */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        {/* Inbound Solution */}
        <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card/70 space-y-6 shadow-xl marketing-glow-card">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <PhoneIncoming className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Inbound Calling Solutions</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Eliminate missed calls and long hold times. CallioAI acts as your primary front desk, triaging caller inquiries, checking inventory, answering FAQs, and transferring complex emergencies to staff.
            </p>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant pickup on ring #1 across 100+ concurrent calls</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct calendar booking (Google Calendar, Outlook & Cal.com)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Intelligent warm handoff with spoken spoken context briefing</span>
            </li>
          </ul>
          <div className="pt-2">
            <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
              <Link href="/inbound-calls">
                Explore Inbound Receptionist →
              </Link>
            </Button>
          </div>
        </div>

        {/* Outbound Campaigns */}
        <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card/70 space-y-6 shadow-xl marketing-glow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <PhoneForwarded className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Outbound Calling Campaigns</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Scale proactive customer communication. Reach out to new website leads within 30 seconds, re-engage inactive customers, conduct post-service surveys, and run recall campaigns at push-button speed.
            </p>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Upload CSV contacts or trigger automatically via Webhooks</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Advanced voicemail detection with personalized voice drops</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live 2-way syncing to HubSpot, Salesforce, or webhooks</span>
            </li>
          </ul>
          <div className="pt-2">
            <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
              <Link href="/outbound-calls">
                Explore Outbound Campaigns →
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sub-350ms Latency Pipeline Component */}
      <div className="mb-24">
        <ArchitecturePipeline />
      </div>

      {/* Operational Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <div className="p-6 sm:p-7 rounded-2xl border border-border/70 bg-card/60 space-y-3 marketing-glow-card">
          <Repeat className="w-6 h-6 text-indigo-400" />
          <h3 className="font-bold text-foreground text-base sm:text-lg">Smart Retry Engine</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Never lose a prospect to an unanswered call. Configure automatic retry rules respecting local time zones and TCPA compliance.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl border border-border/70 bg-card/60 space-y-3 marketing-glow-card">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <h3 className="font-bold text-foreground text-base sm:text-lg">Conversation Analytics</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Inspect call durations, resolution rates, buyer sentiment, intent trends, and full searchable transcripts in one unified dashboard.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl border border-border/70 bg-card/60 space-y-3 marketing-glow-card">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <h3 className="font-bold text-foreground text-base sm:text-lg">Bring Your Own Carrier (BYOC)</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Use CallioAI's ready-to-dial numbers or connect your existing Twilio, Smartflo, or SIP trunk with zero downtime.
          </p>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-card p-10 sm:p-14 text-center space-y-5 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Ready to automate your calling operations?
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Start with a 14-day free trial. Deploy an inbound receptionist or run your first outbound campaign in minutes.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl px-8 shadow-lg shadow-indigo-600/25">
            <Link href="/dashboard/agents/create">
              Build Your Agent Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/ai-voice-agents">Try Live Demo Calls</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
