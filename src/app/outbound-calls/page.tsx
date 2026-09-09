import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  PhoneForwarded,
  Repeat,
  Sparkles,
  TrendingUp,
  Voicemail,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Outbound Calls & Campaigns — CallioAI',
  description:
    'Scale outbound sales qualification, speed-to-lead, and customer appointment reminders with natural AI voice agents.',
};

export default function OutboundCallsPage() {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/30 text-xs text-muted-foreground mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>High-Velocity Outbound Voice</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Sub-30 second callbacks and outreach at scale.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Reach inbound form submissions while interest is highest. Automate qualification, appointment reminders, and follow-ups with natural, human-sounding voice agents.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 h-10 text-xs font-semibold">
            <Link href="/campaigns">
              Start Campaign
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg px-4 h-10 text-xs font-medium border-border/70">
            <Link href="/ai-voice-agents">Listen to Sample Call</Link>
          </Button>
        </div>
      </div>

      {/* Campaign Metrics (Minimal & Clean) */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-6 sm:p-8 mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-5 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">Active Outbound Campaign</h2>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                Running
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Speed-to-lead callback funnel</p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Today, 09:00 AM</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-center">
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50">
            <div className="text-[11px] text-muted-foreground">Contacts Dialed</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono mt-1">1,824</div>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50">
            <div className="text-[11px] text-muted-foreground">Connected</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500 font-mono mt-1">1,291</div>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50">
            <div className="text-[11px] text-muted-foreground">Qualified Leads</div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono mt-1">423</div>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50">
            <div className="text-[11px] text-muted-foreground">Appointments</div>
            <div className="text-xl sm:text-2xl font-extrabold text-violet-400 font-mono mt-1">186</div>
          </div>
        </div>
      </div>

      {/* 4 Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        <div className="p-6 rounded-xl border border-border/70 bg-card/40 space-y-2">
          <h3 className="text-sm font-bold text-foreground">Speed-to-Lead Webhooks</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Trigger phone calls within 30 seconds of form submissions on your website, Unbounce, or Facebook Lead Ads.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border/70 bg-card/40 space-y-2">
          <h3 className="text-sm font-bold text-foreground">Voicemail Detection</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Detects answering machines instantly. Automatically drops a tailored voicemail message or retries later.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border/70 bg-card/40 space-y-2">
          <h3 className="text-sm font-bold text-foreground">Timezone Compliance</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Restricts calls strictly to local legal calling hours (e.g. 8:00 AM – 8:00 PM) based on area code.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border/70 bg-card/40 space-y-2">
          <h3 className="text-sm font-bold text-foreground">CRM Two-Way Sync</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Push qualification answers, audio recordings, and outcome tags directly into HubSpot, Salesforce, or webhooks.
          </p>
        </div>
      </div>

      {/* Minimal CTA */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-8 text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Scale your outbound phone pipeline.</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Start contacting web leads instantly with human-grade conversational voice.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs h-9 px-5">
            <Link href="/campaigns">Launch Outbound Campaign</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
