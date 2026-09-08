import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Headphones,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Radio,
  Repeat,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'AI Calling Platform — CallioAI',
  description: 'Turn phone calls into automated business workflows. Inbound receptionist, outbound campaigns, and real-time conversation intelligence.',
};

export default function AICallingPage() {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
          <PhoneCall className="w-3.5 h-3.5 mr-1.5 inline" />
          Enterprise Telephony Engine
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Turn phone calls into automated workflows.
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
          From incoming front-desk calls to automated thousands-strong outbound campaigns, CallioAI powers complete calling operations with zero infrastructure setup.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25">
            <Link href="/dashboard/agents/create">
              Get Started with AI Calling
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/demo">
              <Radio className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
              Try a Live Demo Call
            </Link>
          </Button>
        </div>
      </div>

      {/* Two Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <PhoneIncoming className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Inbound Calling Solutions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eliminate missed calls and long customer hold times. CallioAI acts as your primary front desk, triaging caller inquiries, answering questions, and transferring complex emergencies to staff.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant pickup on ring #1 across all concurrent calls</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct calendar booking (Cal.com, Google Calendar)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Intelligent warm handoff with spoken briefing</span>
            </li>
          </ul>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/inbound-calls">Explore Inbound Receptionist →</Link>
          </Button>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <PhoneForwarded className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Outbound Calling Campaigns</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Scale proactive customer communication. Reach out to new website leads within 30 seconds, re-engage inactive customers, conduct post-service surveys, and run recall campaigns.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Upload CSV contacts or trigger automatically via Webhooks</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Advanced voicemail detection with custom voice drops</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Visual conversion funnels and automated disposition tags</span>
            </li>
          </ul>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/outbound-calls">Explore Outbound Campaigns →</Link>
          </Button>
        </div>
      </div>

      {/* Operational Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
          <Repeat className="w-6 h-6 text-indigo-400" />
          <h3 className="font-bold text-foreground text-lg">Smart Retry Engine</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Never lose a prospect to an unanswered call. Configure automatic retry rules respecting local time zones and TCPA compliance.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <h3 className="font-bold text-foreground text-lg">Conversation Analytics</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Inspect call durations, resolution rates, buyer sentiment, and intent trends in one unified dashboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <h3 className="font-bold text-foreground text-lg">Bring Your Own Carrier</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Use CallioAI's ready-to-dial numbers or connect your existing Twilio, Vonage, or SIP trunk with zero downtime.
          </p>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-card p-10 sm:p-14 text-center space-y-5">
        <h2 className="text-3xl font-extrabold text-foreground">Ready to automate your calling operations?</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Start with a 14-day free trial. Deploy an inbound receptionist or run your first campaign in minutes.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8">
          <Link href="/dashboard/agents/create">Build Your Agent →</Link>
        </Button>
      </div>
    </div>
  );
}
