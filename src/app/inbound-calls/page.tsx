import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Inbound Calls & AI Receptionist — CallioAI',
  description:
    'Never miss another customer call. 24/7 AI front desk answering, calendar booking, and intelligent routing.',
};

export default function InboundCallsPage() {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/30 text-xs text-muted-foreground mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>24/7 Front Desk Reception</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Never miss another customer phone call.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Every missed call is lost revenue. CallioAI answers instantly on the first ring, handles appointment scheduling, answers complex questions, and transfers urgent cases to your staff.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 h-10 text-xs font-semibold">
            <Link href="/workflow">
              Deploy Inbound Agent
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg px-4 h-10 text-xs font-medium border-border/70">
            <Link href="/ai-voice-agents">Try Voice Agents</Link>
          </Button>
        </div>
      </div>

      {/* 5-Step Process Sequence (Minimal & Horizontal) */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-6 sm:p-8 mb-16">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            How Incoming Calls Are Handled
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Autonomous decision loop on every phone ring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground">01</span>
            <div className="font-semibold text-foreground">Customer Calls</div>
            <p className="text-[11px] text-muted-foreground">Dials your office or clinic phone number.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 space-y-1">
            <span className="text-[10px] font-mono text-indigo-400">02</span>
            <div className="font-semibold text-foreground">Instant Answer</div>
            <p className="text-[11px] text-muted-foreground">Picks up on ring #1 with zero hold time.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground">03</span>
            <div className="font-semibold text-foreground">Understands Intent</div>
            <p className="text-[11px] text-muted-foreground">Identifies bookings, pricing, or support.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground">04</span>
            <div className="font-semibold text-foreground">Executes Request</div>
            <p className="text-[11px] text-muted-foreground">Schedules calendar or routes to staff.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400">05</span>
            <div className="font-semibold text-foreground">Syncs & Texts</div>
            <p className="text-[11px] text-muted-foreground">Sends SMS confirmation and logs to CRM.</p>
          </div>
        </div>
      </div>

      {/* 6 High-Focus Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {[
          {
            title: '24/7/365 Answering',
            desc: 'Cover late nights, weekends, and holidays without hiring costly after-hours staff.',
          },
          {
            title: 'Direct Calendar Booking',
            desc: 'Real-time synchronization with Google Calendar, Outlook, and Cal.com.',
          },
          {
            title: 'Warm Human Transfer',
            desc: 'Transfers callers to team phones with a private voice briefing before connecting.',
          },
          {
            title: 'Zero Hold Queues',
            desc: 'Can handle 100+ incoming calls simultaneously with zero busy signals.',
          },
          {
            title: 'Automated SMS Texts',
            desc: 'Instantly text driving directions, appointment links, or intake forms while on call.',
          },
          {
            title: 'Instant CRM Logging',
            desc: 'Every call generates a structured bulleted transcript and logs to your CRM.',
          },
        ].map((feat, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-border/70 bg-card/40 space-y-2">
            <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Minimal CTA */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-8 text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Turn missed calls into revenue.</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Deploy your AI receptionist in under 5 minutes and forward your calls with ease.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs h-9 px-5">
            <Link href="/workflow">Create Inbound Agent</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
