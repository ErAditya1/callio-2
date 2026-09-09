import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  Headphones,
  PhoneCall,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { VoiceAgentsGrid } from '@/components/marketing/VoiceAgentsGrid';
import { VoiceAgentsHero } from '@/components/marketing/VoiceAgentsHero';

export const metadata = {
  title: 'AI Voice Agents — CallioAI',
  description: 'Your autonomous AI workforce for every customer conversation. Answer calls, book appointments, and qualify leads.',
};

export default function AIVoiceAgentsPage() {
  return (
    <div className="py-10 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Attractive and Professional Hero Section with Interactive Console */}
      <VoiceAgentsHero />

      {/* Production-Ready Agents Grid (Click to Call via Modal, No Images) */}
      <div id="agents-directory">
        <VoiceAgentsGrid />
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: 'Answer Inbound Calls 24/7',
            desc: 'Zero hold time. Answers on the very first ring, answers questions, checks inventory or hours, and directs callers.',
            icon: PhoneCall,
            color: 'text-blue-400 bg-blue-500/10'
          },
          {
            title: 'Automate Calendar Bookings',
            desc: 'Checks real-time availability in Google Calendar or Cal.com, books slots, sends calendar invites, and texts SMS reminders.',
            icon: Calendar,
            color: 'text-emerald-400 bg-emerald-500/10'
          },
          {
            title: 'Qualify Prospects in 30s',
            desc: 'Call form leads in sub-30 seconds, asks custom BANT questions, and live-transfers high-intent buyers to senior sales reps.',
            icon: Zap,
            color: 'text-amber-400 bg-amber-500/10'
          },
          {
            title: 'Trained on Your Knowledge',
            desc: 'Feed your website URL, PDF documentation, and FAQs. Agents speak strictly from your verified facts with zero hallucination.',
            icon: BrainCircuit,
            color: 'text-purple-400 bg-purple-500/10'
          },
          {
            title: 'Warm Human Transfers',
            desc: 'When a caller requests a manager or complex support, CallioAI dials your team and delivers a 10-second spoken briefing before connecting.',
            icon: Headphones,
            color: 'text-rose-400 bg-rose-500/10'
          },
          {
            title: 'Actionable Intelligence',
            desc: 'Every call generates a structured summary, extracted parameters (name, dates, budget), sentiment score, and full transcript in your CRM.',
            icon: Sparkles,
            color: 'text-indigo-400 bg-indigo-500/10'
          }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-8 rounded-3xl border border-border/80 bg-card/70 space-y-4 shadow-md">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Pipeline */}
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 text-center space-y-8 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
          How Customer Conversations Flow
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-semibold">
          <span className="p-3.5 rounded-2xl bg-muted border border-border/60">1. Customer Calls</span>
          <span className="text-indigo-400">→</span>
          <span className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">2. CallioAI Agent Answers</span>
          <span className="text-indigo-400">→</span>
          <span className="p-3.5 rounded-2xl bg-muted border border-border/60">3. Understands Intent</span>
          <span className="text-indigo-400">→</span>
          <span className="p-3.5 rounded-2xl bg-muted border border-border/60">4. Executes Action</span>
          <span className="text-indigo-400">→</span>
          <span className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">5. Business Outcome</span>
        </div>
        <div className="pt-4">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6">
            <Link href="/dashboard/agents/create">
              Create Your First Agent in 2 Minutes →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
