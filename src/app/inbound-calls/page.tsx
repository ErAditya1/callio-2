import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Inbound Calls & AI Receptionist — CallioAI',
  description: 'Never miss another customer call. 24/7 AI front desk answering, calendar booking, FAQ resolution, and smart staff routing.',
};

export default function InboundCallsPage() {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1">
          <PhoneIncoming className="w-3.5 h-3.5 mr-1.5 inline" />
          Always-On Front Desk
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Never miss another customer call.
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Every missed call is a missed customer. CallioAI answers instantly on ring #1, handles appointments, answers questions accurately, and routes urgent issues to your staff.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25">
            <Link href="/dashboard/agents/create?template=agent-receptionist">
              Deploy an AI Receptionist
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/demo/call?agent=agent-receptionist">
              <Radio className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
              Call Sarah (AI Receptionist)
            </Link>
          </Button>
        </div>
      </div>

      {/* Visual Sequence */}
      <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-card mb-20 shadow-xl text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          What Happens When a Customer Dials Your Number
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-semibold text-left">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
            <div className="text-muted-foreground font-mono">STEP 1</div>
            <div className="text-sm font-bold text-foreground">Phone Rings</div>
            <p className="text-muted-foreground font-normal">Customer dials your office, clinic, or business number.</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-2">
            <div className="text-indigo-400 font-mono">STEP 2</div>
            <div className="text-sm font-bold text-foreground">CallioAI Answers</div>
            <p className="text-muted-foreground font-normal">Picks up on ring #1 with warm, personalized greeting.</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
            <div className="text-muted-foreground font-mono">STEP 3</div>
            <div className="text-sm font-bold text-foreground">Understands Intent</div>
            <p className="text-muted-foreground font-normal">Identifies if caller wants booking, hours, pricing, or staff.</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
            <div className="text-muted-foreground font-mono">STEP 4</div>
            <div className="text-sm font-bold text-foreground">Executes Request</div>
            <p className="text-muted-foreground font-normal">Books calendar, answers FAQ, or warm-transfers to human.</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
            <div className="text-emerald-400 font-mono">STEP 5</div>
            <div className="text-sm font-bold text-foreground">Logs & Texts</div>
            <p className="text-muted-foreground font-normal">Sends SMS confirmation and logs structured notes to CRM.</p>
          </div>
        </div>
      </div>

      {/* 6 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: '24/7/365 Front Desk Answering',
            desc: 'Cover late nights, weekends, and lunch hour peaks without adding expensive shifts or temp agencies.'
          },
          {
            title: 'Direct Calendar Integration',
            desc: 'Books appointments directly into Google Calendar, Outlook, and Cal.com with zero double-booking.'
          },
          {
            title: 'Smart Human Handoff',
            desc: 'Routes urgent medical or VIP calls to your cell or desk phone with a quick private voice briefing.'
          },
          {
            title: 'Structured Call Summaries',
            desc: 'Every call generates a neat bulleted summary, sentiment score, and action items synced to your CRM.'
          },
          {
            title: 'Zero Hold Times',
            desc: 'Handles 1 or 1,000 calls simultaneously without busy signals, queues, or frustrating elevator hold music.'
          },
          {
            title: 'SMS Follow-up Automation',
            desc: 'Texts caller directions, booking confirmations, or payment links while the conversation is still active.'
          }
        ].map((feat, idx) => (
          <div key={idx} className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-3 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-foreground">{feat.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-foreground">Turn missed calls into revenue today.</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Set up your receptionist agent in under 5 minutes and forward your calls with ease.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-7">
          <Link href="/dashboard/agents/create">Build Your Inbound Agent →</Link>
        </Button>
      </div>
    </div>
  );
}
