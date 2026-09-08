'use client';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
  TrendingUp,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INDUSTRY_USE_CASES } from '@/lib/services/mockData';

export default function IndustryUseCasePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const useCase = INDUSTRY_USE_CASES.find((u) => u.slug === slug) || INDUSTRY_USE_CASES[0];

  if (!useCase) {
    notFound();
  }

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Solutions
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
          {useCase.industry}
        </Badge>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {useCase.headline}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {useCase.subheadline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25">
            <Link href={`/dashboard/agents/create?category=${useCase.recommendedAgentCategory}`}>
              Build {useCase.industry} Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/demo">
              <Radio className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
              Try Live Demo
            </Link>
          </Button>
        </div>
      </div>

      {/* ROI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
        {useCase.roiStats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border border-border/80 bg-card text-center space-y-2 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            <div className="text-4xl font-extrabold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Pain Points vs Solutions Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Pain points */}
        <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-5">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
            <XCircle className="w-5 h-5" />
            Traditional Industry Challenges
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {useCase.painPoints.map((pain, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Solutions */}
        <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <CheckCircle2 className="w-5 h-5" />
            The CallioAI Autonomous Solution
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {useCase.aiSolutions.map((sol, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">{sol}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example Conversation Script */}
      <div className="max-w-3xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl mb-20 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <h3 className="text-lg font-bold text-foreground">Example Industry Conversation</h3>
            <p className="text-xs text-muted-foreground">How the agent responds naturally to customer inquiries</p>
          </div>
          <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
            Real Scenario
          </Badge>
        </div>

        <div className="space-y-3.5">
          {useCase.exampleScript.map((turn, i) => (
            <div
              key={i}
              className={`flex flex-col ${turn.speaker === 'ai' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  turn.speaker === 'ai'
                    ? 'bg-muted/80 text-foreground border border-border/50 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                  {turn.speaker === 'ai' ? 'CallioAI Voice Agent' : 'Customer'}
                </div>
                {turn.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Industry CTA */}
      <div className="rounded-3xl border border-border/80 bg-card p-10 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-foreground">
          Ready to automate {useCase.industry} calling?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Launch a pre-trained agent tailored to your workflow in less than 5 minutes.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8">
          <Link href={`/dashboard/agents/create?category=${useCase.recommendedAgentCategory}`}>
            Build Your Agent Now →
          </Link>
        </Button>
      </div>
    </div>
  );
}
