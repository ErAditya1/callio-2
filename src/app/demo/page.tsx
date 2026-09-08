'use client';

import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Headphones,
  Home,
  Mic,
  Phone,
  Radio,
  Sparkles,
  Stethoscope,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_AGENTS } from '@/lib/services/mockData';
import { Agent, AgentCategory } from '@/lib/services/types';

export default function DemoMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Agents' },
    { key: 'receptionist', label: 'Receptionist' },
    { key: 'appointment_setter', label: 'Appointment Setter' },
    { key: 'sales', label: 'Sales & SDR' },
    { key: 'real_estate', label: 'Real Estate' }
  ];

  const filteredAgents = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_AGENTS;
    return MOCK_AGENTS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="outline" className="mb-3 border-rose-500/30 text-rose-400 bg-rose-500/10 px-3 py-1">
          <Radio className="w-3.5 h-3.5 mr-1.5 inline animate-pulse" />
          Interactive Public Demos
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Talk to an AI Agent.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Choose a pre-configured agent below and experience a real conversation in your browser.
          No sign-up or credit card required.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Agents Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-black/10 hover:border-indigo-500/50 transition-all group"
          >
            <div>
              {/* Agent Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-lg">{agent.name}</h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{agent.role}</div>
                    <div className="text-xs text-indigo-400 mt-1 font-medium">Voice: {agent.voiceName}</div>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1">
                  {agent.metrics.successRate}% Resolution
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {agent.description}
              </p>

              {/* Core Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                {agent.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Sample Opener Preview */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-xs text-muted-foreground italic mb-6">
                "{agent.firstMessage}"
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-5 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Est. Duration: ~2 minutes
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  asChild
                  className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-rose-600/20 font-semibold text-xs px-4 h-10"
                >
                  <Link href={`/demo/call?agent=${agent.id}`}>
                    <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                    Try Live Call
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-xl border-border/80 text-xs h-10 font-medium"
                >
                  <Link href={`/dashboard/agents/create?template=${agent.id}`}>
                    Clone Agent
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
