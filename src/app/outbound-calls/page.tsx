import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  PhoneCall,
  PhoneForwarded,
  Radio,
  Repeat,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Voicemail,
  Zap
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Outbound Calls & Campaigns — CallioAI',
  description: 'Scale outbound sales qualification, appointment recalls, and customer follow-up calls with natural AI voice agents.',
};

export default function OutboundCallsPage() {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-purple-500/30 text-purple-400 bg-purple-500/10 px-3 py-1">
          <PhoneForwarded className="w-3.5 h-3.5 mr-1.5 inline" />
          High-Velocity Outbound
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Let AI handle your outbound calls.
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
          From calling new web leads in under 30 seconds to running thousands of patient appointment recalls, CallioAI conducts human-sounding outreach that converts.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25">
            <Link href="/dashboard/campaigns">
              Create a Calling Campaign
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/demo/call?agent=agent-sales">
              <Radio className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
              Listen to Outbound SDR Call
            </Link>
          </Button>
        </div>
      </div>

      {/* Visual Campaign Dashboard Mockup */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">September Enterprise Lead Follow-up</h2>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                ● Running
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Outbound Agent: Alex (US Energetic) • Caller ID: +1 (888) 720-9110</p>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Started: Today at 9:00 AM EST
          </div>
        </div>

        {/* Funnel Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-8 text-center">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="text-xs text-muted-foreground">Contacts</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">2,480</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="text-xs text-muted-foreground">Calls Placed</div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">1,824</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="text-xs text-muted-foreground">Connected</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">1,291</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="text-xs text-muted-foreground">Qualified</div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-1">423</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 col-span-2 sm:col-span-1">
            <div className="text-xs text-muted-foreground">Appointments</div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-400 mt-1">186</div>
          </div>
        </div>

        {/* Progress Funnel Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Campaign Progress (73% Completed)</span>
            <span className="text-emerald-400 font-semibold">14.4% Appointment Conversion Rate</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[52%]" />
            <div className="bg-indigo-500 h-full w-[21%]" />
            <div className="bg-purple-500 h-full w-[14%]" />
          </div>
        </div>
      </div>

      {/* 4 Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-3">
          <Zap className="w-8 h-8 text-amber-400" />
          <h3 className="text-xl font-bold text-foreground">30-Second Speed-to-Lead</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect a webhook from HubSpot, Webflow, or Zapier. The moment a prospect submits your form, CallioAI triggers an outbound call to qualify their project requirements while their buying intent is at its highest.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-3">
          <Voicemail className="w-8 h-8 text-indigo-400" />
          <h3 className="text-xl font-bold text-foreground">Smart Voicemail Drops</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our audio machine learning model identifies answering machine tones with 99.4% accuracy. Instead of talking to a beep, the agent leaves a perfectly timed, personalized voicemail message.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-3">
          <Repeat className="w-8 h-8 text-emerald-400" />
          <h3 className="text-xl font-bold text-foreground">Intelligent Cadence & Retry Rules</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Specify how many times to retry unanswered numbers, interval spacing, and strict calling windows to guarantee legal TCPA compliance and maintain pristine carrier reputation.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-3">
          <PhoneCall className="w-8 h-8 text-rose-400" />
          <h3 className="text-xl font-bold text-foreground">Live Warm Call Transfers</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When an outbound lead qualifies for a high-value purchase, CallioAI immediately dials your account executive, provides a 10-second summary, and transfers the call live without disconnection.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-3xl border border-border/80 bg-card p-10 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-foreground">Scale your outbound pipeline today.</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Upload your contact list and launch your first AI calling campaign in 3 simple steps.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8">
          <Link href="/dashboard/campaigns">Launch Campaign →</Link>
        </Button>
      </div>
    </div>
  );
}
