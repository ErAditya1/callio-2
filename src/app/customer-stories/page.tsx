import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  Quote,
  Sparkles,
  Star,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Customer Stories & Measurable ROI — CallioAI',
  description: 'See how clinics, brokerages, and logistics teams achieve measurable outcomes with CallioAI voice agents.',
};

export default function CustomerStoriesPage() {
  const stories = [
    {
      company: 'Beacon Dental Group',
      industry: 'Healthcare (8 Locations)',
      stats: [
        { label: 'Hold Time', value: '0 sec' },
        { label: 'Appointments Booked', value: '+42%' },
        { label: 'Front-Desk Saved', value: '5 hrs/day' }
      ],
      quote: 'Before CallioAI, over 30% of our patient calls during lunch and after 5 PM went to voicemail. Sarah now answers every call immediately and books directly into our schedule. It paid for itself in week one.',
      author: 'Dr. Rachel Vance, Managing Partner'
    },
    {
      company: 'Oakwood Real Estate Partners',
      industry: 'Commercial & Residential Brokerage',
      stats: [
        { label: 'Lead Response Time', value: '<25 sec' },
        { label: 'Showings Scheduled', value: '+38%' },
        { label: 'Agent Close Rate', value: '2.4x' }
      ],
      quote: 'Speed-to-lead is everything in residential sales. When someone requests property info on Zillow, our CallioAI outbound agent calls them within 30 seconds to pre-qualify and book a walkthrough.',
      author: 'Jordan Miller, Head of Brokerage Operations'
    },
    {
      company: 'Apex Freight Solutions',
      industry: 'Logistics & 3PL (450 Trucks)',
      stats: [
        { label: 'Check-in Calls Automated', value: '91%' },
        { label: 'Dispatcher Capacity', value: '3.2x' },
        { label: 'On-Time ETA Accuracy', value: '+45%' }
      ],
      quote: 'Our dispatchers were burning out making 600 routine "Where are you?" check calls every single day. CallioAI handles all automated check-ins and only escalates breakdowns or gate delays.',
      author: 'Carlos Santana, VP of Fleet Operations'
    }
  ];

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-amber-500/30 text-amber-400 bg-amber-500/10 px-3 py-1">
          <Award className="w-3.5 h-3.5 mr-1.5 inline" />
          Measurable Business Impact
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Real businesses. Proven outcomes.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Discover how industry leaders replace hold music and missed calls with autonomous AI voice agents.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="space-y-12 mb-20 max-w-5xl mx-auto">
        {stories.map((story, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-border/60">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{story.company}</h2>
                <div className="text-xs text-muted-foreground font-medium mt-1">{story.industry}</div>
              </div>

              {/* Stats pill row */}
              <div className="flex flex-wrap items-center gap-4">
                {story.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-center min-w-[120px]">
                    <div className="text-xl sm:text-2xl font-extrabold text-foreground">{st.value}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote body */}
            <div className="pt-8 space-y-4">
              <Quote className="w-8 h-8 text-indigo-400 opacity-60" />
              <p className="text-base sm:text-lg text-foreground/90 italic leading-relaxed">
                "{story.quote}"
              </p>
              <div className="text-xs font-semibold text-muted-foreground">
                — {story.author}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl border border-border/80 bg-card p-10 text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-foreground">Write your own success story.</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start automating calls today and measure the immediate impact on customer satisfaction and revenue.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
          <Link href="/dashboard/agents/create">Build Your Agent →</Link>
        </Button>
      </div>
    </div>
  );
}
